# Find - Lost & Found Platform for Land and Materials

A full-stack web application designed to help users report and find lost or found land properties and construction materials. The platform features real-time messaging, notifications, location tracking, and an admin dashboard for content moderation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [WebSocket Events](#websocket-events)
- [Contributing](#contributing)

## Features

### User Features
- **User Authentication & Authorization**
  - Email and password based registration
  - Email verification system with 24-hour token expiry
  - Secure password hashing with bcrypt
  - NextAuth integration for session management

- **Post Management**
  - Create posts for lost/found land properties and materials
  - Upload multiple images per post
  - Location-based tracking with Google Maps integration
  - Edit and delete owned posts
  - Filter posts by type (Land/Material) and status

- **Real-time Communication**
  - Live messaging system using WebSocket
  - Real-time notifications
  - Message editing and deletion
  - Read receipts for messages
  - Unread message counters

- **Interactive Features**
  - Comment on posts
  - Report inappropriate content
  - User profiles
  - Search functionality with location suggestions

- **Maps Integration**
  - Google Maps API for location visualization
  - Leaflet maps with routing capabilities
  - Place name autocomplete
  - Distance calculations

### Admin Features
- **Dashboard Analytics**
  - View total users, posts, lands, and materials statistics
  - Monitor platform activity

- **Content Moderation**
  - Review and approve/reject new posts
  - Manage user reports
  - Delete inappropriate content
  - View and moderate comments

- **User Management**
  - View all registered users
  - User activity monitoring

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.0.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcrypt for password hashing
- **Real-time**: WebSocket (ws) and Socket.io
- **Email**: Nodemailer
- **File Upload**: Multer
- **Other**: CORS, dotenv, UUID

### Frontend
- **Framework**: Next.js 15.2.4 (React 19.1.0)
- **Language**: TypeScript
- **Styling**:
  - Tailwind CSS
  - Material-UI (MUI)
  - Chakra UI
  - Emotion
- **Maps**:
  - Google Maps API
  - React Leaflet
  - Leaflet Routing Machine
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify, React Hot Toast, SweetAlert2
- **UI Components**:
  - Framer Motion (animations)
  - Headless UI
  - Radix UI
  - Lucide Icons
- **Other**:
  - Chart.js for analytics
  - Date-fns for date handling
  - Emoji Picker React
  - Image compression with Compressorjs
  - Profanity filtering

## Project Structure

```
Find/
├── back/
│   └── Backend/
│       ├── app.js                 # Main application file
│       ├── bin/
│       │   └── www               # Server startup script
│       ├── controllers/          # Business logic
│       │   ├── AuthController.js
│       │   ├── CommentaireController.js
│       │   ├── itemController.js
│       │   ├── messageController.js
│       │   ├── NotoficationController.js
│       │   ├── ReportController.js
│       │   ├── UserController.js
│       │   └── VerificationTokenController.js
│       ├── models/               # Database schemas
│       │   ├── Commantaire.js
│       │   ├── Image.js
│       │   ├── Land.js
│       │   ├── Material.js
│       │   ├── Message.js
│       │   ├── Notification.js
│       │   ├── Post.js
│       │   ├── Report.js
│       │   ├── User.js
│       │   └── VerificationToken.js
│       ├── routes/               # API routes
│       │   ├── comment.js
│       │   ├── items.js
│       │   ├── message.js
│       │   ├── notification.js
│       │   ├── Report.js
│       │   ├── user.js
│       │   └── veriftoken.js
│       ├── middleware/
│       │   └── upload.js         # File upload configuration
│       └── package.json
├── front/
│   ├── app/
│   │   ├── Admin/               # Admin dashboard pages
│   │   ├── components/          # React components
│   │   ├── services/           # API service layer
│   │   ├── models/             # TypeScript models
│   │   ├── api/                # API routes
│   │   ├── context/            # React Context
│   │   └── lib/                # Utility functions
│   ├── public/
│   └── package.json
├── .env                         # Environment variables
└── README.md

```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager
- Git

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Find
```

### 2. Install Backend Dependencies

```bash
cd back/Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../../front
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google Maps API Key
GOOGLE_PLACES_API_KEY=your_google_maps_api_key

# OpenAI API Key (optional, for AI features)
OPENAI_API_KEY=your_openai_api_key

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/PostsDB

# Server Configuration
PORT=3001

# Email Configuration (for nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# JWT Secret (if implementing JWT)
JWT_SECRET=your_jwt_secret_key

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running the Application

### Start MongoDB

Ensure MongoDB is running on your system:

```bash
mongod
```

### Start Backend Server

```bash
cd back/Backend
npm start
```

The backend server will start on `http://localhost:3001`

### Start Frontend Development Server

```bash
cd front
npm run dev
```

The frontend will start on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Post Endpoints

#### Get All Posts
```http
GET /api/Posts
```

#### Get Approved Posts
```http
GET /api/Posts/approved
```

#### Get Pending Posts
```http
GET /api/Posts/pending
```

#### Get Post by ID
```http
GET /api/Posts/:id
```

#### Create Post
```http
POST /api/Posts
Content-Type: application/json

{
  "titre": "Lost Construction Materials",
  "description": "Lost construction materials near downtown",
  "prix": 1500,
  "localisation": [48.8566, 2.3522],
  "placeName": "Paris, France",
  "propertyType": "Material",
  "id_user": "user_id_here",
  "etat": 3,
  "photos": ["base64_encoded_image_1", "base64_encoded_image_2"]
}
```

#### Update Post
```http
PUT /api/Posts/:id
```

#### Delete Post
```http
DELETE /api/Posts/:id
```

#### Approve Post
```http
PUT /api/Posts/approve/:id
```

### Comment Endpoints

```http
GET /api/Comments/:id          # Get comments by post ID
POST /api/Comments             # Create comment
DELETE /api/Comments/:id       # Delete comment
```

### Report Endpoints

```http
GET /api/Reports               # Get all reports
POST /api/Reports              # Create report
PUT /api/Reports/:id           # Update report status
DELETE /api/Reports/:id        # Delete report
```

### Message Endpoints

```http
GET /api/Message               # Get all messages
GET /api/Message/conversation  # Get conversation messages
POST /api/Message              # Send message
```

### Notification Endpoints

```http
GET /api/Notification          # Get all notifications
GET /api/Notification/user/:id # Get user notifications
POST /api/Notification         # Create notification
```

## Database Models

### User Model
```javascript
{
  email: String (required),
  name: String (required),
  password: String (hashed),
  image: String (URL),
  role: Number (0: user, 1: admin),
  emailVerified: Date,
  timestamps: true
}
```

### Post Model (Discriminator Pattern)
```javascript
{
  titre: String (required),
  description: String (required),
  prix: Number (required),
  localisation: [Number] (coordinates),
  placeName: String (required),
  propertyType: Enum ['Land', 'Material'],
  id_user: String (required),
  statut: Boolean (approved/pending),
  images: [ObjectId] (references Image),
  timestamps: true
}
```

### Land Model (extends Post)
```javascript
{
  ...Post fields,
  air: Number,
  Superficie: Number,
  unit: String (required),
  equipements: [String]
}
```

### Material Model (extends Post)
```javascript
{
  ...Post fields,
  etat: Number (condition rating)
}
```

### Message Model
```javascript
{
  senderId: String (required),
  receiverId: String (required),
  text: String (required),
  isRead: Boolean,
  isEdited: Boolean,
  timestamps: true
}
```

### Notification Model
```javascript
{
  senderId: String (required),
  receiverId: String (required),
  text: String (required),
  isRead: Boolean,
  timestamps: true
}
```

### Report Model
```javascript
{
  userId: String (required),
  text: String,
  reason: [String] (enum: spam, offensive content, misinformation, harassment, inappropriate language, other),
  status: [String] (enum: pending, reviewed, approved),
  OffreId: String (required),
  date: Date
}
```

### Comment Model
```javascript
{
  userId: String (required),
  postId: String (required),
  text: String (required),
  likes: Number,
  timestamps: true
}
```

## WebSocket Events

### Client to Server Events

#### NEW_MESSAGE
```javascript
{
  type: 'NEW_MESSAGE',
  message: {
    senderId: string,
    receiverId: string,
    text: string
  }
}
```

#### NEW_NOTIFICATION
```javascript
{
  type: 'NEW_NOTIFICATION',
  notification: {
    senderId: string,
    receiverId: string,
    text: string
  }
}
```

#### DELETE_MESSAGE
```javascript
{
  type: 'DELETE_MESSAGE',
  messageId: string
}
```

#### UPDATE_MESSAGE
```javascript
{
  type: 'UPDATE_MESSAGE',
  messageId: string,
  text: string
}
```

#### MESSAGE_READ
```javascript
{
  type: 'MESSAGE_READ',
  senderId: string,
  receiverId: string
}
```

#### MARK_NOTIFICATION_READ
```javascript
{
  type: 'MARK_NOTIFICATION_READ',
  notificationId: string
}
```

#### MARK_ALL_NOTIFICATIONS_READ
```javascript
{
  type: 'MARK_ALL_NOTIFICATIONS_READ'
}
```

#### DELETE_NOTIFICATION
```javascript
{
  type: 'DELETE_NOTIFICATION',
  notificationId: string
}
```

### Server to Client Events

All events above have corresponding responses from server to client with saved data from MongoDB.

## Features in Detail

### Email Verification System
- Upon registration, users receive a verification email
- Email contains a unique token valid for 24 hours
- Users must verify email before full access to platform
- Automated email templates with HTML formatting

### Image Upload System
- Multiple image uploads per post
- Image association with posts via references
- Automatic cleanup of orphaned images on post deletion
- Support for base64 encoded images

### Real-time Features
- WebSocket connections with user identification
- Instant message delivery
- Live notification updates
- Message read receipts
- Online/offline status tracking

### Location Services
- Google Maps integration for location selection
- Place name autocomplete
- Coordinate-based search
- Distance calculation between locations
- Map visualization with markers

### Admin Moderation
- Post approval workflow
- Content reporting system with predefined reasons
- Comment moderation
- User activity monitoring
- Statistics dashboard with counts

### Security Features
- Password hashing with bcrypt (10 salt rounds)
- Email verification required
- CORS configuration for controlled access
- Input validation and sanitization
- Profanity filtering for user-generated content
- Report system for inappropriate content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@find-platform.com or open an issue in the repository.

## Acknowledgments

- Google Maps Platform for location services
- MongoDB for database services
- Anthropic Claude for development assistance
- All open-source libraries used in this project
