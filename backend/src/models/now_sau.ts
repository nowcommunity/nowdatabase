import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people, com_peopleId } from './com_people'
import type { com_species, com_speciesId } from './com_species'
import type { now_sr } from './now_sr'
import type { ref_ref } from './ref_ref'

export class now_sau extends Model<InferAttributes<now_sau>, InferCreationAttributes<now_sau>> {
  declare suid: CreationOptional<number>
  declare sau_coordinator: string
  declare sau_authorizer: string
  declare species_id: number
  declare sau_date?: string
  declare sau_comment?: string

  // now_sau belongsTo com_people via sau_coordinator
  declare sau_coordinator_com_person?: Sequelize.NonAttribute<com_people>
  declare getSau_coordinator_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setSau_coordinator_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createSau_coordinator_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_sau belongsTo com_people via sau_authorizer
  declare sau_authorizer_com_person?: Sequelize.NonAttribute<com_people>
  declare getSau_authorizer_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setSau_authorizer_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createSau_authorizer_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_sau belongsTo com_species via species_id
  declare species?: Sequelize.NonAttribute<com_species>
  declare getSpecies: Sequelize.BelongsToGetAssociationMixin<com_species>
  declare setSpecies: Sequelize.BelongsToSetAssociationMixin<com_species, number>
  declare createSpecies: Sequelize.BelongsToCreateAssociationMixin<com_species>
  // now_sau hasMany now_sr via suid
  declare now_srs?: Sequelize.NonAttribute<now_sr[]>
  declare getNow_srs: Sequelize.HasManyGetAssociationsMixin<now_sr>
  declare setNow_srs: Sequelize.HasManySetAssociationsMixin<now_sr, number>
  declare addNow_sr: Sequelize.HasManyAddAssociationMixin<now_sr, number>
  declare addNow_srs: Sequelize.HasManyAddAssociationsMixin<now_sr, number>
  declare createNow_sr: Sequelize.HasManyCreateAssociationMixin<now_sr, 'suid'>
  declare removeNow_sr: Sequelize.HasManyRemoveAssociationMixin<now_sr, number>
  declare removeNow_srs: Sequelize.HasManyRemoveAssociationsMixin<now_sr, number>
  declare hasNow_sr: Sequelize.HasManyHasAssociationMixin<now_sr, number>
  declare hasNow_srs: Sequelize.HasManyHasAssociationsMixin<now_sr, number>
  declare countNow_srs: Sequelize.HasManyCountAssociationsMixin
  // now_sau belongsToMany ref_ref via suid and rid
  declare rid_ref_ref_now_srs: Sequelize.NonAttribute<ref_ref[]>
  declare getRid_ref_ref_now_srs: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  declare setRid_ref_ref_now_srs: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, number>
  declare addRid_ref_ref_now_sr: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, number>
  declare addRid_ref_ref_now_srs: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, number>
  declare createRid_ref_ref_now_sr: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref, 'suid'>
  declare removeRid_ref_ref_now_sr: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, number>
  declare removeRid_ref_ref_now_srs: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, number>
  declare hasRid_ref_ref_now_sr: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, number>
  declare hasRid_ref_ref_now_srs: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, number>
  declare countRid_ref_ref_now_srs: Sequelize.BelongsToManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof now_sau {
    return now_sau.init(
      {
        suid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        sau_coordinator: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        sau_authorizer: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        species_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'com_species',
            key: 'species_id',
          },
        },
        sau_date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        sau_comment: {
          type: DataTypes.STRING(1024),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_sau',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'suid' }],
          },
          {
            name: 'now_test_sau_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'species_id' }],
          },
          {
            name: 'now_test_sau_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'sau_coordinator' }],
          },
          {
            name: 'now_test_sau_FKIndex3',
            using: 'BTREE',
            fields: [{ name: 'sau_authorizer' }],
          },
        ],
      }
    )
  }
}
