# PrimetradeAI 🚀

PrimetradeAI is a full-stack MERN application designed for efficient task management with administrative oversight. It features a secure authentication system, a responsive user dashboard, and an integrated admin panel for monitoring system-wide activity.

## 🌟 Key Features

- **🔐 Secure Authentication**: JWT-based authentication with cookie storage, bcrypt password hashing, and role-based access control (User/Admin).
- **📋 Task Management**: Full CRUD operations for personal tasks with status tracking and priority levels.
- **🛠️ Admin Dashboard**: Dedicated interface for administrators to manage users and monitor global statistics.
- **🛡️ Security First**: Implemented with Helmet for secure headers, Express-rate-limit for DDoS protection, and Joi for request validation.
- **📖 API Documentation**: Integrated Swagger UI for interactive API exploration.
- **⚡ Performance**: Node-cache implementation for optimized data retrieval.
- **🎨 Modern UI**: Built with React 19, Vite, and Tailwind CSS 4 for a premium, high-performance user experience.

---
<img width="1908" height="912" alt="image" src="https://github.com/user-attachments/assets/5a3b4740-9cc3-4957-b458-2f687c9f483b" />
<img width="1913" height="905" alt="image" src="https://github.com/user-attachments/assets/74192a30-e143-44a6-a757-45a20ab53825" />
<img width="1909" height="904" alt="image" src="https://github.com/user-attachments/assets/477efa19-00e0-4b5f-be83-3a4db6f46585" />
<img width="1912" height="909" alt="image" src="https://github.com/user-attachments/assets/a0362837-3b32-4652-abf9-29aa4f7a8862" />
<img width="1911" height="920" alt="image" src="https://github.com/user-attachments/assets/7659539e-aff5-4e97-8dc8-20117ea580b1" />
<img width="1909" height="900" alt="image" src="https://github.com/user-attachments/assets/fc4f64bb-6a80-499a-bc78-3c78e3da806e" />


## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Routing**: React Router Dom
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose)
- **Validation**: Joi
- **Logging**: Winston & Morgan
- **Security**: Helmet, Express-rate-limit, CORS

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-2006-git/Primetrade.git
   cd Primetrade
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Start Backend (Development):**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🛤️ API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - System statistics

---

## 📄 License
This project is licensed under the ISC License.

## 👤 Author
**Harsh**
- GitHub: [@Harsh-2006-git](https://github.com/Harsh-2006-git)
