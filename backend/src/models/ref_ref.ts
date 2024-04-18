import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_bau } from './now_bau'
import type { now_br } from './now_br'
import type { now_lau } from './now_lau'
import type { now_lr } from './now_lr'
import type { now_sau } from './now_sau'
import type { now_sr } from './now_sr'
import type { now_tau } from './now_tau'
import type { now_tr } from './now_tr'
import type { now_tu_bound } from './now_tu_bound'
import type { now_tur } from './now_tur'
import type { ref_authors } from './ref_authors'
import type { ref_journal, ref_journalId } from './ref_journal'
import type { ref_keywords } from './ref_keywords'
import type { ref_keywords_ref } from './ref_keywords_ref'
import type { ref_ref_type, ref_ref_typeId } from './ref_ref_type'

export class ref_ref extends Model<InferAttributes<ref_ref>, InferCreationAttributes<ref_ref>> {
  declare rid: CreationOptional<number>
  declare ref_type_id: number
  declare journal_id?: number
  declare title_primary?: string
  declare date_primary?: number
  declare volume?: string
  declare issue?: string
  declare start_page?: number
  declare end_page?: number
  declare publisher?: string
  declare pub_place?: string
  declare title_secondary?: string
  declare date_secondary?: number
  declare title_series?: string
  declare issn_isbn?: string
  declare ref_abstract?: string
  declare web_url?: string
  declare misc_1?: string
  declare misc_2?: string
  declare gen_notes?: string
  declare printed_language?: string
  declare exact_date?: string
  declare used_morph?: number
  declare used_now?: number
  declare used_gene?: number

  // ref_ref belongsTo ref_journal via journal_id
  declare journal?: Sequelize.NonAttribute<ref_journal>
  declare getJournal: Sequelize.BelongsToGetAssociationMixin<ref_journal>
  declare setJournal: Sequelize.BelongsToSetAssociationMixin<ref_journal, number>
  declare createJournal: Sequelize.BelongsToCreateAssociationMixin<ref_journal>
  // ref_ref belongsToMany now_bau via rid and buid
  declare buid_now_baus: Sequelize.NonAttribute<now_bau[]>
  declare getBuid_now_baus: Sequelize.BelongsToManyGetAssociationsMixin<now_bau>
  declare setBuid_now_baus: Sequelize.BelongsToManySetAssociationsMixin<now_bau, number>
  declare addBuid_now_bau: Sequelize.BelongsToManyAddAssociationMixin<now_bau, number>
  declare addBuid_now_baus: Sequelize.BelongsToManyAddAssociationsMixin<now_bau, number>
  declare createBuid_now_bau: Sequelize.BelongsToManyCreateAssociationMixin<now_bau, 'rid'>
  declare removeBuid_now_bau: Sequelize.BelongsToManyRemoveAssociationMixin<now_bau, number>
  declare removeBuid_now_baus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_bau, number>
  declare hasBuid_now_bau: Sequelize.BelongsToManyHasAssociationMixin<now_bau, number>
  declare hasBuid_now_baus: Sequelize.BelongsToManyHasAssociationsMixin<now_bau, number>
  declare countBuid_now_baus: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_br via rid
  declare now_brs?: Sequelize.NonAttribute<now_br[]>
  declare getNow_brs: Sequelize.HasManyGetAssociationsMixin<now_br>
  declare setNow_brs: Sequelize.HasManySetAssociationsMixin<now_br, number>
  declare addNow_br: Sequelize.HasManyAddAssociationMixin<now_br, number>
  declare addNow_brs: Sequelize.HasManyAddAssociationsMixin<now_br, number>
  declare createNow_br: Sequelize.HasManyCreateAssociationMixin<now_br, 'rid'>
  declare removeNow_br: Sequelize.HasManyRemoveAssociationMixin<now_br, number>
  declare removeNow_brs: Sequelize.HasManyRemoveAssociationsMixin<now_br, number>
  declare hasNow_br: Sequelize.HasManyHasAssociationMixin<now_br, number>
  declare hasNow_brs: Sequelize.HasManyHasAssociationsMixin<now_br, number>
  declare countNow_brs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany now_lau via rid and luid
  declare luid_now_laus: Sequelize.NonAttribute<now_lau[]>
  declare getLuid_now_laus: Sequelize.BelongsToManyGetAssociationsMixin<now_lau>
  declare setLuid_now_laus: Sequelize.BelongsToManySetAssociationsMixin<now_lau, number>
  declare addLuid_now_lau: Sequelize.BelongsToManyAddAssociationMixin<now_lau, number>
  declare addLuid_now_laus: Sequelize.BelongsToManyAddAssociationsMixin<now_lau, number>
  declare createLuid_now_lau: Sequelize.BelongsToManyCreateAssociationMixin<now_lau, 'rid'>
  declare removeLuid_now_lau: Sequelize.BelongsToManyRemoveAssociationMixin<now_lau, number>
  declare removeLuid_now_laus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_lau, number>
  declare hasLuid_now_lau: Sequelize.BelongsToManyHasAssociationMixin<now_lau, number>
  declare hasLuid_now_laus: Sequelize.BelongsToManyHasAssociationsMixin<now_lau, number>
  declare countLuid_now_laus: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_lr via rid
  declare now_lrs?: Sequelize.NonAttribute<now_lr[]>
  declare getNow_lrs: Sequelize.HasManyGetAssociationsMixin<now_lr>
  declare setNow_lrs: Sequelize.HasManySetAssociationsMixin<now_lr, number>
  declare addNow_lr: Sequelize.HasManyAddAssociationMixin<now_lr, number>
  declare addNow_lrs: Sequelize.HasManyAddAssociationsMixin<now_lr, number>
  declare createNow_lr: Sequelize.HasManyCreateAssociationMixin<now_lr, 'rid'>
  declare removeNow_lr: Sequelize.HasManyRemoveAssociationMixin<now_lr, number>
  declare removeNow_lrs: Sequelize.HasManyRemoveAssociationsMixin<now_lr, number>
  declare hasNow_lr: Sequelize.HasManyHasAssociationMixin<now_lr, number>
  declare hasNow_lrs: Sequelize.HasManyHasAssociationsMixin<now_lr, number>
  declare countNow_lrs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany now_sau via rid and suid
  declare suid_now_saus: Sequelize.NonAttribute<now_sau[]>
  declare getSuid_now_saus: Sequelize.BelongsToManyGetAssociationsMixin<now_sau>
  declare setSuid_now_saus: Sequelize.BelongsToManySetAssociationsMixin<now_sau, number>
  declare addSuid_now_sau: Sequelize.BelongsToManyAddAssociationMixin<now_sau, number>
  declare addSuid_now_saus: Sequelize.BelongsToManyAddAssociationsMixin<now_sau, number>
  declare createSuid_now_sau: Sequelize.BelongsToManyCreateAssociationMixin<now_sau, 'rid'>
  declare removeSuid_now_sau: Sequelize.BelongsToManyRemoveAssociationMixin<now_sau, number>
  declare removeSuid_now_saus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_sau, number>
  declare hasSuid_now_sau: Sequelize.BelongsToManyHasAssociationMixin<now_sau, number>
  declare hasSuid_now_saus: Sequelize.BelongsToManyHasAssociationsMixin<now_sau, number>
  declare countSuid_now_saus: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_sr via rid
  declare now_srs?: Sequelize.NonAttribute<now_sr[]>
  declare getNow_srs: Sequelize.HasManyGetAssociationsMixin<now_sr>
  declare setNow_srs: Sequelize.HasManySetAssociationsMixin<now_sr, number>
  declare addNow_sr: Sequelize.HasManyAddAssociationMixin<now_sr, number>
  declare addNow_srs: Sequelize.HasManyAddAssociationsMixin<now_sr, number>
  declare createNow_sr: Sequelize.HasManyCreateAssociationMixin<now_sr, 'rid'>
  declare removeNow_sr: Sequelize.HasManyRemoveAssociationMixin<now_sr, number>
  declare removeNow_srs: Sequelize.HasManyRemoveAssociationsMixin<now_sr, number>
  declare hasNow_sr: Sequelize.HasManyHasAssociationMixin<now_sr, number>
  declare hasNow_srs: Sequelize.HasManyHasAssociationsMixin<now_sr, number>
  declare countNow_srs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany now_tau via rid and tuid
  declare tuid_now_taus: Sequelize.NonAttribute<now_tau[]>
  declare getTuid_now_taus: Sequelize.BelongsToManyGetAssociationsMixin<now_tau>
  declare setTuid_now_taus: Sequelize.BelongsToManySetAssociationsMixin<now_tau, number>
  declare addTuid_now_tau: Sequelize.BelongsToManyAddAssociationMixin<now_tau, number>
  declare addTuid_now_taus: Sequelize.BelongsToManyAddAssociationsMixin<now_tau, number>
  declare createTuid_now_tau: Sequelize.BelongsToManyCreateAssociationMixin<now_tau, 'rid'>
  declare removeTuid_now_tau: Sequelize.BelongsToManyRemoveAssociationMixin<now_tau, number>
  declare removeTuid_now_taus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_tau, number>
  declare hasTuid_now_tau: Sequelize.BelongsToManyHasAssociationMixin<now_tau, number>
  declare hasTuid_now_taus: Sequelize.BelongsToManyHasAssociationsMixin<now_tau, number>
  declare countTuid_now_taus: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_tr via rid
  declare now_trs?: Sequelize.NonAttribute<now_tr[]>
  declare getNow_trs: Sequelize.HasManyGetAssociationsMixin<now_tr>
  declare setNow_trs: Sequelize.HasManySetAssociationsMixin<now_tr, number>
  declare addNow_tr: Sequelize.HasManyAddAssociationMixin<now_tr, number>
  declare addNow_trs: Sequelize.HasManyAddAssociationsMixin<now_tr, number>
  declare createNow_tr: Sequelize.HasManyCreateAssociationMixin<now_tr, 'rid'>
  declare removeNow_tr: Sequelize.HasManyRemoveAssociationMixin<now_tr, number>
  declare removeNow_trs: Sequelize.HasManyRemoveAssociationsMixin<now_tr, number>
  declare hasNow_tr: Sequelize.HasManyHasAssociationMixin<now_tr, number>
  declare hasNow_trs: Sequelize.HasManyHasAssociationsMixin<now_tr, number>
  declare countNow_trs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany now_tu_bound via rid and bid
  declare bid_now_tu_bounds: Sequelize.NonAttribute<now_tu_bound[]>
  declare getBid_now_tu_bounds: Sequelize.BelongsToManyGetAssociationsMixin<now_tu_bound>
  declare setBid_now_tu_bounds: Sequelize.BelongsToManySetAssociationsMixin<now_tu_bound, number>
  declare addBid_now_tu_bound: Sequelize.BelongsToManyAddAssociationMixin<now_tu_bound, number>
  declare addBid_now_tu_bounds: Sequelize.BelongsToManyAddAssociationsMixin<now_tu_bound, number>
  declare createBid_now_tu_bound: Sequelize.BelongsToManyCreateAssociationMixin<now_tu_bound, 'rid'>
  declare removeBid_now_tu_bound: Sequelize.BelongsToManyRemoveAssociationMixin<now_tu_bound, number>
  declare removeBid_now_tu_bounds: Sequelize.BelongsToManyRemoveAssociationsMixin<now_tu_bound, number>
  declare hasBid_now_tu_bound: Sequelize.BelongsToManyHasAssociationMixin<now_tu_bound, number>
  declare hasBid_now_tu_bounds: Sequelize.BelongsToManyHasAssociationsMixin<now_tu_bound, number>
  declare countBid_now_tu_bounds: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_tur via rid
  declare now_turs?: Sequelize.NonAttribute<now_tur[]>
  declare getNow_turs: Sequelize.HasManyGetAssociationsMixin<now_tur>
  declare setNow_turs: Sequelize.HasManySetAssociationsMixin<now_tur, number>
  declare addNow_tur: Sequelize.HasManyAddAssociationMixin<now_tur, number>
  declare addNow_turs: Sequelize.HasManyAddAssociationsMixin<now_tur, number>
  declare createNow_tur: Sequelize.HasManyCreateAssociationMixin<now_tur, 'rid'>
  declare removeNow_tur: Sequelize.HasManyRemoveAssociationMixin<now_tur, number>
  declare removeNow_turs: Sequelize.HasManyRemoveAssociationsMixin<now_tur, number>
  declare hasNow_tur: Sequelize.HasManyHasAssociationMixin<now_tur, number>
  declare hasNow_turs: Sequelize.HasManyHasAssociationsMixin<now_tur, number>
  declare countNow_turs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref hasMany ref_authors via rid
  declare ref_authors?: Sequelize.NonAttribute<ref_authors[]>
  declare getRef_authors: Sequelize.HasManyGetAssociationsMixin<ref_authors>
  declare setRef_authors: Sequelize.HasManySetAssociationsMixin<ref_authors, number>
  declare addRef_author: Sequelize.HasManyAddAssociationMixin<ref_authors, number>
  declare addRef_authors: Sequelize.HasManyAddAssociationsMixin<ref_authors, number>
  declare createRef_author: Sequelize.HasManyCreateAssociationMixin<ref_authors, 'rid'>
  declare removeRef_author: Sequelize.HasManyRemoveAssociationMixin<ref_authors, number>
  declare removeRef_authors: Sequelize.HasManyRemoveAssociationsMixin<ref_authors, number>
  declare hasRef_author: Sequelize.HasManyHasAssociationMixin<ref_authors, number>
  declare hasRef_authors: Sequelize.HasManyHasAssociationsMixin<ref_authors, number>
  declare countRef_authors: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany ref_keywords via rid and keywords_id
  declare keywords_id_ref_keywords: Sequelize.NonAttribute<ref_keywords[]>
  declare getKeywords_id_ref_keywords: Sequelize.BelongsToManyGetAssociationsMixin<ref_keywords>
  declare setKeywords_id_ref_keywords: Sequelize.BelongsToManySetAssociationsMixin<ref_keywords, number>
  declare addKeywords_id_ref_keyword: Sequelize.BelongsToManyAddAssociationMixin<ref_keywords, number>
  declare addKeywords_id_ref_keywords: Sequelize.BelongsToManyAddAssociationsMixin<ref_keywords, number>
  declare createKeywords_id_ref_keyword: Sequelize.BelongsToManyCreateAssociationMixin<ref_keywords, 'rid'>
  declare removeKeywords_id_ref_keyword: Sequelize.BelongsToManyRemoveAssociationMixin<ref_keywords, number>
  declare removeKeywords_id_ref_keywords: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_keywords, number>
  declare hasKeywords_id_ref_keyword: Sequelize.BelongsToManyHasAssociationMixin<ref_keywords, number>
  declare hasKeywords_id_ref_keywords: Sequelize.BelongsToManyHasAssociationsMixin<ref_keywords, number>
  declare countKeywords_id_ref_keywords: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany ref_keywords_ref via rid
  declare ref_keywords_refs?: Sequelize.NonAttribute<ref_keywords_ref[]>
  declare getRef_keywords_refs: Sequelize.HasManyGetAssociationsMixin<ref_keywords_ref>
  declare setRef_keywords_refs: Sequelize.HasManySetAssociationsMixin<ref_keywords_ref, number>
  declare addRef_keywords_ref: Sequelize.HasManyAddAssociationMixin<ref_keywords_ref, number>
  declare addRef_keywords_refs: Sequelize.HasManyAddAssociationsMixin<ref_keywords_ref, number>
  declare createRef_keywords_ref: Sequelize.HasManyCreateAssociationMixin<ref_keywords_ref, 'rid'>
  declare removeRef_keywords_ref: Sequelize.HasManyRemoveAssociationMixin<ref_keywords_ref, number>
  declare removeRef_keywords_refs: Sequelize.HasManyRemoveAssociationsMixin<ref_keywords_ref, number>
  declare hasRef_keywords_ref: Sequelize.HasManyHasAssociationMixin<ref_keywords_ref, number>
  declare hasRef_keywords_refs: Sequelize.HasManyHasAssociationsMixin<ref_keywords_ref, number>
  declare countRef_keywords_refs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsTo ref_ref_type via ref_type_id
  declare ref_type?: Sequelize.NonAttribute<ref_ref_type>
  declare getRef_type: Sequelize.BelongsToGetAssociationMixin<ref_ref_type>
  declare setRef_type: Sequelize.BelongsToSetAssociationMixin<ref_ref_type, number>
  declare createRef_type: Sequelize.BelongsToCreateAssociationMixin<ref_ref_type>

  static initModel(sequelize: Sequelize.Sequelize): typeof ref_ref {
    return ref_ref.init(
      {
        rid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        ref_type_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'ref_ref_type',
            key: 'ref_type_id',
          },
        },
        journal_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'ref_journal',
            key: 'journal_id',
          },
        },
        title_primary: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        date_primary: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        volume: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        issue: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        start_page: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        end_page: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        publisher: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        pub_place: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        title_secondary: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        date_secondary: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        title_series: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        issn_isbn: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        ref_abstract: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        web_url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        misc_1: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        misc_2: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        gen_notes: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        printed_language: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        exact_date: {
          type: DataTypes.DATEONLY,
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
        tableName: 'ref_ref',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'rid' }],
          },
          {
            name: 'ref_ref_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'journal_id' }],
          },
          {
            name: 'ref_ref_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'ref_type_id' }],
          },
        ],
      }
    )
  }
}
