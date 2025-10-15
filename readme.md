# Event Management API

A RESTful Event Management API built with Node.js, Express, and PostgreSQL.

## Features

- Create and manage events
- User registration system
- Event capacity management
- Registration validation
- Event statistics
- Upcoming events listing

## Database Schema

### Users Table
- `id` SERIAL PRIMARY KEY
- `name` VARCHAR(255) NOT NULL
- `email` VARCHAR(255) UNIQUE NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Events Table
- `id` SERIAL PRIMARY KEY
- `title` VARCHAR(255) NOT NULL
- `date_time` TIMESTAMP NOT NULL
- `location` VARCHAR(255) NOT NULL
- `capacity` INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 1000)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Registrations Table
- `id` SERIAL PRIMARY KEY
- `user_id` INTEGER REFERENCES users(id) ON DELETE CASCADE
- `event_id` INTEGER REFERENCES events(id) ON DELETE CASCADE
- `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- UNIQUE(user_id, event_id)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-management-api