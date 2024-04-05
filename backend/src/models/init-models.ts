import type { Sequelize } from 'sequelize'
import { com_family_synonym as _com_family_synonym } from './com_family_synonym'
import type { com_family_synonymAttributes, com_family_synonymCreationAttributes } from './com_family_synonym'
import { com_genus_synonym as _com_genus_synonym } from './com_genus_synonym'
import type { com_genus_synonymAttributes, com_genus_synonymCreationAttributes } from './com_genus_synonym'
import { com_main as _com_main } from './com_main'
import type { com_mainAttributes, com_mainCreationAttributes } from './com_main'
import { com_mlist as _com_mlist } from './com_mlist'
import type { com_mlistAttributes, com_mlistCreationAttributes } from './com_mlist'
import { com_order_synonym as _com_order_synonym } from './com_order_synonym'
import type { com_order_synonymAttributes, com_order_synonymCreationAttributes } from './com_order_synonym'
import { com_people as _com_people } from './com_people'
import type { com_peopleAttributes, com_peopleCreationAttributes } from './com_people'
import { com_species as _com_species } from './com_species'
import type { com_speciesAttributes, com_speciesCreationAttributes } from './com_species'
import { com_subfamily_synonym as _com_subfamily_synonym } from './com_subfamily_synonym'
import type { com_subfamily_synonymAttributes, com_subfamily_synonymCreationAttributes } from './com_subfamily_synonym'
import { com_taxa_synonym as _com_taxa_synonym } from './com_taxa_synonym'
import type { com_taxa_synonymAttributes, com_taxa_synonymCreationAttributes } from './com_taxa_synonym'
import { com_users as _com_users } from './com_users'
import type { com_usersAttributes, com_usersCreationAttributes } from './com_users'
import { now_bau as _now_bau } from './now_bau'
import type { now_bauAttributes, now_bauCreationAttributes } from './now_bau'
import { now_br as _now_br } from './now_br'
import type { now_brAttributes, now_brCreationAttributes } from './now_br'
import { now_coll_meth as _now_coll_meth } from './now_coll_meth'
import type { now_coll_methAttributes, now_coll_methCreationAttributes } from './now_coll_meth'
import { now_coll_meth_values as _now_coll_meth_values } from './now_coll_meth_values'
import type { now_coll_meth_valuesAttributes, now_coll_meth_valuesCreationAttributes } from './now_coll_meth_values'
import { now_lau as _now_lau } from './now_lau'
import type { now_lauAttributes, now_lauCreationAttributes } from './now_lau'
import { now_loc as _now_loc } from './now_loc'
import type { now_locAttributes, now_locCreationAttributes } from './now_loc'
import { now_lr as _now_lr } from './now_lr'
import type { now_lrAttributes, now_lrCreationAttributes } from './now_lr'
import { now_ls as _now_ls } from './now_ls'
import type { now_lsAttributes, now_lsCreationAttributes } from './now_ls'
import { now_ls_copy as _now_ls_copy } from './now_ls_copy'
import type { now_ls_copyAttributes, now_ls_copyCreationAttributes } from './now_ls_copy'
import { now_mus as _now_mus } from './now_mus'
import type { now_musAttributes, now_musCreationAttributes } from './now_mus'
import { now_plr as _now_plr } from './now_plr'
import type { now_plrAttributes, now_plrCreationAttributes } from './now_plr'
import { now_proj as _now_proj } from './now_proj'
import type { now_projAttributes, now_projCreationAttributes } from './now_proj'
import { now_proj_people as _now_proj_people } from './now_proj_people'
import type { now_proj_peopleAttributes, now_proj_peopleCreationAttributes } from './now_proj_people'
import { now_psr as _now_psr } from './now_psr'
import type { now_psrAttributes, now_psrCreationAttributes } from './now_psr'
import { now_reg_coord as _now_reg_coord } from './now_reg_coord'
import type { now_reg_coordAttributes, now_reg_coordCreationAttributes } from './now_reg_coord'
import { now_reg_coord_country as _now_reg_coord_country } from './now_reg_coord_country'
import type { now_reg_coord_countryAttributes, now_reg_coord_countryCreationAttributes } from './now_reg_coord_country'
import { now_reg_coord_people as _now_reg_coord_people } from './now_reg_coord_people'
import type { now_reg_coord_peopleAttributes, now_reg_coord_peopleCreationAttributes } from './now_reg_coord_people'
import { now_regional_culture as _now_regional_culture } from './now_regional_culture'
import type { now_regional_cultureAttributes, now_regional_cultureCreationAttributes } from './now_regional_culture'
import { now_sau as _now_sau } from './now_sau'
import type { now_sauAttributes, now_sauCreationAttributes } from './now_sau'
import { now_sp_coord as _now_sp_coord } from './now_sp_coord'
import type { now_sp_coordAttributes, now_sp_coordCreationAttributes } from './now_sp_coord'
import { now_sp_coord_people as _now_sp_coord_people } from './now_sp_coord_people'
import type { now_sp_coord_peopleAttributes, now_sp_coord_peopleCreationAttributes } from './now_sp_coord_people'
import { now_sp_coord_taxa as _now_sp_coord_taxa } from './now_sp_coord_taxa'
import type { now_sp_coord_taxaAttributes, now_sp_coord_taxaCreationAttributes } from './now_sp_coord_taxa'
import { now_sr as _now_sr } from './now_sr'
import type { now_srAttributes, now_srCreationAttributes } from './now_sr'
import { now_ss as _now_ss } from './now_ss'
import type { now_ssAttributes, now_ssCreationAttributes } from './now_ss'
import { now_ss_values as _now_ss_values } from './now_ss_values'
import type { now_ss_valuesAttributes, now_ss_valuesCreationAttributes } from './now_ss_values'
import { now_strat_coord as _now_strat_coord } from './now_strat_coord'
import type { now_strat_coordAttributes, now_strat_coordCreationAttributes } from './now_strat_coord'
import { now_strat_coord_people as _now_strat_coord_people } from './now_strat_coord_people'
import type {
  now_strat_coord_peopleAttributes,
  now_strat_coord_peopleCreationAttributes,
} from './now_strat_coord_people'
import { now_syn_loc as _now_syn_loc } from './now_syn_loc'
import type { now_syn_locAttributes, now_syn_locCreationAttributes } from './now_syn_loc'
import { now_tau as _now_tau } from './now_tau'
import type { now_tauAttributes, now_tauCreationAttributes } from './now_tau'
import { now_time_unit as _now_time_unit } from './now_time_unit'
import type { now_time_unitAttributes, now_time_unitCreationAttributes } from './now_time_unit'
import { now_time_update as _now_time_update } from './now_time_update'
import type { now_time_updateAttributes, now_time_updateCreationAttributes } from './now_time_update'
import { now_tr as _now_tr } from './now_tr'
import type { now_trAttributes, now_trCreationAttributes } from './now_tr'
import { now_tu_bound as _now_tu_bound } from './now_tu_bound'
import type { now_tu_boundAttributes, now_tu_boundCreationAttributes } from './now_tu_bound'
import { now_tu_sequence as _now_tu_sequence } from './now_tu_sequence'
import type { now_tu_sequenceAttributes, now_tu_sequenceCreationAttributes } from './now_tu_sequence'
import { now_tur as _now_tur } from './now_tur'
import type { now_turAttributes, now_turCreationAttributes } from './now_tur'
import { ref_authors as _ref_authors } from './ref_authors'
import type { ref_authorsAttributes, ref_authorsCreationAttributes } from './ref_authors'
import { ref_field_name as _ref_field_name } from './ref_field_name'
import type { ref_field_nameAttributes, ref_field_nameCreationAttributes } from './ref_field_name'
import { ref_journal as _ref_journal } from './ref_journal'
import type { ref_journalAttributes, ref_journalCreationAttributes } from './ref_journal'
import { ref_keywords as _ref_keywords } from './ref_keywords'
import type { ref_keywordsAttributes, ref_keywordsCreationAttributes } from './ref_keywords'
import { ref_keywords_ref as _ref_keywords_ref } from './ref_keywords_ref'
import type { ref_keywords_refAttributes, ref_keywords_refCreationAttributes } from './ref_keywords_ref'
import { ref_ref as _ref_ref } from './ref_ref'
import type { ref_refAttributes, ref_refCreationAttributes } from './ref_ref'
import { ref_ref_type as _ref_ref_type } from './ref_ref_type'
import type { ref_ref_typeAttributes, ref_ref_typeCreationAttributes } from './ref_ref_type'

export {
  _com_family_synonym as com_family_synonym,
  _com_genus_synonym as com_genus_synonym,
  _com_main as com_main,
  _com_mlist as com_mlist,
  _com_order_synonym as com_order_synonym,
  _com_people as com_people,
  _com_species as com_species,
  _com_subfamily_synonym as com_subfamily_synonym,
  _com_taxa_synonym as com_taxa_synonym,
  _com_users as com_users,
  _now_bau as now_bau,
  _now_br as now_br,
  _now_coll_meth as now_coll_meth,
  _now_coll_meth_values as now_coll_meth_values,
  _now_lau as now_lau,
  _now_loc as now_loc,
  _now_lr as now_lr,
  _now_ls as now_ls,
  _now_ls_copy as now_ls_copy,
  _now_mus as now_mus,
  _now_plr as now_plr,
  _now_proj as now_proj,
  _now_proj_people as now_proj_people,
  _now_psr as now_psr,
  _now_reg_coord as now_reg_coord,
  _now_reg_coord_country as now_reg_coord_country,
  _now_reg_coord_people as now_reg_coord_people,
  _now_regional_culture as now_regional_culture,
  _now_sau as now_sau,
  _now_sp_coord as now_sp_coord,
  _now_sp_coord_people as now_sp_coord_people,
  _now_sp_coord_taxa as now_sp_coord_taxa,
  _now_sr as now_sr,
  _now_ss as now_ss,
  _now_ss_values as now_ss_values,
  _now_strat_coord as now_strat_coord,
  _now_strat_coord_people as now_strat_coord_people,
  _now_syn_loc as now_syn_loc,
  _now_tau as now_tau,
  _now_time_unit as now_time_unit,
  _now_time_update as now_time_update,
  _now_tr as now_tr,
  _now_tu_bound as now_tu_bound,
  _now_tu_sequence as now_tu_sequence,
  _now_tur as now_tur,
  _ref_authors as ref_authors,
  _ref_field_name as ref_field_name,
  _ref_journal as ref_journal,
  _ref_keywords as ref_keywords,
  _ref_keywords_ref as ref_keywords_ref,
  _ref_ref as ref_ref,
  _ref_ref_type as ref_ref_type,
}

export type {
  com_family_synonymAttributes,
  com_family_synonymCreationAttributes,
  com_genus_synonymAttributes,
  com_genus_synonymCreationAttributes,
  com_mainAttributes,
  com_mainCreationAttributes,
  com_mlistAttributes,
  com_mlistCreationAttributes,
  com_order_synonymAttributes,
  com_order_synonymCreationAttributes,
  com_peopleAttributes,
  com_peopleCreationAttributes,
  com_speciesAttributes,
  com_speciesCreationAttributes,
  com_subfamily_synonymAttributes,
  com_subfamily_synonymCreationAttributes,
  com_taxa_synonymAttributes,
  com_taxa_synonymCreationAttributes,
  com_usersAttributes,
  com_usersCreationAttributes,
  now_bauAttributes,
  now_bauCreationAttributes,
  now_brAttributes,
  now_brCreationAttributes,
  now_coll_methAttributes,
  now_coll_methCreationAttributes,
  now_coll_meth_valuesAttributes,
  now_coll_meth_valuesCreationAttributes,
  now_lauAttributes,
  now_lauCreationAttributes,
  now_locAttributes,
  now_locCreationAttributes,
  now_lrAttributes,
  now_lrCreationAttributes,
  now_lsAttributes,
  now_lsCreationAttributes,
  now_ls_copyAttributes,
  now_ls_copyCreationAttributes,
  now_musAttributes,
  now_musCreationAttributes,
  now_plrAttributes,
  now_plrCreationAttributes,
  now_projAttributes,
  now_projCreationAttributes,
  now_proj_peopleAttributes,
  now_proj_peopleCreationAttributes,
  now_psrAttributes,
  now_psrCreationAttributes,
  now_reg_coordAttributes,
  now_reg_coordCreationAttributes,
  now_reg_coord_countryAttributes,
  now_reg_coord_countryCreationAttributes,
  now_reg_coord_peopleAttributes,
  now_reg_coord_peopleCreationAttributes,
  now_regional_cultureAttributes,
  now_regional_cultureCreationAttributes,
  now_sauAttributes,
  now_sauCreationAttributes,
  now_sp_coordAttributes,
  now_sp_coordCreationAttributes,
  now_sp_coord_peopleAttributes,
  now_sp_coord_peopleCreationAttributes,
  now_sp_coord_taxaAttributes,
  now_sp_coord_taxaCreationAttributes,
  now_srAttributes,
  now_srCreationAttributes,
  now_ssAttributes,
  now_ssCreationAttributes,
  now_ss_valuesAttributes,
  now_ss_valuesCreationAttributes,
  now_strat_coordAttributes,
  now_strat_coordCreationAttributes,
  now_strat_coord_peopleAttributes,
  now_strat_coord_peopleCreationAttributes,
  now_syn_locAttributes,
  now_syn_locCreationAttributes,
  now_tauAttributes,
  now_tauCreationAttributes,
  now_time_unitAttributes,
  now_time_unitCreationAttributes,
  now_time_updateAttributes,
  now_time_updateCreationAttributes,
  now_trAttributes,
  now_trCreationAttributes,
  now_tu_boundAttributes,
  now_tu_boundCreationAttributes,
  now_tu_sequenceAttributes,
  now_tu_sequenceCreationAttributes,
  now_turAttributes,
  now_turCreationAttributes,
  ref_authorsAttributes,
  ref_authorsCreationAttributes,
  ref_field_nameAttributes,
  ref_field_nameCreationAttributes,
  ref_journalAttributes,
  ref_journalCreationAttributes,
  ref_keywordsAttributes,
  ref_keywordsCreationAttributes,
  ref_keywords_refAttributes,
  ref_keywords_refCreationAttributes,
  ref_refAttributes,
  ref_refCreationAttributes,
  ref_ref_typeAttributes,
  ref_ref_typeCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
  const com_family_synonym = _com_family_synonym.initModel(sequelize)
  const com_genus_synonym = _com_genus_synonym.initModel(sequelize)
  const com_main = _com_main.initModel(sequelize)
  const com_mlist = _com_mlist.initModel(sequelize)
  const com_order_synonym = _com_order_synonym.initModel(sequelize)
  const com_people = _com_people.initModel(sequelize)
  const com_species = _com_species.initModel(sequelize)
  const com_subfamily_synonym = _com_subfamily_synonym.initModel(sequelize)
  const com_taxa_synonym = _com_taxa_synonym.initModel(sequelize)
  const com_users = _com_users.initModel(sequelize)
  const now_bau = _now_bau.initModel(sequelize)
  const now_br = _now_br.initModel(sequelize)
  const now_coll_meth = _now_coll_meth.initModel(sequelize)
  const now_coll_meth_values = _now_coll_meth_values.initModel(sequelize)
  const now_lau = _now_lau.initModel(sequelize)
  const now_loc = _now_loc.initModel(sequelize)
  const now_lr = _now_lr.initModel(sequelize)
  const now_ls = _now_ls.initModel(sequelize)
  const now_ls_copy = _now_ls_copy.initModel(sequelize)
  const now_mus = _now_mus.initModel(sequelize)
  const now_plr = _now_plr.initModel(sequelize)
  const now_proj = _now_proj.initModel(sequelize)
  const now_proj_people = _now_proj_people.initModel(sequelize)
  const now_psr = _now_psr.initModel(sequelize)
  const now_reg_coord = _now_reg_coord.initModel(sequelize)
  const now_reg_coord_country = _now_reg_coord_country.initModel(sequelize)
  const now_reg_coord_people = _now_reg_coord_people.initModel(sequelize)
  const now_regional_culture = _now_regional_culture.initModel(sequelize)
  const now_sau = _now_sau.initModel(sequelize)
  const now_sp_coord = _now_sp_coord.initModel(sequelize)
  const now_sp_coord_people = _now_sp_coord_people.initModel(sequelize)
  const now_sp_coord_taxa = _now_sp_coord_taxa.initModel(sequelize)
  const now_sr = _now_sr.initModel(sequelize)
  const now_ss = _now_ss.initModel(sequelize)
  const now_ss_values = _now_ss_values.initModel(sequelize)
  const now_strat_coord = _now_strat_coord.initModel(sequelize)
  const now_strat_coord_people = _now_strat_coord_people.initModel(sequelize)
  const now_syn_loc = _now_syn_loc.initModel(sequelize)
  const now_tau = _now_tau.initModel(sequelize)
  const now_time_unit = _now_time_unit.initModel(sequelize)
  const now_time_update = _now_time_update.initModel(sequelize)
  const now_tr = _now_tr.initModel(sequelize)
  const now_tu_bound = _now_tu_bound.initModel(sequelize)
  const now_tu_sequence = _now_tu_sequence.initModel(sequelize)
  const now_tur = _now_tur.initModel(sequelize)
  const ref_authors = _ref_authors.initModel(sequelize)
  const ref_field_name = _ref_field_name.initModel(sequelize)
  const ref_journal = _ref_journal.initModel(sequelize)
  const ref_keywords = _ref_keywords.initModel(sequelize)
  const ref_keywords_ref = _ref_keywords_ref.initModel(sequelize)
  const ref_ref = _ref_ref.initModel(sequelize)
  const ref_ref_type = _ref_ref_type.initModel(sequelize)

  com_mlist.belongsToMany(now_loc, {
    as: 'lid_now_loc_now_mus',
    through: now_mus,
    foreignKey: 'museum',
    otherKey: 'lid',
  })
  com_people.belongsToMany(now_proj, {
    as: 'pid_now_proj_now_proj_people',
    through: now_proj_people,
    foreignKey: 'initials',
    otherKey: 'pid',
  })
  com_people.belongsToMany(now_reg_coord, {
    as: 'reg_coord_id_now_reg_coords',
    through: now_reg_coord_people,
    foreignKey: 'initials',
    otherKey: 'reg_coord_id',
  })
  com_people.belongsToMany(now_sp_coord, {
    as: 'sp_coord_id_now_sp_coords',
    through: now_sp_coord_people,
    foreignKey: 'initials',
    otherKey: 'sp_coord_id',
  })
  com_people.belongsToMany(now_strat_coord, {
    as: 'strat_coord_id_now_strat_coords',
    through: now_strat_coord_people,
    foreignKey: 'initials',
    otherKey: 'strat_coord_id',
  })
  com_species.belongsToMany(now_loc, { as: 'lid_now_locs', through: now_ls, foreignKey: 'species_id', otherKey: 'lid' })
  com_species.belongsToMany(now_proj, {
    as: 'pid_now_proj_now_psrs',
    through: now_psr,
    foreignKey: 'species_id',
    otherKey: 'pid',
  })
  now_bau.belongsToMany(ref_ref, { as: 'rid_ref_refs', through: now_br, foreignKey: 'buid', otherKey: 'rid' })
  now_lau.belongsToMany(ref_ref, { as: 'rid_ref_ref_now_lrs', through: now_lr, foreignKey: 'luid', otherKey: 'rid' })
  now_loc.belongsToMany(com_mlist, { as: 'museum_com_mlists', through: now_mus, foreignKey: 'lid', otherKey: 'museum' })
  now_loc.belongsToMany(com_species, {
    as: 'species_id_com_species',
    through: now_ls,
    foreignKey: 'lid',
    otherKey: 'species_id',
  })
  now_loc.belongsToMany(now_proj, { as: 'pid_now_projs', through: now_plr, foreignKey: 'lid', otherKey: 'pid' })
  now_proj.belongsToMany(com_people, {
    as: 'initials_com_people',
    through: now_proj_people,
    foreignKey: 'pid',
    otherKey: 'initials',
  })
  now_proj.belongsToMany(com_species, {
    as: 'species_id_com_species_now_psrs',
    through: now_psr,
    foreignKey: 'pid',
    otherKey: 'species_id',
  })
  now_proj.belongsToMany(now_loc, { as: 'lid_now_loc_now_plrs', through: now_plr, foreignKey: 'pid', otherKey: 'lid' })
  now_reg_coord.belongsToMany(com_people, {
    as: 'initials_com_people_now_reg_coord_people',
    through: now_reg_coord_people,
    foreignKey: 'reg_coord_id',
    otherKey: 'initials',
  })
  now_sau.belongsToMany(ref_ref, { as: 'rid_ref_ref_now_srs', through: now_sr, foreignKey: 'suid', otherKey: 'rid' })
  now_sp_coord.belongsToMany(com_people, {
    as: 'initials_com_people_now_sp_coord_people',
    through: now_sp_coord_people,
    foreignKey: 'sp_coord_id',
    otherKey: 'initials',
  })
  now_strat_coord.belongsToMany(com_people, {
    as: 'initials_com_people_now_strat_coord_people',
    through: now_strat_coord_people,
    foreignKey: 'strat_coord_id',
    otherKey: 'initials',
  })
  now_tau.belongsToMany(ref_ref, { as: 'rid_ref_ref_now_trs', through: now_tr, foreignKey: 'tuid', otherKey: 'rid' })
  now_tu_bound.belongsToMany(ref_ref, {
    as: 'rid_ref_ref_now_turs',
    through: now_tur,
    foreignKey: 'bid',
    otherKey: 'rid',
  })
  ref_keywords.belongsToMany(ref_ref, {
    as: 'rid_ref_ref_ref_keywords_refs',
    through: ref_keywords_ref,
    foreignKey: 'keywords_id',
    otherKey: 'rid',
  })
  ref_ref.belongsToMany(now_bau, { as: 'buid_now_baus', through: now_br, foreignKey: 'rid', otherKey: 'buid' })
  ref_ref.belongsToMany(now_lau, { as: 'luid_now_laus', through: now_lr, foreignKey: 'rid', otherKey: 'luid' })
  ref_ref.belongsToMany(now_sau, { as: 'suid_now_saus', through: now_sr, foreignKey: 'rid', otherKey: 'suid' })
  ref_ref.belongsToMany(now_tau, { as: 'tuid_now_taus', through: now_tr, foreignKey: 'rid', otherKey: 'tuid' })
  ref_ref.belongsToMany(now_tu_bound, { as: 'bid_now_tu_bounds', through: now_tur, foreignKey: 'rid', otherKey: 'bid' })
  ref_ref.belongsToMany(ref_keywords, {
    as: 'keywords_id_ref_keywords',
    through: ref_keywords_ref,
    foreignKey: 'rid',
    otherKey: 'keywords_id',
  })
  now_mus.belongsTo(com_mlist, { as: 'museum_com_mlist', foreignKey: 'museum' })
  com_mlist.hasMany(now_mus, { as: 'now_mus', foreignKey: 'museum' })
  now_bau.belongsTo(com_people, { as: 'bau_coordinator_com_person', foreignKey: 'bau_coordinator' })
  com_people.hasMany(now_bau, { as: 'now_baus', foreignKey: 'bau_coordinator' })
  now_bau.belongsTo(com_people, { as: 'bau_authorizer_com_person', foreignKey: 'bau_authorizer' })
  com_people.hasMany(now_bau, { as: 'bau_authorizer_now_baus', foreignKey: 'bau_authorizer' })
  now_lau.belongsTo(com_people, { as: 'lau_coordinator_com_person', foreignKey: 'lau_coordinator' })
  com_people.hasMany(now_lau, { as: 'now_laus', foreignKey: 'lau_coordinator' })
  now_lau.belongsTo(com_people, { as: 'lau_authorizer_com_person', foreignKey: 'lau_authorizer' })
  com_people.hasMany(now_lau, { as: 'lau_authorizer_now_laus', foreignKey: 'lau_authorizer' })
  now_proj.belongsTo(com_people, { as: 'contact_com_person', foreignKey: 'contact' })
  com_people.hasMany(now_proj, { as: 'now_projs', foreignKey: 'contact' })
  now_proj_people.belongsTo(com_people, { as: 'initials_com_person', foreignKey: 'initials' })
  com_people.hasMany(now_proj_people, { as: 'now_proj_people', foreignKey: 'initials' })
  now_reg_coord_people.belongsTo(com_people, { as: 'initials_com_person', foreignKey: 'initials' })
  com_people.hasMany(now_reg_coord_people, { as: 'now_reg_coord_people', foreignKey: 'initials' })
  now_sau.belongsTo(com_people, { as: 'sau_coordinator_com_person', foreignKey: 'sau_coordinator' })
  com_people.hasMany(now_sau, { as: 'now_saus', foreignKey: 'sau_coordinator' })
  now_sau.belongsTo(com_people, { as: 'sau_authorizer_com_person', foreignKey: 'sau_authorizer' })
  com_people.hasMany(now_sau, { as: 'sau_authorizer_now_saus', foreignKey: 'sau_authorizer' })
  now_sp_coord_people.belongsTo(com_people, { as: 'initials_com_person', foreignKey: 'initials' })
  com_people.hasMany(now_sp_coord_people, { as: 'now_sp_coord_people', foreignKey: 'initials' })
  now_strat_coord_people.belongsTo(com_people, { as: 'initials_com_person', foreignKey: 'initials' })
  com_people.hasMany(now_strat_coord_people, { as: 'now_strat_coord_people', foreignKey: 'initials' })
  now_tau.belongsTo(com_people, { as: 'tau_coordinator_com_person', foreignKey: 'tau_coordinator' })
  com_people.hasMany(now_tau, { as: 'now_taus', foreignKey: 'tau_coordinator' })
  now_tau.belongsTo(com_people, { as: 'tau_authorizer_com_person', foreignKey: 'tau_authorizer' })
  com_people.hasMany(now_tau, { as: 'tau_authorizer_now_taus', foreignKey: 'tau_authorizer' })
  now_ls.belongsTo(com_species, { as: 'species', foreignKey: 'species_id' })
  com_species.hasMany(now_ls, { as: 'now_ls', foreignKey: 'species_id' })
  now_psr.belongsTo(com_species, { as: 'species', foreignKey: 'species_id' })
  com_species.hasMany(now_psr, { as: 'now_psrs', foreignKey: 'species_id' })
  now_sau.belongsTo(com_species, { as: 'species', foreignKey: 'species_id' })
  com_species.hasMany(now_sau, { as: 'now_saus', foreignKey: 'species_id' })
  now_br.belongsTo(now_bau, { as: 'bu', foreignKey: 'buid' })
  now_bau.hasMany(now_br, { as: 'now_brs', foreignKey: 'buid' })
  now_time_update.belongsTo(now_bau, { as: 'lower_bu', foreignKey: 'lower_buid' })
  now_bau.hasMany(now_time_update, { as: 'now_time_updates', foreignKey: 'lower_buid' })
  now_time_update.belongsTo(now_bau, { as: 'upper_bu', foreignKey: 'upper_buid' })
  now_bau.hasMany(now_time_update, { as: 'upper_bu_now_time_updates', foreignKey: 'upper_buid' })
  now_lr.belongsTo(now_lau, { as: 'lu', foreignKey: 'luid' })
  now_lau.hasMany(now_lr, { as: 'now_lrs', foreignKey: 'luid' })
  now_coll_meth.belongsTo(now_loc, { as: 'lid_now_loc', foreignKey: 'lid' })
  now_loc.hasMany(now_coll_meth, { as: 'now_coll_meths', foreignKey: 'lid' })
  now_lau.belongsTo(now_loc, { as: 'lid_now_loc', foreignKey: 'lid' })
  now_loc.hasMany(now_lau, { as: 'now_laus', foreignKey: 'lid' })
  now_ls.belongsTo(now_loc, { as: 'lid_now_loc', foreignKey: 'lid' })
  now_loc.hasMany(now_ls, { as: 'now_ls', foreignKey: 'lid' })
  now_mus.belongsTo(now_loc, { as: 'lid_now_loc', foreignKey: 'lid' })
  now_loc.hasMany(now_mus, { as: 'now_mus', foreignKey: 'lid' })
  now_plr.belongsTo(now_loc, { as: 'lid_now_loc', foreignKey: 'lid' })
  now_loc.hasMany(now_plr, { as: 'now_plrs', foreignKey: 'lid' })
  now_ss.belongsTo(now_loc, { as: 'lid_now_loc', foreignKey: 'lid' })
  now_loc.hasMany(now_ss, { as: 'now_sses', foreignKey: 'lid' })
  now_syn_loc.belongsTo(now_loc, { as: 'lid_now_loc', foreignKey: 'lid' })
  now_loc.hasMany(now_syn_loc, { as: 'now_syn_locs', foreignKey: 'lid' })
  now_plr.belongsTo(now_proj, { as: 'pid_now_proj', foreignKey: 'pid' })
  now_proj.hasMany(now_plr, { as: 'now_plrs', foreignKey: 'pid' })
  now_proj_people.belongsTo(now_proj, { as: 'pid_now_proj', foreignKey: 'pid' })
  now_proj.hasMany(now_proj_people, { as: 'now_proj_people', foreignKey: 'pid' })
  now_psr.belongsTo(now_proj, { as: 'pid_now_proj', foreignKey: 'pid' })
  now_proj.hasMany(now_psr, { as: 'now_psrs', foreignKey: 'pid' })
  now_reg_coord_country.belongsTo(now_reg_coord, { as: 'reg_coord', foreignKey: 'reg_coord_id' })
  now_reg_coord.hasMany(now_reg_coord_country, { as: 'now_reg_coord_countries', foreignKey: 'reg_coord_id' })
  now_reg_coord_people.belongsTo(now_reg_coord, { as: 'reg_coord', foreignKey: 'reg_coord_id' })
  now_reg_coord.hasMany(now_reg_coord_people, { as: 'now_reg_coord_people', foreignKey: 'reg_coord_id' })
  now_sr.belongsTo(now_sau, { as: 'su', foreignKey: 'suid' })
  now_sau.hasMany(now_sr, { as: 'now_srs', foreignKey: 'suid' })
  now_sp_coord_people.belongsTo(now_sp_coord, { as: 'sp_coord', foreignKey: 'sp_coord_id' })
  now_sp_coord.hasMany(now_sp_coord_people, { as: 'now_sp_coord_people', foreignKey: 'sp_coord_id' })
  now_sp_coord_taxa.belongsTo(now_sp_coord, { as: 'sp_coord', foreignKey: 'sp_coord_id' })
  now_sp_coord.hasMany(now_sp_coord_taxa, { as: 'now_sp_coord_taxas', foreignKey: 'sp_coord_id' })
  now_strat_coord_people.belongsTo(now_strat_coord, { as: 'strat_coord', foreignKey: 'strat_coord_id' })
  now_strat_coord.hasMany(now_strat_coord_people, { as: 'now_strat_coord_people', foreignKey: 'strat_coord_id' })
  now_time_update.belongsTo(now_tau, { as: 'tu', foreignKey: 'tuid' })
  now_tau.hasMany(now_time_update, { as: 'now_time_updates', foreignKey: 'tuid' })
  now_tr.belongsTo(now_tau, { as: 'tu', foreignKey: 'tuid' })
  now_tau.hasMany(now_tr, { as: 'now_trs', foreignKey: 'tuid' })
  now_loc.belongsTo(now_time_unit, { as: 'bfa_max_now_time_unit', foreignKey: 'bfa_max' })
  now_time_unit.hasMany(now_loc, { as: 'now_locs', foreignKey: 'bfa_max' })
  now_loc.belongsTo(now_time_unit, { as: 'bfa_min_now_time_unit', foreignKey: 'bfa_min' })
  now_time_unit.hasMany(now_loc, { as: 'bfa_min_now_locs', foreignKey: 'bfa_min' })
  now_tau.belongsTo(now_time_unit, { as: 'tu_name_now_time_unit', foreignKey: 'tu_name' })
  now_time_unit.hasMany(now_tau, { as: 'now_taus', foreignKey: 'tu_name' })
  now_time_update.belongsTo(now_time_unit, { as: 'tu_name_now_time_unit', foreignKey: 'tu_name' })
  now_time_unit.hasMany(now_time_update, { as: 'now_time_updates', foreignKey: 'tu_name' })
  now_bau.belongsTo(now_tu_bound, { as: 'bid_now_tu_bound', foreignKey: 'bid' })
  now_tu_bound.hasMany(now_bau, { as: 'now_baus', foreignKey: 'bid' })
  now_time_unit.belongsTo(now_tu_bound, { as: 'up_bnd_now_tu_bound', foreignKey: 'up_bnd' })
  now_tu_bound.hasMany(now_time_unit, { as: 'now_time_units', foreignKey: 'up_bnd' })
  now_time_unit.belongsTo(now_tu_bound, { as: 'low_bnd_now_tu_bound', foreignKey: 'low_bnd' })
  now_tu_bound.hasMany(now_time_unit, { as: 'low_bnd_now_time_units', foreignKey: 'low_bnd' })
  now_tur.belongsTo(now_tu_bound, { as: 'bid_now_tu_bound', foreignKey: 'bid' })
  now_tu_bound.hasMany(now_tur, { as: 'now_turs', foreignKey: 'bid' })
  now_time_unit.belongsTo(now_tu_sequence, { as: 'sequence_now_tu_sequence', foreignKey: 'sequence' })
  now_tu_sequence.hasMany(now_time_unit, { as: 'now_time_units', foreignKey: 'sequence' })
  ref_ref.belongsTo(ref_journal, { as: 'journal', foreignKey: 'journal_id' })
  ref_journal.hasMany(ref_ref, { as: 'ref_refs', foreignKey: 'journal_id' })
  ref_keywords_ref.belongsTo(ref_keywords, { as: 'keyword', foreignKey: 'keywords_id' })
  ref_keywords.hasMany(ref_keywords_ref, { as: 'ref_keywords_refs', foreignKey: 'keywords_id' })
  now_br.belongsTo(ref_ref, { as: 'rid_ref_ref', foreignKey: 'rid' })
  ref_ref.hasMany(now_br, { as: 'now_brs', foreignKey: 'rid' })
  now_lr.belongsTo(ref_ref, { as: 'rid_ref_ref', foreignKey: 'rid' })
  ref_ref.hasMany(now_lr, { as: 'now_lrs', foreignKey: 'rid' })
  now_sr.belongsTo(ref_ref, { as: 'rid_ref_ref', foreignKey: 'rid' })
  ref_ref.hasMany(now_sr, { as: 'now_srs', foreignKey: 'rid' })
  now_tr.belongsTo(ref_ref, { as: 'rid_ref_ref', foreignKey: 'rid' })
  ref_ref.hasMany(now_tr, { as: 'now_trs', foreignKey: 'rid' })
  now_tur.belongsTo(ref_ref, { as: 'rid_ref_ref', foreignKey: 'rid' })
  ref_ref.hasMany(now_tur, { as: 'now_turs', foreignKey: 'rid' })
  ref_authors.belongsTo(ref_ref, { as: 'rid_ref_ref', foreignKey: 'rid' })
  ref_ref.hasMany(ref_authors, { as: 'ref_authors', foreignKey: 'rid' })
  ref_keywords_ref.belongsTo(ref_ref, { as: 'rid_ref_ref', foreignKey: 'rid' })
  ref_ref.hasMany(ref_keywords_ref, { as: 'ref_keywords_refs', foreignKey: 'rid' })
  ref_field_name.belongsTo(ref_ref_type, { as: 'ref_type', foreignKey: 'ref_type_id' })
  ref_ref_type.hasMany(ref_field_name, { as: 'ref_field_names', foreignKey: 'ref_type_id' })
  ref_ref.belongsTo(ref_ref_type, { as: 'ref_type', foreignKey: 'ref_type_id' })
  ref_ref_type.hasMany(ref_ref, { as: 'ref_refs', foreignKey: 'ref_type_id' })

  return {
    com_family_synonym: com_family_synonym,
    com_genus_synonym: com_genus_synonym,
    com_main: com_main,
    com_mlist: com_mlist,
    com_order_synonym: com_order_synonym,
    com_people: com_people,
    com_species: com_species,
    com_subfamily_synonym: com_subfamily_synonym,
    com_taxa_synonym: com_taxa_synonym,
    com_users: com_users,
    now_bau: now_bau,
    now_br: now_br,
    now_coll_meth: now_coll_meth,
    now_coll_meth_values: now_coll_meth_values,
    now_lau: now_lau,
    now_loc: now_loc,
    now_lr: now_lr,
    now_ls: now_ls,
    now_ls_copy: now_ls_copy,
    now_mus: now_mus,
    now_plr: now_plr,
    now_proj: now_proj,
    now_proj_people: now_proj_people,
    now_psr: now_psr,
    now_reg_coord: now_reg_coord,
    now_reg_coord_country: now_reg_coord_country,
    now_reg_coord_people: now_reg_coord_people,
    now_regional_culture: now_regional_culture,
    now_sau: now_sau,
    now_sp_coord: now_sp_coord,
    now_sp_coord_people: now_sp_coord_people,
    now_sp_coord_taxa: now_sp_coord_taxa,
    now_sr: now_sr,
    now_ss: now_ss,
    now_ss_values: now_ss_values,
    now_strat_coord: now_strat_coord,
    now_strat_coord_people: now_strat_coord_people,
    now_syn_loc: now_syn_loc,
    now_tau: now_tau,
    now_time_unit: now_time_unit,
    now_time_update: now_time_update,
    now_tr: now_tr,
    now_tu_bound: now_tu_bound,
    now_tu_sequence: now_tu_sequence,
    now_tur: now_tur,
    ref_authors: ref_authors,
    ref_field_name: ref_field_name,
    ref_journal: ref_journal,
    ref_keywords: ref_keywords,
    ref_keywords_ref: ref_keywords_ref,
    ref_ref: ref_ref,
    ref_ref_type: ref_ref_type,
  }
}
