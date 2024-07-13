import express from 'express';
import multer from 'multer';
import fs from 'fs';
const router = express.Router();


router.get('/sam', async (req, res) => {
   try {
       console.log("Hello from server");
       res.status(200).send("Hello from server");
   } catch (error) {
       console.error(error);
       res.status(500).send("Internal Server Error");
   }
});
 export default router;