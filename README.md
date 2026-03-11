# 🏠 House Rent Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application for browsing, listing, and managing rental properties with role-based access control.

---

## 🚀 Features

- **User Authentication** — JWT-based login/register with bcryptjs password hashing
- **Role-Based Access** — `tenant`, `landlord`, and `admin` roles
- **Property Listings** — Search & filter by city, type, and price range
- **Property Booking** — Tenants can book properties with date selection
- **Admin Panel** — Approve/reject property listings, manage all bookings
- **Image Uploads** — Landlords can upload up to 5 property photos
- **Responsive Design** — Mobile-first with Bootstrap 5

---

## 🛠️ Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | React 18, Vite, React Router v6, Bootstrap 5, Axios |
| Backend  | Node.js, Express.js                                 |
| Database | MongoDB (Mongoose ODM)                              |
| Auth     | JWT + bcryptjs                                      |
| Uploads  | Multer                                              |

---

## 📦 Project Structure

```
house-rent-management/
├── backend/          # Express API
│   ├── config/       # MongoDB connection
│   ├── controllers/  # Route handlers
│   ├── middleware/   # JWT & Role auth
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── uploads/      # Uploaded images
│   └── server.js
│
├── frontend/         # React App (Vite)
│   └── src/
│       ├── api/      # Axios instance
│       ├── components/
│       ├── context/  # Auth Context
│       └── pages/
│
└── seed.js           # Admin seed script
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/house-rent-management.git
cd house-rent-management
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` in the `backend/` folder:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/houserentdb
JWT_SECRET=house_rent_super_secret_jwt_key_2024
NODE_ENV=development
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Seed Admin User

```bash
# From the root directory
node seed.js
```

This creates: `admin@rentease.com` / `admin123`

### 5. Run the App

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

App runs at `http://localhost:5173` and API at `http://localhost:5000`

---

## 🔑 Default Credentials

| Role  | Email              | Password |
| ----- | ------------------ | -------- |
| Admin | admin@rentease.com | admin123 |

---

## 📡 API Endpoints

### Auth

| Method | Route                | Access  |
| ------ | -------------------- | ------- |
| POST   | `/api/auth/register` | Public  |
| POST   | `/api/auth/login`    | Public  |
| GET    | `/api/auth/profile`  | Private |
| PUT    | `/api/auth/profile`  | Private |

### Properties

| Method | Route                              | Access         |
| ------ | ---------------------------------- | -------------- |
| GET    | `/api/properties`                  | Public         |
| GET    | `/api/properties/:id`              | Public         |
| POST   | `/api/properties`                  | Landlord/Admin |
| PUT    | `/api/properties/:id`              | Owner/Admin    |
| DELETE | `/api/properties/:id`              | Owner/Admin    |
| GET    | `/api/properties/my/listings`      | Private        |
| GET    | `/api/properties/admin/all`        | Admin          |
| PUT    | `/api/properties/admin/:id/status` | Admin          |

### Bookings

| Method | Route                      | Access             |
| ------ | -------------------------- | ------------------ |
| POST   | `/api/bookings`            | Private            |
| GET    | `/api/bookings/my`         | Private            |
| GET    | `/api/bookings/landlord`   | Landlord           |
| PUT    | `/api/bookings/:id/status` | Owner/Admin/Tenant |
| DELETE | `/api/bookings/:id`        | Tenant/Admin       |
| GET    | `/api/bookings/admin/all`  | Admin              |

---

## 👥 Team Members

| Member   | Contribution                                  |
| -------- | --------------------------------------------- |
| Member 1 | Project foundation, auth system, React setup  |
| Member 2 | Properties module — listings, search, filters |
| Member 3 | Bookings & dashboards                         |
| Member 4 | Security, validation, and polish              |

---

## 📄 License

MIT License — for educational use.
