/**
*	LOCALITY
**/

/*** creates view used by locality list ***/
DROP VIEW IF EXISTS now_v_locality_list;
CREATE VIEW now_v_locality_list
  AS
  SELECT
    lid, loc_name, country,
    max_age, min_age,
    loc_status
  FROM now_loc;

/*** creates view used by locality header ***/
DROP VIEW IF EXISTS now_v_locality_header;
CREATE VIEW now_v_locality_header
  AS
  SELECT
    lid, loc_name, country, state, county, site_area, dms_lat, dms_long, dec_lat, dec_long, approx_coord, altitude,
    max_age, bfa_max, bfa_max_abs, min_age, bfa_min, bfa_min_abs, date_meth, frac_max, frac_min, age_comm, chron, basin, subbasin,
    loc_status, gen_loc, plate, loc_detail, lgroup, formation, member, bed, datum_plane, tos, bos, rock_type, rt_adj,
    lith_comm, depo_context1, depo_context2, depo_context3, depo_context4, depo_comm, sed_env_1, sed_env_2, event_circum,
    se_comm, climate_type, biome, v_ht, v_struct, v_envi_det, disturb, nutrients, water, seasonality, seas_intens, pri_prod,
    moisture, temperature, assem_fm, transport, trans_mod, weath_trmp, pt_conc, size_type, vert_pres, plant_pres, invert_pres,
    time_rep, appr_num_spm, num_spm, true_quant, complete, num_quad, taph_comm, tax_comm
  FROM now_loc;

/*** creates view used by locality age form ***/
DROP VIEW IF EXISTS now_v_locality_age;
CREATE VIEW now_v_locality_age
  AS
  SELECT
    lid, loc_name, country,
    date_meth,
    min_age, bfa_min_abs, bfa_min, frac_min,
    max_age, bfa_max_abs, bfa_max, frac_max,
    chron, age_comm, basin, subbasin,
    lgroup, formation, member, bed,
    datum_plane, tos, bos
  FROM now_loc;

/*** creates view used by locality locality form ***/
DROP VIEW IF EXISTS now_v_locality_locality;
CREATE VIEW now_v_locality_locality
  AS
  SELECT
    lid, loc_name,
    country, state, county, loc_detail, site_area, gen_loc, plate,
    dms_lat, dec_lat,
    dms_long, dec_long,
    approx_coord,
    altitude,
    loc_status
  FROM now_loc;

/*** creates view used by locality locality form for synonym table ***/
DROP VIEW IF EXISTS now_v_locality_locality_synonym;
CREATE VIEW now_v_locality_locality_synonym
  AS
  SELECT
    now_loc.lid, loc_name,
    syn_id, synonym
  FROM now_syn_loc
    LEFT JOIN now_loc ON now_loc.lid = now_syn_loc.lid;

/*** creates view used by locality lithology form ***/
DROP VIEW IF EXISTS now_v_locality_lithology;
CREATE VIEW now_v_locality_lithology
  AS
  SELECT
    lid, loc_name, country,
    rock_type, rt_adj, lith_comm,
    sed_env_1, sed_env_2, event_circum, se_comm, depo_context1, depo_context2, depo_context3, depo_context4, depo_comm
  FROM now_loc;

/*** creates view used by locality ecometrics form ***/
DROP VIEW IF EXISTS now_v_locality_ecometrics;
CREATE VIEW now_v_locality_ecometrics
  AS
  SELECT
    lid,
    estimate_precip, estimate_temp, estimate_npp, pers_woody_cover
  FROM now_loc;

/*** creates view used by locality ecometrics forms mean hypsodonty calculations ***/
DROP VIEW IF EXISTS now_v_locality_ecometrics_mean_hypsodonty;
CREATE VIEW now_v_locality_ecometrics_mean_hypsodonty
  AS
  SELECT
    now_ls.lid,
    ROUND(SUM(CASE WHEN tht = 'bra' THEN 1 WHEN tht = 'mes' THEN 2 WHEN tht = 'hyp' OR tht = 'hys' THEN 3 ELSE 0 END) / COUNT(NULLIF(tht, '')), 2) AS mean_hypsodonty
  FROM now_ls
    LEFT JOIN com_species ON com_species.species_id = now_ls.species_id
  WHERE
    order_name in ('Perissodactyla', 'Artiodactyla', 'Primates', 'Proboscidea', 'Hyracoidea', 'Dinocerata', 'Embrithopoda', 'Notoungulata', 'Astrapotheria', 'Pyrotheria', 'Litopterna', 'Condylarthra', 'Pantodonta')
  GROUP BY
    now_ls.lid;

/*** creates view used by locality climate form ***/
DROP VIEW IF EXISTS now_v_locality_climate;
CREATE VIEW now_v_locality_climate
  AS
  SELECT
    lid, loc_name, country,
    climate_type, temperature, moisture, disturb,
    biome, v_ht, v_struct, pri_prod,
    v_envi_det,
    seasonality, seas_intens,
    nutrients, water,
    pers_pollen_ap, pers_pollen_nap, pers_pollen_other
  FROM now_loc;

/*** creates view used by locality taphonomy form ***/
DROP VIEW IF EXISTS now_v_locality_taphonomy;
CREATE VIEW now_v_locality_taphonomy
  AS
  SELECT
    lid, loc_name, country,
    assem_fm, transport,trans_mod, weath_trmp, pt_conc, size_type,
    time_rep, vert_pres, appr_num_spm, num_spm, num_quad, true_quant, complete, taph_comm
  FROM now_loc;

/*** creates view used by locality species form ***/
DROP VIEW IF EXISTS now_v_locality_species;
CREATE VIEW now_v_locality_species
  AS
  SELECT
    now_loc.lid, loc_name, country,
    com_species.species_id, order_name, family_name, subfamily_name,
    subclass_or_superorder_name, suborder_or_superfamily_name,
    genus_name, species_name, unique_identifier, taxonomic_status,
    id_status, orig_entry,
    nis, pct, quad, mni, qua, source_name,
    now_ls.body_mass,
    dc13_mean, dc13_n, dc13_max, dc13_min, dc13_stdev, do18_mean, do18_n, do18_max, do18_min, do18_stdev,
    now_ls.mesowear, now_ls.mw_or_high, now_ls.mw_or_low, now_ls.mw_cs_sharp, now_ls.mw_cs_round, now_ls.mw_cs_blunt, now_ls.mw_scale_min, now_ls.mw_scale_max, now_ls.mw_value,
    now_ls.microwear,
    sp_status, sp_comment
  FROM now_ls
    LEFT JOIN com_species ON com_species.species_id=now_ls.species_id
    LEFT JOIN now_loc ON now_loc.lid = now_ls.lid;

/*** creates view used by locality museum form ***/
DROP VIEW IF EXISTS now_v_locality_museum;
CREATE VIEW now_v_locality_museum
  AS
  SELECT
    now_loc.lid, loc_name,
    com_mlist.museum, institution, city, com_mlist.country
  FROM now_mus
    LEFT JOIN com_mlist ON com_mlist.museum=now_mus.museum
    LEFT JOIN now_loc ON now_loc.lid = now_mus.lid;

/*** creates view used by locality projects form ***/
DROP VIEW IF EXISTS now_v_locality_project;
CREATE VIEW now_v_locality_project
  AS
  SELECT
    now_loc.lid, loc_name,
    now_plr.pid,
    proj_code, proj_name, contact, proj_status, proj_records,
    full_name, email
  FROM now_plr
    LEFT JOIN now_proj ON now_proj.pid = now_plr.pid
    LEFT JOIN now_loc ON now_loc.lid = now_plr.lid
    LEFT JOIN com_people ON com_people.initials = now_proj.contact;

/*** creates view used by locality updates form ***/
DROP VIEW IF EXISTS now_v_locality_updates;
CREATE VIEW now_v_locality_updates
  AS
  SELECT
    now_lau.luid, lid, lau_coordinator, lau_authorizer, lau_date,
    GROUP_CONCAT(now_lr.rid) as rids
  FROM now_lau, now_lr
  WHERE now_lau.luid = now_lr.luid
  GROUP BY now_lau.luid;

/*** creates view used by locality updates header form ***/
DROP VIEW IF EXISTS now_v_locality_update_header;
CREATE VIEW now_v_locality_update_header
  AS
  SELECT
    luid,
    lau_date AS date,
    l_authorizer.full_name AS authorizer,
    l_coordinator.full_name AS coordinator,
    lau_comment AS comment,
    now_loc.lid, loc_name, now_loc.country
  FROM now_lau
    LEFT JOIN com_people AS l_authorizer ON l_authorizer.initials = now_lau.lau_authorizer
    LEFT JOIN com_people AS l_coordinator ON l_coordinator.initials = now_lau.lau_coordinator
    LEFT JOIN now_loc ON now_loc.lid = now_lau.lid;

/*** creates view used by locality archaeology form ***/
DROP VIEW IF EXISTS now_v_locality_archaeology;
CREATE VIEW now_v_locality_archaeology
  AS
  SELECT
    lid, loc_name,
    hominin_skeletal_remains, bipedal_footprints, stone_tool_technology, stone_tool_cut_marks_on_bones,
    technological_mode_1, cultural_stage_1, regional_culture_1,
    technological_mode_2, cultural_stage_2, regional_culture_2,
    technological_mode_3, cultural_stage_3, regional_culture_3
  FROM now_loc;

/**
*	SPECIES
**/

/*** creates view used by species list ***/
DROP VIEW IF EXISTS now_v_species_list;
CREATE VIEW now_v_species_list
  AS
  SELECT
    com_species.species_id,
    order_name, family_name, subfamily_name,
    subclass_or_superorder_name, suborder_or_superfamily_name,
    genus_name, species_name, unique_identifier,
    sp_status, taxonomic_status, sp_comment, COUNT(com_taxa_synonym.synonym_id) AS syncount
  FROM com_species
  LEFT JOIN com_taxa_synonym ON com_taxa_synonym.species_id = com_species.species_id
  WHERE used_now = 1
  GROUP BY com_species.species_id;

/*** creates view used by species header ***/
DROP VIEW IF EXISTS now_v_species_header;
CREATE VIEW now_v_species_header
  AS
  SELECT
    species_id, class_name, order_name, family_name, subfamily_name, subclass_or_superorder_name, suborder_or_superfamily_name, genus_name, species_name, unique_identifier, common_name, sp_status,
    taxonomic_status, sp_author, strain, gene, taxon_status, diet1, diet2, diet3, diet_description, rel_fib,
    selectivity, digestion, feedinghab1, feedinghab2, shelterhab1, shelterhab2, locomo1, locomo2, locomo3, hunt_forage,
    body_mass, brain_mass, sv_length, activity, sd_size, sd_display, tshm, symph_mob, relative_blade_length, tht, crowntype, microwear, pop_struc,
    used_morph, used_now, used_gene, sp_comment
  FROM com_species
  WHERE used_now = 1
  GROUP BY species_id;

/*** creates view used by species taxonomy form ***/
DROP VIEW IF EXISTS now_v_species_taxonomy;
CREATE VIEW now_v_species_taxonomy
  AS
  SELECT
    species_id,
    class_name, order_name, family_name, subfamily_name,
    subclass_or_superorder_name, suborder_or_superfamily_name,
    genus_name, species_name, unique_identifier, taxonomic_status,
    sp_author,
    sp_status,
    sp_comment
  FROM com_species
  WHERE used_now = 1;

/*** creates view used by species diet form ***/
DROP VIEW IF EXISTS now_v_species_diet;
CREATE VIEW now_v_species_diet
  AS
  SELECT
    species_id, genus_name, species_name, unique_identifier,
    diet1, diet2, diet3,
    rel_fib, selectivity, digestion, hunt_forage
  FROM com_species
  WHERE used_now = 1;

/*** creates view used by species locomotion form ***/
DROP VIEW IF EXISTS now_v_species_locomotion;
CREATE VIEW now_v_species_locomotion
  AS
  SELECT
    species_id, genus_name, species_name, unique_identifier,
    feedinghab1, feedinghab2,
    shelterhab1, shelterhab2,
    locomo1, locomo2, locomo3, activity
  FROM com_species
  WHERE used_now = 1;

/*** creates view used by species size form ***/
DROP VIEW IF EXISTS now_v_species_size;
CREATE VIEW now_v_species_size
  AS
  SELECT
    species_id, genus_name, species_name, unique_identifier,
    body_mass, brain_mass, sv_length,
    sd_size, sd_display,
    pop_struc
  FROM com_species
  WHERE used_now = 1;

/*** creates view used by species teeth form ***/
DROP VIEW IF EXISTS now_v_species_teeth;
CREATE VIEW now_v_species_teeth
  AS
  SELECT
    species_id, genus_name, species_name, unique_identifier,
    tshm, crowntype, tht, microwear, symph_mob, relative_blade_length, horizodonty,
    cusp_shape, cusp_count_buccal, cusp_count_lingual, loph_count_lon, loph_count_trs,
    fct_al, fct_ol, fct_sf, fct_ot, fct_cm,
    mesowear, mw_or_high, mw_or_low, mw_cs_sharp, mw_cs_round, mw_cs_blunt, mw_scale_min, mw_scale_max, mw_value,
    CONCAT(
      CASE WHEN fct_al IS NULL OR fct_al = "" THEN "-" ELSE fct_al END,
      CASE WHEN fct_ol IS NULL OR fct_ol = "" THEN "-" ELSE fct_ol END,
      CASE WHEN fct_sf IS NULL OR fct_sf = "" THEN "-" ELSE fct_sf END,
      CASE WHEN fct_ot IS NULL OR fct_ot = "" THEN "-" ELSE fct_ot END,
      CASE WHEN fct_cm IS NULL OR fct_cm = "" THEN "-" ELSE fct_cm END
    ) AS functional_crown_type,
    CONCAT(
      CASE WHEN cusp_shape IS NULL OR cusp_shape = "" THEN "-" ELSE cusp_shape END,
      CASE WHEN cusp_count_buccal IS NULL OR cusp_count_buccal = "" THEN "-" ELSE cusp_count_buccal END,
      CASE WHEN cusp_count_lingual IS NULL OR cusp_count_lingual = "" THEN "-" ELSE cusp_count_lingual END,
      CASE WHEN loph_count_lon IS NULL OR loph_count_lon = "" THEN "-" ELSE loph_count_lon END,
      CASE WHEN loph_count_trs IS NULL OR loph_count_trs = "" THEN "-" ELSE loph_count_trs END
    ) AS developmental_crown_type
  FROM com_species
  WHERE used_now = 1;

/*** creates view used by species locality form ***/
DROP VIEW IF EXISTS now_v_species_locality;
CREATE VIEW now_v_species_locality
  AS
  SELECT
    com_species.species_id, genus_name, species_name, unique_identifier,
    now_loc.lid, loc_name, country,
    max_age, min_age,
    id_status, orig_entry, source_name,
    nis, pct, quad, mni, qua,
    now_ls.body_mass,
    dc13_mean, dc13_n, dc13_max, dc13_min, dc13_stdev, do18_mean, do18_n, do18_max, do18_min, do18_stdev,
    now_ls.mesowear, now_ls.mw_or_high, now_ls.mw_or_low, now_ls.mw_cs_sharp, now_ls.mw_cs_round, now_ls.mw_cs_blunt, now_ls.mw_scale_min, now_ls.mw_scale_max, now_ls.mw_value,
    now_ls.microwear,
    loc_status
  FROM now_ls
    LEFT JOIN com_species ON com_species.species_id=now_ls.species_id
    LEFT JOIN now_loc ON now_loc.lid = now_ls.lid;

/*** creates view used by species updates form ***/
DROP VIEW IF EXISTS now_v_species_updates;
CREATE VIEW now_v_species_updates
  AS
  SELECT
    now_sau.suid, species_id, sau_coordinator, sau_authorizer, sau_date,
    GROUP_CONCAT(now_sr.rid) as rids
  FROM now_sau, now_sr
  WHERE now_sau.suid = now_sr.suid
  GROUP BY now_sau.suid;

/*** creates view used by species update header form ***/
DROP VIEW IF EXISTS now_v_species_update_header;
CREATE VIEW now_v_species_update_header
  AS
  SELECT
    suid,
    sau_date AS date,
    s_authorizer.full_name AS authorizer,
    s_coordinator.full_name AS coordinator,
    sau_comment AS comment,
    com_species.species_id, genus_name, species_name, unique_identifier
  FROM now_sau
    LEFT JOIN com_people AS s_authorizer ON s_authorizer.initials = now_sau.sau_authorizer
    LEFT JOIN com_people AS s_coordinator ON s_coordinator.initials = now_sau.sau_coordinator
    LEFT JOIN com_species ON com_species.species_id = now_sau.species_id;

/**
*	REFERENCE
**/

/*** creates view used by reference list ***/
DROP VIEW IF EXISTS now_v_reference_list;
CREATE VIEW now_v_reference_list
  AS
  SELECT
    ref_ref.rid,
    date_primary, date_secondary, exact_date, title_primary, title_secondary, title_series, ref_ref.journal_id,
    ref_ref.ref_type_id, volume, issue, start_page, end_page, publisher, pub_place, issn_isbn, ref_abstract, web_url,
    misc_1, misc_2, gen_notes, printed_language, used_morph, used_now, used_gene,
    ref_authors.author_surname,
    ref_journal.journal_title,
    ref_ref_type.ref_type,
    IF(title_primary IS NULL OR title_primary = '', IF(title_series IS NULL OR title_series = '', IF(gen_notes IS NULL OR gen_notes = '', '', gen_notes), title_series), title_primary) AS cmb_title,
    IF(ref_authors.author_surname IS NULL OR ref_authors.author_surname = '', IF(ref_authors2.author_surname IS NULL OR ref_authors2.author_surname = '', IF(ref_authors3.author_surname IS NULL OR ref_authors3.author_surname = '', '', ref_authors3.author_surname), ref_authors2.author_surname), ref_authors.author_surname) AS cmb_author
  FROM ref_ref
  	LEFT JOIN ref_authors ON ref_authors.rid = ref_ref.rid AND ref_authors.field_id = 2 AND ref_authors.au_num = 1
  	LEFT JOIN ref_authors AS ref_authors2 ON ref_authors2.rid = ref_ref.rid AND ref_authors2.field_id = 12 AND ref_authors2.au_num = 1
  	LEFT JOIN ref_authors AS ref_authors3 ON ref_authors3.rid = ref_ref.rid AND ref_authors3.field_id = 15 AND ref_authors3.au_num = 1
  	LEFT JOIN ref_journal ON ref_journal.journal_id = ref_ref.journal_id
  	LEFT JOIN ref_ref_type ON ref_ref_type.ref_type_id = ref_ref.ref_type_id
  WHERE used_now = 1;

/*** creates view used for reference citation ***/
DROP VIEW IF EXISTS now_v_ref_cit;
CREATE VIEW now_v_ref_cit
  AS
  SELECT
    ref_ref.rid,
    date_primary, title_primary, title_secondary, gen_notes,
    volume, issue, start_page, end_page, publisher, pub_place,
    ref_authors1.author_surname AS author_surname1,
    ref_authors2.author_surname AS author_surname2,
    ref_authors3.author_surname AS author_surname3,
    ref_authors4.author_surname AS author_surname4,
    ref_editors1.author_surname AS editor_surname1,
    ref_editors2.author_surname AS editor_surname2,
    ref_editors3.author_surname AS editor_surname3,
    ref_editors4.author_surname AS editor_surname4,
    journal_title,
    ref_ref.ref_type_id, ref_type
  FROM ref_ref
 	LEFT JOIN ref_authors AS ref_authors1 ON ref_authors1.rid = ref_ref.rid AND ref_authors1.field_id = 2 AND ref_authors1.au_num = 1
 	LEFT JOIN ref_authors AS ref_authors2 ON ref_authors2.rid = ref_ref.rid AND ref_authors2.field_id = 2 AND ref_authors2.au_num = 2
 	LEFT JOIN ref_authors AS ref_authors3 ON ref_authors3.rid = ref_ref.rid AND ref_authors3.field_id = 2 AND ref_authors3.au_num = 3
 	LEFT JOIN ref_authors AS ref_authors4 ON ref_authors4.rid = ref_ref.rid AND ref_authors4.field_id = 2 AND ref_authors4.au_num = 4
 	LEFT JOIN ref_authors AS ref_editors1 ON ref_editors1.rid = ref_ref.rid AND ref_editors1.field_id = 12 AND ref_editors1.au_num = 1
 	LEFT JOIN ref_authors AS ref_editors2 ON ref_editors2.rid = ref_ref.rid AND ref_editors2.field_id = 12 AND ref_editors2.au_num = 2
 	LEFT JOIN ref_authors AS ref_editors3 ON ref_editors3.rid = ref_ref.rid AND ref_editors3.field_id = 12 AND ref_editors3.au_num = 3
 	LEFT JOIN ref_authors AS ref_editors4 ON ref_editors4.rid = ref_ref.rid AND ref_editors4.field_id = 12 AND ref_editors4.au_num = 4
  	LEFT JOIN ref_journal ON ref_journal.journal_id = ref_ref.journal_id
  	LEFT JOIN ref_ref_type ON ref_ref_type.ref_type_id = ref_ref.ref_type_id
  WHERE used_now = 1;

/*** creates view used by reference locality form ***/
DROP VIEW IF EXISTS now_v_reference_locality;
CREATE VIEW now_v_reference_locality
  AS
  SELECT DISTINCT
    rid,
    now_loc.lid, loc_name, country,
    max_age, min_age,
    loc_status
  FROM now_lr
    LEFT JOIN now_lau ON now_lau.luid = now_lr.luid
    LEFT JOIN now_loc ON now_loc.lid = now_lau.lid;

/*** creates view used by reference species form ***/
DROP VIEW IF EXISTS now_v_reference_species;
CREATE VIEW now_v_reference_species
  AS
  SELECT DISTINCT
    rid,
    com_species.species_id, order_name, family_name, subfamily_name,
    subclass_or_superorder_name, suborder_or_superfamily_name,
    genus_name, species_name, unique_identifier,
    sp_status
  FROM now_sr
    LEFT JOIN now_sau ON now_sau.suid = now_sr.suid
    LEFT JOIN com_species ON com_species.species_id=now_sau.species_id;

/*** creates view used by reference time unit bound ***/
DROP VIEW IF EXISTS now_v_reference_tubound;
CREATE VIEW now_v_reference_tubound
  AS
  SELECT DISTINCT
    rid,
    now_tu_bound.bid, b_name, age, b_comment
  FROM now_tur
    LEFT JOIN now_tu_bound ON now_tu_bound.bid = now_tur.bid;

/*** creates view used by reference header ***/
DROP VIEW IF EXISTS now_v_reference_header;
CREATE VIEW now_v_reference_header
  AS
  SELECT
    rid
  FROM ref_ref
  WHERE used_now = 1;

/*** creates view used by locality export ***/
DROP VIEW IF EXISTS now_v_export_loc;
CREATE VIEW now_v_export_loc
  AS
  SELECT
    now_loc.lid,
    loc_name, country, state, county,
    dms_lat, dms_long, dec_lat, dec_long, altitude,
    max_age, bfa_max, bfa_max_abs, frac_max,
    min_age, bfa_min, bfa_min_abs, frac_min,
    chron, age_comm,
    basin, subbasin,
    appr_num_spm, gen_loc,
    GROUP_CONCAT(now_syn_loc.synonym SEPARATOR ', ') AS loc_synonyms,
    estimate_precip, estimate_temp, estimate_npp,
    pers_woody_cover, pers_pollen_ap, pers_pollen_nap, pers_pollen_other,
    hominin_skeletal_remains, bipedal_footprints, stone_tool_technology, stone_tool_cut_marks_on_bones,
    technological_mode_1, cultural_stage_1, regional_culture_1,
    technological_mode_2, cultural_stage_2, regional_culture_2,
    technological_mode_3, cultural_stage_3, regional_culture_3,
    loc_status,
    '\\N' mean_hypsodonty
  FROM now_loc
    LEFT JOIN now_syn_loc ON now_loc.lid = now_syn_loc.lid
  GROUP BY now_loc.lid;

/*** creates view used by locality-species export ***/
DROP VIEW IF EXISTS now_v_export_locsp;
CREATE VIEW now_v_export_locsp
  AS
  SELECT
    /* LOCALITY */
    now_loc.lid,
    loc_name, country, state, county,
    dms_lat, dms_long, dec_lat, dec_long, altitude,
    max_age, bfa_max, bfa_max_abs, frac_max,
    min_age, bfa_min, bfa_min_abs, frac_min,
    chron, age_comm,
    basin, subbasin,
    appr_num_spm, gen_loc,
    (SELECT GROUP_CONCAT(synonym SEPARATOR ', ') FROM now_syn_loc WHERE now_syn_loc.lid=now_loc.lid) AS loc_synonyms,
    estimate_precip, estimate_temp, estimate_npp,
    pers_woody_cover, pers_pollen_ap, pers_pollen_nap, pers_pollen_other,
    hominin_skeletal_remains, bipedal_footprints, stone_tool_technology, stone_tool_cut_marks_on_bones,
    technological_mode_1, cultural_stage_1, regional_culture_1,
    technological_mode_2, cultural_stage_2, regional_culture_2,
    technological_mode_3, cultural_stage_3, regional_culture_3,
    loc_status,
    '\\N' mean_hypsodonty,

    /* SPECIES */
    com_species.species_id,
    order_name, family_name, subfamily_name, subclass_or_superorder_name, suborder_or_superfamily_name, genus_name, species_name, unique_identifier,
    taxonomic_status,
    com_species.body_mass,
    sv_length,
    sd_size, sd_display,
    tshm, tht, crowntype,
    diet1, diet2, diet3,
    locomo1, locomo2, locomo3,
    horizodonty,
    com_species.microwear, com_species.mesowear,
    com_species.mw_or_high, com_species.mw_or_low,
    com_species.mw_cs_sharp, com_species.mw_cs_round, com_species.mw_cs_blunt,
    com_species.mw_scale_min, com_species.mw_scale_max, com_species.mw_value,
    cusp_shape, cusp_count_buccal, cusp_count_lingual, loph_count_lon, loph_count_trs,
    fct_al, fct_ol, fct_sf, fct_ot, fct_cm,
    sp_status, sp_comment,
    (SELECT GROUP_CONCAT(CONCAT(syn_genus_name, " ", syn_species_name) ORDER BY syn_genus_name SEPARATOR ":")
     FROM com_taxa_synonym WHERE com_taxa_synonym.species_id=com_species.species_id) AS sp_synonyms,
    (SELECT GROUP_CONCAT(syn_comment ORDER BY syn_genus_name SEPARATOR ":")
     FROM com_taxa_synonym WHERE com_taxa_synonym.species_id=com_species.species_id) AS sp_synonyms_comment,

    /* LOC-SP */
    now_ls.id_status, now_ls.orig_entry, now_ls.source_name,
    now_ls.microwear AS ls_microwear, now_ls.mesowear AS ls_mesowear,
    now_ls.mw_or_low AS ls_mw_or_low, now_ls.mw_or_high AS ls_mw_or_high,
    now_ls.mw_cs_sharp AS ls_mw_cs_sharp, now_ls.mw_cs_round AS ls_mw_cs_round, now_ls.mw_cs_blunt AS ls_mw_cs_blunt,
    now_ls.mw_scale_min AS ls_mw_scale_min, now_ls.mw_scale_max AS ls_mw_scale_max, now_ls.mw_value AS ls_mw_value,
    '\\N' AS ls_mesowear_score
  FROM now_ls
    LEFT JOIN now_loc ON now_ls.lid = now_loc.lid
    LEFT JOIN com_species ON now_ls.species_id = com_species.species_id
    /*LEFT JOIN com_taxa_synonym ON now_ls.species_id = com_taxa_synonym.species_id*/
  WHERE
    used_now = 1;

/*** creates view used by non-associated (not in now_ls) com_species export ***/
DROP VIEW IF EXISTS now_v_export_nonassociated_species;
CREATE VIEW now_v_export_nonassociated_species
  AS
  SELECT
    /* LOCALITY */
    '\\N' AS lid,
    '\\N' AS loc_name, '\\N' AS country, '\\N' AS state, '\\N' AS county,
    '\\N' AS dms_lat, '\\N' AS dms_long, '\\N' AS dec_lat, '\\N' AS dec_long, '\\N' AS altitude,
    '\\N' AS max_age, '\\N' AS bfa_max, '\\N' AS bfa_max_abs, '\\N' AS frac_max,
    '\\N' AS min_age, '\\N' AS bfa_min, '\\N' AS bfa_min_abs, '\\N' AS frac_min,
    '\\N' AS chron, '\\N' AS age_comm,
    '\\N' AS basin, '\\N' AS subbasin,
    '\\N' AS appr_num_spm, '\\N' AS gen_loc,
    '\\N' AS loc_synonyms,
    '\\N' AS estimate_precip, '\\N' AS estimate_temp, '\\N' AS estimate_npp,
    '\\N' AS pers_woody_cover, '\\N' AS pers_pollen_ap, '\\N' AS pers_pollen_nap, '\\N' AS pers_pollen_other,
    '\\N' AS hominin_skeletal_remains, '\\N' AS bipedal_footprints, '\\N' AS stone_tool_technology, '\\N' AS stone_tool_cut_marks_on_bones,
    '\\N' AS technological_mode_1, '\\N' AS cultural_stage_1, '\\N' AS regional_culture_1,
    '\\N' AS technological_mode_2, '\\N' AS cultural_stage_2, '\\N' AS regional_culture_2,
    '\\N' AS technological_mode_3, '\\N' AS cultural_stage_3, '\\N' AS regional_culture_3,
    '\\N' AS loc_status,
    '\\N' mean_hypsodonty,

    /* SPECIES */
    species_id,
    order_name, family_name, subfamily_name, subclass_or_superorder_name, suborder_or_superfamily_name, genus_name, species_name, unique_identifier,
    taxonomic_status,
    body_mass,
    sv_length,
    sd_size, sd_display,
    tshm, tht, crowntype,
    diet1, diet2, diet3,
    locomo1, locomo2, locomo3,
    horizodonty,
    microwear, mesowear,
    mw_or_high, mw_or_low,
    mw_cs_sharp, mw_cs_round, mw_cs_blunt,
    mw_scale_min, mw_scale_max, mw_value,
    cusp_shape, cusp_count_buccal, cusp_count_lingual, loph_count_lon, loph_count_trs,
    fct_al, fct_ol, fct_sf, fct_ot, fct_cm,
    sp_status, sp_comment,
    (SELECT GROUP_CONCAT(CONCAT(syn_genus_name, " ", syn_species_name) ORDER BY syn_genus_name SEPARATOR ":")
     FROM com_taxa_synonym WHERE com_taxa_synonym.species_id=com_species.species_id) AS sp_synonyms,
    (SELECT GROUP_CONCAT(syn_comment ORDER BY syn_genus_name SEPARATOR ":")
     FROM com_taxa_synonym WHERE com_taxa_synonym.species_id=com_species.species_id) AS sp_synonyms_comment,

    /* LOC-SP */
    '\\N' AS id_status, '\\N' AS orig_entry, '\\N' AS source_name,
    '\\N' AS ls_microwear, '\\N' AS ls_mesowear,
    '\\N' AS ls_mw_or_low, '\\N' AS ls_mw_or_high,
    '\\N' AS ls_mw_cs_sharp, '\\N' AS ls_mw_cs_round, '\\N' AS ls_mw_cs_blunt,
    '\\N' AS ls_mw_scale_min, '\\N' AS ls_mw_scale_max, '\\N' AS ls_mw_value,
    '\\N' AS ls_mesowear_score
  FROM com_species
  WHERE
    species_id NOT IN (SELECT species_id FROM now_ls) AND used_now = 1;

/*** creates view used by people list ***/
DROP VIEW IF EXISTS now_v_people_list;
CREATE VIEW now_v_people_list
  AS
  SELECT
    initials, first_name, surname, full_name, format, email, user_id, organization, country, password_set, used_now
  FROM com_people
  WHERE
    used_now = 1;

/*** creates view used by project list ***/
DROP VIEW IF EXISTS now_v_project_list;
CREATE VIEW now_v_project_list
  AS
  SELECT
    pid, com_people.full_name, proj_code, proj_name, proj_status, proj_records
  FROM now_proj
    LEFT JOIN com_people ON com_people.initials = now_proj.contact;

/*** creates view used by user project list ***/
DROP VIEW IF EXISTS now_v_project_list_user;
CREATE VIEW now_v_project_list_user
  AS
  SELECT
    now_proj.pid, com_people.full_name, now_proj_people.initials AS nppinitials, proj_code, proj_name, proj_status, proj_records
  FROM now_proj
    LEFT JOIN com_people ON com_people.initials = now_proj.contact
    INNER JOIN now_proj_people ON now_proj.pid = now_proj_people.pid;

/*** creates view used by museum list ***/
DROP VIEW IF EXISTS now_v_museum_list;
CREATE VIEW now_v_museum_list
  AS
  SELECT
    museum, institution, alt_int_name, city, state_code, state, country, used_now
  FROM com_mlist
  WHERE
  used_now=1;

/*** creates view used by sedimentary structure list ***/
DROP VIEW IF EXISTS now_v_ss_values_list;
CREATE VIEW now_v_ss_values_list
  AS
  SELECT
    ss_value, category
  FROM now_ss_values;

/*** creates view used by collection method list ***/
DROP VIEW IF EXISTS now_v_coll_meth_values_list;
CREATE VIEW now_v_coll_meth_values_list
  AS
  SELECT
    coll_meth_value
  FROM now_coll_meth_values;

/*** creates view for fetching locality statistics ***/
DROP VIEW IF EXISTS now_v_locality_statistics;
CREATE VIEW now_v_locality_statistics
  AS
  SELECT
    year(lau_date) AS year,
    month(lau_date) AS month,
    surname
  FROM now_lau
    LEFT JOIN com_people ON now_lau.lau_authorizer = com_people.initials
  GROUP BY 1, 2, com_people.surname, com_people.first_name
  ORDER BY 1 DESC, 2 DESC, count(*) DESC;

/*** creates view for fetching species statistics ***/
DROP VIEW IF EXISTS now_v_species_statistics;
CREATE VIEW now_v_species_statistics
  AS
  SELECT
    year(sau_date) AS year,
    month(sau_date) AS month,
    surname
  FROM now_sau
    LEFT JOIN com_people ON now_sau.sau_authorizer = com_people.initials
  GROUP BY 1, 2, com_people.surname, com_people.first_name
  ORDER BY 1 DESC, 2 DESC, count(*) DESC;

/*** creates view for getting the count of public locality-species records ***/
DROP VIEW IF EXISTS now_v_public_locality_species;
CREATE VIEW now_v_public_locality_species
  AS
  SELECT
    count(now_ls.lid) AS count
  FROM now_ls
    LEFT JOIN com_species ON com_species.species_id=now_ls.species_id
    LEFT JOIN now_loc ON now_loc.lid = now_ls.lid
  WHERE
    sp_status=0 AND loc_status=0 AND used_now=1 AND
    now_ls.lid NOT IN (SELECT DISTINCT now_plr.lid FROM now_plr JOIN now_proj ON now_plr.pid = now_proj.pid WHERE now_proj.proj_records = 1);

/**
*	TIME UNIT / BOUND
**/

/*** creates view used by time unit / bound updates form ***/
DROP VIEW IF EXISTS now_v_time_unit_and_bound_updates;
CREATE VIEW now_v_time_unit_and_bound_updates
  AS
  SELECT
    time_update_id, now_time_update.tu_name, tu_display_name, tuid, lower_buid, upper_buid, coordinator, authorizer, date, comment
  FROM now_time_update, now_time_unit
  WHERE now_time_update.tu_name = now_time_unit.tu_name;

/*** creates view used by time unit bound list ***/
DROP VIEW IF EXISTS now_v_time_bound_list;
CREATE VIEW now_v_time_bound_list
  AS
  SELECT
    bid, b_name, age, b_comment
  FROM now_tu_bound;

/*** creates view used by time bound header ***/
DROP VIEW IF EXISTS now_v_time_bound_header;
CREATE VIEW now_v_time_bound_header
  AS
  SELECT
    bid, b_name, age, b_comment
  FROM now_tu_bound;

/*** creates view used by time bound header ***/
DROP VIEW IF EXISTS now_v_time_bound;
CREATE VIEW now_v_time_bound
  AS
  SELECT
    bid, b_name, age, b_comment
  FROM now_tu_bound;

/*** creates view used by time unit list in time bound page ***/
DROP VIEW IF EXISTS now_v_time_bounds_in_time_units;
CREATE VIEW now_v_time_bounds_in_time_units
  AS
  SELECT
    bid, tu_name, tu_display_name, up_bnd, low_bnd, rank, sequence, tu_comment
  FROM now_time_unit
  LEFT JOIN now_tu_bound ON now_tu_bound.bid = now_time_unit.low_bnd OR now_tu_bound.bid = now_time_unit.up_bnd;

/*** creates view used by time bound updates form ***/
DROP VIEW IF EXISTS now_v_time_bound_updates;
CREATE VIEW now_v_time_bound_updates
  AS
  SELECT
    now_bau.buid, bid, bau_coordinator, bau_authorizer, bau_date,
    GROUP_CONCAT(now_br.rid) as rids
  FROM now_bau, now_br
  WHERE now_bau.buid = now_br.buid
  GROUP BY now_bau.buid;

/*** creates view used by time bound updates header form ***/
DROP VIEW IF EXISTS now_v_time_bound_update_header;
CREATE VIEW now_v_time_bound_update_header
  AS
  SELECT
    buid,
    bau_date AS date,
    b_authorizer.full_name AS authorizer,
    b_coordinator.full_name AS coordinator,
    bau_comment AS comment,
    now_tu_bound.bid, b_name
  FROM now_bau
    LEFT JOIN com_people AS b_authorizer ON b_authorizer.initials = now_bau.bau_authorizer
    LEFT JOIN com_people AS b_coordinator ON b_coordinator.initials = now_bau.bau_coordinator
    LEFT JOIN now_tu_bound ON now_tu_bound.bid = now_bau.bid;

/*** creates view used by time unit localities form ***/
DROP VIEW IF EXISTS now_v_time_unit_localities;
CREATE VIEW now_v_time_unit_localities
  AS
  SELECT
    tu_name, tu_display_name, lid, loc_name, bfa_min, bfa_max, loc_status
  FROM now_time_unit
    LEFT JOIN now_loc ON now_loc.bfa_min = now_time_unit.tu_name OR now_loc.bfa_max = now_time_unit.tu_name;
