# TerraScope 3D - Geospatial Property Intelligence Platform

TerraScope 3D is a production-quality 3D geospatial platform built with React, CesiumJS, and Node.js. It allows users to visualize property boundaries in 3D, analyze market data with heatmaps, and filter properties based on various criteria.

## 🚀 Features

- **Interactive 3D Globe**: Built on CesiumJS with terrain and satellite imagery.
- **3D Building Extrusion**: GeoJSON property boundaries extruded into 3D models with height and price-based coloring.
- **Dynamic Filtering**: Filter properties by price and address.
- **Data Visualization**: Integrated Recharts for property analytics and a price intensity heatmap.
- **Modern UI**: Dark theme with glassmorphism effects using Material UI.
- **Responsive State**: Managed via Zustand for seamless interaction between map and UI.

## 🛠 Tech Stack

- **Frontend**: React, Vite, CesiumJS, Material UI, Zustand, Recharts.
- **Backend**: Node.js, Express, MongoDB (via `mongodb-memory-server` for easy setup).
- **Testing**: Playwright for E2E testing.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or Bun

### Installation

1. Clone the repository.
2. Navigate to the project root:
   ```bash
   cd terrascope-3d
   ```
3. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   ```

### Running the Application

1. **Start the Backend**:
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`. It includes an in-memory MongoDB that seeds automatically.

2. **Start the Frontend**:
   ```bash
   cd client
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in `terrascope-3d/client/`:
```env
VITE_CESIUM_TOKEN=your_cesium_ion_token_here
```

## 🧪 Testing

Run E2E tests with Playwright:
```bash
cd client
npx playwright test
```

## 📂 Project Structure

- `client/`: React application and Cesium viewer.
- `server/`: Express API and MongoDB models.
- `terrascope-3d/client/src/components/`: Core UI and Map components.
- `terrascope-3d/client/src/store/`: Zustand state management.
