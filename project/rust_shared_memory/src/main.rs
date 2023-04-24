// main.rs
use rust_shared_memory::{shared_memory_utils_init};
use warp::Filter;

mod websocket;
use websocket::{handle_connection, handle_updates};
mod variable_sets;
use variable_sets::{FLOAT_VARIABLES, CHAR_VARIABLES, INT_VARIABLES_WITH_CORE_TYPE};



/// The main function initializes the shared memory utilities and starts the
/// Warp server to listen for incoming WebSocket connections. It defines two
/// WebSocket routes: `change_value_ws` and `update_value_ws`, which handle
/// incoming connections and delegate processing to `handle_connection` and
/// `handle_updates` respectively.

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize shared memory utilities
    match init_shared_memory_utils() {
        Ok(()) => (),
        Err(e) => return Err(e.into()),
    }

    // Websocket routes
    // change_value_ws route: used by clients to change the values of variables

    let websocket_route =
    warp::path!("change_value_ws")
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| {
            ws.on_upgrade(move |socket| {
                handle_connection(
                    socket,
                    &FLOAT_VARIABLES,
                    &INT_VARIABLES_WITH_CORE_TYPE,
                    &CHAR_VARIABLES,
                )
            })
        });

    // update_value_ws route: used by clients to receive periodic updates for variable values
    let update_route =
    warp::path!("update_value_ws")
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| {
            ws.on_upgrade(move |socket| {
                handle_updates(
                    socket,
                    &FLOAT_VARIABLES,
                    &INT_VARIABLES_WITH_CORE_TYPE,
                    &CHAR_VARIABLES,
                )
            })
        });

    // Combine the routes
    let routes = websocket_route.or(update_route);

    // Start the server
    warp::serve(routes).run(([0, 0, 0, 0], 3030)).await;
    Ok(())
}

/// Initializes the shared memory utilities by calling the
/// `shared_memory_utils_init` function from the rust_shared_memory crate.
/// This function serves as a wrapper for the C functions `shm_init` and
/// `attach_shm`. The wrapper assumes that if `shm_init` returns success,
/// `attach_shm` will succeed as well.
///
/// # Returns
///
/// * `Ok(())` if the shared memory utilities are successfully initialized.
/// * An error message if an error occurs, specifically when `shm_init` fails.

fn init_shared_memory_utils() -> Result<(), &'static str> {
    let result = unsafe { shared_memory_utils_init() };

    match result {
        0 => Ok(()),
        _ => Err("Failed to initialize shared memory utilities"),
    }
}
