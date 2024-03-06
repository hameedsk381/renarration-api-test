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

app.use(cors());

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to the Renarration API');
});

app.use('/sweets', RenarrationRouter);
app.use('/download', fetchRouter);
app.use('/upload', uploadRouter);
// Other middleware or routes

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
