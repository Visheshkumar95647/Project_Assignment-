# 🍔 Food Ordering Application

![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
![Azure](https://img.shields.io/badge/Azure-Deployed-0078D4)
![GitLab CI](https://img.shields.io/badge/GitLab-CI/CD-orange)

## 📌 Project Overview

Food Ordering Application is a full-stack web application developed as a capstone project using **React**, **FastAPI**, **PostgreSQL**, **Docker**, **Azure**, and **GitLab CI/CD**. The application supports two roles:

- Customer
- Restaurant Owner

Customers can browse restaurants, search menus, manage carts, place orders, manage favorites and preferences, and receive recommendations.

Restaurant Owners can manage restaurants, categories, menu items, specials, deals, and incoming orders.

---

# 🚀 Live Deployment

## Frontend

https://food-frontend-c8a9bvcxcqb6bhda.canadacentral-01.azurewebsites.net

## Backend

https://food-backend-a9eug7etcnepgfa4.canadacentral-01.azurewebsites.net

## Swagger

https://food-backend-a9eug7etcnepgfa4.canadacentral-01.azurewebsites.net/docs

---

# 📦 Repository

https://git-training.nagarro.com/nagarro_fresher_training/general-account/vishesh-kumar-chauhan-3221678/-/tree/main/Assignment_6?ref_type=heads

---

# 🛠 Tech Stack

## Frontend

- React (Vite)
- React Router DOM
- Redux Toolkit
- Redux Persist
- React Hook Form
- Tailwind CSS
- React Icons
- React Hot Toast
- Framer Motion

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT Authentication
- Passlib
- Pydantic

## DevOps

- Docker
- Docker Compose
- Azure App Service
- Azure Container Registry
- GitLab CI/CD

---

# 📂 Project Structure

```text
Assignment_6
│
├── client
│   ├── src
│   ├── public
│   ├── package.json
│   └── Dockerfile
│
├── server
│   ├── app
│   ├── alembic
│   ├── scripts
│   ├── tests
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── AI_USAGE.md
```

---

# ✨ Features

## Authentication

- Login
- Register
- JWT Authentication
- Refresh Token
- Forgot Password
- Reset Password
- Protected Routes
- Role-Based Authorization

## Customer

- Browse Restaurants
- Search Restaurants
- Restaurant Details
- Browse Categories
- Browse Menu
- Search Menu
- Filter Menu
- Specials
- Deals
- Cart Management
- Checkout
- Order History
- Favorites
- Preferences
- Profile
- AI Recommendations

## Restaurant Owner

- Create Restaurant
- Update Restaurant
- Delete Restaurant
- Manage Categories
- Manage Menu
- Today's Specials
- Deal of the Day
- Incoming Orders
- Update Order Status

---

# 🔗 API Modules

## Authentication

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password

## Restaurants

- GET /api/v1/restaurants
- POST /api/v1/restaurants
- GET /api/v1/restaurants/search
- GET /api/v1/restaurants/owner/my-restaurants
- GET /api/v1/restaurants/{restaurant_id}
- PUT /api/v1/restaurants/{restaurant_id}
- DELETE /api/v1/restaurants/{restaurant_id}

## Categories

CRUD + Search + Restaurant Categories

## Menu

CRUD + Search + Filter + Specials + Deals

## Cart

Add, Update, Delete, Clear Cart

## Orders

Create Order, History, Search History, Owner Orders, Status Update

## Favorites

Add / Remove Favorite Restaurants

## Preferences

Manage User Preferences & Favorite Categories

## Profile

Update Profile & Change Password

## Recommendations

Restaurant Recommendations

Menu Recommendations

Popular Recommendations

---

# ⚙ Environment Variables

```env
APP_NAME=Food Ordering API
APP_VERSION=1.0.0
HOST=0.0.0.0
PORT=8000

DATABASE_URL=postgresql://postgres:root@localhost:5432/food_ordering_db

SECRET_KEY=YOUR_SECRET_KEY
ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:5173
```

---

# ▶ Local Setup

```bash
git clone <repository>

cd Assignment_6

docker compose up --build
```

or

Backend

```bash
cd server

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

Frontend

```bash
cd client

npm install

npm run dev
```

---

# 🐳 Docker

```bash
docker compose build

docker compose up
```

Services

- PostgreSQL
- FastAPI
- React + Nginx

---

# 🔄 GitLab CI/CD

Pipeline stages

- Build Backend
- Build Frontend
- Test Backend
- Build Docker Images
- Push Images to Azure Container Registry
- Deploy to Azure App Service

Deployment occurs automatically when code is pushed to the **main** branch.

---

# ☁ Azure Deployment

Services Used

- Azure App Service
- Azure Container Registry
- Azure Database for PostgreSQL

---

# 🧪 Testing

Implemented using **pytest**.

Includes tests for authentication, restaurants, menu, cart, orders, and other core modules.

---

# 🔐 Security

- JWT Authentication
- Password Hashing using Passlib
- Role-Based Access
- Protected Routes
- Token Refresh
- Input Validation

---

# 🤖 AI Feature

The application provides recommendations based on:

- Favorite Restaurants
- Favorite Categories
- User Preferences
- Order History
- Popular Items

---

# 🚀 Future Enhancements

- Online Payments
- Email Notifications
- Delivery Tracking
- Coupons
- Reviews & Ratings
- Multi-language Support
- Mobile Application

---

# 👨‍💻 Author

**Vishesh Kumar Chauhan**

Capstone Project – Food Ordering Application

---

# 📄 License

This project was developed for educational and training purposes.
