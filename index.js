import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import juice from 'juice';
import multer from 'multer';
import { create } from '@web3-storage/w3up-client';
const app = express();
import dotenv from 'dotenv';
import connectDB from './db.js'
import RenarrationRouter from './routes/Renarration.js'
import cheerio from 'cheerio';


const port = process.env.PORT || 4000
const upload = multer();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
connectDB();
dotenv.config();

let client;

(async () => {
  client = await create();
  const space = await client.createSpace('hameed_storage');
  const myAccount = await client.login('hameedsk381@gmail.com');
  await myAccount.provision(space.did());
  await space.save();
  const recovery = await space.createRecovery(myAccount.did());
  await client.capability.access.delegate({
    space: space.did(),
    delegations: [recovery],
  });
})();

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }
      
      const fileData = req.file.buffer;
      const fileName = req.file.originalname;
  
      const file = new File([fileData], fileName);
  
      const fileCid = await client.uploadFile(file);
  
      console.log('Uploaded file CID:', fileCid);
      res.send(`https://${fileCid}.ipfs.w3s.link/`);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    }
  });

app.delete('/delete/:public_id', (req, res) => {
    const public_id = req.params.public_id;

    cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting media from Cloudinary' });
        } else {
            res.status(200).json({ message: 'Media deleted successfully from Cloudinary' });
        }
    });
});

app.post('/download', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.get(url);

        // Load the HTML content into cheerio
        const $ = cheerio.load(response.data);

        // Remove favicon elements
        $('link[rel="icon"], link[rel="shortcut icon"]').remove();

        // Modify SVG elements
        $('svg').attr({
          'width': '50',
          'height': '50'
        });

        // Remove event handlers and adjust styles
        $('*').each((index, element) => {
            const el = $(element);
            el.removeAttr('onmouseover').removeAttr('onmouseout');
            const position = el.css('position');
            if (position === 'fixed' || position === 'sticky') {
                el.css('position', 'static');
            }
            const existingDataId = el.attr('data-id');
            el.attr('data-id', existingDataId || uuidv4());
        });

        // Inline CSS using juice and the modified HTML
        const htmlContent = juice($.html());

        res.header('Content-Type', 'text/html').send(htmlContent);
    } catch (error) {
        console.error(`This page cannot be renarrated at the moment: ${error}`);
        res.status(500).send('This page cannot be renarrated at the moment');
    }
});

app.use('/sweets', RenarrationRouter);

app.use('/uploads', express.static('uploads'));
   

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});
