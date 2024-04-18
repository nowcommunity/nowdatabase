import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class now_regional_culture extends Model<
  InferAttributes<now_regional_culture>,
  InferCreationAttributes<now_regional_culture>
> {
  declare regional_culture_id: CreationOptional<string>
  declare regional_culture_name: string

  static initModel(sequelize: Sequelize.Sequelize): typeof now_regional_culture {
    return now_regional_culture.init(
      {
        regional_culture_id: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        regional_culture_name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize,
        tableName: 'now_regional_culture',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'regional_culture_id' }],
          },
        ],
      }
    )
  }
}
