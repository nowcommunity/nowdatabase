# Changelog

## Unreleased
### Changed
- Repositioned table row action icons to the right edge, tightened spacing, and added aria labels so Locality, Species, and related tables reclaim horizontal room while keeping tooltips and restriction markers accessible.

### Fixed
- Resolved Update log detail navigation so Return buttons honor the originating table using the new shared return-navigation helper.
- Restored Locality edit view synonym creation so saving a valid synonym immediately appears in the Synonyms table.

### Added
- Species table Genus and Species filters now also match synonym names (syn_genus_name and syn_species_name) returned with each species record.
