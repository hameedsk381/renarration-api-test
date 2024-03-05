import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import fetchRouter from './src/routes/fetchRouter.js';
import RenarrationRouter from './src/routes/RenarrationRouter.js';
import uploadRouter from './src/routes/uploadRouter.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 4000;

// Specify your client domain
const allowedOrigins = ['https://renarration.onrender.com','https://renarration-ui.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // Optionally add other CORS configuration options
};

// Use CORS middleware for all routes
app.use(cors(corsOptions));

app.use(express.json());

app.use('/sweets', RenarrationRouter);
app.use('/download', fetchRouter);
app.use('/upload', uploadRouter);
// Other middleware or routes

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});