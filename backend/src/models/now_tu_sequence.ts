import * as Sequelize from 'sequelize'
import { DataTypes, Model } from 'sequelize'
import type { now_time_unit, now_time_unitId } from './now_time_unit'

export interface now_tu_sequenceAttributes {
  sequence: string
  seq_name: string
}

export type now_tu_sequencePk = 'sequence'
export type now_tu_sequenceId = now_tu_sequence[now_tu_sequencePk]
export type now_tu_sequenceCreationAttributes = now_tu_sequenceAttributes

export class now_tu_sequence
  extends Model<now_tu_sequenceAttributes, now_tu_sequenceCreationAttributes>
  implements now_tu_sequenceAttributes
{
  sequence!: string
  seq_name!: string

  // now_tu_sequence hasMany now_time_unit via sequence
  now_time_units!: now_time_unit[]
  getNow_time_units!: Sequelize.HasManyGetAssociationsMixin<now_time_unit>
  setNow_time_units!: Sequelize.HasManySetAssociationsMixin<now_time_unit, now_time_unitId>
  addNow_time_unit!: Sequelize.HasManyAddAssociationMixin<now_time_unit, now_time_unitId>
  addNow_time_units!: Sequelize.HasManyAddAssociationsMixin<now_time_unit, now_time_unitId>
  createNow_time_unit!: Sequelize.HasManyCreateAssociationMixin<now_time_unit>
  removeNow_time_unit!: Sequelize.HasManyRemoveAssociationMixin<now_time_unit, now_time_unitId>
  removeNow_time_units!: Sequelize.HasManyRemoveAssociationsMixin<now_time_unit, now_time_unitId>
  hasNow_time_unit!: Sequelize.HasManyHasAssociationMixin<now_time_unit, now_time_unitId>
  hasNow_time_units!: Sequelize.HasManyHasAssociationsMixin<now_time_unit, now_time_unitId>
  countNow_time_units!: Sequelize.HasManyCountAssociationsMixin

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
