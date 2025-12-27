# MenEscape - Luxury Gay Travel Platform

A full-stack web application for luxury gay travel experiences, built with Next.js (frontend) and NestJS (backend).

## 🚀 Quick Start for VPS Deployment

### Prerequisites

- Docker & Docker Compose installed on your VPS
- Git (to clone the repository)

### Deployment Steps

1. **Clone the repository to your VPS:**
   ```bash
   git clone <your-repo-url> menescape
   cd menescape
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   nano .env  # or use your preferred editor
   ```
   
   **Important: Update `NEXT_PUBLIC_API_URL` with your VPS IP or domain:**
   ```bash
   # Example for VPS with IP 123.456.78.90
   NEXT_PUBLIC_API_URL=http://123.456.78.90:3001/api
   
   # Example for domain
   NEXT_PUBLIC_API_URL=http://yourdomain.com:3001/api
   ```
   
   **Other important settings:**
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `ADMIN_PASSWORD`: A secure admin password
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: (Optional) For Google OAuth

3. **Build and run everything:**
   ```bash
   ./deploy.sh
   ```

4. **Access the application:**
   - Frontend: `http://your-server-ip:3000`
   - Admin Panel: `http://your-server-ip:3000/admin`
   - API: `http://your-server-ip:3001/api`

## 📋 Deploy Script Commands

```bash
./deploy.sh           # Build and start all services
./deploy.sh build     # Build only (no start)
./deploy.sh start     # Start services (assumes already built)
./deploy.sh stop      # Stop all services
./deploy.sh restart   # Restart all services
./deploy.sh logs      # View logs from all services
./deploy.sh clean     # Stop and remove all containers, volumes, and images
./deploy.sh status    # Show status of all services
./deploy.sh seed      # Seed the database with initial data
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         VPS Server                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐   │
│  │   Frontend  │   │   Backend   │   │    MongoDB      │   │
│  │   (Next.js) │──▶│  (NestJS)   │──▶│   Database      │   │
│  │   Port 3000 │   │  Port 3001  │   │   Port 27017    │   │
│  └─────────────┘   └─────────────┘   └─────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Docker Network (menescape-network)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────┐   ┌─────────────────────────────┐     │
│  │  mongodb_data   │   │        uploads_data          │     │
│  │    (Volume)     │   │         (Volume)             │     │
│  └─────────────────┘   └─────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Default Credentials

**Admin Panel:**
- Username: `admin`
- Password: `menescape` (change in `.env` for production!)

## 🛠️ Development

For local development without Docker:

```bash
# Terminal 1 - Start MongoDB
docker compose up mongodb

# Terminal 2 - Start Backend
cd backend
npm install
npm run dev

# Terminal 3 - Start Frontend
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
├── backend/                 # NestJS API server
│   ├── src/                # Source code
│   ├── uploads/            # Uploaded images
│   └── Dockerfile          # Backend Docker config
├── frontend/               # Next.js application
│   ├── src/               # Source code
│   └── Dockerfile         # Frontend Docker config
├── docker-compose.yml     # Docker Compose configuration
├── deploy.sh              # Deployment script
├── .env.example           # Environment template
└── README.md              # This file
```

## 🔧 Troubleshooting

**Services not starting:**
```bash
./deploy.sh logs    # Check logs for errors
./deploy.sh status  # Check container status
```

**Clean rebuild:**
```bash
./deploy.sh clean   # Remove everything
./deploy.sh         # Rebuild from scratch
```

**Database issues:**
```bash
./deploy.sh seed    # Re-seed the database
```

## 📄 License

Private - All rights reserved.
