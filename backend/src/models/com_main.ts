import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface com_mainAttributes {
  one: number
}

export type com_mainPk = 'one'
export type com_mainId = com_main[com_mainPk]
export type com_mainOptionalAttributes = 'one'
export type com_mainCreationAttributes = Optional<com_mainAttributes, com_mainOptionalAttributes>

export class com_main extends Model<com_mainAttributes, com_mainCreationAttributes> implements com_mainAttributes {
  one!: number

  static initModel(sequelize: Sequelize.Sequelize): typeof com_main {
    return com_main.init(
      {
        one: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'com_main',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'one' }],
          },
        ],
      }
    )
  }
}
