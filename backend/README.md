# Backend

This folder contains the Express/MongoDB backend for certificate management.

- `server.js`: Main server file
- `routes/`: Express route handlers
- `models/`: Mongoose models
- `upload/`: Uploaded certificate images

## Setup
1. Add your MongoDB connection string to `.env` as `MONGO_URL`.
2. Run `npm install express mongoose multer dotenv` in this folder.
3. Start the server with `node server.js`.
