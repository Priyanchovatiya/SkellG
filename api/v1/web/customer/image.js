import express from 'express';
import multer from 'multer';
import fs from 'fs';
const router = express.Router();

// for parsing application/json
router.use(express.json()); 

// for parsing application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
router.use(upload.array()); 
router.use(express.static('public'));


// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      console.log("enter");
      cb(null, 'D:/resume'); // Directory where files will be stored
      console.log("added sucessfully");
    } catch (error) {
      console.log("error", error);
    }
  
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original filename for uploaded file
  }
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Route for image upload
/**
 * @swagger
 * /api/v1/customer/image:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Upload customer image.
 *     description: API used for uploading customer images.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The image file to upload.
 *       - in: formData
 *         name: jobType
 *         type: string
 *         required: true
 *         description: The type of job associated with the image.
 *     responses:
 *       '200':
 *         description: Image uploaded successfully.
 *       '400':
 *         description: Bad request, please check your file upload.
 *       '500':
 *         description: Server error, failed to upload image.
 */
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
    const fileName = req.file.originalname.trim(); // Trim any leading/trailing spaces
    const targetFilePath = `${targetDirectory}${fileName}`;

    // Ensure target directory exists
    fs.mkdirSync(targetDirectory, { recursive: true });

    // Move uploaded file to target directory
    fs.rename(file.path, targetFilePath, (err) => {
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
