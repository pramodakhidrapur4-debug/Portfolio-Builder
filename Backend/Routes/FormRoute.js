import { fetdata, FormInfo } from "../Controllers/FormController.js";
import express from 'express'
import { upload } from "../Middleware/multer.js";
import authmid from "../Middleware/Auth.js";
const Formin=express.Router();
Formin.post('/fill',authmid,upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "projectImages", maxCount: 20 }
]),FormInfo);
Formin.get('/:id',fetdata)
export default Formin;
