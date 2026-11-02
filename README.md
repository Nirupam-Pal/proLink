ProfileLink 🔗

ProfileLink is a full-stack web application designed for professional networking and profile management. It allows users to create personalized profiles, connect with others, and share posts and documents.

🚀 Key Features

* User Profiles: Create and view detailed professional profiles including usernames and personal information.
* Networking: Discover other users and manage professional connections.
* Post Management: Create, view, and interact with posts within the community.
* PDF Generation: Generate professional documents directly through the platform.
* Media Handling: Upload and host images and documents via Cloudinary.

🛠️ Technology Stack

Frontend

* **Framework**: Next.js 15 (Pages Router).
* **State Management**: Redux Toolkit & React-Redux.
* **Styling**: CSS Modules and Global CSS.
* **HTTP Client**: Axios.

Backend

* Runtime: Node.js with Express.js.
* Database: MongoDB with Mongoose ODM.
* Authentication: Bcrypt for password hashing and custom user controllers.
* Storage: Multer and Cloudinary.
* PDF Tools: PDFKit and pdf-creator-node.

📂 Project Structure

```text
├── frontend/             # Next.js application
│   ├── src/pages/        # Routing and view components
│   ├── src/config/redux/ # State management logic
│   └── public/           # Static assets (images, icons)
├── backend/              # Express.js API
│   ├── controllers/      # Business logic for posts and users
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   └── config/           # Middleware and service configurations
└── package.json          # Root dependencies for media handling

```

⚙️ Installation & Setup

1. Prerequisites

* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/) account or local instance.
* [Cloudinary](https://cloudinary.com/) account for media uploads.

2. Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add:
* `MONGO_URI`
* `CLOUDINARY_CLOUD_NAME`
* `CLOUDINARY_API_KEY`
* `CLOUDINARY_API_SECRET`


4. Start the server: `npm run dev`

3. Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

📝 Scripts

* **Backend Dev**: `npm run dev` (uses nodemon)
* **Frontend Dev**: `npm run dev` (uses Next.js Turbopack)
* **Build Frontend**: `npm run build`

---
