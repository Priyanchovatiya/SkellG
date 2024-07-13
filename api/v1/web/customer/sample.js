import express from 'express';
import multer from 'multer';
import fs from 'fs';
const router = express.Router();


router.get('/sam', 
 async (req, res) => {
    console.log("hello from server");
 })
 export default router;