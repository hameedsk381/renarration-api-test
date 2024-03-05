import multer from 'multer';

// Configure storage options, limits, etc., as needed
const upload = multer({ 
  // Multer settings, e.g., storage, file size limits, etc.
  limits: { fileSize: 100 * 1024 * 1024 }, // for example, limit file size to 10MB
});

export default upload;
