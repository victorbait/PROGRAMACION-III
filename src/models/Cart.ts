import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './index';
import User from './User';
import Product from './Product';

interface CartAttributes {
  id: number;
  userId: number;
  productId: number;
  cantidad: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type CartCreationAttributes = Optional<CartAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public userId!: number;
  public productId!: number;
  public cantidad!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'La cantidad debe ser al menos 1',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'carritos',
  }
);

// Asociaciones para poder incluir usuario y producto en las consultas
Cart.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'producto' });

export default Cart;

