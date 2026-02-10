import { Router } from 'express';
import { agregarAlCarrito, verCarrito, vaciarCarrito } from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Ver carrito del usuario logueado
router.get('/carrito', authMiddleware, verCarrito);

// Agregar producto al carrito
router.post('/carrito/agregar', authMiddleware, agregarAlCarrito);

// Vaciar carrito
router.delete('/carrito/vaciar', authMiddleware, vaciarCarrito);

export default router;

