/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: now_test
-- ------------------------------------------------------
-- Server version	11.4.3-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `com_family_synonym`
--

DROP TABLE IF EXISTS `com_family_synonym`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_family_synonym` (
  `syn_family_name` varchar(30) NOT NULL DEFAULT '',
  `family_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`syn_family_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_family_synonym`
--

LOCK TABLES `com_family_synonym` WRITE;
/*!40000 ALTER TABLE `com_family_synonym` DISABLE KEYS */;
/*!40000 ALTER TABLE `com_family_synonym` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_genus_synonym`
--

DROP TABLE IF EXISTS `com_genus_synonym`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_genus_synonym` (
  `syn_genus_name` varchar(30) NOT NULL DEFAULT '',
  `genus_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`syn_genus_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_genus_synonym`
--

LOCK TABLES `com_genus_synonym` WRITE;
/*!40000 ALTER TABLE `com_genus_synonym` DISABLE KEYS */;
/*!40000 ALTER TABLE `com_genus_synonym` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_main`
--

DROP TABLE IF EXISTS `com_main`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_main` (
  `one` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`one`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_main`
--

LOCK TABLES `com_main` WRITE;
/*!40000 ALTER TABLE `com_main` DISABLE KEYS */;
INSERT INTO `com_main` VALUES
(1);
/*!40000 ALTER TABLE `com_main` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_mlist`
--

DROP TABLE IF EXISTS `com_mlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_mlist` (
  `museum` varchar(10) NOT NULL DEFAULT '',
  `institution` varchar(120) NOT NULL DEFAULT '',
  `alt_int_name` varchar(120) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state_code` varchar(5) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `used_morph` tinyint(1) DEFAULT NULL,
  `used_now` tinyint(1) DEFAULT NULL,
  `used_gene` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`museum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_mlist`
--

LOCK TABLES `com_mlist` WRITE;
/*!40000 ALTER TABLE `com_mlist` DISABLE KEYS */;
INSERT INTO `com_mlist` VALUES
('IPMC','Institut CatalÃ  de Paleontologia Miquel Crusafont','','Sabadell','','Catalonia','Spain',NULL,1,NULL),
('ISEZ','Institute of Systematics and Evolution of Animals, Polish Academy of Sciences','Instytut Systematyki i Ewolucji Zwierzat, Polska Akademia Nauk','Cracow',NULL,NULL,'Poland',NULL,1,NULL),
('RGM','Naturalis: National Museum of Natural History','Nationaal Natuurhistorisch Museum, former Rijksmuseum van Geologie en Mineralogie','Leiden','','','Netherlands',NULL,1,NULL);
/*!40000 ALTER TABLE `com_mlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_order_synonym`
--

DROP TABLE IF EXISTS `com_order_synonym`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_order_synonym` (
  `syn_order_name` varchar(30) NOT NULL DEFAULT '',
  `order_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`syn_order_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_order_synonym`
--

LOCK TABLES `com_order_synonym` WRITE;
/*!40000 ALTER TABLE `com_order_synonym` DISABLE KEYS */;
/*!40000 ALTER TABLE `com_order_synonym` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_people`
--

DROP TABLE IF EXISTS `com_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_people` (
  `initials` varchar(10) NOT NULL DEFAULT '',
  `first_name` varchar(50) DEFAULT NULL,
  `surname` varchar(80) NOT NULL DEFAULT '',
  `full_name` varchar(80) NOT NULL DEFAULT '',
  `format` varchar(1) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `organization` varchar(80) DEFAULT NULL,
  `country` varchar(80) DEFAULT NULL,
  `password_set` date DEFAULT NULL,
  `used_morph` tinyint(1) DEFAULT NULL,
  `used_now` tinyint(1) DEFAULT NULL,
  `used_gene` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`initials`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_people`
--

LOCK TABLES `com_people` WRITE;
/*!40000 ALTER TABLE `com_people` DISABLE KEYS */;
INSERT INTO `com_people` VALUES
('AD','adf','ads','adf ads',NULL,'email',156,'organization','Finland','2024-05-22',NULL,1,NULL),
('CO','cfn','csn','cfn csn',NULL,'email',162,'organization','Finland','2024-05-27',NULL,1,NULL),
('ER','erf','ers','erf ers',NULL,'email',158,'organization','Finland','2024-05-22',NULL,1,NULL),
('EU','euf','eus','euf eus',NULL,'email',157,'organization','Finland','2024-05-22',NULL,1,NULL),
('NS','nsf','nss','nsf nss',NULL,'email',NULL,'organization','Finland',NULL,NULL,1,NULL),
('OF','off','ofs','off ofs',NULL,'email',159,'organization','Finland','2024-05-22',NULL,1,NULL),
('PR','prf','prs','prf prs',NULL,'email',160,'organization','Finland','2024-05-22',NULL,1,NULL),
('RD','rdf','rds','rdf rds',NULL,'email',161,'organization','Finland','2024-05-22',NULL,1,NULL),
('TEST-ER',NULL,'','',NULL,NULL,165,NULL,NULL,NULL,NULL,NULL,NULL),
('TEST-EU',NULL,'','',NULL,NULL,164,NULL,NULL,NULL,NULL,NULL,NULL),
('TEST-NO',NULL,'','',NULL,NULL,166,NULL,NULL,NULL,NULL,NULL,NULL),
('TEST-PL',NULL,'','',NULL,NULL,167,NULL,NULL,NULL,NULL,NULL,NULL),
('TEST-SU',NULL,'','',NULL,NULL,163,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `com_people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_species`
--

DROP TABLE IF EXISTS `com_species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_species` (
  `species_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(30) NOT NULL DEFAULT '',
  `order_name` varchar(30) NOT NULL DEFAULT '',
  `family_name` varchar(30) NOT NULL DEFAULT '',
  `subclass_or_superorder_name` varchar(30) DEFAULT '',
  `suborder_or_superfamily_name` varchar(30) DEFAULT '',
  `subfamily_name` varchar(30) DEFAULT '',
  `genus_name` varchar(30) NOT NULL DEFAULT '',
  `species_name` varchar(30) NOT NULL DEFAULT '',
  `unique_identifier` varchar(50) NOT NULL DEFAULT '',
  `taxonomic_status` varchar(50) DEFAULT NULL,
  `common_name` varchar(50) DEFAULT NULL,
  `sp_author` varchar(50) DEFAULT NULL,
  `strain` varchar(50) DEFAULT NULL,
  `gene` varchar(30) DEFAULT NULL,
  `taxon_status` varchar(10) DEFAULT NULL,
  `diet1` varchar(1) DEFAULT NULL,
  `diet2` varchar(9) DEFAULT NULL,
  `diet3` varchar(10) DEFAULT NULL,
  `diet_description` varchar(255) DEFAULT NULL,
  `rel_fib` varchar(1) DEFAULT NULL,
  `selectivity` varchar(1) DEFAULT NULL,
  `digestion` varchar(2) DEFAULT NULL,
  `feedinghab1` varchar(2) DEFAULT NULL,
  `feedinghab2` varchar(8) DEFAULT NULL,
  `shelterhab1` varchar(2) DEFAULT NULL,
  `shelterhab2` varchar(8) DEFAULT NULL,
  `locomo1` varchar(2) DEFAULT NULL,
  `locomo2` varchar(15) DEFAULT NULL,
  `locomo3` varchar(15) DEFAULT NULL,
  `hunt_forage` varchar(8) DEFAULT NULL,
  `body_mass` bigint(20) DEFAULT NULL,
  `brain_mass` int(11) DEFAULT NULL,
  `sv_length` varchar(7) DEFAULT NULL,
  `activity` varchar(1) DEFAULT NULL,
  `sd_size` varchar(1) DEFAULT NULL,
  `sd_display` varchar(1) DEFAULT NULL,
  `tshm` varchar(3) DEFAULT NULL,
  `symph_mob` varchar(1) DEFAULT NULL,
  `relative_blade_length` double DEFAULT NULL,
  `tht` varchar(3) DEFAULT NULL,
  `crowntype` varchar(6) DEFAULT NULL,
  `microwear` varchar(7) DEFAULT NULL,
  `horizodonty` char(3) DEFAULT NULL,
  `cusp_shape` char(1) DEFAULT NULL,
  `cusp_count_buccal` char(1) DEFAULT NULL,
  `cusp_count_lingual` char(1) DEFAULT NULL,
  `loph_count_lon` char(1) DEFAULT NULL,
  `loph_count_trs` char(1) DEFAULT NULL,
  `fct_al` char(1) DEFAULT NULL,
  `fct_ol` char(1) DEFAULT NULL,
  `fct_sf` char(1) DEFAULT NULL,
  `fct_ot` char(1) DEFAULT NULL,
  `fct_cm` char(1) DEFAULT NULL,
  `mesowear` char(3) DEFAULT NULL,
  `mw_or_high` int(11) DEFAULT NULL,
  `mw_or_low` int(11) DEFAULT NULL,
  `mw_cs_sharp` int(11) DEFAULT NULL,
  `mw_cs_round` int(11) DEFAULT NULL,
  `mw_cs_blunt` int(11) DEFAULT NULL,
  `mw_scale_min` int(11) DEFAULT NULL,
  `mw_scale_max` int(11) DEFAULT NULL,
  `mw_value` int(11) DEFAULT NULL,
  `pop_struc` varchar(3) DEFAULT NULL,
  `sp_status` tinyint(1) DEFAULT NULL,
  `used_morph` tinyint(1) DEFAULT NULL,
  `used_now` tinyint(1) DEFAULT NULL,
  `used_gene` tinyint(1) DEFAULT NULL,
  `sp_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`species_id`)
) ENGINE=InnoDB AUTO_INCREMENT=86515 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_species`
--

LOCK TABLES `com_species` WRITE;
/*!40000 ALTER TABLE `com_species` DISABLE KEYS */;
INSERT INTO `com_species` VALUES
(21052,'Mammalia','Rodentia','Gliridae','Eutheria',NULL,'','Simplomys','simplicidens','-',NULL,NULL,NULL,NULL,NULL,NULL,'p','herbivore',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL),
(21426,'Mammalia','Eulipotyphla','Soricidae','Eutheria',NULL,'','Amblycoptus','indet.','-',NULL,NULL,NULL,NULL,NULL,NULL,'a',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1238,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL),
(23065,'Mammalia','Eulipotyphla','Soricidae','Eutheria',NULL,'Soricinae','Petenyia','dubia','-',NULL,NULL,'Bachmayer & Wilson, 1970',NULL,NULL,NULL,'a',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL),
(25009,'Mammalia','Rodentia','Gliridae','Eutheria',NULL,'','Microdyromys','legidensis','legidensis-koenigswaldi',NULL,NULL,NULL,NULL,NULL,NULL,'o','omnivore',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL),
(84357,'Mammalia','Carnivora','Odobenidae','Eutheria','Pinnipedia',NULL,'Prototaria','planicephala','-',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,1,0,NULL),
(85729,'Mammalia','Artiodactyla','Bovidae','Eutheria','','','Gallogoral','meneghinii','sickenbergii',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,1,0,NULL),
(85730,'Mammalia','Artiodactyla','Bovidae','Eutheria','','','Pontoceros','surprine','-',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,1,0,NULL);
/*!40000 ALTER TABLE `com_species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_subfamily_synonym`
--

DROP TABLE IF EXISTS `com_subfamily_synonym`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_subfamily_synonym` (
  `syn_subfamily_name` varchar(30) NOT NULL DEFAULT '',
  `subfamily_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`syn_subfamily_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_subfamily_synonym`
--

LOCK TABLES `com_subfamily_synonym` WRITE;
/*!40000 ALTER TABLE `com_subfamily_synonym` DISABLE KEYS */;
/*!40000 ALTER TABLE `com_subfamily_synonym` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_taxa_synonym`
--

DROP TABLE IF EXISTS `com_taxa_synonym`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_taxa_synonym` (
  `synonym_id` int(11) NOT NULL AUTO_INCREMENT,
  `species_id` int(11) NOT NULL DEFAULT 0,
  `syn_genus_name` varchar(30) DEFAULT NULL,
  `syn_species_name` varchar(30) DEFAULT NULL,
  `syn_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`synonym_id`),
  KEY `com_taxa_synonym_FKIndex1` (`species_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1157 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_taxa_synonym`
--

LOCK TABLES `com_taxa_synonym` WRITE;
/*!40000 ALTER TABLE `com_taxa_synonym` DISABLE KEYS */;
INSERT INTO `com_taxa_synonym` VALUES
(147,21052,'Pseudodryomys','simplicidens',NULL);
/*!40000 ALTER TABLE `com_taxa_synonym` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `com_users`
--

DROP TABLE IF EXISTS `com_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `com_users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `newpassword` varchar(100) DEFAULT NULL,
  `last_login` date DEFAULT NULL,
  `now_user_group` varchar(30) DEFAULT NULL,
  `mor_user_group` varchar(30) DEFAULT NULL,
  `gen_user_group` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_users`
--

LOCK TABLES `com_users` WRITE;
/*!40000 ALTER TABLE `com_users` DISABLE KEYS */;
INSERT INTO `com_users` VALUES
(156,'admin',NULL,'0cc175b9c0f1b6a831c399e269772661','2024-05-30','su',NULL,NULL),
(157,'editu',NULL,'0cc175b9c0f1b6a831c399e269772661','2024-05-23','eu',NULL,NULL),
(158,'editr',NULL,'0cc175b9c0f1b6a831c399e269772661','2024-05-27','er',NULL,NULL),
(159,'office',NULL,'0cc175b9c0f1b6a831c399e269772661','2024-05-23','no',NULL,NULL),
(160,'project',NULL,'0cc175b9c0f1b6a831c399e269772661','2024-05-27','pl',NULL,NULL),
(161,'read',NULL,'0cc175b9c0f1b6a831c399e269772661','2024-05-23','ro',NULL,NULL),
(162,'coord',NULL,'0cc175b9c0f1b6a831c399e269772661','2024-05-27','su',NULL,NULL),
(163,'testSu',NULL,'$2b$10$JGpnCPk9ONMuE3MNLjO8ce7kRElCyq1hdVgteYZlCCczq5kkKiVVG',NULL,'su',NULL,NULL),
(164,'testEu',NULL,'$2b$10$JGpnCPk9ONMuE3MNLjO8ce7kRElCyq1hdVgteYZlCCczq5kkKiVVG',NULL,'eu',NULL,NULL),
(165,'testEr',NULL,'$2b$10$JGpnCPk9ONMuE3MNLjO8ce7kRElCyq1hdVgteYZlCCczq5kkKiVVG',NULL,'er',NULL,NULL),
(166,'testNo',NULL,'$2b$10$JGpnCPk9ONMuE3MNLjO8ce7kRElCyq1hdVgteYZlCCczq5kkKiVVG',NULL,'no',NULL,NULL),
(167,'testPl',NULL,'$2b$10$JGpnCPk9ONMuE3MNLjO8ce7kRElCyq1hdVgteYZlCCczq5kkKiVVG',NULL,'pl',NULL,NULL);
/*!40000 ALTER TABLE `com_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_bau`
--

DROP TABLE IF EXISTS `now_bau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_bau` (
  `buid` int(11) NOT NULL AUTO_INCREMENT,
  `bau_coordinator` varchar(10) NOT NULL DEFAULT '',
  `bau_authorizer` varchar(10) NOT NULL DEFAULT '',
  `bid` int(11) NOT NULL,
  `bau_date` date DEFAULT NULL,
  `bau_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`buid`),
  KEY `now_test_bau_FKIndex1` (`bid`),
  KEY `now_test_bau_FKIndex2` (`bau_coordinator`),
  KEY `now_test_bau_FKIndex3` (`bau_authorizer`),
  CONSTRAINT `now_bau_ibfk_1` FOREIGN KEY (`bid`) REFERENCES `now_tu_bound` (`bid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_bau_ibfk_2` FOREIGN KEY (`bau_coordinator`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_bau_ibfk_3` FOREIGN KEY (`bau_authorizer`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=545 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_bau`
--

LOCK TABLES `now_bau` WRITE;
/*!40000 ALTER TABLE `now_bau` DISABLE KEYS */;
INSERT INTO `now_bau` VALUES
(4,'CO','AD',11,'2019-12-24',''),
(5,'CO','AD',14,'2019-12-24',''),
(6,'CO','AD',11,'2019-12-24',''),
(7,'CO','AD',11,'2019-12-24',''),
(193,'CO','AD',20213,'2020-01-29',''),
(194,'CO','AD',20214,'2020-01-29',''),
(195,'CO','AD',20214,'2020-01-29',''),
(197,'CO','AD',65,'2020-01-29',''),
(198,'CO','AD',20213,'2020-01-29',''),
(199,'CO','AD',65,'2020-01-29',''),
(403,'CO','AD',49,'2020-05-08',''),
(404,'CO','AD',50,'2020-05-08','');
/*!40000 ALTER TABLE `now_bau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_br`
--

DROP TABLE IF EXISTS `now_br`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_br` (
  `buid` int(11) NOT NULL DEFAULT 0,
  `rid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`buid`,`rid`),
  KEY `now_test_tr_FKIndex1` (`buid`),
  KEY `now_test_tr_FKIndex2` (`rid`),
  CONSTRAINT `now_br_ibfk_1` FOREIGN KEY (`buid`) REFERENCES `now_bau` (`buid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_br_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `ref_ref` (`rid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_br`
--

LOCK TABLES `now_br` WRITE;
/*!40000 ALTER TABLE `now_br` DISABLE KEYS */;
INSERT INTO `now_br` VALUES
(4,10039),
(5,10039),
(6,10039),
(7,10039),
(193,10039),
(193,24151),
(194,10039),
(194,24151),
(195,10039),
(197,10039),
(198,10039),
(199,10039),
(403,10039),
(404,10039);
/*!40000 ALTER TABLE `now_br` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_coll_meth`
--

DROP TABLE IF EXISTS `now_coll_meth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_coll_meth` (
  `lid` int(11) NOT NULL DEFAULT 0,
  `coll_meth` varchar(21) NOT NULL,
  PRIMARY KEY (`lid`,`coll_meth`),
  KEY `now_test_coll_meth_FKIndex1` (`lid`),
  CONSTRAINT `now_coll_meth_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `now_loc` (`lid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_coll_meth`
--

LOCK TABLES `now_coll_meth` WRITE;
/*!40000 ALTER TABLE `now_coll_meth` DISABLE KEYS */;
INSERT INTO `now_coll_meth` VALUES
(20920,'surface'),
(20920,'systematic_loc_survey'),
(21050,'wet_screen');
/*!40000 ALTER TABLE `now_coll_meth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_coll_meth_values`
--

DROP TABLE IF EXISTS `now_coll_meth_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_coll_meth_values` (
  `coll_meth_value` varchar(21) NOT NULL,
  PRIMARY KEY (`coll_meth_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_coll_meth_values`
--

LOCK TABLES `now_coll_meth_values` WRITE;
/*!40000 ALTER TABLE `now_coll_meth_values` DISABLE KEYS */;
INSERT INTO `now_coll_meth_values` VALUES
('surface'),
('systematic_loc_survey'),
('wet_screen');
/*!40000 ALTER TABLE `now_coll_meth_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_lau`
--

DROP TABLE IF EXISTS `now_lau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_lau` (
  `luid` int(11) NOT NULL AUTO_INCREMENT,
  `lau_coordinator` varchar(10) NOT NULL DEFAULT '',
  `lau_authorizer` varchar(10) NOT NULL DEFAULT '',
  `lid` int(11) NOT NULL DEFAULT 0,
  `lau_date` date DEFAULT NULL,
  `lau_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`luid`),
  KEY `now_test_lau_FKIndex1` (`lid`),
  KEY `now_test_lau_FKIndex2` (`lau_coordinator`),
  KEY `now_test_lau_FKIndex3` (`lau_authorizer`),
  CONSTRAINT `now_lau_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `now_loc` (`lid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_lau_ibfk_2` FOREIGN KEY (`lau_coordinator`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_lau_ibfk_3` FOREIGN KEY (`lau_authorizer`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=98524 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_lau`
--

LOCK TABLES `now_lau` WRITE;
/*!40000 ALTER TABLE `now_lau` DISABLE KEYS */;
INSERT INTO `now_lau` VALUES
(23101,'CO','EU',21050,'1998-07-12',''),
(32181,'CO','OF',20920,'2005-05-10',''),
(35350,'CO','EU',24750,'2006-10-16',''),
(35536,'CO','EU',24797,'2006-10-25',''),
(62383,'CO','PR',28518,'2016-10-12',''),
(98500,'CO','AD',24797,'2024-05-27',''),
(98521,'CO','AD',24797,'2024-05-27',''),
(98522,'CO','AD',24797,'2024-05-27',''),
(98523,'CO','AD',24750,'2024-05-29','');
/*!40000 ALTER TABLE `now_lau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_loc`
--

DROP TABLE IF EXISTS `now_loc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_loc` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `bfa_max` varchar(30) DEFAULT NULL,
  `bfa_min` varchar(30) DEFAULT NULL,
  `loc_name` varchar(30) NOT NULL DEFAULT '',
  `date_meth` varchar(9) NOT NULL DEFAULT '',
  `max_age` double NOT NULL DEFAULT 0,
  `min_age` double NOT NULL DEFAULT 0,
  `bfa_max_abs` varchar(30) DEFAULT NULL,
  `bfa_min_abs` varchar(30) DEFAULT NULL,
  `frac_max` varchar(9) DEFAULT NULL,
  `frac_min` varchar(9) DEFAULT NULL,
  `chron` varchar(40) DEFAULT NULL,
  `age_comm` varchar(120) DEFAULT NULL,
  `basin` varchar(120) DEFAULT NULL,
  `subbasin` varchar(120) DEFAULT NULL,
  `dms_lat` varchar(14) DEFAULT NULL,
  `dms_long` varchar(14) DEFAULT NULL,
  `dec_lat` double NOT NULL DEFAULT 0,
  `dec_long` double NOT NULL DEFAULT 0,
  `approx_coord` tinyint(1) DEFAULT NULL,
  `altitude` smallint(6) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `county` varchar(20) DEFAULT NULL,
  `site_area` varchar(10) DEFAULT NULL,
  `gen_loc` varchar(1) DEFAULT NULL,
  `plate` varchar(20) DEFAULT NULL,
  `loc_detail` varchar(255) DEFAULT NULL,
  `lgroup` varchar(30) DEFAULT NULL,
  `formation` varchar(30) DEFAULT NULL,
  `member` varchar(30) DEFAULT NULL,
  `bed` varchar(30) DEFAULT NULL,
  `datum_plane` varchar(50) DEFAULT NULL,
  `tos` double DEFAULT NULL,
  `bos` double DEFAULT NULL,
  `rock_type` varchar(15) DEFAULT NULL,
  `rt_adj` varchar(30) DEFAULT NULL,
  `lith_comm` varchar(120) DEFAULT NULL,
  `depo_context1` varchar(10) DEFAULT NULL,
  `depo_context2` varchar(10) DEFAULT NULL,
  `depo_context3` varchar(10) DEFAULT NULL,
  `depo_context4` varchar(10) DEFAULT NULL,
  `depo_comm` varchar(120) DEFAULT NULL,
  `sed_env_1` varchar(13) DEFAULT NULL,
  `sed_env_2` varchar(15) DEFAULT NULL,
  `event_circum` varchar(15) DEFAULT NULL,
  `se_comm` varchar(50) DEFAULT NULL,
  `climate_type` varchar(15) DEFAULT NULL,
  `biome` varchar(15) DEFAULT NULL,
  `v_ht` varchar(4) DEFAULT NULL,
  `v_struct` varchar(9) DEFAULT NULL,
  `v_envi_det` varchar(80) DEFAULT NULL,
  `disturb` varchar(16) DEFAULT NULL,
  `nutrients` varchar(7) DEFAULT NULL,
  `water` varchar(8) DEFAULT NULL,
  `seasonality` varchar(16) DEFAULT NULL,
  `seas_intens` varchar(3) DEFAULT NULL,
  `pri_prod` varchar(4) DEFAULT NULL,
  `moisture` varchar(3) DEFAULT NULL,
  `temperature` varchar(4) DEFAULT NULL,
  `assem_fm` varchar(12) DEFAULT NULL,
  `transport` varchar(15) DEFAULT NULL,
  `trans_mod` varchar(9) DEFAULT NULL,
  `weath_trmp` varchar(9) DEFAULT NULL,
  `pt_conc` varchar(14) DEFAULT NULL,
  `size_type` varchar(5) DEFAULT NULL,
  `vert_pres` varchar(12) DEFAULT NULL,
  `plant_pres` varchar(12) DEFAULT NULL,
  `invert_pres` varchar(12) DEFAULT NULL,
  `time_rep` varchar(9) DEFAULT NULL,
  `appr_num_spm` int(11) DEFAULT NULL,
  `num_spm` int(11) DEFAULT NULL,
  `true_quant` varchar(1) DEFAULT NULL,
  `complete` varchar(1) DEFAULT NULL,
  `num_quad` int(11) DEFAULT NULL,
  `taph_comm` varchar(120) DEFAULT NULL,
  `tax_comm` varchar(255) DEFAULT NULL,
  `loc_status` tinyint(1) DEFAULT NULL,
  `estimate_precip` int(11) DEFAULT NULL,
  `estimate_temp` decimal(4,1) DEFAULT NULL,
  `estimate_npp` int(11) DEFAULT NULL,
  `pers_woody_cover` int(11) DEFAULT NULL,
  `pers_pollen_ap` int(11) DEFAULT NULL,
  `pers_pollen_nap` int(11) DEFAULT NULL,
  `pers_pollen_other` int(11) DEFAULT NULL,
  `hominin_skeletal_remains` tinyint(1) NOT NULL DEFAULT 0,
  `bipedal_footprints` tinyint(1) NOT NULL DEFAULT 0,
  `stone_tool_technology` tinyint(1) NOT NULL DEFAULT 0,
  `stone_tool_cut_marks_on_bones` tinyint(1) NOT NULL DEFAULT 0,
  `technological_mode_1` int(11) DEFAULT NULL,
  `technological_mode_2` int(11) DEFAULT NULL,
  `technological_mode_3` int(11) DEFAULT NULL,
  `cultural_stage_1` varchar(64) DEFAULT NULL,
  `cultural_stage_2` varchar(64) DEFAULT NULL,
  `cultural_stage_3` varchar(64) DEFAULT NULL,
  `regional_culture_1` varchar(64) DEFAULT NULL,
  `regional_culture_2` varchar(64) DEFAULT NULL,
  `regional_culture_3` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`lid`),
  KEY `now_test_loc_FKIndex1` (`bfa_max`),
  KEY `now_test_loc_FKIndex2` (`bfa_min`),
  CONSTRAINT `now_loc_ibfk_1` FOREIGN KEY (`bfa_max`) REFERENCES `now_time_unit` (`tu_name`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_loc_ibfk_2` FOREIGN KEY (`bfa_min`) REFERENCES `now_time_unit` (`tu_name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=50002 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_loc`
--

LOCK TABLES `now_loc` WRITE;
/*!40000 ALTER TABLE `now_loc` DISABLE KEYS */;
INSERT INTO `now_loc` VALUES
(20920,'bahean','bahean','Lantian-Shuijiazui','time_unit',11.63,7.2,NULL,NULL,NULL,NULL,'','','Fenwei','Weihe','34 6 0 N','109 18 0 E',34.1,109.3,NULL,NULL,'China','Shaanxi','Lantian','100-1000m2','y','','','','Bahe','','','',NULL,NULL,'sandstone','','',NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','','','','','','','','','','','','','','','','','',NULL,NULL,'','y',NULL,'',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(21050,NULL,'olduvai','Dmanisi','composite',1.85,1.778,'Ar/Ar',NULL,NULL,NULL,'Villafranchian, MNQ18','before Acheulian: E. hydruntinus, stone tools.1.81 Ma based on volcanic ash dating',NULL,NULL,'41 20 10 N','44 20 38 E',41.336111111111116,44.34388888888889,0,NULL,'Georgia','Tbilisi area','','','n','','elevation 1015m','','','','','',NULL,NULL,'sandstone','','',NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','','','','','','wet','hot','','','','','','','','','','',NULL,NULL,'','',NULL,'',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24750,NULL,NULL,'RomanyÃ  dEmpordÃ ','absolute',7.1,5.3,'Ar/Ar','AAR',NULL,NULL,'Turolian',NULL,'Ebro',NULL,'42 9 58 N','2 39 58 E',42.166,2.666,NULL,NULL,'Spain','Province of Girona',NULL,NULL,NULL,NULL,'EmpordÃ  Basin.Coordinates are for Girona.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24797,'mn5','mn5','Las Umbrias 1','time_unit',16.4,14.2,NULL,NULL,NULL,NULL,'Aragonian, zone Dd','C5Adn','Iberian Range',NULL,'41 11 46 N','1 30 38 W',41.1963254,-1.5106093,NULL,NULL,'Spain','Province of Zaragoza',NULL,NULL,NULL,NULL,'northern Teruel Basin. Coordinates are for Villafeliche',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(28518,'langhian','langhian','Goishi','time_unit',15.97,13.82,NULL,NULL,NULL,NULL,NULL,NULL,'Joban',NULL,'38 12 0 N','140 42 0 E',38.2,140.7,1,NULL,'Japan','Miyagi Prefecture',NULL,NULL,NULL,NULL,NULL,NULL,'Moniwa',NULL,NULL,NULL,NULL,NULL,'sandstone',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(29999,NULL,NULL,'not in cross search','time_unit',15.97,13.82,NULL,NULL,NULL,NULL,NULL,NULL,'Joban',NULL,'38 12 0 N','140 42 0 E',38.2,140.7,1,NULL,'Japan','Miyagi Prefecture',NULL,NULL,NULL,NULL,NULL,NULL,'Moniwa',NULL,NULL,NULL,NULL,NULL,'sandstone',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(49999,NULL,NULL,'draftLocality','',3,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(50001,NULL,NULL,'draftLocalityWithProject','',3,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `now_loc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_lr`
--

DROP TABLE IF EXISTS `now_lr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_lr` (
  `luid` int(11) NOT NULL DEFAULT 0,
  `rid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`luid`,`rid`),
  KEY `now_test_lr_FKIndex1` (`luid`),
  KEY `now_test_lr_FKIndex2` (`rid`),
  CONSTRAINT `now_lr_ibfk_1` FOREIGN KEY (`luid`) REFERENCES `now_lau` (`luid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_lr_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `ref_ref` (`rid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_lr`
--

LOCK TABLES `now_lr` WRITE;
/*!40000 ALTER TABLE `now_lr` DISABLE KEYS */;
INSERT INTO `now_lr` VALUES
(23101,10039),
(35350,10039),
(35350,24151),
(35536,10039),
(35536,24151),
(62383,10039),
(98500,24188),
(98521,10039),
(98522,10039),
(98523,24151);
/*!40000 ALTER TABLE `now_lr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_ls`
--

DROP TABLE IF EXISTS `now_ls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_ls` (
  `lid` int(11) NOT NULL DEFAULT 0,
  `species_id` int(11) NOT NULL DEFAULT 0,
  `nis` int(11) DEFAULT NULL,
  `pct` double DEFAULT NULL,
  `quad` int(11) DEFAULT NULL,
  `mni` int(11) DEFAULT NULL,
  `qua` varchar(1) DEFAULT NULL,
  `id_status` varchar(20) DEFAULT NULL,
  `orig_entry` varchar(120) DEFAULT NULL,
  `source_name` varchar(120) DEFAULT NULL,
  `body_mass` bigint(20) DEFAULT NULL,
  `mesowear` char(3) DEFAULT NULL,
  `mw_or_high` int(11) DEFAULT NULL,
  `mw_or_low` int(11) DEFAULT NULL,
  `mw_cs_sharp` int(11) DEFAULT NULL,
  `mw_cs_round` int(11) DEFAULT NULL,
  `mw_cs_blunt` int(11) DEFAULT NULL,
  `mw_scale_min` int(11) DEFAULT NULL,
  `mw_scale_max` int(11) DEFAULT NULL,
  `mw_value` int(11) DEFAULT NULL,
  `microwear` varchar(7) DEFAULT NULL,
  `dc13_mean` double DEFAULT NULL,
  `dc13_n` int(11) DEFAULT NULL,
  `dc13_max` double DEFAULT NULL,
  `dc13_min` double DEFAULT NULL,
  `dc13_stdev` double DEFAULT NULL,
  `do18_mean` double DEFAULT NULL,
  `do18_n` int(11) DEFAULT NULL,
  `do18_max` double DEFAULT NULL,
  `do18_min` double DEFAULT NULL,
  `do18_stdev` double DEFAULT NULL,
  PRIMARY KEY (`lid`,`species_id`),
  KEY `now_test_ls_FKIndex1` (`species_id`),
  KEY `now_test_ls_FKIndex2` (`lid`),
  CONSTRAINT `now_ls_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `com_species` (`species_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_ls_ibfk_2` FOREIGN KEY (`lid`) REFERENCES `now_loc` (`lid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_ls`
--

LOCK TABLES `now_ls` WRITE;
/*!40000 ALTER TABLE `now_ls` DISABLE KEYS */;
INSERT INTO `now_ls` VALUES
(21050,85729,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(21050,85730,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(21050,21426,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(21050,23065,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(21050,84357,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24750,85729,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24750,85730,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24750,21426,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24750,23065,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24750,84357,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24797,85729,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24797,85730,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24797,21426,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24797,23065,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(24797,84357,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(28518,85729,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(28518,85730,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(28518,21426,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(28518,23065,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(28518,84357,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(50001,84357,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(49999,23065,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `now_ls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_mus`
--

DROP TABLE IF EXISTS `now_mus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_mus` (
  `lid` int(11) NOT NULL DEFAULT 0,
  `museum` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`lid`,`museum`),
  KEY `now_test_mus_FKIndex1` (`lid`),
  KEY `now_test_mus_FKIndex2` (`museum`),
  CONSTRAINT `now_mus_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `now_loc` (`lid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_mus_ibfk_2` FOREIGN KEY (`museum`) REFERENCES `com_mlist` (`museum`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_mus`
--

LOCK TABLES `now_mus` WRITE;
/*!40000 ALTER TABLE `now_mus` DISABLE KEYS */;
INSERT INTO `now_mus` VALUES
(20920,'RGM'),
(24750,'IPMC'),
(24750,'ISEZ');
/*!40000 ALTER TABLE `now_mus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_plr`
--

DROP TABLE IF EXISTS `now_plr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_plr` (
  `lid` int(11) NOT NULL DEFAULT 0,
  `pid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`lid`,`pid`),
  KEY `now_test_plr_FKIndex1` (`pid`),
  KEY `now_test_plr_FKIndex2` (`lid`),
  CONSTRAINT `now_plr_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `now_proj` (`pid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_plr_ibfk_2` FOREIGN KEY (`lid`) REFERENCES `now_loc` (`lid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_plr`
--

LOCK TABLES `now_plr` WRITE;
/*!40000 ALTER TABLE `now_plr` DISABLE KEYS */;
INSERT INTO `now_plr` VALUES
(20920,3),
(24750,3),
(24797,3),
(24750,14),
(24797,14),
(28518,23),
(50001,35);
/*!40000 ALTER TABLE `now_plr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_proj`
--

DROP TABLE IF EXISTS `now_proj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_proj` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `contact` varchar(10) NOT NULL DEFAULT '',
  `proj_code` varchar(10) DEFAULT NULL,
  `proj_name` varchar(80) DEFAULT NULL,
  `proj_status` varchar(10) DEFAULT NULL,
  `proj_records` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`pid`),
  KEY `now_test_proj_FKIndex1` (`contact`),
  CONSTRAINT `now_proj_ibfk_1` FOREIGN KEY (`contact`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_proj`
--

LOCK TABLES `now_proj` WRITE;
/*!40000 ALTER TABLE `now_proj` DISABLE KEYS */;
INSERT INTO `now_proj` VALUES
(3,'AD','NOW','NOW Database','current',0),
(14,'AD','WINE','Workgroup on Insectivores of the Neogene of Eurasia','current',1),
(23,'EU','SEAL','Seal evolution and localities','current',0),
(35,'TEST-PL',NULL,'Test Project',NULL,NULL),
(36,'TEST-PL',NULL,'Test Project 2',NULL,NULL);
/*!40000 ALTER TABLE `now_proj` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_proj_people`
--

DROP TABLE IF EXISTS `now_proj_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_proj_people` (
  `pid` int(11) NOT NULL,
  `initials` varchar(10) NOT NULL,
  PRIMARY KEY (`pid`,`initials`),
  KEY `now_test_proj_people_FKIndex1` (`pid`),
  KEY `now_test_proj_people_FKIndex2` (`initials`),
  CONSTRAINT `now_proj_people_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `now_proj` (`pid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_proj_people_ibfk_2` FOREIGN KEY (`initials`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_proj_people`
--

LOCK TABLES `now_proj_people` WRITE;
/*!40000 ALTER TABLE `now_proj_people` DISABLE KEYS */;
INSERT INTO `now_proj_people` VALUES
(3,'ER'),
(14,'ER'),
(35,'TEST-PL'),
(36,'TEST-PL');
/*!40000 ALTER TABLE `now_proj_people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_psr`
--

DROP TABLE IF EXISTS `now_psr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_psr` (
  `pid` int(11) NOT NULL DEFAULT 0,
  `species_id` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`pid`,`species_id`),
  KEY `now_test_psr_FKIndex1` (`pid`),
  KEY `now_test_psr_FKIndex2` (`species_id`),
  CONSTRAINT `now_psr_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `now_proj` (`pid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_psr_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `com_species` (`species_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_psr`
--

LOCK TABLES `now_psr` WRITE;
/*!40000 ALTER TABLE `now_psr` DISABLE KEYS */;
/*!40000 ALTER TABLE `now_psr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_reg_coord`
--

DROP TABLE IF EXISTS `now_reg_coord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_reg_coord` (
  `reg_coord_id` int(11) NOT NULL AUTO_INCREMENT,
  `region` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`reg_coord_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_reg_coord`
--

LOCK TABLES `now_reg_coord` WRITE;
/*!40000 ALTER TABLE `now_reg_coord` DISABLE KEYS */;
INSERT INTO `now_reg_coord` VALUES
(1,'region 4452477e'),
(2,'region 44524b6e');
/*!40000 ALTER TABLE `now_reg_coord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_reg_coord_country`
--

DROP TABLE IF EXISTS `now_reg_coord_country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_reg_coord_country` (
  `reg_coord_id` int(11) NOT NULL DEFAULT 0,
  `country` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`reg_coord_id`,`country`),
  KEY `now_test_reg_coord_country_FKIndex1` (`reg_coord_id`),
  CONSTRAINT `now_reg_coord_country_ibfk_1` FOREIGN KEY (`reg_coord_id`) REFERENCES `now_reg_coord` (`reg_coord_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_reg_coord_country`
--

LOCK TABLES `now_reg_coord_country` WRITE;
/*!40000 ALTER TABLE `now_reg_coord_country` DISABLE KEYS */;
INSERT INTO `now_reg_coord_country` VALUES
(1,'France'),
(1,'Spain'),
(2,'Austria'),
(2,'Germany'),
(2,'Slovakia'),
(2,'Switzerland');
/*!40000 ALTER TABLE `now_reg_coord_country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_reg_coord_people`
--

DROP TABLE IF EXISTS `now_reg_coord_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_reg_coord_people` (
  `reg_coord_id` int(11) NOT NULL DEFAULT 0,
  `initials` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`reg_coord_id`,`initials`),
  KEY `now_test_reg_coord_people_FKIndex1` (`reg_coord_id`),
  KEY `now_test_reg_coord_people_FKIndex2` (`initials`),
  CONSTRAINT `now_reg_coord_people_ibfk_1` FOREIGN KEY (`reg_coord_id`) REFERENCES `now_reg_coord` (`reg_coord_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_reg_coord_people_ibfk_2` FOREIGN KEY (`initials`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_reg_coord_people`
--

LOCK TABLES `now_reg_coord_people` WRITE;
/*!40000 ALTER TABLE `now_reg_coord_people` DISABLE KEYS */;
INSERT INTO `now_reg_coord_people` VALUES
(1,'PR'),
(2,'ER');
/*!40000 ALTER TABLE `now_reg_coord_people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_regional_culture`
--

DROP TABLE IF EXISTS `now_regional_culture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_regional_culture` (
  `regional_culture_id` varchar(50) NOT NULL DEFAULT '',
  `regional_culture_name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`regional_culture_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_regional_culture`
--

LOCK TABLES `now_regional_culture` WRITE;
/*!40000 ALTER TABLE `now_regional_culture` DISABLE KEYS */;
INSERT INTO `now_regional_culture` VALUES
('acheulean','Acheulean'),
('aterian','Aterian'),
('aurignac','Aurignac'),
('early_acheulean','Early Acheulean'),
('large_flake_acheulean','Large Flake Acheulean'),
('lct_acheulean','LCT Acheulean'),
('levantine_acheulean','Levantine Acheulean'),
('mousterian','Mousterian'),
('oldowan','Oldowan'),
('stillbay','Stillbay'),
('tabun_b','Tabun B');
/*!40000 ALTER TABLE `now_regional_culture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_sau`
--

DROP TABLE IF EXISTS `now_sau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_sau` (
  `suid` int(11) NOT NULL AUTO_INCREMENT,
  `sau_coordinator` varchar(10) NOT NULL DEFAULT '',
  `sau_authorizer` varchar(10) NOT NULL DEFAULT '',
  `species_id` int(11) NOT NULL DEFAULT 0,
  `sau_date` date DEFAULT NULL,
  `sau_comment` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`suid`),
  KEY `now_test_sau_FKIndex1` (`species_id`),
  KEY `now_test_sau_FKIndex2` (`sau_coordinator`),
  KEY `now_test_sau_FKIndex3` (`sau_authorizer`),
  CONSTRAINT `now_sau_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `com_species` (`species_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_sau_ibfk_2` FOREIGN KEY (`sau_coordinator`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_sau_ibfk_3` FOREIGN KEY (`sau_authorizer`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=129168 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sau`
--

LOCK TABLES `now_sau` WRITE;
/*!40000 ALTER TABLE `now_sau` DISABLE KEYS */;
INSERT INTO `now_sau` VALUES
(24260,'CO','OF',25009,'2005-05-10',''),
(98809,'CO','PR',84357,'2016-10-12',''),
(118820,'CO','AD',85729,'2022-02-08',''),
(118821,'CO','AD',85730,'2022-02-08',''),
(129165,'CO','AD',25009,'2024-05-27',''),
(129167,'CO','AD',21426,'2024-05-30','');
/*!40000 ALTER TABLE `now_sau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_sp_coord`
--

DROP TABLE IF EXISTS `now_sp_coord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_sp_coord` (
  `sp_coord_id` int(11) NOT NULL AUTO_INCREMENT,
  `tax_group` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`sp_coord_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sp_coord`
--

LOCK TABLES `now_sp_coord` WRITE;
/*!40000 ALTER TABLE `now_sp_coord` DISABLE KEYS */;
INSERT INTO `now_sp_coord` VALUES
(6,'group bb181567'),
(7,'group bb181839');
/*!40000 ALTER TABLE `now_sp_coord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_sp_coord_people`
--

DROP TABLE IF EXISTS `now_sp_coord_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_sp_coord_people` (
  `sp_coord_id` int(11) NOT NULL DEFAULT 0,
  `initials` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`sp_coord_id`,`initials`),
  KEY `now_test_sp_coord_people_FKIndex1` (`sp_coord_id`),
  KEY `now_test_sp_coord_people_FKIndex2` (`initials`),
  CONSTRAINT `now_sp_coord_people_ibfk_1` FOREIGN KEY (`sp_coord_id`) REFERENCES `now_sp_coord` (`sp_coord_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_sp_coord_people_ibfk_2` FOREIGN KEY (`initials`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sp_coord_people`
--

LOCK TABLES `now_sp_coord_people` WRITE;
/*!40000 ALTER TABLE `now_sp_coord_people` DISABLE KEYS */;
INSERT INTO `now_sp_coord_people` VALUES
(6,'OF'),
(7,'ER'),
(7,'OF');
/*!40000 ALTER TABLE `now_sp_coord_people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_sp_coord_taxa`
--

DROP TABLE IF EXISTS `now_sp_coord_taxa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_sp_coord_taxa` (
  `sp_coord_id` int(11) NOT NULL DEFAULT 0,
  `order_name` varchar(30) NOT NULL DEFAULT '',
  `family_name` varchar(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`sp_coord_id`,`order_name`,`family_name`),
  KEY `now_test_sp_coord_taxa_FKIndex1` (`sp_coord_id`),
  CONSTRAINT `now_sp_coord_taxa_ibfk_1` FOREIGN KEY (`sp_coord_id`) REFERENCES `now_sp_coord` (`sp_coord_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sp_coord_taxa`
--

LOCK TABLES `now_sp_coord_taxa` WRITE;
/*!40000 ALTER TABLE `now_sp_coord_taxa` DISABLE KEYS */;
INSERT INTO `now_sp_coord_taxa` VALUES
(6,'Primates','Cercopithecidae'),
(7,'Carnivora','Felidae');
/*!40000 ALTER TABLE `now_sp_coord_taxa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_sr`
--

DROP TABLE IF EXISTS `now_sr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_sr` (
  `suid` int(11) NOT NULL DEFAULT 0,
  `rid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`suid`,`rid`),
  KEY `now_test_sr_FKIndex1` (`suid`),
  KEY `now_test_sr_FKIndex2` (`rid`),
  CONSTRAINT `now_sr_ibfk_1` FOREIGN KEY (`suid`) REFERENCES `now_sau` (`suid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_sr_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `ref_ref` (`rid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sr`
--

LOCK TABLES `now_sr` WRITE;
/*!40000 ALTER TABLE `now_sr` DISABLE KEYS */;
INSERT INTO `now_sr` VALUES
(98809,10039),
(118820,10039),
(118821,10039),
(129167,24188);
/*!40000 ALTER TABLE `now_sr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_ss`
--

DROP TABLE IF EXISTS `now_ss`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_ss` (
  `lid` int(11) NOT NULL DEFAULT 0,
  `sed_struct` varchar(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`lid`,`sed_struct`),
  KEY `now_test_ss_FKIndex1` (`lid`),
  CONSTRAINT `now_ss_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `now_loc` (`lid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_ss`
--

LOCK TABLES `now_ss` WRITE;
/*!40000 ALTER TABLE `now_ss` DISABLE KEYS */;
INSERT INTO `now_ss` VALUES
(20920,'crocodile_frags'),
(20920,'m_cones'),
(20920,'tool_marks'),
(21050,'bivalves'),
(21050,'gastropods'),
(28518,'brks_fresh');
/*!40000 ALTER TABLE `now_ss` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_ss_values`
--

DROP TABLE IF EXISTS `now_ss_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_ss_values` (
  `ss_value` varchar(30) NOT NULL DEFAULT '',
  `category` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`ss_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_ss_values`
--

LOCK TABLES `now_ss_values` WRITE;
/*!40000 ALTER TABLE `now_ss_values` DISABLE KEYS */;
INSERT INTO `now_ss_values` VALUES
('bivalves','Other organisms present but not collected, studied, or identified'),
('brks_fresh','Bone characteristics'),
('crocodile_frags','Other organisms present but not collected, studied, or identified'),
('gastropods','Other organisms present but not collected, studied, or identified'),
('m_cones','Plant parts present'),
('tool_marks','Sedimentary structures & features');
/*!40000 ALTER TABLE `now_ss_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_strat_coord`
--

DROP TABLE IF EXISTS `now_strat_coord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_strat_coord` (
  `strat_coord_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`strat_coord_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_strat_coord`
--

LOCK TABLES `now_strat_coord` WRITE;
/*!40000 ALTER TABLE `now_strat_coord` DISABLE KEYS */;
INSERT INTO `now_strat_coord` VALUES
(2,'random title');
/*!40000 ALTER TABLE `now_strat_coord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_strat_coord_people`
--

DROP TABLE IF EXISTS `now_strat_coord_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_strat_coord_people` (
  `strat_coord_id` int(11) NOT NULL DEFAULT 0,
  `initials` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`strat_coord_id`,`initials`),
  KEY `now_test_strat_coord_people_FKIndex1` (`strat_coord_id`),
  KEY `now_test_strat_coord_people_FKIndex2` (`initials`),
  CONSTRAINT `now_strat_coord_people_ibfk_1` FOREIGN KEY (`strat_coord_id`) REFERENCES `now_strat_coord` (`strat_coord_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_strat_coord_people_ibfk_2` FOREIGN KEY (`initials`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_strat_coord_people`
--

LOCK TABLES `now_strat_coord_people` WRITE;
/*!40000 ALTER TABLE `now_strat_coord_people` DISABLE KEYS */;
INSERT INTO `now_strat_coord_people` VALUES
(2,'AD');
/*!40000 ALTER TABLE `now_strat_coord_people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_syn_loc`
--

DROP TABLE IF EXISTS `now_syn_loc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_syn_loc` (
  `syn_id` int(11) NOT NULL AUTO_INCREMENT,
  `lid` int(11) NOT NULL DEFAULT 0,
  `synonym` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`syn_id`),
  KEY `now_test_syn_loc_FKIndex1` (`lid`),
  CONSTRAINT `now_syn_loc_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `now_loc` (`lid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7115 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_syn_loc`
--

LOCK TABLES `now_syn_loc` WRITE;
/*!40000 ALTER TABLE `now_syn_loc` DISABLE KEYS */;
INSERT INTO `now_syn_loc` VALUES
(2315,24750,'Romanya d\'Emporda'),
(2373,20920,'Shuijiazui'),
(6066,20920,'Bahe');
/*!40000 ALTER TABLE `now_syn_loc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_tau`
--

DROP TABLE IF EXISTS `now_tau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_tau` (
  `tuid` int(11) NOT NULL AUTO_INCREMENT,
  `tau_coordinator` varchar(10) NOT NULL DEFAULT '',
  `tau_authorizer` varchar(10) NOT NULL DEFAULT '',
  `tu_name` varchar(100) NOT NULL DEFAULT '',
  `tau_date` date DEFAULT NULL,
  `tau_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tuid`),
  KEY `now_test_tau_FKIndex1` (`tu_name`),
  KEY `now_test_tau_FKIndex2` (`tau_coordinator`),
  KEY `now_test_tau_FKIndex3` (`tau_authorizer`),
  CONSTRAINT `now_tau_ibfk_1` FOREIGN KEY (`tu_name`) REFERENCES `now_time_unit` (`tu_name`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_tau_ibfk_2` FOREIGN KEY (`tau_coordinator`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_tau_ibfk_3` FOREIGN KEY (`tau_authorizer`) REFERENCES `com_people` (`initials`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=227 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tau`
--

LOCK TABLES `now_tau` WRITE;
/*!40000 ALTER TABLE `now_tau` DISABLE KEYS */;
INSERT INTO `now_tau` VALUES
(5,'CO','AD','bahean','2020-01-29',''),
(28,'CO','AD','olduvai','2020-01-30',''),
(175,'CO','EU','langhian','2020-12-01','');
/*!40000 ALTER TABLE `now_tau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_time_unit`
--

DROP TABLE IF EXISTS `now_time_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_time_unit` (
  `tu_name` varchar(100) NOT NULL DEFAULT '',
  `tu_display_name` varchar(100) NOT NULL DEFAULT '',
  `up_bnd` int(11) NOT NULL DEFAULT 0,
  `low_bnd` int(11) NOT NULL DEFAULT 0,
  `rank` varchar(15) DEFAULT NULL,
  `sequence` varchar(30) NOT NULL DEFAULT '',
  `tu_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tu_name`),
  KEY `now_test_time_unit_FKIndex1` (`low_bnd`),
  KEY `now_test_time_unit_FKIndex2` (`up_bnd`),
  KEY `now_test_time_unit_FKIndex3` (`sequence`),
  CONSTRAINT `now_time_unit_ibfk_1` FOREIGN KEY (`low_bnd`) REFERENCES `now_tu_bound` (`bid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_time_unit_ibfk_2` FOREIGN KEY (`up_bnd`) REFERENCES `now_tu_bound` (`bid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `now_time_unit_ibfk_3` FOREIGN KEY (`sequence`) REFERENCES `now_tu_sequence` (`sequence`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_time_unit`
--

LOCK TABLES `now_time_unit` WRITE;
/*!40000 ALTER TABLE `now_time_unit` DISABLE KEYS */;
INSERT INTO `now_time_unit` VALUES
('bahean','Bahean',20214,20213,'Age','chlma',''),
('langhian','Langhian',49,50,'Age','gcss',NULL),
('mn13','MN 13',73,72,'Zone','europeanmammalzones',''),
('mn5','MN 5',65,64,'Zone','europeanmammalzones',''),
('olduvai','Olduvai',11,14,'Subchron','magneticpolarityts','C2n');
/*!40000 ALTER TABLE `now_time_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_time_update`
--

DROP TABLE IF EXISTS `now_time_update`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_time_update` (
  `time_update_id` int(11) NOT NULL AUTO_INCREMENT,
  `tu_name` varchar(100) NOT NULL DEFAULT '',
  `tuid` int(11) DEFAULT NULL,
  `lower_buid` int(11) DEFAULT NULL,
  `upper_buid` int(11) DEFAULT NULL,
  `coordinator` varchar(10) NOT NULL DEFAULT '',
  `authorizer` varchar(10) NOT NULL DEFAULT '',
  `date` date DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`time_update_id`),
  KEY `now_test_now_test_time_update_FKIndex1` (`tu_name`),
  KEY `now_test_now_test_time_update_FKIndex2` (`tuid`),
  KEY `now_test_now_test_time_update_FKIndex3` (`lower_buid`),
  KEY `now_test_now_test_time_update_FKIndex4` (`upper_buid`),
  CONSTRAINT `now_time_update_ibfk_1` FOREIGN KEY (`tu_name`) REFERENCES `now_time_unit` (`tu_name`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_time_update_ibfk_2` FOREIGN KEY (`tuid`) REFERENCES `now_tau` (`tuid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_time_update_ibfk_3` FOREIGN KEY (`lower_buid`) REFERENCES `now_bau` (`buid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_time_update_ibfk_4` FOREIGN KEY (`upper_buid`) REFERENCES `now_bau` (`buid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=798 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_time_update`
--

LOCK TABLES `now_time_update` WRITE;
/*!40000 ALTER TABLE `now_time_update` DISABLE KEYS */;
INSERT INTO `now_time_update` VALUES
(192,'bahean',5,193,194,'IZ','IZ','2020-01-29',''),
(217,'olduvai',28,NULL,NULL,'IZ','IZ','2020-01-30',''),
(460,'langhian',NULL,403,NULL,'IZ','IZ','2020-05-08',''),
(463,'langhian',NULL,404,NULL,'IZ','IZ','2020-05-08',''),
(727,'langhian',175,NULL,NULL,'IZ','AKa','2020-12-01','');
/*!40000 ALTER TABLE `now_time_update` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_tr`
--

DROP TABLE IF EXISTS `now_tr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_tr` (
  `tuid` int(11) NOT NULL DEFAULT 0,
  `rid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tuid`,`rid`),
  KEY `now_test_tr_FKIndex1` (`tuid`),
  KEY `now_test_tr_FKIndex2` (`rid`),
  CONSTRAINT `now_tr_ibfk_1` FOREIGN KEY (`tuid`) REFERENCES `now_tau` (`tuid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_tr_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `ref_ref` (`rid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tr`
--

LOCK TABLES `now_tr` WRITE;
/*!40000 ALTER TABLE `now_tr` DISABLE KEYS */;
INSERT INTO `now_tr` VALUES
(5,10039),
(5,24151),
(28,10039),
(175,10039);
/*!40000 ALTER TABLE `now_tr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_tu_bound`
--

DROP TABLE IF EXISTS `now_tu_bound`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_tu_bound` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `b_name` varchar(150) DEFAULT NULL,
  `age` double DEFAULT NULL,
  `b_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=20318 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tu_bound`
--

LOCK TABLES `now_tu_bound` WRITE;
/*!40000 ALTER TABLE `now_tu_bound` DISABLE KEYS */;
INSERT INTO `now_tu_bound` VALUES
(11,'C2N-y',1.778,NULL),
(14,'C2N-o',1.945,NULL),
(49,'Langhian/Serravallian',13.82,NULL),
(50,'Burdigalian/Langhian',15.97,NULL),
(64,'MN4/MN5',16.4,''),
(65,'MN5/MN6',14.2,NULL),
(72,'MN12/MN13',7.1,''),
(73,'MN13/MN14',5.3,''),
(20213,'MioceneLate-low',11.63,NULL),
(20214,'Bahean/Baodean',7.2,NULL);
/*!40000 ALTER TABLE `now_tu_bound` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_tu_sequence`
--

DROP TABLE IF EXISTS `now_tu_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_tu_sequence` (
  `sequence` varchar(30) NOT NULL,
  `seq_name` varchar(30) NOT NULL,
  PRIMARY KEY (`sequence`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tu_sequence`
--

LOCK TABLES `now_tu_sequence` WRITE;
/*!40000 ALTER TABLE `now_tu_sequence` DISABLE KEYS */;
INSERT INTO `now_tu_sequence` VALUES
('',''),
('AFLMA','AFLMA'),
('ALMAAsianlandmammalage','ALMA, Asian land mammal age'),
('CalatayudTeruellocalbiozone','Calatayud-Teruel local biozone'),
('centralparatethys','Central Paratethys'),
('chineseneogenemammalunits','Chinese Neogene Mammal Units'),
('chlma','ChLMA'),
('easternparatethys','Eastern Paratethys'),
('elma','ELMA'),
('europeanarchaeologicalcultur','European Archaeological Cultur'),
('europeanchronostrat','European Chronostrat.'),
('europeanmammalzones','European Mammal Zones'),
('europeanpleistocenestages','European Pleistocene Stages'),
('gcss','GCSS'),
('Levantarchaeologicalculture','Levant archaeological culture'),
('magneticpolarityts','Magnetic Polarity TS'),
('miscequivalents','Misc. equivalents'),
('mongolianrodentbiozones','Mongolian rodent biozones'),
('nacarboniferous','NA Carboniferous'),
('nalma','NALMA'),
('oxygenisotopestages','Oxygen Isotope Stages'),
('salma','SALMA'),
('SwissNorthAlpineForelandBa','Swiss North Alpine Foreland Ba'),
('VallsPenedslocalbiozone','VallÃ¨s-PenedÃ¨s local biozone');
/*!40000 ALTER TABLE `now_tu_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `now_tur`
--

DROP TABLE IF EXISTS `now_tur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `now_tur` (
  `bid` int(11) NOT NULL DEFAULT 0,
  `rid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`bid`,`rid`),
  KEY `now_test_tur_FKIndex1` (`bid`),
  KEY `now_test_tur_FKIndex2` (`rid`),
  CONSTRAINT `now_tur_ibfk_1` FOREIGN KEY (`bid`) REFERENCES `now_tu_bound` (`bid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `now_tur_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `ref_ref` (`rid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tur`
--

LOCK TABLES `now_tur` WRITE;
/*!40000 ALTER TABLE `now_tur` DISABLE KEYS */;
INSERT INTO `now_tur` VALUES
(11,10039),
(14,10039),
(49,10039),
(50,10039),
(64,10039),
(65,10039),
(72,10039),
(73,10039);
/*!40000 ALTER TABLE `now_tur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_authors`
--

DROP TABLE IF EXISTS `ref_authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_authors` (
  `rid` int(11) NOT NULL DEFAULT 0,
  `field_id` int(11) NOT NULL DEFAULT 0,
  `au_num` int(11) NOT NULL DEFAULT 0,
  `author_surname` varchar(255) DEFAULT NULL,
  `author_initials` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`rid`,`field_id`,`au_num`),
  KEY `ref_authors_FKIndex1` (`rid`),
  CONSTRAINT `ref_authors_ibfk_1` FOREIGN KEY (`rid`) REFERENCES `ref_ref` (`rid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_authors`
--

LOCK TABLES `ref_authors` WRITE;
/*!40000 ALTER TABLE `ref_authors` DISABLE KEYS */;
INSERT INTO `ref_authors` VALUES
(10039,2,1,'Cande','S.C.'),
(21368,2,1,'Ciochon','Russell'),
(24151,2,1,'Ogg','J.G.'),
(24187,2,1,'Kaakinen','A.'),
(24188,2,1,'Wang','X.'),
(25000,2,1,'Doe','D.');
/*!40000 ALTER TABLE `ref_authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_field_name`
--

DROP TABLE IF EXISTS `ref_field_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_field_name` (
  `field_ID` int(11) NOT NULL DEFAULT 0,
  `ref_type_id` int(11) NOT NULL DEFAULT 0,
  `ref_field_name` varchar(50) DEFAULT NULL,
  `display` tinyint(1) DEFAULT NULL,
  `label_x` int(11) DEFAULT NULL,
  `label_y` int(11) DEFAULT NULL,
  `field_x` int(11) DEFAULT NULL,
  `field_y` int(11) DEFAULT NULL,
  `field_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`field_ID`,`ref_type_id`),
  KEY `ref_field_name_FKIndex1` (`ref_type_id`),
  CONSTRAINT `ref_field_name_ibfk_1` FOREIGN KEY (`ref_type_id`) REFERENCES `ref_ref_type` (`ref_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_field_name`
--

LOCK TABLES `ref_field_name` WRITE;
/*!40000 ALTER TABLE `ref_field_name` DISABLE KEYS */;
INSERT INTO `ref_field_name` VALUES
(1,1,'Title',1,10,0,150,0,'title_primary'),
(1,2,'Title',1,10,0,150,0,'title_primary'),
(1,3,'Chapter Title',1,10,0,150,0,'title_primary'),
(1,4,'Title',1,10,0,150,0,'title_primary'),
(1,5,'Title',1,10,0,150,0,'title_primary'),
(1,6,'Title',1,10,0,150,0,'title_primary'),
(1,7,'Subject',1,10,0,150,0,'title_primary'),
(1,8,'Title',1,10,0,150,0,'title_primary'),
(1,9,'Title',1,10,0,150,0,'title_primary'),
(1,10,'',0,NULL,NULL,NULL,NULL,'title_primary'),
(1,11,'Title',1,10,0,150,0,'title_primary'),
(1,12,'Subject',1,10,0,150,0,'title_primary'),
(1,13,'Title',1,NULL,NULL,NULL,NULL,'title_primary'),
(1,14,'title_primary',1,10,0,150,0,'title_primary'),
(2,1,'Authors',1,10,50,150,50,'authors_primary'),
(2,2,'Authors',1,10,50,150,50,'authors_primary'),
(2,3,'Authors',1,10,50,150,50,'authors_primary'),
(2,4,'Authors',1,10,50,150,50,'authors_primary'),
(2,5,'Authors',1,10,50,150,50,'authors_primary'),
(2,6,'Authors',1,10,50,150,50,'authors_primary'),
(2,7,'Sender',1,10,50,150,50,'authors_primary'),
(2,8,'Authors',1,10,50,150,50,'authors_primary'),
(2,9,'Authors',1,10,50,150,50,'authors_primary'),
(2,10,'Authors',1,10,0,150,0,'authors_primary'),
(2,11,'Authors',1,10,50,150,50,'authors_primary'),
(2,12,'Authors',1,10,50,150,50,'authors_primary'),
(2,13,'Authors',1,10,0,150,0,'authors_primary'),
(2,14,'authors_primary',1,10,50,150,50,'authors_primary'),
(3,1,'Year',1,10,135,150,135,'date_primary'),
(3,2,'Year',1,10,135,150,135,'date_primary'),
(3,3,'Year',1,10,135,150,135,'date_primary'),
(3,4,'Year',1,10,135,150,135,'date_primary'),
(3,5,'Publication Year',1,10,135,150,135,'date_primary'),
(3,6,'Last Update (Year)',1,10,135,150,135,'date_primary'),
(3,7,'Year',1,10,135,150,135,'date_primary'),
(3,8,'Year',1,10,135,150,135,'date_primary'),
(3,9,'Year',1,10,135,150,135,'date_primary'),
(3,10,'Year',1,10,85,150,85,'date_primary'),
(3,11,'Date',1,10,135,150,135,'date_primary'),
(3,12,'Year',1,10,135,150,135,'date_primary'),
(3,13,'Year',1,10,85,150,85,'date_primary'),
(3,14,'date_primary',1,10,135,150,135,'date_primary'),
(4,1,'Journal',1,10,155,150,155,'journal_id'),
(4,2,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,3,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,4,'',0,10,195,150,195,'journal_id'),
(4,5,'Journal',1,10,310,150,310,'journal_id'),
(4,6,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,7,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,8,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,9,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,10,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,11,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,12,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,13,'',0,NULL,NULL,NULL,NULL,'journal_id'),
(4,14,'journal_id',1,10,155,150,155,'journal_id'),
(5,1,'Volume',1,150,175,150,195,'volume'),
(5,2,'Edition',1,150,280,150,300,'volume'),
(5,3,'Edition',1,150,290,150,310,'volume'),
(5,4,'',0,150,215,150,235,'volume'),
(5,5,'Volume',1,150,330,150,350,'volume'),
(5,6,'',0,NULL,NULL,NULL,NULL,'volume'),
(5,7,'',0,NULL,NULL,NULL,NULL,'volume'),
(5,8,'Report Number',1,150,290,150,310,'volume'),
(5,9,'',0,NULL,NULL,NULL,NULL,'volume'),
(5,10,'',0,NULL,NULL,NULL,NULL,'volume'),
(5,11,'',0,NULL,NULL,NULL,NULL,'volume'),
(5,12,'',0,NULL,NULL,NULL,NULL,'volume'),
(5,13,'',0,NULL,NULL,NULL,NULL,'volume'),
(5,14,'volume',1,150,175,150,195,'volume'),
(6,1,'Issue',1,230,175,230,195,'issue'),
(6,2,'Volume',1,230,280,230,300,'issue'),
(6,3,'Chapter No',1,230,290,230,310,'issue'),
(6,4,'',0,230,215,230,235,'issue'),
(6,5,'Edition',1,230,330,230,350,'issue'),
(6,6,'',0,NULL,NULL,NULL,NULL,'issue'),
(6,7,'',0,NULL,NULL,NULL,NULL,'issue'),
(6,8,'',0,NULL,NULL,NULL,NULL,'issue'),
(6,9,'',0,NULL,NULL,NULL,NULL,'issue'),
(6,10,'',0,NULL,NULL,NULL,NULL,'issue'),
(6,11,'',0,NULL,NULL,NULL,NULL,'issue'),
(6,12,'',0,NULL,NULL,NULL,NULL,'issue'),
(6,13,'',0,NULL,NULL,NULL,NULL,'issue'),
(6,14,'issue',1,230,175,230,195,'issue'),
(7,1,'Start Page',1,310,175,310,195,'start_page'),
(7,2,'',0,NULL,NULL,NULL,NULL,'start_page'),
(7,3,'Start Page',1,310,290,310,310,'start_page'),
(7,4,'',0,310,215,310,235,'start_page'),
(7,5,'Start Page',1,310,330,310,350,'start_page'),
(7,6,'',0,NULL,NULL,NULL,NULL,'start_page'),
(7,7,'',0,NULL,NULL,NULL,NULL,'start_page'),
(7,8,'Start Page',1,230,290,230,310,'start_page'),
(7,9,'',0,NULL,NULL,NULL,NULL,'start_page'),
(7,10,'',0,NULL,NULL,NULL,NULL,'start_page'),
(7,11,'',0,NULL,NULL,NULL,NULL,'start_page'),
(7,12,'',0,NULL,NULL,NULL,NULL,'start_page'),
(7,13,'',0,NULL,NULL,NULL,NULL,'start_page'),
(7,14,'start_page',1,310,175,310,195,'start_page'),
(8,1,'End Page',1,390,175,390,195,'end_page'),
(8,2,'No of Pages',1,390,280,390,300,'end_page'),
(8,3,'End Page',1,390,290,390,310,'end_page'),
(8,4,'No of Pages',1,390,215,390,235,'end_page'),
(8,5,'End Page',1,390,330,390,350,'end_page'),
(8,6,'',0,NULL,NULL,NULL,NULL,'end_page'),
(8,7,'',0,NULL,NULL,NULL,NULL,'end_page'),
(8,8,'End Page',1,310,290,310,310,'end_page'),
(8,9,'',0,NULL,NULL,NULL,NULL,'end_page'),
(8,10,'',0,NULL,NULL,NULL,NULL,'end_page'),
(8,11,'',0,NULL,NULL,NULL,NULL,'end_page'),
(8,12,'',0,NULL,NULL,NULL,NULL,'end_page'),
(8,13,'',0,NULL,NULL,NULL,NULL,'end_page'),
(8,14,'end_page',1,390,175,390,195,'end_page'),
(9,1,'Publisher',1,10,350,150,350,'publisher'),
(9,2,'Publisher',1,10,240,150,240,'publisher'),
(9,3,'Publisher',1,10,330,150,330,'publisher'),
(9,4,'Institution',1,10,155,150,155,'publisher'),
(9,5,'Publisher',1,10,370,150,370,'publisher'),
(9,6,'',0,NULL,NULL,NULL,NULL,'publisher'),
(9,7,'',0,NULL,NULL,NULL,NULL,'publisher'),
(9,8,'Publisher',1,10,330,150,330,'publisher'),
(9,9,'',0,NULL,NULL,NULL,NULL,'publisher'),
(9,10,'',0,NULL,NULL,NULL,NULL,'publisher'),
(9,11,'',0,NULL,NULL,NULL,NULL,'publisher'),
(9,12,'',0,NULL,NULL,NULL,NULL,'publisher'),
(9,13,'',0,NULL,NULL,NULL,NULL,'publisher'),
(9,14,'publisher',1,10,215,150,215,'publisher'),
(10,1,'City',1,10,370,150,370,'pub_place'),
(10,2,'City',1,10,260,150,260,'pub_place'),
(10,3,'City',1,10,350,150,350,'pub_place'),
(10,4,'',0,NULL,NULL,NULL,NULL,'pub_place'),
(10,5,'City',1,10,390,150,390,'pub_place'),
(10,6,'',0,NULL,NULL,NULL,NULL,'pub_place'),
(10,7,'',0,NULL,NULL,NULL,NULL,'pub_place'),
(10,8,'Pub Place',1,10,350,150,350,'pub_place'),
(10,9,'',0,NULL,NULL,NULL,NULL,'pub_place'),
(10,10,'',0,NULL,NULL,NULL,NULL,'pub_place'),
(10,11,'',0,NULL,NULL,NULL,NULL,'pub_place'),
(10,12,'',0,NULL,NULL,NULL,NULL,'pub_place'),
(10,13,'',0,NULL,NULL,NULL,NULL,'pub_place'),
(10,14,'pub_place',1,10,235,150,235,'pub_place'),
(11,1,'Title of Issue',1,10,215,150,215,'title_secondary'),
(11,2,'',0,NULL,NULL,NULL,NULL,'title_secondary'),
(11,3,'Book Title',1,10,155,150,155,'title_secondary'),
(11,4,'',0,NULL,NULL,NULL,NULL,'title_secondary'),
(11,5,'Title of Conference',1,10,155,150,155,'title_secondary'),
(11,6,'Organisation',1,10,175,150,175,'title_secondary'),
(11,7,'',0,NULL,NULL,NULL,NULL,'title_secondary'),
(11,8,'Report Name',1,10,155,150,155,'title_secondary'),
(11,9,'Organisation',1,10,155,150,155,'title_secondary'),
(11,10,'',0,NULL,NULL,NULL,NULL,'title_secondary'),
(11,11,'Organisation',1,10,155,150,155,'title_secondary'),
(11,12,'',0,NULL,NULL,NULL,NULL,'title_secondary'),
(11,13,'',0,NULL,NULL,NULL,NULL,'title_secondary'),
(11,14,'title_secondary',1,10,255,150,255,'title_secondary'),
(12,1,'Editors of Issue',1,10,265,150,265,'authors_secondary'),
(12,2,'Editors',1,10,155,150,155,'authors_secondary'),
(12,3,'Editors',1,10,205,150,205,'authors_secondary'),
(12,4,'',0,NULL,NULL,NULL,NULL,'authors_secondary'),
(12,5,'Editors',1,10,205,150,205,'authors_secondary'),
(12,6,'Editors',1,10,305,150,305,'authors_secondary'),
(12,7,'Recipient',1,10,155,150,155,'authors_secondary'),
(12,8,'Editors',1,10,205,150,205,'authors_secondary'),
(12,9,'Editors',1,10,205,150,205,'authors_secondary'),
(12,10,'Recipients',1,10,105,150,105,'authors_secondary'),
(12,11,'Editors',1,10,205,150,205,'authors_secondary'),
(12,12,'',0,NULL,NULL,NULL,NULL,'authors_secondary'),
(12,13,'',0,NULL,NULL,NULL,NULL,'authors_secondary'),
(12,14,'authors_secondary',1,10,305,150,305,'authors_secondary'),
(13,1,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,2,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,3,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,4,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,5,'Year of Conference',1,10,290,150,290,'date_secondary'),
(13,6,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,7,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,8,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,9,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,10,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,11,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,12,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,13,'',0,NULL,NULL,NULL,NULL,'date_secondary'),
(13,14,'date_secondary',1,10,390,150,390,'date_secondary'),
(14,1,'Series Title',1,10,390,150,390,'title_series'),
(14,2,'Series Title',1,10,320,150,320,'title_series'),
(14,3,'Series Title',1,10,370,150,370,'title_series'),
(14,4,'',0,NULL,NULL,NULL,NULL,'title_series'),
(14,5,'Series Title',1,10,410,150,410,'title_series'),
(14,6,'',0,NULL,NULL,NULL,NULL,'title_series'),
(14,7,'',0,NULL,NULL,NULL,NULL,'title_series'),
(14,8,'Series Title',1,10,370,150,370,'title_series'),
(14,9,'Series Title',1,10,290,150,290,'title_series'),
(14,10,'',0,NULL,NULL,NULL,NULL,'title_series'),
(14,11,'Series Title',1,10,290,150,290,'title_series'),
(14,12,'',0,NULL,NULL,NULL,NULL,'title_series'),
(14,13,'',0,NULL,NULL,NULL,NULL,'title_series'),
(14,14,'title_series',1,10,410,150,410,'title_series'),
(15,1,'',0,NULL,NULL,NULL,NULL,'authors_series'),
(15,2,'Series Editors',1,10,370,150,370,'authors_series'),
(15,3,'Series Editors',1,10,440,150,440,'authors_series'),
(15,4,'',0,NULL,NULL,NULL,NULL,'authors_series'),
(15,5,'Series Editors',1,10,460,150,460,'authors_series'),
(15,6,'',0,NULL,NULL,NULL,NULL,'authors_series'),
(15,7,'',0,NULL,NULL,NULL,NULL,'authors_series'),
(15,8,'Series Editors',1,10,420,150,420,'authors_series'),
(15,9,'Series Editors',1,10,340,150,340,'authors_series'),
(15,10,'',0,NULL,NULL,NULL,NULL,'authors_series'),
(15,11,'Series Editors',1,10,340,150,340,'authors_series'),
(15,12,'',0,NULL,NULL,NULL,NULL,'authors_series'),
(15,13,'',0,NULL,NULL,NULL,NULL,'authors_series'),
(15,14,'authors_series',1,10,460,150,460,'authors_series'),
(16,1,'ISSN/ISBN',1,10,510,150,510,'issn_isbn'),
(16,2,'ISBN',1,10,525,150,525,'issn_isbn'),
(16,3,'ISBN',1,10,595,150,595,'issn_isbn'),
(16,4,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,5,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,6,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,7,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,8,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,9,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,10,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,11,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,12,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,13,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),
(16,14,'issn_isbn',1,10,545,150,545,'issn_isbn'),
(17,1,'Abstract',1,10,550,150,550,'ref_abstract'),
(17,2,'Abstract',1,10,565,150,565,'ref_abstract'),
(17,3,'Abstract',1,10,635,150,635,'ref_abstract'),
(17,4,'Abstract',1,10,315,150,315,'ref_abstract'),
(17,5,'Abstract',1,10,635,150,635,'ref_abstract'),
(17,6,'Abstract',1,10,390,150,390,'ref_abstract'),
(17,7,'',0,NULL,NULL,NULL,NULL,'ref_abstract'),
(17,8,'Abstract',1,10,595,150,595,'ref_abstract'),
(17,9,'Abstract',1,10,515,150,515,'ref_abstract'),
(17,10,'',0,NULL,NULL,NULL,NULL,'ref_abstract'),
(17,11,'Abstract',0,10,515,150,515,'ref_abstract'),
(17,12,'',0,NULL,NULL,NULL,NULL,'ref_abstract'),
(17,13,'',0,NULL,NULL,NULL,NULL,'ref_abstract'),
(17,14,'abstract',1,10,565,150,565,'ref_abstract'),
(18,1,'Web/URL',1,10,530,150,530,'web_url'),
(18,2,'Web/URL',1,10,545,150,545,'web_url'),
(18,3,'Web/URL',1,10,615,150,615,'web_url'),
(18,4,'Web/URL',1,10,295,150,295,'web_url'),
(18,5,'Web/URL',1,10,615,150,615,'web_url'),
(18,6,'Web/URL',1,10,195,150,195,'web_url'),
(18,7,'',0,NULL,NULL,NULL,NULL,'web_url'),
(18,8,'Web/URL',1,10,575,150,575,'web_url'),
(18,9,'Web/URL',1,10,495,150,495,'web_url'),
(18,10,'',0,NULL,NULL,NULL,NULL,'web_url'),
(18,11,'',0,NULL,NULL,NULL,NULL,'web_url'),
(18,12,'',0,NULL,NULL,NULL,NULL,'web_url'),
(18,13,'',0,NULL,NULL,NULL,NULL,'web_url'),
(18,14,'web_url',1,10,615,150,615,'web_url'),
(19,1,'',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,2,'',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,3,'No of Volumes',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,4,'Degree',1,10,175,150,175,'misc_1'),
(19,5,'',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,6,'Last Update (Day Month)',1,10,155,150,155,'misc_1'),
(19,7,'Sender\'s e-mail',1,10,260,150,260,'misc_1'),
(19,8,'',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,9,'',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,10,'Type',1,10,190,150,190,'misc_1'),
(19,11,'',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,12,'',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,13,'',0,NULL,NULL,NULL,NULL,'misc_1'),
(19,14,'misc_1',1,10,635,150,635,'misc_1'),
(20,1,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,2,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,3,'Volume',1,10,420,150,420,'misc_2'),
(20,4,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,5,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,6,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,7,'Recipient\'s e-mail',1,10,280,150,280,'misc_2'),
(20,8,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,9,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,10,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,11,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,12,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,13,'',0,NULL,NULL,NULL,NULL,'misc_2'),
(20,14,'misc_2',1,10,655,150,655,'misc_2'),
(21,1,'Notes',1,10,460,150,460,'gen_notes'),
(21,2,'Notes',1,10,475,150,475,'gen_notes'),
(21,3,'Notes',1,10,545,150,545,'gen_notes'),
(21,4,'Notes',1,10,275,150,275,'gen_notes'),
(21,5,'Notes',1,10,565,150,565,'gen_notes'),
(21,6,'Notes',1,10,255,150,255,'gen_notes'),
(21,7,'Notes',1,10,320,150,320,'gen_notes'),
(21,8,'Notes',1,10,525,150,525,'gen_notes'),
(21,9,'Notes',1,10,445,150,445,'gen_notes'),
(21,10,'Notes',1,10,250,150,250,'gen_notes'),
(21,11,'Notes',1,10,445,150,445,'gen_notes'),
(21,12,'Notes',1,10,155,150,155,'gen_notes'),
(21,13,'Notes',1,10,105,150,105,'gen_notes'),
(21,14,'gen_notes',1,10,675,150,675,'gen_notes'),
(22,1,'Language',1,10,440,150,440,'printed_language'),
(22,2,'Language',1,10,455,150,455,'printed_language'),
(22,3,'Language',1,10,525,150,525,'printed_language'),
(22,4,'Language',1,10,255,150,255,'printed_language'),
(22,5,'Language',1,10,545,150,545,'printed_language'),
(22,6,'Language',1,10,235,150,235,'printed_language'),
(22,7,'Language',1,10,300,150,300,'printed_language'),
(22,8,'Language',1,10,505,150,505,'printed_language'),
(22,9,'Language',1,10,425,150,425,'printed_language'),
(22,10,'Language',1,10,230,150,230,'printed_language'),
(22,11,'Language',1,10,425,150,425,'printed_language'),
(22,12,'',0,NULL,NULL,NULL,NULL,'printed_language'),
(22,13,'',0,NULL,NULL,NULL,NULL,'printed_language'),
(22,14,'language',1,10,725,150,725,'printed_language'),
(23,1,'',0,NULL,NULL,NULL,NULL,'exact_date'),
(23,2,'',0,NULL,NULL,NULL,NULL,'exact_date'),
(23,3,'',0,NULL,NULL,NULL,NULL,'exact_date'),
(23,4,'',0,NULL,NULL,NULL,NULL,'exact_date'),
(23,5,'',0,NULL,NULL,NULL,NULL,'exact_date'),
(23,6,'Access Date',1,10,215,150,215,'exact_date'),
(23,7,'Date of Message',1,10,240,150,240,'exact_date'),
(23,8,'',0,NULL,NULL,NULL,NULL,'exact_date'),
(23,9,'',0,NULL,NULL,NULL,NULL,'exact_date'),
(23,10,'Date Sent',1,10,210,150,210,'exact_date'),
(23,11,'Date',1,10,495,150,495,'exact_date'),
(23,12,'Date',1,10,205,150,205,'exact_date'),
(23,13,'Date',1,10,155,150,155,'exact_date'),
(23,14,'exact_date',1,10,745,150,745,'exact_date');
/*!40000 ALTER TABLE `ref_field_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_journal`
--

DROP TABLE IF EXISTS `ref_journal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_journal` (
  `journal_id` int(11) NOT NULL AUTO_INCREMENT,
  `journal_title` varchar(255) DEFAULT NULL,
  `short_title` varchar(100) DEFAULT NULL,
  `alt_title` varchar(255) DEFAULT NULL,
  `ISSN` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`journal_id`)
) ENGINE=InnoDB AUTO_INCREMENT=769 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_journal`
--

LOCK TABLES `ref_journal` WRITE;
/*!40000 ALTER TABLE `ref_journal` DISABLE KEYS */;
INSERT INTO `ref_journal` VALUES
(100,'Geology','Geology','','0091-7613');
/*!40000 ALTER TABLE `ref_journal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_keywords`
--

DROP TABLE IF EXISTS `ref_keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_keywords` (
  `keywords_id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`keywords_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_keywords`
--

LOCK TABLES `ref_keywords` WRITE;
/*!40000 ALTER TABLE `ref_keywords` DISABLE KEYS */;
/*!40000 ALTER TABLE `ref_keywords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_keywords_ref`
--

DROP TABLE IF EXISTS `ref_keywords_ref`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_keywords_ref` (
  `keywords_id` int(11) NOT NULL DEFAULT 0,
  `rid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`keywords_id`,`rid`),
  KEY `ref_keywords_ref_FKIndex1` (`keywords_id`),
  KEY `ref_keywords_ref_FKIndex2` (`rid`),
  CONSTRAINT `ref_keywords_ref_ibfk_1` FOREIGN KEY (`keywords_id`) REFERENCES `ref_keywords` (`keywords_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ref_keywords_ref_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `ref_ref` (`rid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_keywords_ref`
--

LOCK TABLES `ref_keywords_ref` WRITE;
/*!40000 ALTER TABLE `ref_keywords_ref` DISABLE KEYS */;
/*!40000 ALTER TABLE `ref_keywords_ref` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_ref`
--

DROP TABLE IF EXISTS `ref_ref`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_ref` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `ref_type_id` int(11) NOT NULL DEFAULT 0,
  `journal_id` int(11) DEFAULT NULL,
  `title_primary` varchar(255) DEFAULT NULL,
  `date_primary` int(11) DEFAULT NULL,
  `volume` varchar(10) DEFAULT NULL,
  `issue` varchar(10) DEFAULT NULL,
  `start_page` int(11) DEFAULT NULL,
  `end_page` int(11) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `pub_place` varchar(255) DEFAULT NULL,
  `title_secondary` varchar(255) DEFAULT NULL,
  `date_secondary` int(11) DEFAULT NULL,
  `title_series` varchar(255) DEFAULT NULL,
  `issn_isbn` varchar(30) DEFAULT NULL,
  `ref_abstract` longtext DEFAULT NULL,
  `web_url` varchar(255) DEFAULT NULL,
  `misc_1` varchar(255) DEFAULT NULL,
  `misc_2` varchar(255) DEFAULT NULL,
  `gen_notes` varchar(255) DEFAULT NULL,
  `printed_language` varchar(50) DEFAULT NULL,
  `exact_date` date DEFAULT NULL,
  `used_morph` tinyint(1) DEFAULT NULL,
  `used_now` tinyint(1) DEFAULT NULL,
  `used_gene` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`rid`),
  KEY `ref_ref_FKIndex1` (`journal_id`),
  KEY `ref_ref_FKIndex2` (`ref_type_id`),
  CONSTRAINT `ref_ref_ibfk_1` FOREIGN KEY (`journal_id`) REFERENCES `ref_journal` (`journal_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ref_ref_ibfk_2` FOREIGN KEY (`ref_type_id`) REFERENCES `ref_ref_type` (`ref_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=25781 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_ref`
--

LOCK TABLES `ref_ref` WRITE;
/*!40000 ALTER TABLE `ref_ref` DISABLE KEYS */;
INSERT INTO `ref_ref` VALUES
(10039,1,100,'A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic',1992,'97',NULL,13917,13951,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL),
(21368,1,100,'Dated co-occurrence of Homo erectus and Gigantopithecus from Tham Khuyen Cave, Vietnam',1996,'93',NULL,3016,3020,NULL,NULL,NULL,NULL,NULL,NULL,'abstract','http://www.pnas.org/cgi/reprint/93/7/3016',NULL,NULL,NULL,'English',NULL,NULL,1,NULL),
(24151,2,NULL,'A Concise Geologic Time Scale: 2016',2016,NULL,NULL,NULL,240,'Elsevier',NULL,NULL,NULL,NULL,'9780444594686',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0),
(24187,13,NULL,'Helsinki Asian time update',2020,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2020-01-29',NULL,1,NULL),
(24188,2,NULL,'Fossil Mammals of Asia',2013,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL),
(25000,1,100,'A test reference that is not linked to any localities or species',2025,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ref_ref` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_ref_type`
--

DROP TABLE IF EXISTS `ref_ref_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_ref_type` (
  `ref_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_type` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ref_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_ref_type`
--

LOCK TABLES `ref_ref_type` WRITE;
/*!40000 ALTER TABLE `ref_ref_type` DISABLE KEYS */;
INSERT INTO `ref_ref_type` VALUES
(1,'Journal'),
(2,'Book'),
(3,'Book Chapter'),
(4,'Thesis/Dissertation'),
(5,'Conference Proceeding'),
(6,'Electronic Citation'),
(7,'Internet Communication'),
(8,'Report'),
(9,'Unpublished Work'),
(10,'Personal Communication'),
(11,'Manuscript'),
(12,'Notes'),
(13,'Editing'),
(14,'Undefined');
/*!40000 ALTER TABLE `ref_ref_type` ENABLE KEYS */;
UNLOCK TABLES;
