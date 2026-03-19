# Find - Smart Marketplace for Land & Construction Materials

A full-stack marketplace platform for buying and selling land properties and construction materials. The platform features an **AI-powered chatbot** with intelligent semantic search and recommendations, real-time messaging, location-based search, and comprehensive admin moderation tools.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [AI Chatbot Architecture](#ai-chatbot-architecture)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [WebSocket Events](#websocket-events)
- [Contributing](#contributing)

## Key Features

### 🤖 AI-Powered Recommendation Engine
- **Intelligent Chatbot Assistant**
  - Powered by Google Gemini AI (gemini-1.5-flash)
  - Natural language understanding for property queries
  - Context-aware conversations with memory (last 10 messages)
  - Bilingual support (English and French)

- **Semantic Search & RAG**
  - Vector embeddings using Sentence Transformers (all-MiniLM-L6-v2)
  - Cosine similarity matching for relevant property recommendations
  - Retrieval Augmented Generation for accurate, data-driven responses
  - Real-time database integration with MongoDB

- **Smart Intent Detection**
  - AI-powered intent classification using Gemini
  - Fallback keyword-based detection
  - Automatic property search triggering
  - General conversation handling

### 🏪 Marketplace Features
- **Listing Management**
  - Create listings for land properties and construction materials
  - Upload multiple images per listing
  - Set prices in TND (Tunisian Dinar)
  - Location-based listings with Google Maps integration
  - Edit and delete owned listings
  - Filter by type (Land/Material) and approval status

- **Land Properties**
  - Area and superficie specifications
  - Unit measurements (m², hectares, etc.)
  - Equipment listings (water, electricity, sewage, etc.)
  - Detailed property information

- **Construction Materials**
  - Condition rating system (0-5 scale)
  - Material type and specifications
  - Pricing and availability

### 💬 Real-time Communication
- **Live Messaging System**
  - WebSocket-based instant messaging
  - Message editing and deletion
  - Read receipts
  - Unread message counters
  - Conversation persistence

- **Real-time Notifications**
  - Instant push notifications
  - Mark as read functionality
  - Notification history
  - Batch operations (mark all as read)

### 🗺️ Location Services
- **Google Maps Integration**
  - Interactive map visualization
  - Location picker for listings
  - Place name autocomplete
  - Coordinate-based search

- **Leaflet Maps**
  - Alternative map rendering
  - Routing capabilities
  - Distance calculations

### 👥 User Features
- **Authentication & Authorization**
  - Email and password registration
  - Email verification with 24-hour token expiry
  - Secure password hashing (bcrypt)
  - NextAuth session management

- **User Profiles**
  - Profile customization
  - View own listings
  - Message history
  - Notification preferences

- **Interactive Features**
  - Comment on listings
  - Report inappropriate content
  - Like/unlike comments
  - User-to-user messaging

### 🛡️ Admin Dashboard
- **Analytics & Monitoring**
  - Total users, posts, lands, and materials statistics
  - Platform activity monitoring
  - Interactive charts (Chart.js)

- **Content Moderation**
  - Review and approve/reject listings
  - Manage user reports
  - Delete inappropriate content
  - Comment moderation
  - User management

- **Report Management**
  - Review content reports
  - Categorized reasons (spam, offensive content, misinformation, harassment)
  - Status tracking (pending, reviewed, approved)

## Tech Stack

### AI Backend (Python)
- **Framework**: FastAPI
- **AI Models**:
  - Google Gemini AI (gemini-1.5-flash) for conversational AI
  - Sentence Transformers (all-MiniLM-L6-v2) for semantic embeddings
- **Vector Search**: Scikit-learn cosine similarity
- **Database Access**: PyMongo
- **Other**: NumPy, Python-dotenv, Uvicorn

### Backend (Node.js)
- **Runtime**: Node.js
- **Framework**: Express.js 5.0.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcrypt for password hashing
- **Real-time**: WebSocket (ws) and Socket.io
- **Email**: Nodemailer
- **File Upload**: Multer
- **Other**: CORS, dotenv, UUID

### Frontend (Next.js)
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
│   ├── Backend/                    # Node.js/Express API
│   │   ├── app.js                  # Main application file
│   │   ├── bin/
│   │   │   └── www                 # Server startup script
│   │   ├── controllers/            # Business logic
│   │   │   ├── AuthController.js
│   │   │   ├── CommentaireController.js
│   │   │   ├── itemController.js
│   │   │   ├── messageController.js
│   │   │   ├── NotoficationController.js
│   │   │   ├── ReportController.js
│   │   │   ├── UserController.js
│   │   │   ├── VerificationTokenController.js
│   │   │   └── mailsend.js
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── Commantaire.js
│   │   │   ├── Image.js
│   │   │   ├── Land.js
│   │   │   ├── Material.js
│   │   │   ├── Message.js
│   │   │   ├── Notification.js
│   │   │   ├── Post.js
│   │   │   ├── Report.js
│   │   │   ├── User.js
│   │   │   └── VerificationToken.js
│   │   ├── routes/                 # API routes
│   │   │   ├── comment.js
│   │   │   ├── items.js
│   │   │   ├── message.js
│   │   │   ├── notification.js
│   │   │   ├── Report.js
│   │   │   ├── user.js
│   │   │   ├── veriftoken.js
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   └── upload.js           # Multer configuration
│   │   └── package.json
│   │
│   └── llm_backend/                # Python AI Backend
│       ├── llm_backend.py          # FastAPI server (OpenAI)
│       └── llm_backend_gemini.py   # FastAPI server (Gemini)
│
├── front/                          # Next.js Frontend
│   ├── app/
│   │   ├── Admin/                  # Admin dashboard pages
│   │   ├── Chat/                   # Chat & messaging pages
│   │   ├── Notification/           # Notification pages
│   │   ├── OffreDetail/            # Listing detail pages
│   │   ├── OffrePage/              # Browse listings
│   │   ├── FormPages/              # Create listing forms
│   │   ├── UpdateForm/             # Edit listing forms
│   │   ├── profile/                # User profile pages
│   │   ├── signin/                 # Sign in page
│   │   ├── signup/                 # Sign up page
│   │   ├── verify-email/           # Email verification page
│   │   ├── aboutUs/                # About page
│   │   ├── components/             # Reusable React components
│   │   │   └── Chat/
│   │   │       └── Chatbot.tsx     # AI Chatbot component
│   │   ├── services/               # API service layer
│   │   ├── models/                 # TypeScript models
│   │   ├── context/                # React Context providers
│   │   ├── lib/                    # Utility functions
│   │   ├── styles/                 # Style files
│   │   └── types/                  # TypeScript type definitions
│   ├── public/                     # Static assets
│   └── package.json
│
├── .env                            # Environment variables
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v6 or higher)
- **npm** or yarn package manager
- **pip** (Python package manager)
- **Git**

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Find
```

### 2. Install Backend Dependencies (Node.js)

```bash
cd back/Backend
npm install
```

### 3. Install AI Backend Dependencies (Python)

```bash
cd ../llm_backend
pip install fastapi uvicorn pymongo sentence-transformers scikit-learn google-generativeai numpy python-dotenv
```

Or if you have a requirements.txt:
```bash
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd ../../front
npm install
```

## Environment Variables

### Root `.env` file (or `.env.local`)

```env
# Google Gemini API Key (for AI chatbot)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps API Key
GOOGLE_PLACES_API_KEY=your_google_maps_api_key

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/PostsDB

# Server Configuration
PORT=3001

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# AI Backend URL
NEXT_PUBLIC_CHATBOT_API_URL=http://localhost:8000
```

### Getting API Keys

1. **Google Gemini API**: Get your free API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Google Maps API**: Create a project and enable Maps JavaScript API at [Google Cloud Console](https://console.cloud.google.com/)

## Running the Application

### 1. Start MongoDB

Ensure MongoDB is running on your system:

```bash
mongod
```

### 2. Start AI Backend (Python/FastAPI)

```bash
cd back/llm_backend
python llm_backend_gemini.py
```

The AI backend will start on `http://localhost:8000`

### 3. Start Node.js Backend

```bash
cd back/Backend
npm start
```

The Express backend will start on `http://localhost:3001`

### 4. Start Frontend Development Server

```bash
cd front
npm run dev
```

The Next.js frontend will start on `http://localhost:3000`

### Access the Application

- **Frontend**: http://localhost:3000
- **Node.js API**: http://localhost:3001
- **AI Chatbot API**: http://localhost:8000
- **MongoDB**: mongodb://localhost:27017

## AI Chatbot Architecture

### How It Works

1. **User Query**: User sends a message through the chatbot interface
2. **Intent Detection**: Gemini AI analyzes if the query is about property/material search
3. **Semantic Search** (if property-related):
   - User query is converted to a vector embedding
   - Cosine similarity computed against all listing embeddings
   - Top 5 most relevant listings retrieved
4. **RAG Response Generation**:
   - Retrieved listings are formatted as context
   - Gemini AI generates a natural, conversational recommendation
5. **Conversation Mode** (if general chat):
   - Maintains conversation history
   - Provides helpful, friendly responses
   - Can answer general questions about the platform

### Key Technologies

- **Google Gemini 1.5 Flash**: Fast, efficient LLM for conversational AI
- **Sentence Transformers**: Creates semantic embeddings of listings
- **Vector Similarity**: Finds most relevant listings using cosine similarity
- **RAG Pattern**: Combines retrieval and generation for accurate recommendations
- **FastAPI**: High-performance Python backend (async support)
- **Conversation State**: Maintains context across multiple messages

### Chatbot Capabilities

- Recommend land properties based on location, price, features
- Suggest construction materials based on condition and type
- Answer questions about listings
- Provide general real estate advice
- Have natural conversations about the platform
- Bilingual support (French and English)

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

#### Check Email Exists
```http
POST /api/auth/check-email
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Listing Endpoints

#### Get All Listings
```http
GET /api/Posts
```

#### Get Approved Listings
```http
GET /api/Posts/approved
```

#### Get Pending Listings
```http
GET /api/Posts/pending
```

#### Get User's Approved Listings
```http
GET /api/Posts/user/approved/:userId
```

#### Get User's Pending Listings
```http
GET /api/Posts/user/pending/:userId
```

#### Get Listing by ID
```http
GET /api/Posts/:id
```

#### Create Listing
```http
POST /api/Posts
Content-Type: application/json

{
  "titre": "Premium Construction Sand",
  "description": "High-quality construction sand suitable for all building projects",
  "prix": 1500,
  "localisation": [36.8065, 10.1815],
  "placeName": "Tunis, Tunisia",
  "propertyType": "Material",
  "id_user": "user_id_here",
  "etat": 5,
  "photos": ["base64_image_1", "base64_image_2"]
}
```

For Land listings:
```json
{
  "titre": "Agricultural Land",
  "description": "Fertile land suitable for farming",
  "prix": 50000,
  "localisation": [36.8065, 10.1815],
  "placeName": "Zaghouan, Tunisia",
  "propertyType": "Land",
  "id_user": "user_id_here",
  "air": 5000,
  "Superficie": 5000,
  "unit": "m²",
  "equipements": ["water", "electricity", "road access"],
  "photos": ["base64_image_1", "base64_image_2"]
}
```

#### Update Listing
```http
PUT /api/Posts/:id
Content-Type: application/json
```

#### Delete Listing
```http
DELETE /api/Posts/:id
```

#### Approve Listing (Admin)
```http
PUT /api/Posts/approve/:id
```

#### Get Land Count
```http
GET /api/Posts/lands/count
```

#### Get Materials Count
```http
GET /api/Posts/materials/count
```

### Comment Endpoints

```http
GET /api/Comments/:postId         # Get comments by post ID
POST /api/Comments                # Create comment
DELETE /api/Comments/:id          # Delete comment
```

### Report Endpoints

```http
GET /api/Reports                  # Get all reports (admin)
POST /api/Reports                 # Create report
PUT /api/Reports/:id              # Update report status
DELETE /api/Reports/:id           # Delete report
```

### Message Endpoints

```http
GET /api/Message                       # Get all messages
GET /api/Message/conversation?senderId=x&receiverId=y
POST /api/Message                      # Send message
PUT /api/Message/:id                   # Edit message
DELETE /api/Message/:id                # Delete message
PUT /api/Message/read                  # Mark messages as read
```

### Notification Endpoints

```http
GET /api/Notification                  # Get all notifications
GET /api/Notification/user/:userId     # Get user notifications
POST /api/Notification                 # Create notification
PUT /api/Notification/:id              # Mark as read
PUT /api/Notification/read-all/:userId # Mark all as read
DELETE /api/Notification/:id           # Delete notification
```

### AI Chatbot Endpoint

```http
POST http://localhost:8000/generate
Content-Type: application/json

{
  "message": "I'm looking for affordable land near Tunis with water access"
}
```

Response:
```json
{
  "response": "I found some great options for you! Here are properties near Tunis with water access..."
}
```

## Database Models

### User Model
```javascript
{
  email: String (required, unique),
  name: String (required),
  password: String (hashed with bcrypt),
  image: String (profile picture URL),
  role: Number (0: regular user, 1: admin),
  emailVerified: Date,
  timestamps: true
}
```

### Post Model (Base - uses Discriminator Pattern)
```javascript
{
  titre: String (required),
  description: String (required),
  prix: Number (required, in TND),
  localisation: [Number] (coordinates [lat, lng]),
  placeName: String (required),
  propertyType: Enum ['Land', 'Material'],
  id_user: String (required),
  statut: Boolean (false: pending, true: approved),
  images: [ObjectId] (references Image model),
  timestamps: true
}
```

### Land Model (extends Post)
```javascript
{
  ...Post fields,
  air: Number (land area),
  Superficie: Number (surface area),
  unit: String (required - m², hectare, etc.),
  equipements: [String] (water, electricity, road, etc.)
}
```

### Material Model (extends Post)
```javascript
{
  ...Post fields,
  etat: Number (condition rating 0-5)
}
```

### Image Model
```javascript
{
  postId: ObjectId (required, references Post),
  path: String (base64 or URL),
  date: Date (default: now)
}
```

### Message Model
```javascript
{
  senderId: String (required),
  receiverId: String (required),
  text: String (required),
  isRead: Boolean (default: false),
  isEdited: Boolean (default: false),
  timestamps: true
}
```

### Notification Model
```javascript
{
  senderId: String (required),
  receiverId: String (required),
  text: String (required),
  isRead: Boolean (default: false),
  timestamps: true
}
```

### Report Model
```javascript
{
  userId: String (required),
  text: String (additional details),
  reason: [String] (enum: spam, offensive content, misinformation, harassment, inappropriate language, other),
  status: [String] (enum: pending, reviewed, approved),
  OffreId: String (required, the reported listing ID),
  date: Date (default: now)
}
```

### Comment Model
```javascript
{
  userId: String (required),
  postId: String (required),
  text: String (required),
  likes: Number (default: 0),
  timestamps: true
}
```

### Verification Token Model
```javascript
{
  email: String (required),
  token: String (required, UUID v4),
  expires: Date (required, 24 hours from creation),
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

All events above have corresponding responses from server to client with saved/updated data from MongoDB.

## Features in Detail

### AI Recommendation System

The chatbot uses a sophisticated RAG (Retrieval Augmented Generation) architecture:

1. **Embedding Generation**: All listings are converted to vector embeddings using Sentence Transformers
2. **Intent Detection**: Gemini AI determines if the user is asking for property recommendations
3. **Semantic Search**: User queries are matched against listing embeddings using cosine similarity
4. **Context Retrieval**: Top 5 most relevant listings are retrieved from MongoDB
5. **Response Generation**: Gemini AI generates personalized, conversational recommendations
6. **Conversation Memory**: Maintains context of last 10 messages per user

**Example Workflow**:
- User: "Je cherche un terrain avec eau et électricité près de Tunis"
- System: Detects property search intent → Performs vector search → Retrieves relevant lands → Generates recommendation
- Bot: "J'ai trouvé plusieurs terrains intéressants près de Tunis avec ces équipements..."

### Email Verification System
- UUID v4 token generation
- 24-hour token expiry
- HTML-formatted verification emails
- Automatic token cleanup on reuse
- Nodemailer integration

### Image Upload System
- Multiple image uploads per listing (base64 encoding)
- Image-Post association via MongoDB references
- Automatic cleanup of orphaned images on listing deletion
- Image compression on upload (Compressorjs)

### Real-time Features
- WebSocket connections with user identification
- Instant message delivery
- Live notification updates
- Message read receipts
- Online/offline status tracking
- Conversation persistence in localStorage

### Location Services
- Google Maps integration for location selection
- Place name autocomplete with suggestions
- Coordinate-based geospatial queries
- Distance calculation between locations
- Interactive map visualization with markers
- Leaflet maps with routing capabilities

### Admin Moderation Workflow
1. User creates listing → **statut: false** (pending)
2. Admin reviews listing in dashboard
3. Admin approves → **statut: true** (visible to all users)
4. Admin can also delete inappropriate content
5. Reports are tracked with status (pending → reviewed → approved)

### Security Features
- **Password Security**: bcrypt hashing with 10 salt rounds
- **Email Verification**: Required before full platform access
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Server-side validation for all inputs
- **Profanity Filtering**: Client-side content filtering
- **Content Reporting**: User-driven moderation system
- **XSS Protection**: Input sanitization

## Development Workflow

### Adding a New Listing

1. User signs up and verifies email
2. Navigate to "Create Listing" form
3. Fill in details (title, description, price, location)
4. Upload images
5. Select property type (Land or Material)
6. Submit for admin approval
7. Listing appears in "Pending" section
8. After admin approval, appears in marketplace

### Using the AI Chatbot

1. Click the chatbot button (bottom-right corner)
2. Ask questions like:
   - "Show me affordable construction materials"
   - "I need land with electricity near Sousse"
   - "What properties do you have under 20000 TND?"
3. Chatbot uses semantic search to find relevant listings
4. Provides personalized recommendations
5. Can continue conversation with follow-up questions

### Admin Operations

1. Login with admin account (role: 1)
2. Access Admin Dashboard
3. View statistics (total users, posts, etc.)
4. Review pending listings
5. Approve/reject or delete listings
6. Monitor and resolve user reports
7. Moderate comments

## Troubleshooting

### AI Chatbot Not Working
- Ensure Python backend is running on port 8000
- Check `GEMINI_API_KEY` is valid in `.env` file
- Verify MongoDB connection is active
- Check Python dependencies are installed

### Listings Not Appearing
- Check if listing has `statut: true` (approved)
- Verify user is authenticated
- Check MongoDB connection
- Ensure images are properly encoded

### Email Verification Not Sending
- Verify Nodemailer configuration in `.env`
- Check EMAIL_USER and EMAIL_PASSWORD
- For Gmail, use App Password (not regular password)
- Check spam folder

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code structure and naming conventions
- Add comments for complex logic
- Test AI chatbot responses thoroughly
- Ensure proper error handling
- Update this README for significant changes

## License

This project is licensed under the MIT License.

## Support

For support, email support@find-platform.com or open an issue in the repository.

## Acknowledgments

- **Google Gemini AI** for powering the intelligent chatbot
- **Sentence Transformers** for semantic search capabilities
- **Google Maps Platform** for location services
- **MongoDB** for database services
- **FastAPI** for high-performance Python backend
- All open-source libraries that made this project possible

## Future Enhancements

- [ ] Payment integration for transactions
- [ ] Advanced filtering (price range, location radius, equipment)
- [ ] User ratings and reviews
- [ ] Saved searches and favorites
- [ ] Email notifications for new listings
- [ ] Mobile app (React Native)
- [ ] Multi-language support expansion
- [ ] Image recognition for material type classification
- [ ] Chatbot voice input/output
- [ ] Price prediction using ML
