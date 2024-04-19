import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_species, com_speciesId } from './com_species'
import type { now_proj, now_projId } from './now_proj'

export interface now_psrAttributes {
  pid: number
  species_id: number
}

export type now_psrPk = 'pid' | 'species_id'
export type now_psrId = now_psr[now_psrPk]
export type now_psrOptionalAttributes = 'pid' | 'species_id'
export type now_psrCreationAttributes = Optional<now_psrAttributes, now_psrOptionalAttributes>

export class now_psr extends Model<now_psrAttributes, now_psrCreationAttributes> implements now_psrAttributes {
  declare pid: number
  declare species_id: number

  // now_psr belongsTo com_species via species_id
  declare species: com_species
  declare getSpecies: Sequelize.BelongsToGetAssociationMixin<com_species>
  declare setSpecies: Sequelize.BelongsToSetAssociationMixin<com_species, com_speciesId>
  declare createSpecies: Sequelize.BelongsToCreateAssociationMixin<com_species>
  // now_psr belongsTo now_proj via pid
  declare pid_now_proj: now_proj
  declare getPid_now_proj: Sequelize.BelongsToGetAssociationMixin<now_proj>
  declare setPid_now_proj: Sequelize.BelongsToSetAssociationMixin<now_proj, now_projId>
  declare createPid_now_proj: Sequelize.BelongsToCreateAssociationMixin<now_proj>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_psr {
    return now_psr.init(
      {
        pid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_proj',
            key: 'pid',
          },
        },
        species_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'com_species',
            key: 'species_id',
          },
        },
      },
      {
        sequelize,
        tableName: 'now_psr',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'pid' }, { name: 'species_id' }],
          },
          {
            name: 'now_test_psr_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'pid' }],
          },
          {
            name: 'now_test_psr_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'species_id' }],
          },
        ],
      }
    )
  }
}
