# Full Stack Application - ArticleSphere

This repository contains both the frontend client (React/TypeScript/Vite) and backend server (Node.js/TypeScript) for the ArticleSphere application.

## Live Deployment

- **Frontend**: [https://article-sphere.vercel.app](https://article-sphere.vercel.app)
- **Backend API**: [https://articlesphere-server.onrender.com](https://articlesphere-server.onrender.com)

## Repository Structure
```
/
├── client/         # Frontend React application built with Vite
└── server/         # Backend Node.js application
```

## Client (Frontend)

### Technologies Used
- React
- TypeScript
- Vite

### Getting Started

#### Prerequisites
- Node.js (v14 or later)
- npm or yarn

#### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository/client
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the client directory with the following variables:
```
VITE_API_URL=http://localhost:8000/api
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

### Building for Production
```bash
npm run build
# or
yarn build
```
This will generate a `dist` folder with all the built assets.

### Deployment on Vercel
The client is currently deployed on Vercel at [https://article-sphere.vercel.app](https://article-sphere.vercel.app)

To deploy your own version:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables:
   - `VITE_API_URL`: Your production API URL (e.g., https://articlesphere-server.onrender.com/api)
5. Deploy

### Testing
```bash
npm run test
# or
yarn test
```

## Server (Backend)

### Technologies Used
- Node.js
- Express
- TypeScript
- MongoDB (assumed - adjust if using a different database)

### Getting Started

#### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas connection)

#### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository/server
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

### Building for Production
```bash
npm run build
# or
yarn build
```
This will generate a `dist` folder with the compiled JavaScript files.

### Deployment on Render
The server is currently deployed on Render at [https://articlesphere-server.onrender.com](https://articlesphere-server.onrender.com)

To deploy your own version:
1. Push your code to GitHub
2. Connect your repository to Render
3. Create a new Web Service
4. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add all environment variables from your `.env` file
6. Deploy

### API Documentation

#### Base URL
- Development: http://localhost:8000/api
- Production: https://articlesphere-server.onrender.com/api




### Testing
```bash
npm run test
# or
yarn test
```
