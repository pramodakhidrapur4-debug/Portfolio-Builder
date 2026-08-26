import express from 'express';
import { 
  getPreviousWorks, 
  getPreviousWorkById, 
  createPreviousWork, 
  updatePreviousWork, 
  deletePreviousWork 
} from '../Controllers/WorksController.js';
import authmid from '../Middleware/Auth.js';
import adminAuth from '../Middleware/AdminAuth.js';
import { upload } from '../Middleware/multer.js';

const router = express.Router();

router.get('/', getPreviousWorks);
router.get('/:id', getPreviousWorkById);

router.post('/', authmid, adminAuth, upload.single('image'), createPreviousWork);
router.put('/:id', authmid, adminAuth, upload.single('image'), updatePreviousWork);
router.delete('/:id', authmid, adminAuth, deletePreviousWork);

export default router;
