# Changelog

## Unreleased
### Changed
- Repositioned table row action icons to the right edge, tightened spacing, and added aria labels so Locality, Species, and related tables reclaim horizontal room while keeping tooltips and restriction markers accessible.
- Species detail Locality-Species tab now renders MW Score as a computed, read-only display field based on mw_scale_min, mw_scale_max, and mw_value instead of a placeholder value.

### Fixed
- Resolved Update log detail navigation so Return buttons honor the originating table using the new shared return-navigation helper.
- Restored Locality edit view synonym creation so saving a valid synonym immediately appears in the Synonyms table.
- Locality Age tab now preserves age-entry drafts per dating method (`time_unit`, `absolute`, `composite`) so switching methods no longer clears previously entered min/max age and basis values.
- Locality age validation now enforces required age-basis rules against the active dating method while tolerating preserved values from non-active methods.

### Added
- Species table Genus and Species filters now also match synonym names (syn_genus_name and syn_species_name) returned with each species record.
