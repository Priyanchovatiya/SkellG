import express from 'express';
import multer from 'multer';
import fs from 'fs';
const router = express.Router();


router.post('/samp', async (req, res) => {
   try {
       const name = req.body.name;
       console.log("Hello from server");
       res.status(200).send(`${name}`);
   } catch (error) {
       console.error(error);
       res.status(500).send("Internal Server Error");
   }
});
 export default router;