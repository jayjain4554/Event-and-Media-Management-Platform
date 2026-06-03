# EventSphere – AI-Powered Event & Media Management Platform

<div align="center">

#   EventSphere

### AI-Powered Event Discovery, Media Management & Facial Recognition Platform

A full-stack web application that enables event organizers, photographers, and attendees to seamlessly manage events, upload media, and discover personalized event photos using AI-powered facial recognition.

![React](https://img.shields.io/badge/Frontend-React-blue)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-purple)

</div>

---

##   Live Demo

### Frontend

https://event-and-media-management-platform-three.vercel.app

### Backend API

https://event-and-media-management-platform-1.onrender.com

---

#   Overview

EventSphere is an AI-powered event and media management platform designed to streamline event organization and media sharing. The platform enables users to create and manage events, upload event media, and discover personalized event photos using facial recognition technology.

The system provides a complete ecosystem for:

- Event Organizers
- Photographers
- Event Attendees
- Administrators

Users can register reference selfies which are processed by the AI module to enable facial discovery across uploaded event media.

---

#   Features

##  Authentication & Authorization

- JWT-Based Authentication
- Secure Login & Registration
- Password Hashing using BCrypt
- Protected Routes
- Role-Based Access Control

### Supported Roles

- Admin
- Event Organizer
- Photographer
- Viewer

---

##  Event Management

Users can:

- Create Events
- Edit Events
- Delete Events
- Browse Public Events
- Categorize Events
- Manage Event Visibility

### Event Details

- Event Title
- Description
- Date & Time
- Location
- Category
- Cover Image

---

##  Media Management

Photographers and organizers can:

- Upload Event Images
- Manage Event Galleries
- Associate Media with Events
- View Uploaded Content

### Supported Media

- Event Photos
- Cover Images
- Photo Albums

---

##  AI Selfie Registration

Users can upload a reference selfie that is used for personalized media discovery.

### Workflow

1. Upload Selfie
2. Face Detection
3. Face Embedding Generation
4. Vector Storage
5. Facial Discovery Activation

---

##  Facial Recognition Discovery

The platform allows users to find event photos containing their faces.

### Discovery Pipeline

```text
Reference Selfie
        ↓
Face Detection
        ↓
Embedding Generation
        ↓
Vector Matching
        ↓
Personalized Photo Discovery
```

---

##  Favorites System

Users can:

- Save Favorite Events
- Manage Personal Collections
- Quickly Access Saved Events

---

##  Notification System

Provides updates regarding:

- Event Activities
- Media Uploads
- Platform Notifications
- User Interactions

---

##  Admin Panel

Administrators can:

- Manage Users
- Monitor Events
- Manage Uploaded Media
- Review Platform Activity

---

#  Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- BCrypt
- Multer

## Database

- MongoDB Atlas
- Mongoose

## Cloud & Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- MongoDB Atlas

---

#  Project Structure

```text
Event-and-Media-Management-Platform
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   ├── context
│   │   ├── services
│   │   └── constants
│   │
│   └── public
│
├── backend
│   ├── src
│   │   ├── modules
│   │   │   ├── auth
│   │   │   ├── user
│   │   │   ├── event
│   │   │   ├── media
│   │   │   ├── ai
│   │   │   ├── admin
│   │   │   ├── favorite
│   │   │   └── notification
│   │   │
│   │   ├── middleware
│   │   ├── services
│   │   ├── config
│   │   ├── utils
│   │   └── shared
│   │
│   └── public
│
└── README.md
```

---

#  API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Users

```http
GET /api/users/profile
PATCH /api/users/profile
```

## Events

```http
GET /api/events
POST /api/events
PATCH /api/events/:id
DELETE /api/events/:id
```

## Media

```http
POST /api/media/upload
GET /api/media
```

## AI Services

```http
POST /api/ai/selfie
POST /api/ai/discover
```

## Favorites

```http
POST /api/favorites
GET /api/favorites
```

---

#  Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=10000

NODE_ENV=production

MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=

APP_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
```

---

#  Installation

## Clone Repository

```bash
git clone https://github.com/jayjain4554/Event-and-Media-Management-Platform.git

cd Event-and-Media-Management-Platform
```

---

## Backend Setup

```bash
cd backend

npm install

npm run build

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

#  Security Features

- JWT Authentication
- BCrypt Password Hashing
- Helmet Security Headers
- API Rate Limiting
- MongoDB Query Sanitization
- CORS Protection
- Role-Based Authorization

---

#  Future Enhancements

- AWS Rekognition Integration
- Vector Database Support
- Multi-Face Search
- Event Ticketing System
- QR-Based Event Check-In
- Analytics Dashboard
- Mobile Application
- Advanced Album Management

---

#  Project Highlights

 Full-Stack MERN Architecture

 AI-Powered Facial Discovery

 MongoDB Atlas Integration

 Cloud Deployment (Vercel + Render)

 JWT Authentication

 Event & Media Management

 Real-Time Notifications

 Production-Ready Backend

---

#  Author

### Jay Jain

Chemical Engineering Undergraduate  
Indian Institute of Technology (IIT) Roorkee

### Contributions

- Full Stack Development
- Backend Architecture
- Database Design
- AI Integration
- Cloud Deployment
- API Development

---

#  License

This project is developed for educational, learning, and portfolio purposes.

---

⭐ If you found this project useful, consider giving it a star on GitHub!
