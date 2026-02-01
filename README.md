# ESCOtech Ltd Backend API

Backend API for ESCOtech Ltd - A Civil Engineering Company Website

## Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL + Sequelize ORM
- JWT for authentication
- Nodemailer for emails
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

5. Create the PostgreSQL database:
   ```sql
   CREATE DATABASE escotech;
   ```

6. Run the seed script to create the initial admin:
   ```bash
   npm run seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Create initial admin user

## API Endpoints

### Health Check
- `GET /api/health` - API health check

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create new admin (protected)
- `GET /api/auth/me` - Get current admin profile (protected)

### Contact Form
- `POST /api/contact` - Submit contact form (public)

### Messages Management (Admin Only)
- `GET /api/messages` - List all contact submissions
- `GET /api/messages/:id` - Get single message
- `PATCH /api/messages/:id` - Mark as read/unread
- `DELETE /api/messages/:id` - Delete message

### Projects/Portfolio
- `GET /api/projects` - List all projects (public)
- `GET /api/projects/:id` - Get single project (public)
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Team Members
- `GET /api/team` - List all team members (public)
- `GET /api/team/:id` - Get single member (public)
- `POST /api/team` - Create member (admin)
- `PUT /api/team/:id` - Update member (admin)
- `DELETE /api/team/:id` - Delete member (admin)

### Services
- `GET /api/services` - List all services (public)
- `GET /api/services/:id` - Get single service (public)
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Image Upload
- `POST /api/upload` - Upload image (admin)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Default Admin Credentials

After running the seed script:
- Email: admin@escotech.rw
- Password: admin123

**Important:** Change the password after first login!

## Project Structure

```
src/
├── config/
│   └── database.ts
├── controllers/
│   ├── authController.ts
│   ├── contactController.ts
│   ├── messageController.ts
│   ├── projectController.ts
│   ├── serviceController.ts
│   ├── teamController.ts
│   └── uploadController.ts
├── middlewares/
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── upload.ts
│   └── validate.ts
├── models/
│   ├── Admin.ts
│   ├── Message.ts
│   ├── Project.ts
│   ├── Service.ts
│   ├── TeamMember.ts
│   └── index.ts
├── routes/
│   ├── authRoutes.ts
│   ├── contactRoutes.ts
│   ├── messageRoutes.ts
│   ├── projectRoutes.ts
│   ├── serviceRoutes.ts
│   ├── teamRoutes.ts
│   ├── uploadRoutes.ts
│   └── index.ts
├── scripts/
│   └── seed.ts
├── services/
│   └── emailService.ts
├── utils/
│   └── validators.ts
├── app.ts
└── server.ts
```

## License

ISC
