import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people, com_peopleId } from './com_people'
import type { com_species } from './com_species'
import type { now_loc } from './now_loc'
import type { now_plr } from './now_plr'
import type { now_proj_people } from './now_proj_people'
import type { now_psr } from './now_psr'

export class now_proj extends Model<InferAttributes<now_proj>, InferCreationAttributes<now_proj>> {
  declare pid: CreationOptional<number>
  declare contact: string
  declare proj_code?: string
  declare proj_name?: string
  declare proj_status?: string
  declare proj_records?: number

  // now_proj belongsTo com_people via contact
  declare contact_com_person?: Sequelize.NonAttribute<com_people>
  declare getContact_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setContact_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createContact_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_proj belongsToMany com_people via pid and initials
  declare initials_com_people: Sequelize.NonAttribute<com_people[]>
  declare getInitials_com_people: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  declare setInitials_com_people: Sequelize.BelongsToManySetAssociationsMixin<com_people, number>
  declare addInitials_com_person: Sequelize.BelongsToManyAddAssociationMixin<com_people, number>
  declare addInitials_com_people: Sequelize.BelongsToManyAddAssociationsMixin<com_people, number>
  declare createInitials_com_person: Sequelize.BelongsToManyCreateAssociationMixin<com_people, 'pid'>
  declare removeInitials_com_person: Sequelize.BelongsToManyRemoveAssociationMixin<com_people, number>
  declare removeInitials_com_people: Sequelize.BelongsToManyRemoveAssociationsMixin<com_people, number>
  declare hasInitials_com_person: Sequelize.BelongsToManyHasAssociationMixin<com_people, number>
  declare hasInitials_com_people: Sequelize.BelongsToManyHasAssociationsMixin<com_people, number>
  declare countInitials_com_people: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj belongsToMany com_species via pid and species_id
  declare species_id_com_species_now_psrs: Sequelize.NonAttribute<com_species[]>
  declare getSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyGetAssociationsMixin<com_species>
  declare setSpecies_id_com_species_now_psrs: Sequelize.BelongsToManySetAssociationsMixin<com_species, number>
  declare addSpecies_id_com_species_now_psr: Sequelize.BelongsToManyAddAssociationMixin<com_species, number>
  declare addSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyAddAssociationsMixin<com_species, number>
  declare createSpecies_id_com_species_now_psr: Sequelize.BelongsToManyCreateAssociationMixin<com_species, 'pid'>
  declare removeSpecies_id_com_species_now_psr: Sequelize.BelongsToManyRemoveAssociationMixin<com_species, number>
  declare removeSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyRemoveAssociationsMixin<com_species, number>
  declare hasSpecies_id_com_species_now_psr: Sequelize.BelongsToManyHasAssociationMixin<com_species, number>
  declare hasSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyHasAssociationsMixin<com_species, number>
  declare countSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj belongsToMany now_loc via pid and lid
  declare lid_now_loc_now_plrs: Sequelize.NonAttribute<now_loc[]>
  declare getLid_now_loc_now_plrs: Sequelize.BelongsToManyGetAssociationsMixin<now_loc>
  declare setLid_now_loc_now_plrs: Sequelize.BelongsToManySetAssociationsMixin<now_loc, number>
  declare addLid_now_loc_now_plr: Sequelize.BelongsToManyAddAssociationMixin<now_loc, number>
  declare addLid_now_loc_now_plrs: Sequelize.BelongsToManyAddAssociationsMixin<now_loc, number>
  declare createLid_now_loc_now_plr: Sequelize.BelongsToManyCreateAssociationMixin<now_loc, 'pid'>
  declare removeLid_now_loc_now_plr: Sequelize.BelongsToManyRemoveAssociationMixin<now_loc, number>
  declare removeLid_now_loc_now_plrs: Sequelize.BelongsToManyRemoveAssociationsMixin<now_loc, number>
  declare hasLid_now_loc_now_plr: Sequelize.BelongsToManyHasAssociationMixin<now_loc, number>
  declare hasLid_now_loc_now_plrs: Sequelize.BelongsToManyHasAssociationsMixin<now_loc, number>
  declare countLid_now_loc_now_plrs: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj hasMany now_plr via pid
  declare now_plrs?: Sequelize.NonAttribute<now_plr[]>
  declare getNow_plrs: Sequelize.HasManyGetAssociationsMixin<now_plr>
  declare setNow_plrs: Sequelize.HasManySetAssociationsMixin<now_plr, number>
  declare addNow_plr: Sequelize.HasManyAddAssociationMixin<now_plr, number>
  declare addNow_plrs: Sequelize.HasManyAddAssociationsMixin<now_plr, number>
  declare createNow_plr: Sequelize.HasManyCreateAssociationMixin<now_plr, 'pid'>
  declare removeNow_plr: Sequelize.HasManyRemoveAssociationMixin<now_plr, number>
  declare removeNow_plrs: Sequelize.HasManyRemoveAssociationsMixin<now_plr, number>
  declare hasNow_plr: Sequelize.HasManyHasAssociationMixin<now_plr, number>
  declare hasNow_plrs: Sequelize.HasManyHasAssociationsMixin<now_plr, number>
  declare countNow_plrs: Sequelize.HasManyCountAssociationsMixin
  // now_proj hasMany now_proj_people via pid
  declare now_proj_people?: Sequelize.NonAttribute<now_proj_people[]>
  declare getNow_proj_people: Sequelize.HasManyGetAssociationsMixin<now_proj_people>
  declare setNow_proj_people: Sequelize.HasManySetAssociationsMixin<now_proj_people, number>
  declare addNow_proj_person: Sequelize.HasManyAddAssociationMixin<now_proj_people, number>
  declare addNow_proj_people: Sequelize.HasManyAddAssociationsMixin<now_proj_people, number>
  declare createNow_proj_person: Sequelize.HasManyCreateAssociationMixin<now_proj_people, 'pid'>
  declare removeNow_proj_person: Sequelize.HasManyRemoveAssociationMixin<now_proj_people, number>
  declare removeNow_proj_people: Sequelize.HasManyRemoveAssociationsMixin<now_proj_people, number>
  declare hasNow_proj_person: Sequelize.HasManyHasAssociationMixin<now_proj_people, number>
  declare hasNow_proj_people: Sequelize.HasManyHasAssociationsMixin<now_proj_people, number>
  declare countNow_proj_people: Sequelize.HasManyCountAssociationsMixin
  // now_proj hasMany now_psr via pid
  declare now_psrs?: Sequelize.NonAttribute<now_psr[]>
  declare getNow_psrs: Sequelize.HasManyGetAssociationsMixin<now_psr>
  declare setNow_psrs: Sequelize.HasManySetAssociationsMixin<now_psr, number>
  declare addNow_psr: Sequelize.HasManyAddAssociationMixin<now_psr, number>
  declare addNow_psrs: Sequelize.HasManyAddAssociationsMixin<now_psr, number>
  declare createNow_psr: Sequelize.HasManyCreateAssociationMixin<now_psr, 'pid'>
  declare removeNow_psr: Sequelize.HasManyRemoveAssociationMixin<now_psr, number>
  declare removeNow_psrs: Sequelize.HasManyRemoveAssociationsMixin<now_psr, number>
  declare hasNow_psr: Sequelize.HasManyHasAssociationMixin<now_psr, number>
  declare hasNow_psrs: Sequelize.HasManyHasAssociationsMixin<now_psr, number>
  declare countNow_psrs: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof now_proj {
    return now_proj.init(
      {
        pid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        contact: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        proj_code: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        proj_name: {
          type: DataTypes.STRING(80),
          allowNull: true,
        },
        proj_status: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        proj_records: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_proj',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'pid' }],
          },
          {
            name: 'now_test_proj_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'contact' }],
          },
        ],
      }
    )
  }
}
