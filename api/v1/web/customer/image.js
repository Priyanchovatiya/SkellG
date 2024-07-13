
// import {Joi} from "../../../../utilities/schemaValidate";
// import { Router } from "express";
// import commonResolver from "../../../../utilities/commonResolver";
// import { upload} from "../../../../services/customer/customer";
// import { Error } from "mongoose";
// const Image = require("../../../../collections/customer/image");
// const router = new Router();

// const bodyParser = require('body-parser');
// router.use(bodyParser.json());

// /**
//  * @swagger
//  * /api/v1/customer/image:
//  *  post:
//  *   tags: ["Customer"]
//  *   summary: Save customer information.
//  *   description: api used for Save customer information.
//  *   consumes:
//  *      - multipart/form-data
//  *   parameters:
//  *      - in: formData
//  *        name: image
//  *        type: file
//  *        description: The image file to upload.
//  *      - in: formData
//  *        name: jobType
//  *        type: string
//  *        description: The image file to upload.
//  *   responses:
//  *    "200":
//  *     description: success
//  *    "400":
//  *     description: fail
//  */

// router.post('/image', upload.single('image'), async (req, res, next) => {
//     try {
      
//       // const newImage = new Image({
//       //   name: req.file.originalname,
//       //   data: req.file.buffer,
//       //   contentType: req.file.mimetype
//       // });
//       // await newImage.save();
//       // res.send('Image uploaded successfully!');
//       const file = req.file;
//       console.log(file);
//       if(!file){
//         const error = new Error('please upload a file');
//         error.httpStatusCode = 400
//         return next(error)
//       }

//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error uploading image');
//     }
//   });

// export default router;

import express from 'express';
import multer from 'multer';
import fs from 'fs';
const router = express.Router();

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Multer upload configuration
export const upload = multer({ storage: storage });

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
    const jobType = req.body.jobType;
    console.log("Job Type:", jobType); // Check if jobType is logged correctly
    
    // Example: Handling image upload and saving to database
    const uploadedFilePath = req.file.path; // Path to the uploaded file
    
    // Logic to move the file to another directory (example: 'processed')
    const targetDirectory = `uploads/${jobType}/`;
    const fileName = req.file.originalname;
    const targetFilePath = `${targetDirectory}${fileName}`;

    // Create target directory if it doesn't exist
    fs.mkdirSync(targetDirectory, { recursive: true });

    // Asynchronous file move
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
    res.status(500).send('Server error, failed to upload and move image.');
  }
});
export default router;
