# Jewelry Order Manager

A web application for managing jewelry orders and repairs for a jewelry business. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

- Store customer order details including type of order (new/repair), item type, price, gold weight, dates, etc.
- View all orders on the homepage in a card-style layout
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
git clone https://github.com/sathak13579/jewelry-order-manager.git
cd jewelry-order-manager
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/jewelry-orders
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

## Project Structure

- `/components` - React components used throughout the application
- `/models` - MongoDB/Mongoose models and schemas
- `/pages` - Next.js pages and API routes
- `/lib` - Utility functions (MongoDB connection, etc.)
- `/styles` - Global CSS and Tailwind CSS setup
- `/public` - Static assets (images, favicon, etc.)

## License

This project is licensed under the MIT License.