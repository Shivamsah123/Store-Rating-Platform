# Store Rating Platform

A production-ready, full-stack **Store Rating Platform** that allows normal users to search, browse, rate, and review physical store outlets. It implements **Role-Based Access Control (RBAC)** supporting System Administrators, Store Owners, and Normal Users. 

This platform follows clean software architecture patterns using a decoupled MVC design on the backend and structured React Context API state management on the frontend.

---

## 🚀 Technology Stack

- **Backend**: Express.js (Node.js)
- **Database**: MySQL
- **ORM**: Sequelize
- **Frontend**: React (Vite)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator (Backend) & Client-side regex (Frontend)
- **State Management**: React Context API
- **Styling**: Material UI (MUI v5)
- **Charts**: Recharts
- **API Client**: Axios

---

## 🛠️ Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # DB config, Swagger spec
│   │   ├── controllers/     # Express route handlers
│   │   ├── middleware/      # JWT verify, RBAC authorize, error boundary
│   │   ├── models/          # Sequelize schemas (User, Store, Rating, AuditLog)
│   │   ├── repositories/    # Database queries isolation layer
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Custom exception definitions
│   │   ├── validators/      # express-validator criteria definition
│   │   └── server.js        # App entry point
│   ├── seed.js              # Database bootstrap seeder
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, StatCard, ErrorBoundary
│   │   ├── context/         # AuthContext, NotificationContext, ThemeContext
│   │   ├── pages/           # Pages (Login, Register, Dashboard, Profile, etc.)
│   │   ├── services/        # Axios API client setup
│   │   ├── theme.js         # MUI Dark/Light theme declaration
│   │   ├── App.jsx          # Routing setup and Providers wrapper
│   │   └── main.jsx         # DOM mount entrypoint
│   ├── nginx.conf           # SPA production routing proxy
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Orchestrates MySQL, API, and UI containers
├── .env.example             # Configuration settings template
└── README.md
```

---

## 🗝️ Seeder Test Credentials

The database seeder (`backend/seed.js`) automatically populates the system with compliant usernames (minimum 20 characters), complex passwords, and dummy score mappings.

| Role | Email | Password | Representative Name |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@platform.com` | `Password123!` | `System Administrator Account` |
| **Store Owner** | `owner1@store.com` | `Password123!` | `Store Owner Johnathan Doe` |
| **Normal User** | `user1@consumer.com` | `Password123!` | `Regular Customer John Miller` |

---

## 📦 Getting Started

### 1. Setup Database
Create a MySQL database named `store_rating_platform` on your local server.

### 2. Configure Environment Variables
Check `.env` in the root folder and `backend/.env`, and adjust your database connection credentials (username and password):
* `DB_USER=root`
* `DB_PASSWORD=manager` (or your local MySQL password)

### 3. Run Backend Express API
```bash
cd backend
npm install
# Compile tables and seed testing parameters
npm run seed
# Start backend server
node server.js
```

### 4. Run Frontend React Client
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 API Documentation

Access full interactive Swagger documentation at `http://localhost:5000/api-docs`. Below is a summary of the core endpoints:

### Authentication
- `POST /api/auth/register`: Register user account (forces default role `USER`).
- `POST /api/auth/login`: Login user. Returns authentication JWT token and user profile object.
- `GET /api/auth/me`: Retrieve current logged-in user profile details (requires token).

### User Profile
- `PUT /api/users/change-password`: Update password. Requires token and password complexity verification.

### Stores Listing
- `GET /api/stores`: View all stores. Supports pagination, name/address search, sorting (A-Z or average rating), and injects individual `currentUserRating` if authenticated.

### Store Reviews
- `POST /api/ratings`: Submit rating (1 to 5). Restricts normal users to rating a store only once.
- `PUT /api/ratings/:storeId`: Modify an existing rating.

### System Admin Features (Requires ADMIN role token)
- `GET /api/admin/dashboard`: Dashboard metrics (user counts, store counts, rating count) and 30-day analytics growth arrays.
- `POST /api/admin/users`: Create any type of account (ADMIN, STORE_OWNER, USER).
- `POST /api/admin/stores`: Associate a new business store to a user containing the `STORE_OWNER` role.
- `GET /api/admin/users`: Paginated, filterable, and searchable user grid directory.
- `GET /api/admin/users/:id`: Details of a specific user. If the user is a `STORE_OWNER`, retrieves average reviews for all stores they own.
- `GET /api/admin/global-search?q=...`: Searches query terms across usernames and store names.
- `GET /api/admin/audit-logs`: Lists platform activity logs tracking user additions, store creations, and rating logs.

### Store Owner Features (Requires STORE_OWNER role token)
- `GET /api/store-owner/dashboard`: Aggregated average rating, review count, and bar chart score distributions for all owned stores.
- `GET /api/store-owner/ratings`: List of users who have left ratings at their stores.

---

## 🔒 Security Features Implemented

1. **Password Encryption**: Hashing with `bcryptjs` using a salt work factor of 10 prior to writing to the DB.
2. **Access Security**: JWT authentication validation token check middleware (`authenticateJWT`).
3. **Route Protectors**: Role-Based authorization helper filtering routes (`authorize('ADMIN')`, etc.).
4. **Input Sanitization**: express-validator schemas intercepting invalid email structures, password constraints (length, uppercase, and special chars), and length limitations (names minimum 20 chars, addresses maximum 400 chars).
5. **SQL Injection Protection**: Abstracted database access using Sequelize ORM parameterized query compilers.
