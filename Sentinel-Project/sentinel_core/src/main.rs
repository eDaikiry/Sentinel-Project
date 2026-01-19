/* * SENTINEL.RS v1.0
 * Developed by Daikiry (https://github.com/eDaikiry/Daikiry)
 * High-performance network security auditor.
 */

use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::fs;
use std::net::SocketAddr;
use std::time::Duration;
use tokio::net::TcpStream;
use chrono::Utc;

#[derive(Deserialize)]
struct ScanRequest {
    target: String,
    start_port: u16,
    end_port: u16,
}

#[derive(Serialize, Clone)]
struct PortResult {
    port: u16,
    status: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct ScanRecord {
    id: String,
    target: String,
    open_ports: Vec<u16>,
    timestamp: String,
}

#[derive(Serialize)]
struct ScanResponse {
    target: String,
    results: Vec<PortResult>,
}

const HISTORY_FILE: &str = "scan_history.json";

fn load_history() -> Vec<ScanRecord> {
    match fs::read_to_string(HISTORY_FILE) {
        Ok(data) => serde_json::from_str(&data).unwrap_or_else(|_| vec![]),
        Err(_) => vec![],
    }
}

fn save_to_history(record: ScanRecord) {
    let mut history = load_history();
    history.insert(0, record);
    if history.len() > 50 {
        history.truncate(50);
    }
    if let Ok(json) = serde_json::to_string_pretty(&history) {
        let _ = fs::write(HISTORY_FILE, json);
    }
}

async fn scan_port(addr: SocketAddr) -> bool {
    let timeout = Duration::from_millis(200);
    match tokio::time::timeout(timeout, TcpStream::connect(&addr)).await {
        Ok(Ok(_)) => true,
        _ => false,
    }
}

#[post("/scan")]
async fn scan(req: web::Json<ScanRequest>) -> impl Responder {
    let target_ip = req.target.clone();
    let mut tasks = vec![];

    for port in req.start_port..=req.end_port {
        let target_ip = target_ip.clone();
        tasks.push(tokio::spawn(async move {
            if let Ok(addr) = format!("{}:{}", target_ip, port).parse::<SocketAddr>() {
                if scan_port(addr).await {
                    return Some(port);
                }
            }
            None
        }));
    }

    let mut open_ports = vec![];
    for task in tasks {
        if let Ok(Some(port)) = task.await {
            open_ports.push(port);
        }
    }
    open_ports.sort();

    let results: Vec<PortResult> = open_ports.iter().map(|&p| PortResult {
        port: p,
        status: "open".to_string(),
    }).collect();

    let record = ScanRecord {
        id: uuid::Uuid::new_v4().to_string(),
        target: target_ip.clone(),
        open_ports: open_ports.clone(),
        timestamp: Utc::now().to_rfc3339(),
    };
    save_to_history(record);

    HttpResponse::Ok().json(ScanResponse { target: target_ip, results })
}

#[get("/history")]
async fn get_scan_history() -> impl Responder {
    let history = load_history();
    HttpResponse::Ok().json(history)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🛡️ Sentinel Core v1.0 ONLINE em http://127.0.0.1:8080");

    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(scan)
            .service(get_scan_history)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}