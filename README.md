# SENTINEL.RS 

**High-Performance Asynchronous Port Scanner** *Developed with Rust (Backend) & React (Frontend)*

SENTINEL.RS is a professional-grade network auditor designed for speed, security, and persistence. By leveraging Rust's powerful concurrency model and a modern tactical interface, it provides rapid port discovery and local data persistence.

##  Purpose & Functionality

In cybersecurity, knowing which ports are open is the first step of any vulnerability assessment. **Sentinel** automates this by:

1 - **Mapping:** Scanning a range of 1024 ports on a target IP.
2 - **Identifying:** Detecting active services (like HTTP, SMB, or RPC).
3 - **Auditing:** Automatically logging the scan date, IP, and found ports into a JSON database so you can track network changes over time.

---

## Key Features

- **Blazing Fast Scanning:** Powered by `Tokio` and `Actix-Web` for high-concurrency TCP connections.
- **Persistence Module v1.0:** Automated scan history saved in a local JSON database.
- **Tactical Dashboard:** Modern, dark-themed UI built with React and `Lucide-React`.
- **Real-time Analytics:** Instant visual feedback of open ports and audit timestamps.

##  Tech Stack

- **Backend (Core):** [Rust](https://www.rust-lang.org/) `1.70+`, Actix-Web, Tokio (Async Runtime), Serde, Chrono.
- **Frontend (Dashboard):** [React](https://reactjs.org/), Axios, Vite, Lucide-React.

##  Installation & Setup
Copy the folder path, for example (C:\Users\USER\Downloads\Sentinel-Project)

### 1. Backend Core
```bash
cd sentinel_core
cargo run

```

Server will start at http://127.0.0.1:8080

Frontend Dashboard
``` bash
cd sentinel_dashboard
npm install
npm run dev

```
Access the UI at http://localhost:5173

Author
Developed by Daikiry Cybersecurity Enthusiast & Software Engineer

Disclaimer: This tool is for educational and authorized security auditing purposes only.




