import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './index';

// Modelo pensado para futuras evaluaciones (precio > 0)
interface ProductAttributes {
  id: number;
  nombre: string;
  precio: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProductCreationAttributes = Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public nombre!: string;
  public precio!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
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
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: 'El precio debe ser mayor a 0',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'productos',
  }
);

export default Product;

