import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class com_subfamily_synonym extends Model<
  InferAttributes<com_subfamily_synonym>,
  InferCreationAttributes<com_subfamily_synonym>
> {
  declare syn_subfamily_name: CreationOptional<string>
  declare subfamily_name?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_subfamily_synonym {
    return com_subfamily_synonym.init(
      {
        syn_subfamily_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        subfamily_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_subfamily_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_subfamily_name' }],
          },
        ],
      }
    )
  }
}
