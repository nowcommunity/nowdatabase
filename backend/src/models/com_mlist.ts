import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_loc } from './now_loc'
import type { now_mus } from './now_mus'

export class com_mlist extends Model<InferAttributes<com_mlist>, InferCreationAttributes<com_mlist>> {
  declare museum: CreationOptional<string>
  declare institution: string
  declare alt_int_name?: string
  declare city?: string
  declare state_code?: string
  declare state?: string
  declare country?: string
  declare used_morph?: number
  declare used_now?: number
  declare used_gene?: number

  // com_mlist belongsToMany now_loc via museum and lid
  declare lid_now_loc_now_mus: Sequelize.NonAttribute<now_loc[]>
  declare getLid_now_loc_now_mus: Sequelize.BelongsToManyGetAssociationsMixin<now_loc>
  declare setLid_now_loc_now_mus: Sequelize.BelongsToManySetAssociationsMixin<now_loc, number>
  declare addLid_now_loc_now_mu: Sequelize.BelongsToManyAddAssociationMixin<now_loc, number>
  declare addLid_now_loc_now_mus: Sequelize.BelongsToManyAddAssociationsMixin<now_loc, number>
  declare createLid_now_loc_now_mu: Sequelize.BelongsToManyCreateAssociationMixin<now_loc, 'museum'>
  declare removeLid_now_loc_now_mu: Sequelize.BelongsToManyRemoveAssociationMixin<now_loc, number>
  declare removeLid_now_loc_now_mus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_loc, number>
  declare hasLid_now_loc_now_mu: Sequelize.BelongsToManyHasAssociationMixin<now_loc, number>
  declare hasLid_now_loc_now_mus: Sequelize.BelongsToManyHasAssociationsMixin<now_loc, number>
  declare countLid_now_loc_now_mus: Sequelize.BelongsToManyCountAssociationsMixin
  // com_mlist hasMany now_mus via museum
  declare now_mus?: Sequelize.NonAttribute<now_mus[]>
  declare getNow_mus: Sequelize.HasManyGetAssociationsMixin<now_mus>
  declare setNow_mus: Sequelize.HasManySetAssociationsMixin<now_mus, number>
  declare addNow_mu: Sequelize.HasManyAddAssociationMixin<now_mus, number>
  declare addNow_mus: Sequelize.HasManyAddAssociationsMixin<now_mus, number>
  declare createNow_mu: Sequelize.HasManyCreateAssociationMixin<now_mus, 'museum'>
  declare removeNow_mu: Sequelize.HasManyRemoveAssociationMixin<now_mus, number>
  declare removeNow_mus: Sequelize.HasManyRemoveAssociationsMixin<now_mus, number>
  declare hasNow_mu: Sequelize.HasManyHasAssociationMixin<now_mus, number>
  declare hasNow_mus: Sequelize.HasManyHasAssociationsMixin<now_mus, number>
  declare countNow_mus: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof com_mlist {
    return com_mlist.init(
      {
        museum: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        institution: {
          type: DataTypes.STRING(120),
          allowNull: false,
          defaultValue: '',
        },
        alt_int_name: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        state_code: {
          type: DataTypes.STRING(5),
          allowNull: true,
        },
        state: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        used_morph: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        used_now: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        used_gene: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_mlist',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'museum' }],
          },
        ],
      }
    )
  }
}
