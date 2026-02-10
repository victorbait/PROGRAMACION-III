import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// Validación básica de email para complementar la validación de Sequelize
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register: RequestHandler = async (req, res) => {
  try {
    const { nombre, email, password, nivel } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({ mensaje: 'nombre, email y password son obligatorios' });
      return;
    }

    if (!emailRegex.test(email)) {
      res.status(400).json({ mensaje: 'Email no válido' });
      return;
    }

    const existente = await User.findOne({ where: { email } });
    if (existente) {
      res.status(409).json({ mensaje: 'El email ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await User.create({
      nombre,
      email,
      password: hashedPassword,
      nivel: nivel === 'admin' ? 'admin' : 'usuario',
    });

    const { password: _, ...usuarioSinPassword } = usuario.toJSON() as any;

    res.status(201).json(usuarioSinPassword);
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
    return;
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ mensaje: 'email y password son obligatorios' });
      return;
    }

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
      return;
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nivel: usuario.nivel,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ token });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    return;
  }
};

