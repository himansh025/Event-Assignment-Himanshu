# 🎉 Event Management API

A robust **RESTful Event Management API** built with **Node.js**, **Express**, and **PostgreSQL**.  
This API allows you to create events, manage user registrations, and track event statistics — all with proper validation, error handling, and clean architecture.

---

## 🚀 Features

- 🗓️ **Event Management:** Create, view, and manage events  
- 👥 **User Registration:** Register users for events with capacity limits  
- ✅ **Validation:** Comprehensive input validation and business logic  
- 📊 **Statistics:** Track event registration statistics  
- 🔒 **Security:** Proper error handling and input sanitization  
- 🗄️ **Database:** PostgreSQL with efficient queries and transactions  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Validation** | Joi |
| **Security** | Helmet, CORS |

---

## 📋 Prerequisites

- Node.js (v14 or higher)  
- PostgreSQL (v12 or higher)  
- npm or yarn  


---


### **Tables**

#### 🧾 `events`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique ID |
| title | VARCHAR(255) | Event title |
| date_time | TIMESTAMP | Event date & time |
| location | VARCHAR(255) | Event location |
| capacity | INT | Max participants (≤ 1000) |
| created_at | TIMESTAMP DEFAULT NOW() | Record creation time |

#### 👤 `registrations`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique registration ID |
| event_id | INT REFERENCES events(id) | Event reference |
| user_name | VARCHAR(255) | Participant’s name |
| user_email | VARCHAR(255) | Participant’s email |
| registered_at | TIMESTAMP DEFAULT NOW() | Registration timestamp |

---

# ⚙️ Setup Instructions
  # 1️⃣ Clone the Repository
      git clone event-assignment-himanshu
      cd event-assignment-himanshu
      
# 2️⃣ Install Dependencies
      npm install

# 3️⃣ Environment Configuration
   Create a .env file in the root directory:

# env
         NODE_ENV=development
         PORT=3000
         DB_USER=postgres
         DB_HOST=localhost
         DB_NAME=event_management
         DB_PASSWORD=your_password
         DB_PORT=5432

# 4️⃣ Database Setup

# Create PostgreSQL database
      createdb event_management

# Initialize database tables
      npm run init-db


# Development mode
      npm run dev

# Production mode
      npm start

---

## 🧠 API Endpoints

### **Events**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

### **Registrations**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/events/:id/register` | Register user for event |
| GET | `/api/events/:id/registrations` | Get all registrations for an event |

---

## 🧩 Example Request

**Create Event**
      ```bash
      POST /api/events
      Content-Type: application/json

      {
         "title": "Tech Conference 2025",
        "date_time": "2025-12-20T10:00:00Z",
        "location": "New Delhi",
        "capacity": 500
      }


**🔒 Validation Rules&=**
## Event Validation
   title: Required, string (1–255 characters)

   dateTime: Required, ISO 8601 format, must be in future

   location: Required, string (1–255 characters)
   
   capacity: Required, integer between 1 and 1000

## User Validation
   name: Required, string (1–255 characters)

   email: Required, valid email format

 ## Registration Validation
   User cannot register twice for same event

  Cannot exceed event capacity

  Cannot register for past events

**🐛 Error Handling**
Status Codes:

      200 - Success

      201 - Created

      400 - Bad Request

      404 - Not Found

      409 - Conflict

      500 - Internal Server Error

   Error Response Example:

      {
     "error": "Error message description"
      }
💡
