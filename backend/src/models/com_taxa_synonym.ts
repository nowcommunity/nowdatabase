import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class com_taxa_synonym extends Model<
  InferAttributes<com_taxa_synonym>,
  InferCreationAttributes<com_taxa_synonym>
> {
  declare synonym_id: CreationOptional<number>
  declare species_id: number
  declare syn_genus_name?: string
  declare syn_species_name?: string
  declare syn_comment?: string

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
