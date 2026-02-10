import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Ruta para registrar usuarios
router.post('/register', register);

// Ruta para login
router.post('/login', login);

export default router;

