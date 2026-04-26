# PayWallet Frontend

A modern Paytm-like wallet app built with React + Framer Motion, connected to Spring Boot microservices backend.

## Tech Stack
- React 18 + React Router v6
- Framer Motion (animations)
- Axios (API calls)
- React Hot Toast (notifications)
- Lucide React (icons)

## Getting Started

### Prerequisites
Make sure all your Spring Boot services are running:
- Eureka: http://localhost:8761
- API Gateway: http://localhost:8080
- User Service: port 9000
- Wallet Service: port 8000
- Transaction Service: port 7000

### Install & Run
```bash
npm install
npm start
```

Opens at http://localhost:3000

## Features
- Login / Register with wallet auto-creation
- Dashboard with live balance
- Fund Transfer with user lookup
- Add Money to wallet
- Transaction History with filters
- Animated UI with Framer Motion

## Backend Endpoints Used
| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | /users |
| Get User | GET | /users/{id} |
| Create Wallet | POST | /wallet/{userId} |
| Get Wallet | GET | /wallet/user/{userId} |
| Add Money | POST | /wallet/add-money |
| Transfer | POST | /transfer |
| Tx History | GET | /transactions/user/{userId} |

## Deploy
See DEPLOY.md for full deployment guide.
