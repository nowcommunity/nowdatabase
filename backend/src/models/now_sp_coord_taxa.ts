import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_sp_coord, now_sp_coordId } from './now_sp_coord'

export class now_sp_coord_taxa extends Model<
  InferAttributes<now_sp_coord_taxa>,
  InferCreationAttributes<now_sp_coord_taxa>
> {
  declare sp_coord_id: CreationOptional<number>
  declare order_name: CreationOptional<string>
  declare family_name: CreationOptional<string>

  // now_sp_coord_taxa belongsTo now_sp_coord via sp_coord_id
  declare sp_coord?: Sequelize.NonAttribute<now_sp_coord>
  declare getSp_coord: Sequelize.BelongsToGetAssociationMixin<now_sp_coord>
  declare setSp_coord: Sequelize.BelongsToSetAssociationMixin<now_sp_coord, number>
  declare createSp_coord: Sequelize.BelongsToCreateAssociationMixin<now_sp_coord>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_sp_coord_taxa {
    return now_sp_coord_taxa.init(
      {
        sp_coord_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_sp_coord',
            key: 'sp_coord_id',
          },
        },
        order_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        family_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'now_sp_coord_taxa',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'sp_coord_id' }, { name: 'order_name' }, { name: 'family_name' }],
          },
          {
            name: 'now_test_sp_coord_taxa_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'sp_coord_id' }],
          },
        ],
      }
    )
  }
}
