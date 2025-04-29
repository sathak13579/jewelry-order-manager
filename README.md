# Jewelry Order Manager

A web application for managing jewelry orders and repairs for a jewelry business. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

- Multi-tenant architecture with admin and client (business) user roles
- Admin panel to manage client businesses
- Client dashboard to manage orders for each jewelry business
- Store customer order details including type of order (new/repair), item type, price, gold weight, dates, etc.
- Track order status (pending, in_progress, completed, delivered, cancelled)
- View all orders on the dashboard in a card-style layout
- Create, edit, and delete orders
- Print order receipts for customers
- Responsive design

## Getting Started

### Prerequisites

- Node.js 14.x or later
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/jewelry-order-manager.git
cd jewelry-order-manager
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your MongoDB connection string and JWT secret:

```
MONGODB_URI=mongodb://localhost:27017/jewelry-orders
JWT_SECRET=your-secure-jwt-secret-key
```

If you're using MongoDB Atlas, your connection string will look like:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jewelry-orders?retryWrites=true&w=majority
```

### Running the Application

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Initial Setup

Visit [http://localhost:3000/admin/seed](http://localhost:3000/admin/seed) to create the initial admin account.

### Troubleshooting

#### Module not found: Can't resolve 'fs'

If you encounter this error related to bcrypt and node-pre-gyp, it's because Next.js doesn't support Node.js native modules in client-side code. The application handles this by:

1. Using API routes for any operations requiring bcrypt (like password hashing)
2. Keeping all bcrypt usage server-side

This ensures the application works correctly in both development and production environments.

## Project Structure

- `/components` - React components used throughout the application
- `/models` - MongoDB/Mongoose models and schemas
- `/pages` - Next.js pages and API routes
- `/lib` - Utility functions (MongoDB connection, authentication, etc.)
- `/styles` - Global CSS and Tailwind CSS setup
- `/public` - Static assets (images, favicon, etc.)
- `/types` - TypeScript interfaces and type definitions

## Main Features Description

### Multi-Tenant Architecture

- Admin user can create and manage multiple jewelry business clients
- Each client has their own secure login
- Client data is isolated and secured
- Admin can reset client passwords and log in as clients for support

### Order Management

- Create new jewelry orders or repair requests
- Store all relevant details including customer info, pricing, gold weight, etc.
- Set order dates and expected delivery dates
- Add special notes for each order
- Track order status throughout the fulfillment process

### Dashboard View

- Admin dashboard with client statistics
- Client dashboard with order statistics
- See all orders in a clean card layout
- Quickly scan key information
- Filter orders by status and search by customer/item details

### Print Receipts

- Generate professional receipts for customers
- Print directly from the browser
- Clean, well-formatted receipt design

## License

This project is licensed under the MIT License.
