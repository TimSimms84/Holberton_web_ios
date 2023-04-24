// websocket/mod.rs

use futures_util::SinkExt;
use futures_util::StreamExt;
use libc::c_char;
use phf::Set;
use rust_shared_memory::{shared_memory_utils_get_variable_ptr};
use serde::Serialize;
use serde_json::json;
use std::ffi::CStr;
use std::ffi::CString;
use tokio::time::Duration;
use warp::ws::{Message, WebSocket};

/// Handles incoming WebSocket connections and processes messages received
/// from the client. The function takes references to three `phf::Set`s
/// containing float, int, and char variables, and uses them to determine the
/// type of the variable received in the message.
///
/// The WebSocket message should contain a variable name and its new value,
/// separated by whitespace. If the variable name is found in one of the sets,
/// the value is parsed according to its type and the corresponding handler
/// function is called.
pub async fn handle_connection(
    mut ws: WebSocket,
    float_variables: &'static Set<&'static str>,
    int_variables_with_core_type: &'static [(&'static str, &'static str)],
    char_variables: &'static Set<&'static str>,
) {
    while let Some(result) = ws.next().await {
        match result {
            Ok(msg) => {
                if msg.is_text() {
                    let message_result = msg.to_str();
                    let message_str = match message_result {
                        Ok(s) => s,
                        Err(_) => {
                            let _ = ws.send(Message::text("Invalid message encoding")).await;
                            continue;
                        }
                    };

                    let mut message_parts = message_str.split_whitespace();
                    let variable_name = match message_parts.next() {
                        Some(name) => name.to_uppercase(),
                        None => {
                            let _ = ws.send(Message::text("Invalid message format")).await;
                            continue;
                        }
                    };
                    let value_str = match message_parts.next() {
                        Some(value) => value,
                        None => {
                            let _ = ws.send(Message::text("Invalid message format")).await;
                            continue;
                        }
                    };

                    if float_variables.contains(&variable_name) {
                        match value_str.parse::<f32>() {
                            Ok(new_value) => handle_float(&mut ws, &variable_name, new_value).await,
                            Err(_) => {
                                let _ = ws.send(Message::text("Invalid value format")).await;
                            }
                        }
                    } else if let Some((_, core_type)) = int_variables_with_core_type.iter().find(|(name, _)| name == &variable_name) {
                        match value_str.parse::<i64>() {
                            Ok(new_value) => handle_int(&mut ws, &variable_name, core_type, new_value).await,
                            Err(_) => {
                                let _ = ws.send(Message::text("Invalid value format")).await;
                            }
                        }
                    } else if char_variables.contains(&variable_name) {
                        handle_char(&mut ws, &variable_name, value_str).await;
                    } else {
                        let _ = ws.send(Message::text("Unknown variable name")).await;
                        continue;
                    }
                    
                }
            }
            Err(e) => {
                eprintln!("websocket error: {}", e);
                break;
            }
        }
    }
}

/// Periodically sends updates for all variables in the shared memory to the
/// connected WebSocket client. The updates are sent as a JSON object where
/// the keys are the variable names and the values are the current values of
/// the variables.
///
/// This function reads the values directly from shared memory and constructs
/// a JSON object with the current variable values, which is then sent to the
/// client over the WebSocket connection.
pub async fn handle_updates(
    ws: WebSocket,
    float_variables: &'static phf::Set<&'static str>,
    int_variables_with_core_type: &'static [(&'static str, &'static str)],
    char_variables: &'static phf::Set<&'static str>,
) {
    let (mut ws_tx, _) = ws.split();
    let mut interval_stream = tokio::time::interval(Duration::from_millis(200));

    #[derive(Serialize)]
    enum VariableValue {
        Float(f32),
        Int(i64),
        // Logical(i64),
        Char(String),
    }

    loop {
        interval_stream.tick().await;
        let mut variable_values = serde_json::Map::new();


        // Float variables
        for variable_name in float_variables {
            let c_variable_name = CString::new(*variable_name).unwrap();
            let current_value = unsafe {
                let variable_ptr = shared_memory_utils_get_variable_ptr(
                    c_variable_name.as_ptr() as *const c_char,
                );
                VariableValue::Float(*variable_ptr)
            };
            match current_value {
                VariableValue::Float(val) => {
                    variable_values.insert(variable_name.to_string(), json!(val));
                }
                _ => (),
            }
        }

        // Char variables
        for variable_name in char_variables {
            let c_variable_name = CString::new(*variable_name).unwrap();
            let current_value = unsafe {
                let variable_ptr = shared_memory_utils_get_variable_ptr(
                    c_variable_name.as_ptr() as *const c_char,
                );
                VariableValue::Char(
                    CStr::from_ptr(variable_ptr as *const c_char)
                        .to_string_lossy()
                        .into_owned(),
                )
            };
            match current_value {
                VariableValue::Char(val) => {
                    variable_values.insert(variable_name.to_string(), json!(val));
                }
                _ => (),
            }
        }

        // Handle int variables with core type
        for (variable_name, core_type) in int_variables_with_core_type {
            let c_variable_name = CString::new(*variable_name).unwrap();
            let current_value = unsafe {
                let variable_ptr = shared_memory_utils_get_variable_ptr(
                    c_variable_name.as_ptr() as *const c_char,
                );
                match *core_type {
                    "I1" | "L1" => VariableValue::Int(*(variable_ptr as *mut i8) as i64),
                    "I2" | "L2" => VariableValue::Int(*(variable_ptr as *mut i16) as i64),
                    "I4" | "L4" => VariableValue::Int(*(variable_ptr as *mut i32) as i64),
                    "I8" | "L8" => VariableValue::Int(*(variable_ptr as *mut i64)),
                    _ => {
                        eprintln!("Unexpected core_type: {}", core_type); // Print unexpected core_type
                        unreachable!()
                    } // We should never reach this point since we know the core types
                }
            };
            match current_value {
                VariableValue::Int(val) => {
                    variable_values.insert(variable_name.to_string(), json!(val));
                }
                _ => (),
            }
        }

        let response = json!(variable_values).to_string();
        match ws_tx.send(Message::text(response)).await {
            Ok(_) => (),
            Err(_) => break,
        }
    }
}


/// Updates the value of a float variable in shared memory and sends a
/// confirmation message to the WebSocket client. The function takes a mutable
/// reference to the WebSocket, a reference to the variable name, and the new
/// value for the variable.
async fn handle_float(ws: &mut WebSocket, variable_name: &str, new_value: f32) {
    let variable_name_cstring = CString::new(variable_name).unwrap();

    let (current_value, updated_value) = unsafe {
        let variable_ptr =
            shared_memory_utils_get_variable_ptr(variable_name_cstring.as_ptr() as *const c_char)
                as *mut f32;
        let current_value = *variable_ptr;
        *variable_ptr = new_value;
        let updated_value = *variable_ptr;
        (current_value, updated_value)
    };

    println!(
        "Value of {:?} before change: {}",
        variable_name_cstring, current_value
    );
    println!(
        "Value of {:?} after change: {}",
        variable_name_cstring, updated_value
    );

    let response = format!(
        "The new value of {:?} is {}",
        variable_name_cstring, updated_value
    );
    let _ = ws.send(Message::text(response)).await;
}

/// Updates the value of a char variable in shared memory and sends a
/// confirmation message to the WebSocket client. The function takes a mutable
/// reference to the WebSocket, a reference to the variable name, and a
/// reference to the new value for the variable.
async fn handle_char(ws: &mut WebSocket, variable_name: &str, new_value: &str) {
    let variable_name_cstring = CString::new(variable_name).unwrap();
    let new_value_cstring = CString::new(new_value).unwrap();

    let (current_value, updated_value) = unsafe {
        let variable_ptr =
            shared_memory_utils_get_variable_ptr(variable_name_cstring.as_ptr() as *const c_char)
                as *mut c_char;
        let current_value = CStr::from_ptr(variable_ptr).to_string_lossy().into_owned();

        std::ptr::copy_nonoverlapping(
            new_value_cstring.as_ptr(),
            variable_ptr,
            new_value_cstring.as_bytes_with_nul().len(),
        );

        let updated_value = CStr::from_ptr(variable_ptr).to_string_lossy().into_owned();
        (current_value, updated_value)
    };

    println!(
        "Value of {:?} before change: {}",
        variable_name_cstring, current_value
    );
    println!(
        "Value of {:?} after change: {}",
        variable_name_cstring, updated_value
    );

    let response = format!(
        "The new value of {:?} is {}",
        variable_name_cstring, updated_value
    );
    let _ = ws.send(Message::text(response)).await;
}

/// Updates the value of an int variable in shared memory and sends a
/// confirmation message to the WebSocket client. The function takes a mutable
/// reference to the WebSocket, a reference to the variable name, and the new
/// value for the variable.
async fn handle_int(
    ws: &mut WebSocket,
    variable_name: &str,
    core_type: &str,
    new_value: i64,
) {
    let variable_name_cstring = CString::new(variable_name).unwrap();

    let (current_value, updated_value) = unsafe {
        let variable_ptr = shared_memory_utils_get_variable_ptr(variable_name_cstring.as_ptr() as *const c_char);

        match &core_type[1..] {
            "1" => {
                let variable_ptr = variable_ptr as *mut i8;
                let current_value = *variable_ptr as i64;
                *variable_ptr = new_value as i8;
                let updated_value = *variable_ptr as i64;
                (current_value, updated_value)
            }
            "2" => {
                let variable_ptr = variable_ptr as *mut i16;
                let current_value = *variable_ptr as i64;
                *variable_ptr = new_value as i16;
                let updated_value = *variable_ptr as i64;
                (current_value, updated_value)
            }
            "4" => {
                let variable_ptr = variable_ptr as *mut i32;
                let current_value = *variable_ptr as i64;
                *variable_ptr = new_value as i32;
                let updated_value = *variable_ptr as i64;
                (current_value, updated_value)
            }
            "8" => {
                let variable_ptr = variable_ptr as *mut i64;
                let current_value = *variable_ptr;
                *variable_ptr = new_value;
                let updated_value = *variable_ptr;
                (current_value, updated_value)
            }
            _ => panic!("Unsupported integer size"),
        }
    };

    println!(
        "Value of {:?} before change: {}",
        variable_name_cstring, current_value
    );
    println!(
        "Value of {:?} after change: {}",
        variable_name_cstring, updated_value
    );

    let response = format!(
        "The new value of {:?} is {}",
        variable_name_cstring, updated_value
    );
    let _ = ws.send(Message::text(response)).await;
}
