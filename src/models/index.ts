import { Sequelize } from 'sequelize';
import path from 'path';

// Configuración de Sequelize para usar SQLite con un archivo local database.sqlite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database.sqlite'),
  logging: false,
});

export default sequelize;

