import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class com_genus_synonym extends Model<
  InferAttributes<com_genus_synonym>,
  InferCreationAttributes<com_genus_synonym>
> {
  declare syn_genus_name: CreationOptional<string>
  declare genus_name?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_genus_synonym {
    return com_genus_synonym.init(
      {
        syn_genus_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        genus_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_genus_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_genus_name' }],
          },
        ],
      }
    )
  }
}
