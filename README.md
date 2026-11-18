# 📦 StuffTracker

> A personal inventory tracker — keep tabs on your belongings by category and location.

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | *(Paste your Vercel URL here after deploy)* |
| **Backend API** | *(Paste your Render URL here after deploy)* |

---

## What It Does

StuffTracker lets you manage everything you own in one place:

- **Add items** with a name, description, quantity, category, and location
- **Filter & search** items by keyword, category, or location
- **Edit and delete** items inline
- **Manage categories** (e.g. Electronics, Books, Clothes)
- **Manage locations** (e.g. Living Room, Storage, Bedroom)

Loading and error states are handled gracefully throughout the UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite, Axios |
| Backend | Node.js + Express |
| Deployment | Vercel (frontend) + Render (backend) |

---

## API Resources

The backend exposes **3 resources**:

### `GET /api/health`
Health check → `{ status: "ok" }`

### Categories (`/api/categories`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List all |
| POST | `/api/categories` | Create (`{ name }`) |
| DELETE | `/api/categories/:id` | Delete |

### Locations (`/api/locations`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/locations` | List all |
| POST | `/api/locations` | Create (`{ name, description }`) |
| DELETE | `/api/locations/:id` | Delete |

### Items — Full CRUD (`/api/items`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/items` | List (supports `?search=&categoryId=&locationId=`) |
| POST | `/api/items` | Create |
| GET | `/api/items/:id` | Get one |
| PUT | `/api/items/:id` | Update |
| DELETE | `/api/items/:id` | Delete |

Item body: `{ name, description, quantity, categoryId, locationId }`

---

## Run Locally

### Prerequisites
- Node.js ≥ 18

### 1 — Backend

```bash
cd backend
npm install
node server.js
# API running at http://localhost:3001
```

### 2 — Frontend

```bash
cd frontend
npm install

# Copy env template and set API URL
cp .env.example .env
# .env already points to http://localhost:3001 by default

npm run dev
# UI at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173). Make sure the backend is running first.

---

## Deploy

### Backend → Render

1. Push the `backend/` folder to a GitHub repository.
2. Create a new **Web Service** on [render.com](https://render.com).
3. Connect your repo. Render auto-detects `render.yaml`.
4. Build command: `npm install` | Start command: `node server.js`
5. Copy the live URL (e.g. `https://stufftracker-api.onrender.com`).

### Frontend → Vercel

1. Push the `frontend/` folder to GitHub (can be the same repo).
2. Import the project on [vercel.com](https://vercel.com).
3. Set **Framework Preset** to Vite.
4. Add **Environment Variable**: `VITE_API_URL` = your Render URL from above.
5. Deploy — Vercel uses `vercel.json` for SPA routing automatically.

---

## Project Structure

```
final task/
├── backend/
│   ├── server.js        # Express API (all routes + seed data)
│   ├── package.json
│   ├── render.yaml      # Render deploy config
│   └── Procfile
└── frontend/
    ├── src/
    │   ├── api.js                        # Axios client + all API calls
    │   ├── App.jsx                       # Root component, tab layout
    │   ├── App.css                       # All styles
    │   ├── hooks/
    │   │   ├── useItems.js               # Items CRUD + loading/error state
    │   │   ├── useCategories.js          # Categories state
    │   │   └── useLocations.js           # Locations state
    │   └── components/
    │       ├── FilterBar.jsx             # Search + filter dropdowns
    │       ├── ItemForm.jsx              # Add/edit form with validation
    │       ├── ItemCard.jsx              # Single item card
    │       ├── ItemList.jsx              # Grid of cards + empty/loading/error states
    │       ├── CategoryManager.jsx       # Category CRUD panel
    │       ├── LocationManager.jsx       # Location CRUD panel
    │       ├── LoadingSpinner.jsx        # Animated spinner
    │       └── ErrorBanner.jsx          # Dismissible error message
    ├── vercel.json      # SPA rewrite rule
    └── .env.example     # API URL template
```
