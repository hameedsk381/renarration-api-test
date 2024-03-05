import express from 'express';
import { downloadContent } from '../controllers/fetchHtmlController.js';


const fetchRouter = express.Router();

fetchRouter.post('/', downloadContent);

export default fetchRouter;
