# STELLAR — Space Mission Operations Automator

A simulation-first mission-operations system that generates constrained activity schedules, monitors simulated telemetry streams, detects and diagnoses anomalies, recommends safe procedures, manages communication windows, and features a **live 3D animated spacecraft visualization** driven by a digital twin dataset engine.

## ⚠️ SIMULATION-ONLY ENVIRONMENT
**THIS SYSTEM IS STRICTLY FOR SIMULATION MODE ONLY.** It is NOT connected to any live spacecraft, real telemetry feeds, or flight hardware. All commands are simulated artifacts and require explicit operator approval.

---

## 🚀 Key Capabilities

1. **Digital Twin Dataset Integration**:
   - Schema validation for position (`[x,y,z]`), velocity (`[vx,vy,vz]`), SoC, thermal state, and pointing modes.
   - Real-time dataset streaming & playback API (`/api/dataset/load`, `/api/dataset/status`, `/api/dataset/stop`).
2. **Interactive 3D Mission Control Canvas**:
   - Built with Three.js (`@react-three/fiber` & `@react-three/drei`).
   - Animated 3D rotating Earth with atmospheric glow & orbital trajectory path.
   - Telemetry-reactive spacecraft animations: solar panel brightness, orientation, high-gain antenna earth pointing, and thermal warning aura glow.
3. **Constrained Mission Planner**:
   - Activity Gantt schedule with precedence, power, thermal, and comm-window constraints.
4. **Telemetry & Anomaly Engine**:
   - 1Hz live telemetry updates via WebSockets (Socket.IO).
   - Fault injection engine (`battery_thermal_runaway`, `sensor_drift`, `power_excursion`).
   - Automated confidence hypothesis ranking & runbook recommendation.
5. **Approval Gateway & Replay**:
   - Authority separation (`PROPOSED` → `VALIDATED` → `PENDING_APPROVAL` → `APPROVED` → `EXECUTED`).
   - Mandatory operator comments.
   - Replayable audit timeline with decision comparisons.

---

## 🛠 Tech Stack

- **Backend**: Python 3.12, Flask, Flask-SocketIO, SQLAlchemy, APScheduler, PyYAML, Pydantic
- **Frontend**: React 18, Vite, Three.js, `@react-three/fiber`, `@react-three/drei`, Framer Motion, Tailwind CSS, Recharts, Zustand, Socket.IO Client

---

## 📦 Setup & Running Instructions

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up --build
```

Access the Web Console at `http://localhost:5173`.

---

### Option 2: Manual Development Setup

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Run Flask server & digital twin simulator
python app.py
```
*Backend will be running on `http://localhost:5000`.*

#### 2. Frontend Setup

```bash
cd frontend

# Install all packages including 3D visualization libraries
npm install
npm install three @react-three/fiber @react-three/drei three-stdlib
npm install framer-motion recharts socket.io-client zustand react-router-dom lucide-react

# Start Vite dev server
npm run dev
```
*Frontend will be running on `http://localhost:5173`.*

---

## 🧪 Running Backend Unit Tests

```bash
cd backend
pytest tests/
```

---

## 🛸 Minimum Viable Demo Scenario

1. Open the UI at `http://localhost:5173`.
2. Observe the **3D Spacecraft Canvas** orbiting Earth in real-time.
3. Watch the live telemetry streaming in the gauges and charts.
4. Click **"Load & Stream Dataset"** to load the dataset telemetry.
5. At **T+180s**, a simulated `battery_thermal_runaway` fault is automatically injected.
6. Check **Anomalies** page for the hypothesis diagnosis and recommended runbook `PROC-BATT-THERMAL-01`.
7. Navigate to **Approvals**, review the command preview, add a comment, and click **Approve & Execute**.
8. Observe thermal parameters stabilize and verify the audit history in **Replay**.
