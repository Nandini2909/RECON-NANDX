![Recon-Nandx Banner](https://i.ibb.co/JYG7h0g/banner.png)

# Recon-Nandx 🚀
### Automated Reconnaissance Tracking & Asset Management Platform

Recon-Nandx is a professional-grade, MERN-stack automated reconnaissance platform designed for bug hunters, security researchers, and enterprise security teams. It streamlines the entire asset discovery pipeline—from subdomain enumeration to deep web probing—while providing a sleek, real-time dashboard for monitoring and analysis.

---

## ✨ Key Features

- 🔍 **Automated Subdomain Discovery**: Integrated with industry-standard tools like `subfinder` to discover hidden assets.
- 📡 **Intelligent Port Scanning**: Fast and efficient port discovery using `naabu` with JSON-parsed results.
- 🌐 **Web Stack Fingerprinting**: Deep probing with `httpx` to extract status codes, page titles, and technology markers.
- 🔗 **Aggressive URL Extraction**: Massive URL discovery leveraging `gau` (GetAllUrls).
- 📊 **Real-time Monitoring**: WebSocket integration via **Socket.io** for live log streaming and instant metric updates.
- 📈 **Visual Analytics**: Interactive dashboards powered by **Recharts** for asset distribution and scan progress.
- 🏢 **Multi-Organization Support**: Manage multiple targets and organizations within a unified workspace.
- 🛡️ **Secure Access**: JWT-based authentication with session management and user roles.

---

## 🛠️ Tech Stack

### Core Platform
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Recharts, Socket.io-client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, P-Queue (concurrency control).
- **Authentication**: JWT (JSON Web Tokens), bcryptjs.

### Integrated Security Tools
Recon-Nandx leverages a suite of high-performance tools primarily written in Go:
- [subfinder](https://github.com/projectdiscovery/subfinder) - Subdomain enumeration.
- [naabu](https://github.com/projectdiscovery/naabu) - Fast port scanning.
- [httpx](https://github.com/projectdiscovery/httpx) - Web technology probing.
- [gau](https://github.com/lc/gau) - Historical URL extraction.
- [katana](https://github.com/projectdiscovery/katana) - Web crawling/spidering.
- [dnsx](https://github.com/projectdiscovery/dnsx) - Multi-purpose DNS toolkit.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local or Atlas)
- **Go** (for security tools)
- **Homebrew** (Optional, for easy tool setup on macOS)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Recon-Nandx.git
   cd Recon-Nandx
   ```

2. **Run the tool setup script**:
   This script installs the necessary Go tools if they aren't already present.
   ```bash
   chmod +x init_tools.sh
   ./init_tools.sh
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/recon-nandx
   JWT_SECRET=your_super_secret_key
   ```

4. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🖥️ Usage

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm run dev # or node server.js
   ```

2. **Start the Frontend App**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Dashboard**:
   Open your browser and navigate to `http://localhost:5173`. Launch a new scan by entering a target domain and selecting the desired modules.

---

## 🏗️ Architecture

Recon-Nandx uses a **Worker Queue** architecture to ensure system stability during heavy scans.
- **API Server**: Handles authentication, organization management, and scan triggering.
- **Worker Node**: Uses `p-queue` to execute security tools in the background, streaming output directly to the UI via WebSockets.
- **Database**: MongoDB stores persistent asset data, scan history, and real-time logs.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue for feature requests.

## 📄 License
This project is licensed under the MIT License.

---

<p align="center">Made with ❤️ for the Security Community</p>
