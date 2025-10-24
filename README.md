# Rental Management System (RentalMS)

A comprehensive rental management system built with Node.js backend and a modern frontend.

## 🚀 Project Structure
RentalMS/
├── client/propease/ # Frontend application
├── config/ # Configuration files
│ ├── database.js
│ └── db.js
├── controllers/ # Route controllers
│ ├── authController.js
│ └── userController.js
├── middlewares/ # Custom middleware
│ ├── authMiddleware.js
│ ├── authenticate.js
│ └── validate.js
├── models/ # Database models
│ └── userModel.js
├── routes/ # API routes
│ ├── authRoutes.js
│ └── userRoutes.js
├── utils/ # Utility functions
│ └── passwordUtils.js
├── server.js # Main server file
├── package.json
├── package-lock.json
└── .gitignore


## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (or your preferred database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gathuitapius/RentalMS.git
   cd RentalMS

   Install dependencies
   '''npm install'''

Set up environment variables
Create a .env file in the root directory:
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development


npm run dev

Git Workflow
Branch Structure
main - Production-ready code

master - Legacy main branch (being phased out)

develop - Development branch

feature/* - Feature branches

hotfix/* - Hotfix branches

