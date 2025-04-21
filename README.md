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
- [x] `POST /register` – Register a new user
- [x] `POST /login` – Log in and receive token
- [x] `GET /me` – Get current logged-in user

### Halls (`/api/halls`)
- [x] `POST /` – Add new hall _(admin)_
- [x] `GET /` – Get all halls
- [x] `GET /:hallId` – Get hall by ID
- [x] `PUT /:hallId` – Replace hall _(admin)_
- [x] `PATCH /:hallId` – Update hall partially _(admin)_
- [x] `DELETE /:hallId` – Delete hall _(admin)_

### Movies (`/api/movies`)
- [x] `POST /` – Add new movie _(admin)_
- [x] `GET /` – Get all movies _(admin)_
- [x] `GET /:movieId` – Get movie by ID _(admin)_
- [x] `PUT /:movieId` – Replace movie _(admin)_
- [x] `PATCH /:movieId` – Update movie partially _(admin)_
- [x] `DELETE /:movieId` – Delete movie _(admin)_
- [x] `GET /:movieId/showtimes` – Get all showtimes for movie

### Showtimes (`/api/showtimes`)
- [x] `POST /` – Add showtime _(admin)_
- [x] `GET /` – Get all showtimes
- [x] `GET /:showtimeId` – Get showtime by ID
- [x] `PUT /:showtimeId` – Replace showtime _(admin)_
- [x] `PATCH /:showtimeId` – Update showtime _(admin)_
- [x] `DELETE /:showtimeId` – Delete showtime _(admin)_

### Users (`/api/users`)
- [x] `PUT /:userId/promote` – Promote user to admin _(admin)_
- [x] `PUT /:userId/demote` – Demote user from admin _(super admin)_

---

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

---

## 📄 License

MIT