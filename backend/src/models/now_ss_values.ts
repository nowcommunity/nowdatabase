import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class now_ss_values extends Model<InferAttributes<now_ss_values>, InferCreationAttributes<now_ss_values>> {
  declare ss_value: CreationOptional<string>
  declare category?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof now_ss_values {
    return now_ss_values.init(
      {
        ss_value: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        category: {
          type: DataTypes.STRING(80),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_ss_values',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'ss_value' }],
          },
        ],
      }
    )
  }
}
