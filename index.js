const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const juice = require('juice');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Added Cloudinary
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

// Configure Cloudinary for image, video, and audio uploads
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('Cloudinary configuration status: Configured successfully');

// Multer Configuration
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });

// Route for multiple file upload to Cloudinary
app.post('/upload', upload.single('file'), (req, res) => {
    const path = req.file.path;
    cloudinary.uploader.upload(path, { resource_type: "auto" }, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error uploading file to Cloudinary' });
        } else {
            res.status(200).json(result.secure_url);
        }
    });
});
// Route for deleting media from Cloudinary
app.delete('/delete/:public_id', (req, res) => {
    const public_id = req.params.public_id;

    // Call Cloudinary's delete method to delete the media
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
            el.removeAttribute('onmouseover');
            el.removeAttribute('onmouseout');
            if (el.style.position === 'fixed' || el.style.position === 'sticky') {
                el.style.position = 'static';
            }
            const existingDataId = el.getAttribute('data-id');
            el.setAttribute('data-id', existingDataId || uuidv4());
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
