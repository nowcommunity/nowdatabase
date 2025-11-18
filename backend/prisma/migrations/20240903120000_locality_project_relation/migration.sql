-- Ensure locality/project links require explicit identifiers and cascade when a project is removed
ALTER TABLE `now_plr`
  DROP FOREIGN KEY `now_plr_ibfk_1`;

ALTER TABLE `now_plr`
  MODIFY `lid` INTEGER NOT NULL,
  MODIFY `pid` INTEGER NOT NULL;

ALTER TABLE `now_plr`
  ADD CONSTRAINT `now_plr_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `now_proj`(`pid`) ON DELETE CASCADE ON UPDATE NO ACTION;
