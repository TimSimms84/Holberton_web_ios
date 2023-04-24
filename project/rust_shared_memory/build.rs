use std::env;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use std::process::Command;
extern crate rusqlite;


fn main() {
    let out_dir = env::var("OUT_DIR").unwrap();

    // 1. Compile and link the C code
    // Compile the C source files
    Command::new("cc")
        .args(&[
            "-c",
            "-fPIC",
            "-Ic", // this line to specify the include pathg
            "c/shared_memory_utils.c",
            "c/symlkw.c",
            "c/shared_memory_seg.c",
            "c/shared_memory.c", 
        ])
        .status()
        .unwrap();

    // Create a static library with the compiled object files
    Command::new("ar")
        .args(&[
            "crus",
            "libshared_memory_utils.a",
            "shared_memory_utils.o",
            "symlkw.o",
            "shared_memory_seg.o",
            "shared_memory.o", 
        ])
        .status()
        .unwrap();

    // Move the static library to the output directory
    Command::new("mv")
        .args(&["libshared_memory_utils.a", &out_dir])
        .status()
        .unwrap();

    // Link the library with the Rust project
    println!("cargo:rustc-link-search=native={}", out_dir);
    println!("cargo:rustc-link-lib=static=shared_memory_utils");
    println!("cargo:rustc-link-lib=dylib=sqlite3");

    // 2. Generate variable_sets/mod.rs
    // Read the SIMDIR environment variable
    let simdir = env::var("SIMDIR").unwrap_or_else(|_| {
        panic!("SIMDIR environment variable not set. Please set it to the correct path.")
    });

    // Connect to the SQLite database
    let db_path = format!("{}/symdict/symdict.db", simdir);
    let conn = rusqlite::Connection::open(&db_path).unwrap();


    // Initialize the vectors for different variable types
    let mut float_vars = Vec::new();
    // let mut int_vars = Vec::new();
    let mut char_vars = Vec::new();
    // let mut float_vars_with_core_type = Vec::new();
    let mut int_vars_with_core_type = Vec::new();
    // let mut char_vars_with_core_type = Vec::new();


    // Prepare and execute the SQL statement
    let mut statement = conn
    .prepare("SELECT symbol, core_type FROM Symbol")
    .unwrap();

    // Iterate over the rows in the result set
    for row_result in statement.query_map([], |row| {
        let symbol: String = row.get(0)?;
        let core_type: String = row.get(1)?;
    
        match core_type.chars().next() {
            Some('I') | Some('L') => {
                // int_vars.push(symbol.clone());
                int_vars_with_core_type.push((symbol.clone(), core_type.clone()));
            }
            Some('R') => {
                float_vars.push(symbol.clone());
                // float_vars_with_core_type.push((symbol.clone(), core_type.clone()));
            }
            _ => {
                char_vars.push(symbol.clone());
                // char_vars_with_core_type.push((symbol.clone(), core_type.clone()));
            }
        }
    
        Ok(())
    }).unwrap() {
        let _ = row_result.unwrap(); // Unwrap the result to handle any errors
    }
    
    


    // Write the variable sets to the output file
    let output_path = Path::new(&out_dir).join("variable_sets.rs");
    let mut file = File::create(&output_path).unwrap();

    write_sets(&mut file, "FLOAT_VARIABLES", &float_vars);
    // write_sets(&mut file, "INT_VARIABLES", &int_vars);
    write_sets(&mut file, "CHAR_VARIABLES", &char_vars);
    // write_tuples(&mut file, "FLOAT_VARIABLES_WITH_CORE_TYPE", &float_vars_with_core_type);
    write_tuples(&mut file, "INT_VARIABLES_WITH_CORE_TYPE", &int_vars_with_core_type);
    // write_tuples(&mut file, "CHAR_VARIABLES_WITH_CORE_TYPE", &char_vars_with_core_type);
}

// Helper function to write each variable set to the output file
fn write_sets(file: &mut File, set_name: &str, symbols: &[String]) {
    writeln!(
        file,
        "pub const {}: phf::Set<&'static str> = phf_set! {{",
        set_name
    )
    .unwrap();

    // Write each symbol to the output file
    for symbol in symbols {
        writeln!(file, "    {:?},", symbol).unwrap();
    }

    writeln!(file, "}};").unwrap();
}


fn write_tuples(file: &mut File, set_name: &str, tuples: &[(String, String)]) {
    writeln!(
        file,
        "pub const {}: &[(&'static str, &'static str)] = &[",
        set_name
    )
    .unwrap();

    // Write each tuple to the output file
    for (symbol, core_type) in tuples {
        writeln!(file, "    ({:?}, {:?}),", symbol, core_type).unwrap();
    }

    writeln!(file, "];").unwrap();
}
