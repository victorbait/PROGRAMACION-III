import { RequestHandler } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const agregarAlCarrito: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    res.status(401).json({ mensaje: 'No autenticado' });
    return;
  }

  const { productId, cantidad } = req.body;

  if (!productId) {
    res.status(400).json({ mensaje: 'productId es obligatorio' });
    return;
  }

  const cantidadNumero = cantidad ? parseInt(cantidad, 10) : 1;
  if (isNaN(cantidadNumero) || cantidadNumero <= 0) {
    res.status(400).json({ mensaje: 'La cantidad debe ser un número mayor a 0' });
    return;
  }

  try {
    const producto = await Product.findByPk(productId);
    if (!producto) {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
      return;
    }

    const existente = await Cart.findOne({
      where: {
        userId: authReq.user.id,
        productId,
      },
    });

    if (existente) {
      existente.cantidad += cantidadNumero;
      await existente.save();
    } else {
      await Cart.create({
        userId: authReq.user.id,
        productId,
        cantidad: cantidadNumero,
      });
    }

    res.json({ mensaje: 'Producto agregado al carrito correctamente' });
  } catch (error: any) {
    console.error('Error al agregar al carrito', error);
    res.status(500).json({ mensaje: 'Error al agregar al carrito', error: error.message });
  }
};

export const verCarrito: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    // Por seguridad adicional, aunque authMiddleware ya lo controla
    res.redirect('/login');
    return;
  }

  try {
    const items = await Cart.findAll({
      where: { userId: authReq.user.id },
      include: [{ model: Product, as: 'producto' }],
      order: [['createdAt', 'DESC']],
    });

    const total = items.reduce((sum, item: any) => {
      const precio = Number(item.producto?.precio || 0);
      return sum + precio * item.cantidad;
    }, 0);

    res.render('carrito', {
      items,
      total,
    });
  } catch (error: any) {
    console.error('Error al obtener carrito', error);
    res.status(500).send('Error al obtener el carrito');
  }
};

export const vaciarCarrito: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    res.status(401).json({ mensaje: 'No autenticado' });
    return;
  }

  try {
    await Cart.destroy({
      where: {
        userId: authReq.user.id,
      },
    });

    // Si viene de un fetch (JSON)
    if (req.headers['content-type'] === 'application/json' || req.xhr) {
      res.json({ mensaje: 'Carrito vaciado correctamente' });
    } else {
      res.redirect('/carrito');
    }
  } catch (error: any) {
    console.error('Error al vaciar carrito', error);
    res.status(500).json({ mensaje: 'Error al vaciar el carrito', error: error.message });
  }
};

