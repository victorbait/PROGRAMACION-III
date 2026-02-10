import { RequestHandler } from 'express';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const listarProductos: RequestHandler = async (req, res) => {
  try {
    const productos = await Product.findAll({ order: [['nombre', 'ASC']] });
    const authReq = req as AuthenticatedRequest;
    const esAdmin = authReq.user?.nivel === 'admin';

    res.render('productos', {
      productos,
      esAdmin,
      mensajeExito: null,
      mensajeError: null,
    });
  } catch (error: any) {
    console.error('Error al listar productos', error);
    res.status(500).send('Error al cargar los productos');
  }
};

export const crearProducto: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const esAdmin = authReq.user?.nivel === 'admin';

  const { nombre, codigo, precio, descripcion } = req.body;

  const errores: string[] = [];

  if (!nombre || !codigo || !precio || !descripcion) {
    errores.push('Todos los campos son obligatorios.');
  }

  const precioNumero = parseFloat(precio);
  if (isNaN(precioNumero) || precioNumero <= 0) {
    errores.push('El precio debe ser un número mayor a 0.');
  }

  if (errores.length > 0) {
    const productos = await Product.findAll({ order: [['nombre', 'ASC']] });
    res.status(400).render('productos', {
      productos,
      esAdmin,
      mensajeExito: null,
      mensajeError: errores.join(' '),
    });
    return;
  }

  try {
    await Product.create({
      nombre,
      codigo,
      precio: precioNumero,
      descripcion,
    });

    const productos = await Product.findAll({ order: [['nombre', 'ASC']] });

    res.render('productos', {
      productos,
      esAdmin,
      mensajeExito: 'Producto creado correctamente.',
      mensajeError: null,
    });
  } catch (error: any) {
    console.error('Error al crear producto', error);

    let mensajeError = 'Error al crear el producto.';
    if (error.name === 'SequelizeUniqueConstraintError') {
      mensajeError = 'El código de producto ya existe. Usa otro código.';
    } else if (error.errors?.[0]?.message) {
      mensajeError = error.errors[0].message;
    }

    const productos = await Product.findAll({ order: [['nombre', 'ASC']] });

    res.status(400).render('productos', {
      productos,
      esAdmin,
      mensajeExito: null,
      mensajeError,
    });
  }
};

