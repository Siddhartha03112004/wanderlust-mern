# 🌍 Wanderlust – Travel Listing Web Application

Wanderlust is a full-stack travel listing platform inspired by Airbnb. Users can explore destinations, create and manage listings, upload images, leave reviews, and rate places. The application follows the MVC architecture and implements secure authentication and authorization mechanisms.

---

## 🚀 Live Demo

https://wanderlust-mern-r3yi.onrender.com/listings

---

## ✨ Features

### 🔐 Authentication & Authorization

- User Registration and Login
- Secure Authentication using Passport.js
- Session Management with Express Session
- Logout Functionality
- Protected Routes
- Listing Owners can Edit/Delete only their own listings
- Review Authors can Delete only their own reviews

### 🏡 Listing Management

- Create New Listings
- View All Listings
- View Detailed Listing Information
- Edit Existing Listings
- Delete Listings
- Upload and Store Images using Cloudinary

### ⭐ Reviews & Ratings

- Add Reviews to Listings
- Rating System
- Delete Reviews
- Review Validation

### 🛡️ Security & Validation

- Server-side Validation using Joi
- Error Handling Middleware
- Flash Messages for User Feedback
- Authorization Checks
- Protected CRUD Operations

### 🎨 User Interface

- Responsive Design
- Bootstrap 5 Integration
- Clean and User-Friendly Layout
- Dynamic EJS Templates

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- Bootstrap 5
- EJS

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- Passport.js
- Passport Local
- Passport Local Mongoose

### Cloud Storage

- Cloudinary
- Multer
- Multer Storage Cloudinary

### Validation & Utilities

- Joi
- Connect Flash
- Express Session
- Method Override

---

## 📂 Project Structure

```bash
wanderlust/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── init/
│   ├── data.js
│   └── index.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/
│   ├── css/
│   └── js/
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── views/
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   └── users/
│
├── app.js
├── cloudConfig.js
├── middleware.js
├── schema.js
├── package.json
└── .env
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Siddhartha03112004/wanderlust-mern.git
cd wanderlust-mern
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
ATLASDB_URL=your_mongodb_connection_string

SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name

CLOUD_API_KEY=your_cloudinary_api_key

CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 4. Seed the Database

```bash
node init/index.js
```

### 5. Start the Application

```bash
node app.js
```

or

```bash
npm start
```

### 6. Open in Browser

```bash
http://localhost:8080
```

---

## 📚 Concepts Implemented

- RESTful Routing
- MVC Architecture
- CRUD Operations
- Authentication & Authorization
- Session Handling
- Middleware
- Server-side Validation
- MongoDB Relationships
- Image Uploads with Cloudinary
- Error Handling
- Flash Messages
- Responsive UI Design

---

## 🎯 Future Enhancements

- Search Functionality
- Category-Based Filtering
- Interactive Maps Integration
- User Profile Pages
- Wishlist Feature
- Booking System
- Payment Gateway Integration
- Advanced Search Filters

---

## 👨‍💻 Author

**Siddhartha Singh**

GitHub: https://github.com/Siddhartha03112004

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub.

---

## 📄 License

This project is licensed under the MIT License.
