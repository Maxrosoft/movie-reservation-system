# 🎬 Movie Reservation System

This is a backend system for a movie reservation service.

## 🔐 Authentication

Authentication is handled via JWT. Endpoints are protected using:
- `authenticateToken` – for general access
- `authenticateAdminToken` – for admin-only operations
- `authenticateSuperAdminToken` – for critical actions like demotion

---

## 📌 API Endpoints

### Auth (`/api/auth`)
- `POST /register` – Register a new user
- `POST /login` – Log in and receive token
- `GET /me` – Get current logged-in user

### Halls (`/api/halls`)
- `POST /` – Add new hall _(admin)_
- `GET /` – Get all halls
- `GET /:hallId` – Get hall by ID
- `PUT /:hallId` – Replace hall _(admin)_
- `PATCH /:hallId` – Update hall partially _(admin)_
- `DELETE /:hallId` – Delete hall _(admin)_

### Movies (`/api/movies`)
- `POST /` – Add new movie _(admin)_
- `GET /` – Get all movies _(admin)_
- `GET /:movieId` – Get movie by ID _(admin)_
- `PUT /:movieId` – Replace movie _(admin)_
- `PATCH /:movieId` – Update movie partially _(admin)_
- `DELETE /:movieId` – Delete movie _(admin)_
- `GET /:movieId/showtimes` – Get all showtimes for movie

### Showtimes (`/api/showtimes`)
- `POST /` – Add showtime _(admin)_
- `GET /` – Get all showtimes
- `GET /:showtimeId` – Get showtime by ID
- `PUT /:showtimeId` – Replace showtime _(admin)_
- `PATCH /:showtimeId` – Update showtime _(admin)_
- `DELETE /:showtimeId` – Delete showtime _(admin)_

### Users (`/api/users`)
- `PUT /:userId/promote` – Promote user to admin _(admin)_
- `PUT /:userId/demote` – Demote user from admin _(super admin)_

## 🛠 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Maxrosoft/movie-reservation-system.git
cd movie-reservation-system

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in DB connection, JWT secret, etc.

# Start the server
npm run dev
```
