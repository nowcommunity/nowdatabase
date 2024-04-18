import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class com_order_synonym extends Model<
  InferAttributes<com_order_synonym>,
  InferCreationAttributes<com_order_synonym>
> {
  declare syn_order_name: CreationOptional<string>
  declare order_name?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_order_synonym {
    return com_order_synonym.init(
      {
        syn_order_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        order_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_order_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_order_name' }],
          },
        ],
      }
    )
  }
}
