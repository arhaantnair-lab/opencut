#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let exe_dir = std::env::current_exe().unwrap();
  let exe_dir = exe_dir.parent().unwrap().to_path_buf();
  let server_path = exe_dir.join("_next_server").join("server.js");

  let _next_server = std::thread::spawn(move || {
    let result = std::process::Command::new("node")
      .arg(&server_path)
      .env("PORT", "3000")
      .env("HOSTNAME", "127.0.0.1")
      .spawn();
    if result.is_err() {
      eprintln!("Node.js not found. Please install Node.js from https://nodejs.org");
    }
  });

  std::thread::sleep(std::time::Duration::from_secs(4));

  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      let url = "http://127.0.0.1:3000".parse().unwrap();
      tauri::WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::External(url))
        .title("OpenCut")
        .inner_size(1280.0, 800.0)
        .build()?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
