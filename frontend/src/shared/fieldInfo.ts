export const fieldInfoTexts = {
  body_mass:
    'The average adult body mass estimated for the species, in grams. Where there is sexual dimorphism in size, put the mean of the two sexes here and record the masses per sex, if known, in the Comment field. Confidence intervals, if known, can also be put there.',
  brain_mass:
    'The average adult brain mass estimated for the species, in grams. Where there is sexual dimorphism in size, put the mean of the two sexes here and record the masses per sex, if known, in the Comment field. Confidence intervals, if known, can also be put there.',
  sv_length:
    'For many species body-mass values will be unavailable or cannot be estimated with any confidence. However, every species should be classifiable into one of the gross size ranges listed below. This field will allow at least a crude characterization of body sizes for any fossil locality.',
  sd_size: 'Whether there is sexual dimorphism in overall body size.',
  sd_display:
    'Whether there is evidence of sexual dimorphism in display (or sexual combat) structures. (e. g., horns, antlers, dome-heads, canines). If the presence of these features is unknown, leave the field blank rather than enter "n."',
  tshm: 'A description of the morphology of the tooth crown, for multicusped teeth (if present). In concert with the other tooth morphology fields, this may allow functional interpretations to be made independently of whatever has been entered in the diet fields. Terminology for tooth-crown morphology is most highly developed for extant and fossil mammals, but no system has gained universal acceptance. The following reflects a compromise among many competing traditional systems, and is based partly on Fortelius (1985) and Janis and Fortelius (1988). This field is currently subject to further development. Improved nomenclature for some mammal groups, such as rodents and insectivores, might be more functionally indicative. Also, an expanded list of terms would be useful to characterize more fully the variation found among nonmammalian terrestrial vertebrates -- dinosaurs and therapsids in particular. The similar Molar Crown Type field is based on an alternative descriptive classification scheme, and currently applies only to mammals.',
  symph_mob: 'Whether or not the mandibular symphysis is mobile.',
  tht: 'An indication of hypsodonty (tooth crown height) or the nature of other adaptations to deal with the problem of lifetime tooth wear. Tooth replacement, Tooth plates, and Hypselodont (ever-growing teeth) are absolute descriptors. The terms Brachydont, Mesodont and Hypsodont refer to different degrees of crown height of (mammalian) cheek teeth, and are subject to a variety of interpretations. Hypsodont (high-crowned) teeth may be defined objectively as those where the antero-posterior length is exceeded by the dorso-ventral height (Janis & Fortelius, 1988). "Somewhat hypsodont" teeth, intermediate between brachydont and hypsodont, are referred to as "mesodont," but there is no corresponding objective definition of this term. Quantitative indices of hypsodonty have been used (Janis, 1988), and might prove superior to the classification scheme presented here. Thus, this field is currently subject to further development.',
  diet1:
    'The predominant food type in the diet of the species, at the coarsest level of resolution: Animal, Plant, Omnivore. See also Diet 3, Diet 2, Relative Fiber Content, Selectivity, Food Processing Mode, Digestion.',
  diet2:
    'The predominant food type in the diet of the species, at an intermediate level of resolution. See also Diet 1, Diet 3, Relative Fiber Content, Selectivity, Food Processing Mode, Digestion.',
  diet3:
    'The predominant, or most important or most characteristic, food type in the diet of the species, at a detailed level of resolution. At this scale, the diets of many species will not be clearly distinguishable from one another using only a single term for the most common dietary component. Nevertheless, highly variable food-type categories often delineate distinct ecological/adaptive/functional types (as in the case of mixed browsing/grazing ungulates). That is, calling something a "frugivore" may not explicitly describe other components of its diet, some of which may be of adaptive importance to the species; it does not allow one to distinguish among species within the frugivore category, either. But it does allow one to place the species between omnivores or insectivores, on the one hand, and browsers, on the other.',
  rel_fib:
    'The relative amount of plant fiber in the food of the species. Plant food can be divided into cell contents such as sugars, proteins and storage carbohydrates, which are directly digestible by vertebrates. Plant cell-walls, however, are composed of material ("fiber") partially digestible only by microbial fermentation. Thus, the higher the fiber content, relative to the amount of energy contained in the easily-digested portion, the harder it is to obtain energy from the forage and the poorer the "quality" of the food on a per-unit basis. In addition, the proportion of the fiber digestible by fermentation also varies among plant species, plant parts, and growth stages. This field describes the food as having high, medium, and low levels of fiber. It is intended as a rough indication of the nutritional quality of a species\' diet. It refers only to herbivorous diets, or the plant portions of omnivorous diets. (The field basically functions to group various Diet 3 categories by relative fiber content.)',
  selectivity:
    'Within its food-type category (Diet 1-3) a species may feed selectively or unselectively. Thus this field applies to any dietary category. Some food types impose selectivity restrictions on the species that feed on them. For example, most large grazers are less selective than mixed feeders or browsers. This is not what this field is meant to indicate! Rather, it applies within dietary categories. It could, for example, be used to distinguish between relatively selective and relatively unselective grazers.',
  digestion:
    'There are different broad strategies for breaking down plant material by means of microbial activity in the gut. Hindgut fermenters (hg) and foregut fermenters (fg) are found in a variety of living taxa. True ruminants (ru) are confined to the ruminant artiodactyls; they are separated here from other foregut fermenters, of which they form a special derived subclass.',
  feedinghab1:
    'The general habitat from which the species obtains the major part of its trophic resources, and in which it ordinarily spends time feeding. The allowed values are identical to those for Shelter Habitat 1. See also Feeding Habitat 2.',
  feedinghab2:
    'For the Terrestrial (te) entry in Feeding Habitat 1 only, a further breakdown into more specific feeding habitats. They are described more fully below.',
  shelterhab1:
    'The general habitat in which the animal sleeps, shelters, or avoids predation when not feeding. The allowed values are identical to those for Feeding Habitat 1. See also Shelter Habitat 2.',
  shelterhab2:
    'For the Terrestrial (te) entry in Shelter Habitat 1 only, a further breakdown into more specific shelter habitats. They are described more fully below, and are mostly identical to the fields for Feeding Habitat 2.',
  locomo1:
    'The general substrate upon which locomotion characteristically takes place. These categories are the same as those in Feeding Habitat 1 and Shelter Habitat 1.',
  locomo2:
    'For non-aquatic, non-aerial species the terrestrial substrate upon which locomotion characteristically takes place. "Arboreal" describes species that almost never come to the ground, or, if they do, it is almost always for the purpose of dispersing to another tree or trees. "Scansorial" is a broad category including those species that habitually use both trees and the ground in their movements. At the non-arboreal extreme, it includes species that rarely in practice use the trees, but are not morphologically prevented from doing so. [This category may eventually have to be split to distinguish species that exhibit some arboreal adaptations (e.g., squirrels), from those that could climb in a limited way if they had to (e.g., lions).] "Surficial" refers to those creatures who use only the ground surface in locomotion (e.g., sauropods, wildebeeste).',
  locomo3:
    'The predominant mode of locomotor activity. [These categories are not necessarily complete at this time.] The categorization of flight locomotion in Locomotion 2 and Locomotion 3 is based on Norberg (1985).',
  hunt_forage:
    'The predominant hunting or foraging mode for carnivores. These categories are based upon those of Van Valkenburgh (1985) and are described more fully there. This field might also be of eventual use in describing foraging modes of non-carnivores, but at present these cannot be determined directly upon morphological criteria (such inferences as can be made are already taken care of in Feeding Habitat, Diet and Locomotion.)',
  activity:
    'The primary time of day during which the species was active. Choices are Diurnal, Crepuscular, or Nocturnal.',
  crowntype:
    'This field describes the morphology of mammalian molar crowns, and is complimentary to the Tooth Shape - Multicuspid field. The latter presents a traditional classification of molar crown types (and other multicusped teeth) for vertebrates. Molar Crown Type, in contrast, uses a more recently developed classification scheme that is currently restricted to mammals. The scheme is phylogenetically neutral and descriptive, allowing functional interpretations and interpretations of underlying developmental mechanisms (see Jernvall, 1995). Currently, the values for the field consist of five-letter alphanumeric codes, described in Jernvall, et al. (1996), and the reader is referred to that paper for further explanation.',
  microwear:
    "This field describes the kind of microwear (in terms of striations or pits) revealed by microscopic examination of the wear facets of the tooth crowns of the species. A considerable literature exists concerning the ways to infer aspects of a species' diet from patterns of microwear.",
  pop_struc:
    'Occasionally there will be evidence of herding or other gregarious behavior for a species. This could include evidence from mass deaths, well-preserved trace fossils (e.g., trackways), nesting-site or burrow aggregations, or association of individuals in burrows. It could also be based, less directly, on other aspects of the organism\'s biology -- for example, sexual dimorphism in sexual display or combat features. If so, indicate "soc" here and give details briefly in the Comment field. The choice "sol" (solitary) is allowed for completeness, but ordinarily there will be no positive evidence for solitary behavior, so the alternative to "soc" is usually a blank.',
  loc_name:
    'The name by which the locality is known, if any. Locality names do not need to be unique; they are useful display information, while the database tracks each locality by its unique LID.',
  country: 'The country where the locality is found.',
  state: 'The state or province, or other first-order national subdivision, where the locality is found.',
  county:
    'The county or parish, or other second-order national subdivision, where the locality is found. For U.S. counties, do not include an abbreviation for, or the word, "county" as part of the name.',
  loc_detail:
    'Any relevant details about the geographical location of the locality, or peculiarities of its situation.',
  site_area: 'The approximate area covered by the actual fossil site. See also the General Locality field.',
  gen_loc:
    'Indicates whether the locality is a general locality: an area that contains other localities recorded separately in the database and can hold information not assignable to one specific primary locality.',
  dms_lat:
    'The latitude of the locality in degrees, minutes, seconds format. Include degrees, minutes, and seconds, separated with single spaces, and use N or S.',
  dec_lat: 'The latitude of the locality in decimal degrees. North is positive and south is negative.',
  dms_long:
    'The longitude of the locality in degrees, minutes, seconds format. Include degrees, minutes, and seconds, separated with single spaces, and use E or W.',
  dec_long: 'The longitude of the locality in decimal degrees. East is positive and west is negative.',
  date_meth:
    'The method used to assign the geologic age range to the locality. Values distinguish time-unit, absolute, and composite dating approaches.',
  min_age:
    'The minimum, or youngest, age that the locality is thought to possess, in millions of years before present (Ma). For absolute ages, use value minus error term.',
  max_age:
    'The maximum, or oldest, age that the locality is thought to possess, in millions of years before present (Ma). For absolute ages, use value plus error term.',
  bfa_min:
    'The basis for the minimum age assignment. Non-absolute terms must match a time unit in the time_unit table; absolute terms must be paired with numerical ages.',
  bfa_max:
    'The basis for the maximum age assignment. Non-absolute terms must match a time unit in the time_unit table; absolute terms must be paired with numerical ages.',
  bfa_min_abs: 'The absolute dating method used as the basis for the minimum age assignment.',
  bfa_max_abs: 'The absolute dating method used as the basis for the maximum age assignment.',
  frac_min:
    'A specified fraction of the non-absolute time unit used for the minimum age, written as segment:denominator and counted from the oldest segment.',
  frac_max:
    'A specified fraction of the non-absolute time unit used for the maximum age, written as segment:denominator and counted from the oldest segment.',
  chron:
    'A chronostratigraphic unit, chron, biozone, biostratigraphic unit, or similar assignment for the locality, independent of the age fields.',
  age_comm:
    'A comment on the age assignment of the locality, including information relevant to dating method, basis for age, fractions, and chronostratigraphic age.',
  lgroup:
    'The stratigraphic group in which the locality is found. Use flexibly for the highest useful hierarchical stratigraphic designation.',
  formation:
    'The name of the stratigraphic formation in which the locality is found. Do not include the word "Formation" as part of the name.',
  member:
    'The name of the member of a formation in which the locality is found. Do not include the word "Member" as part of the name.',
  bed: 'The stratigraphic bed in which the fossils are found, interpreted broadly for the lowest-order local stratigraphic unit.',
  datum_plane:
    'A short description of the datum plane used to place the locality in a measured section and interpret top and bottom sample-unit distances.',
  tos: 'The distance, in meters, from the datum plane to the top of the fossil sample unit. It may be positive or negative relative to the datum plane.',
  bos: 'The distance, in meters, from the datum plane to the bottom of the fossil sample unit. It may be positive or negative relative to the datum plane.',
  rock_type: 'A single term describing the general rock type in which the fossils are found.',
  rt_adj: 'One or two short adjectives that describe the rock type, such as calcareous, gray laminated, or red.',
  lith_comm:
    'A short miscellaneous description of the lithology of the locality, especially the fossil-bearing deposit.',
  sed_env_1: 'The general sedimentary environmental setting of the locality.',
  sed_env_2:
    'The specific sedimentary environment of the locality, hierarchically subordinate to Sedimentary Environment 1.',
  event_circum:
    'The more specific sedimentological event or circumstance associated with the formation of the fossil deposit.',
  se_comm: 'Brief comments on the sedimentary environment, augmenting the other sedimentary-environment fields.',
  climate_type: 'The general climatic regime inferred for the locality.',
  temperature:
    'The general temperature regime characteristic of the overall environment. This mainly refers to climate and can be used independently of modern climate-type categories.',
  moisture:
    'The amount of moisture characteristic of the overall environment, mainly climate, rainfall, and evaporation.',
  disturb:
    'The natural agents of major and recurring vegetation disturbance in the ecosystem, limited to water, fire, wind, or combinations of those terms.',
  v_envi_det: 'Additional detail about the inferred environmental and vegetation setting of the locality.',
  seasonality: 'The combination of water, light, and temperature seasonality exhibited by the environment.',
  seas_intens:
    'The intensity values that modify the Seasonality field. The order and number of entries should match the corresponding entries in Seasonality.',
  biome:
    'The biome inferred for the locality eco-environment, a major terrestrial ecosystem type based primarily on vegetation formation and associated physical factors.',
  v_ht: 'The average height of the vegetation, as opposed to the height of any particular plant species.',
  v_struct: 'The overall structure of the vegetation.',
  pri_prod: 'The general level of annual primary productivity inferred for the locality, based on available evidence.',
  nutrients: 'Availability of nutrients to the plants of a locality.',
  water:
    'The amount of water available to the plants or vegetation sampled by a plant locality, which may differ from the overall regional moisture.',
  assem_fm:
    'The basic mode of formation of the fossil assemblage, derived from taphonomic and sedimentological evidence.',
  transport:
    'The extent and nature of taphonomic transport processes that have affected the assemblage, such as transport, winnowing, or both.',
  trans_mod: 'The degree of abrasion observed on the fossil remains at the locality: unabraded, mixed, or abraded.',
  weath_trmp: 'The existence of different levels of weathering and trampling damage to fossils.',
  pt_conc:
    'The concentration of specimens in the fossil deposit, used as an indication of richness of organic remains at the site.',
  size_type: 'Whether the locality yields primarily microfossils, macrofossils, or a relatively even mixture of both.',
  vert_pres:
    'The predominant state of disarticulation and preservation of skeletal remains of vertebrates at the locality.',
  time_rep:
    'The approximate amount of time represented by the fossil deposit, inferred from sedimentological and taphonomic criteria.',
  appr_num_spm:
    'The approximate number of collected specimens from the locality on which database inferences are based.',
  num_spm:
    'The exact total number of specimens collected from the locality, if known. If exact number is known, the approximate number should also be filled.',
  num_quad:
    'The total number of standardized quadrats, squares, samples, or other sampling units on which abundance counts are based.',
  true_quant:
    'Whether the species list or abundance values are likely to be a fair sample of what was available, given the collecting techniques used.',
  complete:
    'Indicates known incompleteness of the species list when additional identified or compilable taxa are expected to be added later.',
  ref_type_id: 'The kind of reference record being entered.',
  title_primary: 'The title of the reference, entered in Paleobiology format where applicable.',
  title_secondary:
    'A secondary title for the reference, such as a book, edited volume, series, or containing work title when applicable.',
  title_series: 'A series title for the reference when applicable.',
  date_primary:
    'The year of publication, or the year the information was obtained if this is not a published reference.',
  date_secondary: 'A secondary publication year or date value for reference types that need one.',
  exact_date:
    'The exact date associated with the reference when a full date is needed in addition to the publication year.',
  authors_primary:
    'The primary author list for the reference. These names are commonly used with publication year to locate references.',
  authors_secondary:
    'A secondary author list for the reference, such as editors or other contributor roles depending on reference type.',
  authors_series: 'A series editor or series contributor list for the reference when applicable.',
  author_surname: 'The last name of an author. Author surnames are used to retrieve references, so spelling matters.',
  author_initials: 'The initials of an author.',
  journal_title: 'The journal or publication title used as part of the full citation of the reference.',
  volume: 'The volume information used as part of the full citation of the reference.',
  issue: 'The issue information used as part of the full citation of the reference.',
  start_page: 'The first page of the reference, used as part of the full citation.',
  end_page: 'The last page of the reference, used as part of the full citation.',
  publisher: 'The publisher information used as part of a book or edited-volume citation.',
  pub_place: 'The publication place used as part of a book or edited-volume citation.',
  gen_notes:
    'General notes about the reference, for source details or other useful context not captured by the structured citation fields.',
} as const

export type FieldInfoKey = keyof typeof fieldInfoTexts

export const getFieldInfoText = (field: string): string | undefined => fieldInfoTexts[field as FieldInfoKey]
