import { Router } from 'express';
import { listarProductos, crearProducto } from '../controllers/productController';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Listar productos (requiere usuario autenticado)
router.get('/productos', authMiddleware, listarProductos);

// Crear producto (solo admin)
router.post('/productos', authMiddleware, isAdmin, crearProducto);

export default router;

