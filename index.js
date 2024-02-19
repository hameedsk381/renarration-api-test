const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const juice = require('juice');
const multer = require('multer');
const app = express();
require('dotenv').config();
const connectDB = require('./db');
const port = process.env.PORT || 4000

app.use(cors()); // Allow CORS to all
app.use(bodyParser.json()); // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
app.use(express.json());
// Connect to MongoDB
connectDB();

// Define the destination paths for uploads and sweets
const uploadDestination = 'uploads/';

// Configure Multer for uploads
const upload = multer({ 
    limits: { fileSize: 200 * 1024 * 1024 }, 
    dest: uploadDestination 
});

    
// Route for multiple file upload
app.post('/upload', (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error uploading file' });
        } else {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
            } else {
                const filePath = req.file.path;
                res.status(200).json(filePath);
            }
        }
    });
});
app.post('/download', async (req, res) => {
    const { url } = req.body;
    const device = req.headers['User-Agent'];

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': device
            }
        });
        
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

   

        // Select all SVG elements and replace them with a small logo size SVG
        const svgElements = document.querySelectorAll('svg');
        svgElements.forEach(svg => {
            svg.setAttribute('width', '50');
            svg.setAttribute('height', '50');
           
        });
        // Your existing code to manipulate other elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            // el.removeAttribute('onclick');
            el.removeAttribute('onmouseover');
            el.removeAttribute('onmouseout');
            // el.removeAttribute('href');
            if (el.style.position === 'fixed' || el.style.position === 'sticky') {
                el.style.position = 'static';
            }
            const existingDataId = el.getAttribute('data-id');
            if (!existingDataId || existingDataId === '') {
                el.setAttribute('data-id', uuidv4());
            } else {
                el.setAttribute('data-id', uuidv4());
            }
        });

        // Convert all CSS to inline styling using juice
        const htmlContent = juice(dom.serialize());

        res.header('Content-Type', 'text/html');
        res.send(htmlContent);

    } catch (error) {
        console.error('This page cannot be renarrated at the moment:', error);
        res.status(500).send('This page cannot be renarrated at the moment');
    }
});

app.use('/sweets', require('./routes/Renarration'));

app.use('/uploads', express.static('uploads'));
   

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});