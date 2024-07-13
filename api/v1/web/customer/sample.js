import express from 'express';
import multer from 'multer';
import fs from 'fs';
const router = express.Router();


router.get('/sample', 
 async (req, res) => {
    console.log("hello from server");
 })