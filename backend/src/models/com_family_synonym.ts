import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class com_family_synonym extends Model<
  InferAttributes<com_family_synonym>,
  InferCreationAttributes<com_family_synonym>
> {
  declare syn_family_name: CreationOptional<string>
  declare family_name?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_family_synonym {
    return com_family_synonym.init(
      {
        syn_family_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        family_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_family_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_family_name' }],
          },
        ],
      }
    )
  }
}
