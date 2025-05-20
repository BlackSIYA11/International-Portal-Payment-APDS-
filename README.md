**🌐 International Portal Payment System (APDS)**

A secure international payment portal that enables users to perform cross-border financial transactions. This project includes admin authentication, transaction management, and robust security features. Developed as part of a university group assignment for the Application Development Security (APDS) module.

✅ Features

🔐 User & Admin Authentication using JWT

💳 Secure Transaction Processing

🗂️ MongoDB Database Integration (via Mongoose ODM)

🛡️ Role-based Access Control

🔒 Encrypted Password Storage using bcrypt

🛠 Tech Stack
Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT, bcrypt.js

Security: dotenv for managing environment variables

⚙️ Installation & Setup
Clone the repository

bash
Copy
Edit
git clone https://github.com/BlackSIYA11/International-Portal-Payment-APDS.git
cd International-Portal-Payment-APDS
Install dependencies

bash
Copy
Edit
npm install
Create a .env file and add the following:

ini
Copy
Edit
ATLAS_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
Start the application

bash
Copy
Edit
npm start
📡 API Endpoints
🔑 Authentication
POST /admin/register – Register an admin account

POST /admin/login – Admin login

💼 Transactions
GET /transactions – Fetch all transactions (Admin only)

POST /transactions – Create a new transaction

🔐 Security Best Practices
Use HTTPS in production environments

Implement rate limiting to prevent brute-force attacks

Store sensitive credentials in .env files (never commit them)

Apply input validation and sanitization to prevent injection attacks
