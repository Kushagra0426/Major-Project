const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = 3000;

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Enable CORS using the cors middleware
app.use(cors());

// Define a route for image uploads
app.post('/upload', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        // Handle the case where no file is uploaded
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }
  
      const filePath = req.file.path;
      console.log('Image uploaded:', filePath);
      res.json({ success: true, filePath });
    } catch (error) {
      console.error('Error uploading image:', error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
