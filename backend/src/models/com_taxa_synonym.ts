import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface com_taxa_synonymAttributes {
  synonym_id: number
  species_id: number
  syn_genus_name?: string
  syn_species_name?: string
  syn_comment?: string
}

export type com_taxa_synonymPk = 'synonym_id'
export type com_taxa_synonymId = com_taxa_synonym[com_taxa_synonymPk]
export type com_taxa_synonymOptionalAttributes =
  | 'synonym_id'
  | 'species_id'
  | 'syn_genus_name'
  | 'syn_species_name'
  | 'syn_comment'
export type com_taxa_synonymCreationAttributes = Optional<
  com_taxa_synonymAttributes,
  com_taxa_synonymOptionalAttributes
>

export class com_taxa_synonym
  extends Model<com_taxa_synonymAttributes, com_taxa_synonymCreationAttributes>
  implements com_taxa_synonymAttributes
{
  synonym_id!: number
  species_id!: number
  syn_genus_name?: string
  syn_species_name?: string
  syn_comment?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_taxa_synonym {
    return com_taxa_synonym.init(
      {
        synonym_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        species_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        syn_genus_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        syn_species_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        syn_comment: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_taxa_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'synonym_id' }],
          },
          {
            name: 'com_taxa_synonym_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'species_id' }],
          },
        ],
      }
    )
  }
}
