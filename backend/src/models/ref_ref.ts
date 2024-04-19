import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_bau, now_bauId } from './now_bau'
import type { now_br, now_brId } from './now_br'
import type { now_lau, now_lauId } from './now_lau'
import type { now_lr, now_lrId } from './now_lr'
import type { now_sau, now_sauId } from './now_sau'
import type { now_sr, now_srId } from './now_sr'
import type { now_tau, now_tauId } from './now_tau'
import type { now_tr, now_trId } from './now_tr'
import type { now_tu_bound, now_tu_boundId } from './now_tu_bound'
import type { now_tur, now_turId } from './now_tur'
import type { ref_authors, ref_authorsId } from './ref_authors'
import type { ref_journal, ref_journalId } from './ref_journal'
import type { ref_keywords, ref_keywordsId } from './ref_keywords'
import type { ref_keywords_ref, ref_keywords_refId } from './ref_keywords_ref'
import type { ref_ref_type, ref_ref_typeId } from './ref_ref_type'

export interface ref_refAttributes {
  rid: number
  ref_type_id: number
  journal_id?: number
  title_primary?: string
  date_primary?: number
  volume?: string
  issue?: string
  start_page?: number
  end_page?: number
  publisher?: string
  pub_place?: string
  title_secondary?: string
  date_secondary?: number
  title_series?: string
  issn_isbn?: string
  ref_abstract?: string
  web_url?: string
  misc_1?: string
  misc_2?: string
  gen_notes?: string
  printed_language?: string
  exact_date?: string
  used_morph?: number
  used_now?: number
  used_gene?: number
}

export type ref_refPk = 'rid'
export type ref_refId = ref_ref[ref_refPk]
export type ref_refOptionalAttributes =
  | 'rid'
  | 'ref_type_id'
  | 'journal_id'
  | 'title_primary'
  | 'date_primary'
  | 'volume'
  | 'issue'
  | 'start_page'
  | 'end_page'
  | 'publisher'
  | 'pub_place'
  | 'title_secondary'
  | 'date_secondary'
  | 'title_series'
  | 'issn_isbn'
  | 'ref_abstract'
  | 'web_url'
  | 'misc_1'
  | 'misc_2'
  | 'gen_notes'
  | 'printed_language'
  | 'exact_date'
  | 'used_morph'
  | 'used_now'
  | 'used_gene'
export type ref_refCreationAttributes = Optional<ref_refAttributes, ref_refOptionalAttributes>

export class ref_ref extends Model<ref_refAttributes, ref_refCreationAttributes> implements ref_refAttributes {
  declare rid: number
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
  declare journal: ref_journal
  declare getJournal: Sequelize.BelongsToGetAssociationMixin<ref_journal>
  declare setJournal: Sequelize.BelongsToSetAssociationMixin<ref_journal, ref_journalId>
  declare createJournal: Sequelize.BelongsToCreateAssociationMixin<ref_journal>
  // ref_ref belongsToMany now_bau via rid and buid
  declare buid_now_baus: now_bau[]
  declare getBuid_now_baus: Sequelize.BelongsToManyGetAssociationsMixin<now_bau>
  declare setBuid_now_baus: Sequelize.BelongsToManySetAssociationsMixin<now_bau, now_bauId>
  declare addBuid_now_bau: Sequelize.BelongsToManyAddAssociationMixin<now_bau, now_bauId>
  declare addBuid_now_baus: Sequelize.BelongsToManyAddAssociationsMixin<now_bau, now_bauId>
  declare createBuid_now_bau: Sequelize.BelongsToManyCreateAssociationMixin<now_bau>
  declare removeBuid_now_bau: Sequelize.BelongsToManyRemoveAssociationMixin<now_bau, now_bauId>
  declare removeBuid_now_baus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_bau, now_bauId>
  declare hasBuid_now_bau: Sequelize.BelongsToManyHasAssociationMixin<now_bau, now_bauId>
  declare hasBuid_now_baus: Sequelize.BelongsToManyHasAssociationsMixin<now_bau, now_bauId>
  declare countBuid_now_baus: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_br via rid
  declare now_brs: now_br[]
  declare getNow_brs: Sequelize.HasManyGetAssociationsMixin<now_br>
  declare setNow_brs: Sequelize.HasManySetAssociationsMixin<now_br, now_brId>
  declare addNow_br: Sequelize.HasManyAddAssociationMixin<now_br, now_brId>
  declare addNow_brs: Sequelize.HasManyAddAssociationsMixin<now_br, now_brId>
  declare createNow_br: Sequelize.HasManyCreateAssociationMixin<now_br>
  declare removeNow_br: Sequelize.HasManyRemoveAssociationMixin<now_br, now_brId>
  declare removeNow_brs: Sequelize.HasManyRemoveAssociationsMixin<now_br, now_brId>
  declare hasNow_br: Sequelize.HasManyHasAssociationMixin<now_br, now_brId>
  declare hasNow_brs: Sequelize.HasManyHasAssociationsMixin<now_br, now_brId>
  declare countNow_brs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany now_lau via rid and luid
  declare luid_now_laus: now_lau[]
  declare getLuid_now_laus: Sequelize.BelongsToManyGetAssociationsMixin<now_lau>
  declare setLuid_now_laus: Sequelize.BelongsToManySetAssociationsMixin<now_lau, now_lauId>
  declare addLuid_now_lau: Sequelize.BelongsToManyAddAssociationMixin<now_lau, now_lauId>
  declare addLuid_now_laus: Sequelize.BelongsToManyAddAssociationsMixin<now_lau, now_lauId>
  declare createLuid_now_lau: Sequelize.BelongsToManyCreateAssociationMixin<now_lau>
  declare removeLuid_now_lau: Sequelize.BelongsToManyRemoveAssociationMixin<now_lau, now_lauId>
  declare removeLuid_now_laus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_lau, now_lauId>
  declare hasLuid_now_lau: Sequelize.BelongsToManyHasAssociationMixin<now_lau, now_lauId>
  declare hasLuid_now_laus: Sequelize.BelongsToManyHasAssociationsMixin<now_lau, now_lauId>
  declare countLuid_now_laus: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_lr via rid
  declare now_lrs: now_lr[]
  declare getNow_lrs: Sequelize.HasManyGetAssociationsMixin<now_lr>
  declare setNow_lrs: Sequelize.HasManySetAssociationsMixin<now_lr, now_lrId>
  declare addNow_lr: Sequelize.HasManyAddAssociationMixin<now_lr, now_lrId>
  declare addNow_lrs: Sequelize.HasManyAddAssociationsMixin<now_lr, now_lrId>
  declare createNow_lr: Sequelize.HasManyCreateAssociationMixin<now_lr>
  declare removeNow_lr: Sequelize.HasManyRemoveAssociationMixin<now_lr, now_lrId>
  declare removeNow_lrs: Sequelize.HasManyRemoveAssociationsMixin<now_lr, now_lrId>
  declare hasNow_lr: Sequelize.HasManyHasAssociationMixin<now_lr, now_lrId>
  declare hasNow_lrs: Sequelize.HasManyHasAssociationsMixin<now_lr, now_lrId>
  declare countNow_lrs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany now_sau via rid and suid
  declare suid_now_saus: now_sau[]
  declare getSuid_now_saus: Sequelize.BelongsToManyGetAssociationsMixin<now_sau>
  declare setSuid_now_saus: Sequelize.BelongsToManySetAssociationsMixin<now_sau, now_sauId>
  declare addSuid_now_sau: Sequelize.BelongsToManyAddAssociationMixin<now_sau, now_sauId>
  declare addSuid_now_saus: Sequelize.BelongsToManyAddAssociationsMixin<now_sau, now_sauId>
  declare createSuid_now_sau: Sequelize.BelongsToManyCreateAssociationMixin<now_sau>
  declare removeSuid_now_sau: Sequelize.BelongsToManyRemoveAssociationMixin<now_sau, now_sauId>
  declare removeSuid_now_saus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_sau, now_sauId>
  declare hasSuid_now_sau: Sequelize.BelongsToManyHasAssociationMixin<now_sau, now_sauId>
  declare hasSuid_now_saus: Sequelize.BelongsToManyHasAssociationsMixin<now_sau, now_sauId>
  declare countSuid_now_saus: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_sr via rid
  declare now_srs: now_sr[]
  declare getNow_srs: Sequelize.HasManyGetAssociationsMixin<now_sr>
  declare setNow_srs: Sequelize.HasManySetAssociationsMixin<now_sr, now_srId>
  declare addNow_sr: Sequelize.HasManyAddAssociationMixin<now_sr, now_srId>
  declare addNow_srs: Sequelize.HasManyAddAssociationsMixin<now_sr, now_srId>
  declare createNow_sr: Sequelize.HasManyCreateAssociationMixin<now_sr>
  declare removeNow_sr: Sequelize.HasManyRemoveAssociationMixin<now_sr, now_srId>
  declare removeNow_srs: Sequelize.HasManyRemoveAssociationsMixin<now_sr, now_srId>
  declare hasNow_sr: Sequelize.HasManyHasAssociationMixin<now_sr, now_srId>
  declare hasNow_srs: Sequelize.HasManyHasAssociationsMixin<now_sr, now_srId>
  declare countNow_srs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany now_tau via rid and tuid
  declare tuid_now_taus: now_tau[]
  declare getTuid_now_taus: Sequelize.BelongsToManyGetAssociationsMixin<now_tau>
  declare setTuid_now_taus: Sequelize.BelongsToManySetAssociationsMixin<now_tau, now_tauId>
  declare addTuid_now_tau: Sequelize.BelongsToManyAddAssociationMixin<now_tau, now_tauId>
  declare addTuid_now_taus: Sequelize.BelongsToManyAddAssociationsMixin<now_tau, now_tauId>
  declare createTuid_now_tau: Sequelize.BelongsToManyCreateAssociationMixin<now_tau>
  declare removeTuid_now_tau: Sequelize.BelongsToManyRemoveAssociationMixin<now_tau, now_tauId>
  declare removeTuid_now_taus: Sequelize.BelongsToManyRemoveAssociationsMixin<now_tau, now_tauId>
  declare hasTuid_now_tau: Sequelize.BelongsToManyHasAssociationMixin<now_tau, now_tauId>
  declare hasTuid_now_taus: Sequelize.BelongsToManyHasAssociationsMixin<now_tau, now_tauId>
  declare countTuid_now_taus: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_tr via rid
  declare now_trs: now_tr[]
  declare getNow_trs: Sequelize.HasManyGetAssociationsMixin<now_tr>
  declare setNow_trs: Sequelize.HasManySetAssociationsMixin<now_tr, now_trId>
  declare addNow_tr: Sequelize.HasManyAddAssociationMixin<now_tr, now_trId>
  declare addNow_trs: Sequelize.HasManyAddAssociationsMixin<now_tr, now_trId>
  declare createNow_tr: Sequelize.HasManyCreateAssociationMixin<now_tr>
  declare removeNow_tr: Sequelize.HasManyRemoveAssociationMixin<now_tr, now_trId>
  declare removeNow_trs: Sequelize.HasManyRemoveAssociationsMixin<now_tr, now_trId>
  declare hasNow_tr: Sequelize.HasManyHasAssociationMixin<now_tr, now_trId>
  declare hasNow_trs: Sequelize.HasManyHasAssociationsMixin<now_tr, now_trId>
  declare countNow_trs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany now_tu_bound via rid and bid
  declare bid_now_tu_bounds: now_tu_bound[]
  declare getBid_now_tu_bounds: Sequelize.BelongsToManyGetAssociationsMixin<now_tu_bound>
  declare setBid_now_tu_bounds: Sequelize.BelongsToManySetAssociationsMixin<now_tu_bound, now_tu_boundId>
  declare addBid_now_tu_bound: Sequelize.BelongsToManyAddAssociationMixin<now_tu_bound, now_tu_boundId>
  declare addBid_now_tu_bounds: Sequelize.BelongsToManyAddAssociationsMixin<now_tu_bound, now_tu_boundId>
  declare createBid_now_tu_bound: Sequelize.BelongsToManyCreateAssociationMixin<now_tu_bound>
  declare removeBid_now_tu_bound: Sequelize.BelongsToManyRemoveAssociationMixin<now_tu_bound, now_tu_boundId>
  declare removeBid_now_tu_bounds: Sequelize.BelongsToManyRemoveAssociationsMixin<now_tu_bound, now_tu_boundId>
  declare hasBid_now_tu_bound: Sequelize.BelongsToManyHasAssociationMixin<now_tu_bound, now_tu_boundId>
  declare hasBid_now_tu_bounds: Sequelize.BelongsToManyHasAssociationsMixin<now_tu_bound, now_tu_boundId>
  declare countBid_now_tu_bounds: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany now_tur via rid
  declare now_turs: now_tur[]
  declare getNow_turs: Sequelize.HasManyGetAssociationsMixin<now_tur>
  declare setNow_turs: Sequelize.HasManySetAssociationsMixin<now_tur, now_turId>
  declare addNow_tur: Sequelize.HasManyAddAssociationMixin<now_tur, now_turId>
  declare addNow_turs: Sequelize.HasManyAddAssociationsMixin<now_tur, now_turId>
  declare createNow_tur: Sequelize.HasManyCreateAssociationMixin<now_tur>
  declare removeNow_tur: Sequelize.HasManyRemoveAssociationMixin<now_tur, now_turId>
  declare removeNow_turs: Sequelize.HasManyRemoveAssociationsMixin<now_tur, now_turId>
  declare hasNow_tur: Sequelize.HasManyHasAssociationMixin<now_tur, now_turId>
  declare hasNow_turs: Sequelize.HasManyHasAssociationsMixin<now_tur, now_turId>
  declare countNow_turs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref hasMany ref_authors via rid
  declare ref_authors: ref_authors[]
  declare getRef_authors: Sequelize.HasManyGetAssociationsMixin<ref_authors>
  declare setRef_authors: Sequelize.HasManySetAssociationsMixin<ref_authors, ref_authorsId>
  declare addRef_author: Sequelize.HasManyAddAssociationMixin<ref_authors, ref_authorsId>
  declare addRef_authors: Sequelize.HasManyAddAssociationsMixin<ref_authors, ref_authorsId>
  declare createRef_author: Sequelize.HasManyCreateAssociationMixin<ref_authors>
  declare removeRef_author: Sequelize.HasManyRemoveAssociationMixin<ref_authors, ref_authorsId>
  declare removeRef_authors: Sequelize.HasManyRemoveAssociationsMixin<ref_authors, ref_authorsId>
  declare hasRef_author: Sequelize.HasManyHasAssociationMixin<ref_authors, ref_authorsId>
  declare hasRef_authors: Sequelize.HasManyHasAssociationsMixin<ref_authors, ref_authorsId>
  declare countRef_authors: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsToMany ref_keywords via rid and keywords_id
  declare keywords_id_ref_keywords: ref_keywords[]
  declare getKeywords_id_ref_keywords: Sequelize.BelongsToManyGetAssociationsMixin<ref_keywords>
  declare setKeywords_id_ref_keywords: Sequelize.BelongsToManySetAssociationsMixin<ref_keywords, ref_keywordsId>
  declare addKeywords_id_ref_keyword: Sequelize.BelongsToManyAddAssociationMixin<ref_keywords, ref_keywordsId>
  declare addKeywords_id_ref_keywords: Sequelize.BelongsToManyAddAssociationsMixin<ref_keywords, ref_keywordsId>
  declare createKeywords_id_ref_keyword: Sequelize.BelongsToManyCreateAssociationMixin<ref_keywords>
  declare removeKeywords_id_ref_keyword: Sequelize.BelongsToManyRemoveAssociationMixin<ref_keywords, ref_keywordsId>
  declare removeKeywords_id_ref_keywords: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_keywords, ref_keywordsId>
  declare hasKeywords_id_ref_keyword: Sequelize.BelongsToManyHasAssociationMixin<ref_keywords, ref_keywordsId>
  declare hasKeywords_id_ref_keywords: Sequelize.BelongsToManyHasAssociationsMixin<ref_keywords, ref_keywordsId>
  declare countKeywords_id_ref_keywords: Sequelize.BelongsToManyCountAssociationsMixin
  // ref_ref hasMany ref_keywords_ref via rid
  declare ref_keywords_refs: ref_keywords_ref[]
  declare getRef_keywords_refs: Sequelize.HasManyGetAssociationsMixin<ref_keywords_ref>
  declare setRef_keywords_refs: Sequelize.HasManySetAssociationsMixin<ref_keywords_ref, ref_keywords_refId>
  declare addRef_keywords_ref: Sequelize.HasManyAddAssociationMixin<ref_keywords_ref, ref_keywords_refId>
  declare addRef_keywords_refs: Sequelize.HasManyAddAssociationsMixin<ref_keywords_ref, ref_keywords_refId>
  declare createRef_keywords_ref: Sequelize.HasManyCreateAssociationMixin<ref_keywords_ref>
  declare removeRef_keywords_ref: Sequelize.HasManyRemoveAssociationMixin<ref_keywords_ref, ref_keywords_refId>
  declare removeRef_keywords_refs: Sequelize.HasManyRemoveAssociationsMixin<ref_keywords_ref, ref_keywords_refId>
  declare hasRef_keywords_ref: Sequelize.HasManyHasAssociationMixin<ref_keywords_ref, ref_keywords_refId>
  declare hasRef_keywords_refs: Sequelize.HasManyHasAssociationsMixin<ref_keywords_ref, ref_keywords_refId>
  declare countRef_keywords_refs: Sequelize.HasManyCountAssociationsMixin
  // ref_ref belongsTo ref_ref_type via ref_type_id
  declare ref_type: ref_ref_type
  declare getRef_type: Sequelize.BelongsToGetAssociationMixin<ref_ref_type>
  declare setRef_type: Sequelize.BelongsToSetAssociationMixin<ref_ref_type, ref_ref_typeId>
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
