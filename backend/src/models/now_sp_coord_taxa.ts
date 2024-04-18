import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_sp_coord, now_sp_coordId } from './now_sp_coord'

export interface now_sp_coord_taxaAttributes {
  sp_coord_id: number
  order_name: string
  family_name: string
}

export type now_sp_coord_taxaPk = 'sp_coord_id' | 'order_name' | 'family_name'
export type now_sp_coord_taxaId = now_sp_coord_taxa[now_sp_coord_taxaPk]
export type now_sp_coord_taxaOptionalAttributes = 'sp_coord_id' | 'order_name' | 'family_name'
export type now_sp_coord_taxaCreationAttributes = Optional<
  now_sp_coord_taxaAttributes,
  now_sp_coord_taxaOptionalAttributes
>

export class now_sp_coord_taxa
  extends Model<now_sp_coord_taxaAttributes, now_sp_coord_taxaCreationAttributes>
  implements now_sp_coord_taxaAttributes
{
  sp_coord_id!: number
  order_name!: string
  family_name!: string

  // now_sp_coord_taxa belongsTo now_sp_coord via sp_coord_id
  sp_coord!: now_sp_coord
  getSp_coord!: Sequelize.BelongsToGetAssociationMixin<now_sp_coord>
  setSp_coord!: Sequelize.BelongsToSetAssociationMixin<now_sp_coord, now_sp_coordId>
  createSp_coord!: Sequelize.BelongsToCreateAssociationMixin<now_sp_coord>

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
