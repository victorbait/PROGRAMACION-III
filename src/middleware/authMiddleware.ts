import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: number; email: string; nivel: string };
}

export const authMiddleware: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : undefined;

    // Preferimos cookie (flujo del navegador), pero aceptamos header para pruebas con Postman
    const token = req.cookies?.token || tokenFromHeader;

    if (!token) {
      // Si es una petición de página HTML, redirigimos al login
      if (req.accepts('html')) {
        res.redirect('/login');
      } else {
        res.status(401).json({ mensaje: 'No autenticado' });
      }
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      id: number;
      email: string;
      nivel: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error en authMiddleware', error);
    if (req.accepts('html')) {
      res.redirect('/login');
    } else {
      res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
  }
};

export const isAdmin: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.nivel === 'admin') {
    next();
    return;
  }

  if (req.accepts('html')) {
    res.status(403).send('Acceso denegado. Solo administradores.');
  } else {
    res.status(403).json({ mensaje: 'Solo administradores pueden realizar esta acción' });
  }
};

