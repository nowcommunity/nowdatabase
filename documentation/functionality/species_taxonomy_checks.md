### Species taxonomy checks

If you are unsure how the taxonomic conventions work or what the different taxonomic fields mean, you should read [this document](https://github.com/nowcommunity/NOW-Django/wiki/Data-Conventions%3A-Taxonomic-Fields) first. (NOTE: some information might be incorrect, outdated or not implemented in the new version of the app. Once an updated document is made, it should be linked here.)

When the user is creating a new species or editing an existing one, clicking the write button calls the functions inside [taxonomyFunctions.tsx](../../frontend/src/components/Species/taxonomyFunctions.tsx) in the following order:

1. The `convertTaxonomyFields` function formats the taxonomy values given by the user. Everything except `species_name` and `unique_identifier` begins with a capital letter, with all other letters lowercased. The exceptions to this are special values: "incertae sedis", "indet.", "fam.", "gen." and "sp.", which are left unchanged. `species_name` is fully lowercased, and `unique_identifier` is also left unchanged.
2. The `checkTaxonomy` function ensures that the species does not already exist in the database, and that the taxonomy tree is correct. The function loops through every species in the database and for each one:
   1. checks that the new species is not a duplicate of an existing one (Genus, Species, an Unique identifier cannot all be identical)
   2. checks that the new species is not a synonym of an existing species
   3. checks that the taxonomy tree is correct. This is done by comparing every taxonomic field to their parent field, e.g. if the new species and the existing species have the same Family but different Order, the taxonomy tree is not valid. This has some additional rules depending on whether a taxonomic field has a special value ("incertae sedis", "indet." etc.).

If any of these checks fail, the creating/updating fails and the user is notified about it.
