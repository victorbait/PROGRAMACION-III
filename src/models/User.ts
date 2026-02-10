import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './index';

// Atributos del modelo de Usuario
interface UserAttributes {
  id: number;
  nombre: string;
  email: string;
  password: string;
  nivel: 'admin' | 'usuario';
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public nivel!: 'admin' | 'usuario';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'El email no es válido',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nivel: {
      type: DataTypes.ENUM('admin', 'usuario'),
      allowNull: false,
      defaultValue: 'usuario',
    },
  },
  {
    sequelize,
    tableName: 'usuarios',
  }
);

export default User;

