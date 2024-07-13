import express from 'express';
import multer from 'multer';
import fs from 'fs';
const router = express.Router();

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    // Sanitize filename to remove special characters
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, sanitizedFileName);
  }
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Route for image upload
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const jobType = req.body.jobType; // Extract jobType from request body
    console.log("Job Type:", jobType); // Log jobType to console (for debugging)

    const file = req.file; // Uploaded file details

    // Check if file is present
    if (!file) {
      throw new Error('Please upload a file');
    }

    // Directory to save files based on jobType
    const targetDirectory = `uploads/${jobType}/`;

    // Ensure target directory exists
    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, { recursive: true });
    }

    // Move uploaded file to target directory
    const uploadedFilePath = file.path;
    const fileName = file.filename;
    const targetFilePath = `${targetDirectory}${fileName}`;

    fs.rename(uploadedFilePath, targetFilePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error, failed to upload and move image.');
      }
      // Respond with success message
      res.status(200).send('Image uploaded and moved successfully!');
    });
  } catch (err) {
    console.error(err);
    res.status(400).send('Bad request, please check your file upload.'); // Handle client-side errors
  }
});

export default router;
