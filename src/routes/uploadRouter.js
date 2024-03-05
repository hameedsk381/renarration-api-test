import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import upload from '../middleware/uploadMiddleware.js';

const uploadRouter = express.Router();

// Single file upload route
uploadRouter.post('/', upload.single('file'), uploadFile);

export default uploadRouter;
