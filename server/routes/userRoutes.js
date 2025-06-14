import express from 'express'
import { handleLogin } from '../controllers/userController.js';

const router = express.Router();

router.post('/', handleLogin);

export default router;