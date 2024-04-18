import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_time_unit } from './now_time_unit'

export class now_tu_sequence extends Model<InferAttributes<now_tu_sequence>, InferCreationAttributes<now_tu_sequence>> {
  declare sequence: CreationOptional<string>
  declare seq_name: string

  // now_tu_sequence hasMany now_time_unit via sequence
  declare now_time_units?: Sequelize.NonAttribute<now_time_unit[]>
  declare getNow_time_units: Sequelize.HasManyGetAssociationsMixin<now_time_unit>
  declare setNow_time_units: Sequelize.HasManySetAssociationsMixin<now_time_unit, number>
  declare addNow_time_unit: Sequelize.HasManyAddAssociationMixin<now_time_unit, number>
  declare addNow_time_units: Sequelize.HasManyAddAssociationsMixin<now_time_unit, number>
  declare createNow_time_unit: Sequelize.HasManyCreateAssociationMixin<now_time_unit, 'sequence'>
  declare removeNow_time_unit: Sequelize.HasManyRemoveAssociationMixin<now_time_unit, number>
  declare removeNow_time_units: Sequelize.HasManyRemoveAssociationsMixin<now_time_unit, number>
  declare hasNow_time_unit: Sequelize.HasManyHasAssociationMixin<now_time_unit, number>
  declare hasNow_time_units: Sequelize.HasManyHasAssociationsMixin<now_time_unit, number>
  declare countNow_time_units: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof now_tu_sequence {
    return now_tu_sequence.init(
      {
        sequence: {
          type: DataTypes.STRING(30),
          allowNull: false,
          primaryKey: true,
        },
        seq_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'now_tu_sequence',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'sequence' }],
          },
        ],
      }
    )
  }
}
