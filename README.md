# International-Portal-APDS-

International Portal Payment System (APDS)
Overview
This project is a secure International Payment Portal that enables users to perform financial transactions across borders. It includes admin authentication, transaction management, and security features like JWT authentication and bcrypt password hashing. This project formed part of a university group assignment for an Application Development Security module (APDS).

**Features**
User & Admin Authentication (JWT-based)
Secure Transaction Processing
MongoDB Database Integration
Role-based Access Control
Encrypted Password Storage

**Tech Stack**
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Authentication: JWT, bcrypt.js
Security: dotenv (for environment variables)

**Installation & Setup**
Clone the repository
git clone https://github.com/BlackSIYA11/International-Portal-Payment-APDS.git
cd International-Portal-Payment-APDS
Install dependencies
npm install
Set up environment variables (Create a .env file)
ATLAS_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
Start the application
npm start

**API Endpoints**
Authentication
POST /admin/register - Register an admin account
POST /admin/login - Admin login
Transactions
GET /transactions - Fetch all transactions (Admin only)
POST /transactions - Create a new transaction

**Security Best Practices**
Use HTTPS in production
Implement rate limiting to prevent brute-force attacks
Store secrets in .env (never commit them)
