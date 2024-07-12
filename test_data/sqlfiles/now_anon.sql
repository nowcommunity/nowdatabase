-- MariaDB dump 10.19  Distrib 10.5.10-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: now_test
-- ------------------------------------------------------
-- Server version	10.5.10-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES latin1 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_main`
--

LOCK TABLES `com_main` WRITE;
/*!40000 ALTER TABLE `com_main` DISABLE KEYS */;
INSERT INTO `com_main` VALUES (1);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_mlist`
--

LOCK TABLES `com_mlist` WRITE;
/*!40000 ALTER TABLE `com_mlist` DISABLE KEYS */;
INSERT INTO `com_mlist` VALUES ('IPMC','Institut Catal� de Paleontologia Miquel Crusafont','','Sabadell','','Catalonia','Spain',NULL,1,NULL),('ISEZ','Institute of Systematics and Evolution of Animals, Polish Academy of Sciences','Instytut Systematyki i Ewolucji Zwierzat, Polska Akademia Nauk','Cracow',NULL,NULL,'Poland',NULL,1,NULL),('RGM','Naturalis: National Museum of Natural History','Nationaal Natuurhistorisch Museum, former Rijksmuseum van Geologie en Mineralogie','Leiden','','','Netherlands',NULL,1,NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_people`
--

LOCK TABLES `com_people` WRITE;
/*!40000 ALTER TABLE `com_people` DISABLE KEYS */;
INSERT INTO `com_people` VALUES ('AD','adf','ads','adf ads',NULL,'email',156,'organization','Finland','2024-05-22',NULL,1,NULL),('CO','cfn','csn','cfn csn',NULL,'email',162,'organization','Finland','2024-05-27',NULL,1,NULL),('ER','erf','ers','erf ers',NULL,'email',158,'organization','Finland','2024-05-22',NULL,1,NULL),('EU','euf','eus','euf eus',NULL,'email',157,'organization','Finland','2024-05-22',NULL,1,NULL),('NS','nsf','nss','nsf nss',NULL,'email',NULL,'organization','Finland',NULL,NULL,1,NULL),('OF','off','ofs','off ofs',NULL,'email',159,'organization','Finland','2024-05-22',NULL,1,NULL),('PR','prf','prs','prf prs',NULL,'email',160,'organization','Finland','2024-05-22',NULL,1,NULL),('RD','rdf','rds','rdf rds',NULL,'email',161,'organization','Finland','2024-05-22',NULL,1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=86515 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_species`
--

LOCK TABLES `com_species` WRITE;
/*!40000 ALTER TABLE `com_species` DISABLE KEYS */;
INSERT INTO `com_species` VALUES (21052,'Mammalia','Rodentia','Gliridae','Eutheria',NULL,'','Simplomys','simplicidens','-',NULL,NULL,NULL,NULL,NULL,NULL,'p','herbivore',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL),(21426,'Mammalia','Eulipotyphla','Soricidae','Eutheria',NULL,'','Amblycoptus','indet.','-',NULL,NULL,NULL,NULL,NULL,NULL,'a',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1238,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL),(23065,'Mammalia','Eulipotyphla','Soricidae','Eutheria',NULL,'Soricinae','Petenyia','dubia','-',NULL,NULL,'Bachmayer & Wilson, 1970',NULL,NULL,NULL,'a',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL),(25009,'Mammalia','Rodentia','Gliridae','Eutheria',NULL,'','Microdyromys','legidensis','legidensis-koenigswaldi',NULL,NULL,NULL,NULL,NULL,NULL,'o','omnivore',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL),(84357,'Mammalia','Carnivora','Odobenidae','Eutheria','Pinnipedia',NULL,'Prototaria','planicephala','-',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,1,0,NULL),(85729,'Mammalia','Artiodactyla','Bovidae','Eutheria','','','Gallogoral','meneghinii','sickenbergii',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,1,0,NULL),(85730,'Mammalia','Artiodactyla','Bovidae','Eutheria','','','Pontoceros','surprine','-',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,1,0,NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=1157 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_taxa_synonym`
--

LOCK TABLES `com_taxa_synonym` WRITE;
/*!40000 ALTER TABLE `com_taxa_synonym` DISABLE KEYS */;
INSERT INTO `com_taxa_synonym` VALUES (147,21052,'Pseudodryomys','simplicidens',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_users`
--

LOCK TABLES `com_users` WRITE;
/*!40000 ALTER TABLE `com_users` DISABLE KEYS */;
INSERT INTO `com_users` VALUES (156,'admin',NULL,'0cc175b9c0f1b6a831c399e269772661',NULL,'2024-05-30','su',NULL,NULL),(157,'editu',NULL,'0cc175b9c0f1b6a831c399e269772661',NULL,'2024-05-23','eu',NULL,NULL),(158,'editr',NULL,'0cc175b9c0f1b6a831c399e269772661',NULL,'2024-05-27','er',NULL,NULL),(159,'office',NULL,'0cc175b9c0f1b6a831c399e269772661',NULL,'2024-05-23','no',NULL,NULL),(160,'project',NULL,'0cc175b9c0f1b6a831c399e269772661',NULL,'2024-05-27','pl',NULL,NULL),(161,'read',NULL,'0cc175b9c0f1b6a831c399e269772661',NULL,'2024-05-23','ro',NULL,NULL),(162,'coord',NULL,'0cc175b9c0f1b6a831c399e269772661',NULL,'2024-05-27','su',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=545 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_bau`
--

LOCK TABLES `now_bau` WRITE;
/*!40000 ALTER TABLE `now_bau` DISABLE KEYS */;
INSERT INTO `now_bau` VALUES (4,'CO','AD',11,'2019-12-24',''),(5,'CO','AD',14,'2019-12-24',''),(6,'CO','AD',11,'2019-12-24',''),(7,'CO','AD',11,'2019-12-24',''),(193,'CO','AD',20213,'2020-01-29',''),(194,'CO','AD',20214,'2020-01-29',''),(195,'CO','AD',20214,'2020-01-29',''),(197,'CO','AD',65,'2020-01-29',''),(198,'CO','AD',20213,'2020-01-29',''),(199,'CO','AD',65,'2020-01-29',''),(403,'CO','AD',49,'2020-05-08',''),(404,'CO','AD',50,'2020-05-08','');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_br`
--

LOCK TABLES `now_br` WRITE;
/*!40000 ALTER TABLE `now_br` DISABLE KEYS */;
INSERT INTO `now_br` VALUES (4,10039),(5,10039),(6,10039),(7,10039),(193,10039),(193,24151),(194,10039),(194,24151),(195,10039),(197,10039),(198,10039),(199,10039),(403,10039),(404,10039);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_coll_meth`
--

LOCK TABLES `now_coll_meth` WRITE;
/*!40000 ALTER TABLE `now_coll_meth` DISABLE KEYS */;
INSERT INTO `now_coll_meth` VALUES (20920,'surface'),(20920,'systematic_loc_survey'),(21050,'wet_screen');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_coll_meth_values`
--

LOCK TABLES `now_coll_meth_values` WRITE;
/*!40000 ALTER TABLE `now_coll_meth_values` DISABLE KEYS */;
INSERT INTO `now_coll_meth_values` VALUES ('surface'),('systematic_loc_survey'),('wet_screen');
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
) ENGINE=InnoDB AUTO_INCREMENT=98524 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_lau`
--

LOCK TABLES `now_lau` WRITE;
/*!40000 ALTER TABLE `now_lau` DISABLE KEYS */;
INSERT INTO `now_lau` VALUES (23101,'CO','EU',21050,'1998-07-12',''),(32181,'CO','OF',20920,'2005-05-10',''),(35350,'CO','EU',24750,'2006-10-16',''),(35536,'CO','EU',24797,'2006-10-25',''),(62383,'CO','PR',28518,'2016-10-12',''),(98500,'CO','AD',24797,'2024-05-27',''),(98521,'CO','AD',24797,'2024-05-27',''),(98522,'CO','AD',24797,'2024-05-27',''),(98523,'CO','AD',24750,'2024-05-29','');
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
) ENGINE=InnoDB AUTO_INCREMENT=29564 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_loc`
--

LOCK TABLES `now_loc` WRITE;
/*!40000 ALTER TABLE `now_loc` DISABLE KEYS */;
INSERT INTO `now_loc` VALUES (20920,'bahean','bahean','Lantian-Shuijiazui','time_unit',11.63,7.2,NULL,NULL,NULL,NULL,'','','Fenwei','Weihe','34 6 0 N','109 18 0 E',34.1,109.3,NULL,NULL,'China','Shaanxi','Lantian','100-1000m2','y','','','','Bahe','','','',NULL,NULL,'sandstone','','',NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','','','','','','','','','','','','','','','','','',NULL,NULL,'','y',NULL,'',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21050,NULL,'olduvai','Dmanisi','composite',1.85,1.778,'Ar/Ar',NULL,NULL,NULL,'Villafranchian, MNQ18','before Acheulian: E. hydruntinus, stone tools.1.81 Ma based on volcanic ash dating',NULL,NULL,'41 20 10 N','44 20 38 E',41.336111111111116,44.34388888888889,0,NULL,'Georgia','Tbilisi area','','','n','','elevation 1015m','','','','','',NULL,NULL,'sandstone','','',NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','','','','','','wet','hot','','','','','','','','','','',NULL,NULL,'','',NULL,'',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24750,NULL,NULL,'Romany� dEmpord�','absolute',7.1,5.3,'Ar/Ar','AAR',NULL,NULL,'Turolian',NULL,'Ebro',NULL,'42 9 58 N','2 39 58 E',42.166,2.666,NULL,NULL,'Spain','Province of Girona',NULL,NULL,NULL,NULL,'Empord� Basin.Coordinates are for Girona.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24797,'mn5','mn5','Las Umbrias 1','time_unit',16.4,14.2,NULL,NULL,NULL,NULL,'Aragonian, zone Dd','C5Adn','Iberian Range',NULL,'41 11 46 N','1 30 38 W',41.1963254,-1.5106093,NULL,NULL,'Spain','Province of Zaragoza',NULL,NULL,NULL,NULL,'northern Teruel Basin. Coordinates are for Villafeliche',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28518,'langhian','langhian','Goishi','time_unit',15.97,13.82,NULL,NULL,NULL,NULL,NULL,NULL,'Joban',NULL,'38 12 0 N','140 42 0 E',38.2,140.7,1,NULL,'Japan','Miyagi Prefecture',NULL,NULL,NULL,NULL,NULL,NULL,'Moniwa',NULL,NULL,NULL,NULL,NULL,'sandstone',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_lr`
--

LOCK TABLES `now_lr` WRITE;
/*!40000 ALTER TABLE `now_lr` DISABLE KEYS */;
INSERT INTO `now_lr` VALUES (23101,10039),(35350,10039),(35350,24151),(35536,10039),(35536,24151),(62383,10039),(98500,24188),(98521,10039),(98522,10039),(98523,24151);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_ls`
--

LOCK TABLES `now_ls` WRITE;
/*!40000 ALTER TABLE `now_ls` DISABLE KEYS */;
INSERT INTO `now_ls` VALUES (21050,85729,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21050,85730,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24750,21426,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24750,23065,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24797,21052,NULL,NULL,NULL,NULL,'a','family id uncertain','Test',NULL,1020,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28518,84357,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_mus`
--

LOCK TABLES `now_mus` WRITE;
/*!40000 ALTER TABLE `now_mus` DISABLE KEYS */;
INSERT INTO `now_mus` VALUES (20920,'RGM'),(24750,'IPMC'),(24750,'ISEZ');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_plr`
--

LOCK TABLES `now_plr` WRITE;
/*!40000 ALTER TABLE `now_plr` DISABLE KEYS */;
INSERT INTO `now_plr` VALUES (20920,3),(24750,3),(24750,14),(24797,3),(24797,14),(28518,23);
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_proj`
--

LOCK TABLES `now_proj` WRITE;
/*!40000 ALTER TABLE `now_proj` DISABLE KEYS */;
INSERT INTO `now_proj` VALUES (3,'AD','NOW','NOW Database','current',0),(14,'AD','WINE','Workgroup on Insectivores of the Neogene of Eurasia','current',1),(23,'EU','SEAL','Seal evolution and localities','current',0);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_proj_people`
--

LOCK TABLES `now_proj_people` WRITE;
/*!40000 ALTER TABLE `now_proj_people` DISABLE KEYS */;
INSERT INTO `now_proj_people` VALUES (3,'ER'),(14,'ER');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_reg_coord`
--

LOCK TABLES `now_reg_coord` WRITE;
/*!40000 ALTER TABLE `now_reg_coord` DISABLE KEYS */;
INSERT INTO `now_reg_coord` VALUES (1,'region 4452477e'),(2,'region 44524b6e');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_reg_coord_country`
--

LOCK TABLES `now_reg_coord_country` WRITE;
/*!40000 ALTER TABLE `now_reg_coord_country` DISABLE KEYS */;
INSERT INTO `now_reg_coord_country` VALUES (1,'France'),(1,'Spain'),(2,'Austria'),(2,'Germany'),(2,'Slovakia'),(2,'Switzerland');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_reg_coord_people`
--

LOCK TABLES `now_reg_coord_people` WRITE;
/*!40000 ALTER TABLE `now_reg_coord_people` DISABLE KEYS */;
INSERT INTO `now_reg_coord_people` VALUES (1,'PR'),(2,'ER');
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_regional_culture`
--

LOCK TABLES `now_regional_culture` WRITE;
/*!40000 ALTER TABLE `now_regional_culture` DISABLE KEYS */;
INSERT INTO `now_regional_culture` VALUES ('acheulean','Acheulean'),('aterian','Aterian'),('aurignac','Aurignac'),('early_acheulean','Early Acheulean'),('large_flake_acheulean','Large Flake Acheulean'),('lct_acheulean','LCT Acheulean'),('levantine_acheulean','Levantine Acheulean'),('mousterian','Mousterian'),('oldowan','Oldowan'),('stillbay','Stillbay'),('tabun_b','Tabun B');
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
) ENGINE=InnoDB AUTO_INCREMENT=129168 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sau`
--

LOCK TABLES `now_sau` WRITE;
/*!40000 ALTER TABLE `now_sau` DISABLE KEYS */;
INSERT INTO `now_sau` VALUES (24260,'CO','OF',25009,'2005-05-10',''),(98809,'CO','PR',84357,'2016-10-12',''),(118820,'CO','AD',85729,'2022-02-08',''),(118821,'CO','AD',85730,'2022-02-08',''),(129165,'CO','AD',25009,'2024-05-27',''),(129167,'CO','AD',21426,'2024-05-30','');
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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sp_coord`
--

LOCK TABLES `now_sp_coord` WRITE;
/*!40000 ALTER TABLE `now_sp_coord` DISABLE KEYS */;
INSERT INTO `now_sp_coord` VALUES (6,'group bb181567'),(7,'group bb181839');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sp_coord_people`
--

LOCK TABLES `now_sp_coord_people` WRITE;
/*!40000 ALTER TABLE `now_sp_coord_people` DISABLE KEYS */;
INSERT INTO `now_sp_coord_people` VALUES (6,'OF'),(7,'ER'),(7,'OF');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sp_coord_taxa`
--

LOCK TABLES `now_sp_coord_taxa` WRITE;
/*!40000 ALTER TABLE `now_sp_coord_taxa` DISABLE KEYS */;
INSERT INTO `now_sp_coord_taxa` VALUES (6,'Primates','Cercopithecidae'),(7,'Carnivora','Felidae');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_sr`
--

LOCK TABLES `now_sr` WRITE;
/*!40000 ALTER TABLE `now_sr` DISABLE KEYS */;
INSERT INTO `now_sr` VALUES (98809,10039),(118820,10039),(118821,10039),(129167,24188);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_ss`
--

LOCK TABLES `now_ss` WRITE;
/*!40000 ALTER TABLE `now_ss` DISABLE KEYS */;
INSERT INTO `now_ss` VALUES (20920,'crocodile_frags'),(20920,'m_cones'),(20920,'tool_marks'),(21050,'bivalves'),(21050,'gastropods'),(28518,'brks_fresh');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_ss_values`
--

LOCK TABLES `now_ss_values` WRITE;
/*!40000 ALTER TABLE `now_ss_values` DISABLE KEYS */;
INSERT INTO `now_ss_values` VALUES ('bivalves','Other organisms present but not collected, studied, or identified'),('brks_fresh','Bone characteristics'),('crocodile_frags','Other organisms present but not collected, studied, or identified'),('gastropods','Other organisms present but not collected, studied, or identified'),('m_cones','Plant parts present'),('tool_marks','Sedimentary structures & features');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_strat_coord`
--

LOCK TABLES `now_strat_coord` WRITE;
/*!40000 ALTER TABLE `now_strat_coord` DISABLE KEYS */;
INSERT INTO `now_strat_coord` VALUES (2,'random title');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_strat_coord_people`
--

LOCK TABLES `now_strat_coord_people` WRITE;
/*!40000 ALTER TABLE `now_strat_coord_people` DISABLE KEYS */;
INSERT INTO `now_strat_coord_people` VALUES (2,'AD');
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
) ENGINE=InnoDB AUTO_INCREMENT=7115 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_syn_loc`
--

LOCK TABLES `now_syn_loc` WRITE;
/*!40000 ALTER TABLE `now_syn_loc` DISABLE KEYS */;
INSERT INTO `now_syn_loc` VALUES (2315,24750,'Romanya d\'Emporda'),(2373,20920,'Shuijiazui'),(6066,20920,'Bahe');
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
) ENGINE=InnoDB AUTO_INCREMENT=227 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tau`
--

LOCK TABLES `now_tau` WRITE;
/*!40000 ALTER TABLE `now_tau` DISABLE KEYS */;
INSERT INTO `now_tau` VALUES (5,'CO','AD','bahean','2020-01-29',''),(28,'CO','AD','olduvai','2020-01-30',''),(175,'CO','EU','langhian','2020-12-01','');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_time_unit`
--

LOCK TABLES `now_time_unit` WRITE;
/*!40000 ALTER TABLE `now_time_unit` DISABLE KEYS */;
INSERT INTO `now_time_unit` VALUES ('bahean','Bahean',20214,20213,'Age','chlma',''),('langhian','Langhian',49,50,'Age','gcss',NULL),('mn13','MN 13',73,72,'Zone','europeanmammalzones',''),('mn5','MN 5',65,64,'Zone','europeanmammalzones',''),('olduvai','Olduvai',11,14,'Subchron','magneticpolarityts','C2n');
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
) ENGINE=InnoDB AUTO_INCREMENT=798 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_time_update`
--

LOCK TABLES `now_time_update` WRITE;
/*!40000 ALTER TABLE `now_time_update` DISABLE KEYS */;
INSERT INTO `now_time_update` VALUES (192,'bahean',5,193,194,'IZ','IZ','2020-01-29',''),(217,'olduvai',28,NULL,NULL,'IZ','IZ','2020-01-30',''),(460,'langhian',NULL,403,NULL,'IZ','IZ','2020-05-08',''),(463,'langhian',NULL,404,NULL,'IZ','IZ','2020-05-08',''),(727,'langhian',175,NULL,NULL,'IZ','AKa','2020-12-01','');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tr`
--

LOCK TABLES `now_tr` WRITE;
/*!40000 ALTER TABLE `now_tr` DISABLE KEYS */;
INSERT INTO `now_tr` VALUES (5,10039),(5,24151),(28,10039),(175,10039);
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
) ENGINE=InnoDB AUTO_INCREMENT=20318 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tu_bound`
--

LOCK TABLES `now_tu_bound` WRITE;
/*!40000 ALTER TABLE `now_tu_bound` DISABLE KEYS */;
INSERT INTO `now_tu_bound` VALUES (11,'C2N-y',1.778,NULL),(14,'C2N-o',1.945,NULL),(49,'Langhian/Serravallian',13.82,NULL),(50,'Burdigalian/Langhian',15.97,NULL),(64,'MN4/MN5',16.4,''),(65,'MN5/MN6',14.2,NULL),(72,'MN12/MN13',7.1,''),(73,'MN13/MN14',5.3,''),(20213,'MioceneLate-low',11.63,NULL),(20214,'Bahean/Baodean',7.2,NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tu_sequence`
--

LOCK TABLES `now_tu_sequence` WRITE;
/*!40000 ALTER TABLE `now_tu_sequence` DISABLE KEYS */;
INSERT INTO `now_tu_sequence` VALUES ('',''),('AFLMA','AFLMA'),('ALMAAsianlandmammalage','ALMA, Asian land mammal age'),('CalatayudTeruellocalbiozone','Calatayud-Teruel local biozone'),('centralparatethys','Central Paratethys'),('chineseneogenemammalunits','Chinese Neogene Mammal Units'),('chlma','ChLMA'),('easternparatethys','Eastern Paratethys'),('elma','ELMA'),('europeanarchaeologicalcultur','European Archaeological Cultur'),('europeanchronostrat','European Chronostrat.'),('europeanmammalzones','European Mammal Zones'),('europeanpleistocenestages','European Pleistocene Stages'),('gcss','GCSS'),('Levantarchaeologicalculture','Levant archaeological culture'),('magneticpolarityts','Magnetic Polarity TS'),('miscequivalents','Misc. equivalents'),('mongolianrodentbiozones','Mongolian rodent biozones'),('nacarboniferous','NA Carboniferous'),('nalma','NALMA'),('oxygenisotopestages','Oxygen Isotope Stages'),('salma','SALMA'),('SwissNorthAlpineForelandBa','Swiss North Alpine Foreland Ba'),('VallsPenedslocalbiozone','Vall�s-Pened�s local biozone');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `now_tur`
--

LOCK TABLES `now_tur` WRITE;
/*!40000 ALTER TABLE `now_tur` DISABLE KEYS */;
INSERT INTO `now_tur` VALUES (11,10039),(14,10039),(49,10039),(50,10039),(64,10039),(65,10039),(72,10039),(73,10039);
/*!40000 ALTER TABLE `now_tur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `now_v_coll_meth_values_list`
--

DROP TABLE IF EXISTS `now_v_coll_meth_values_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_coll_meth_values_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_coll_meth_values_list` (
  `coll_meth_value` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_export_loc`
--

DROP TABLE IF EXISTS `now_v_export_loc`;
/*!50001 DROP VIEW IF EXISTS `now_v_export_loc`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_export_loc` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `county` tinyint NOT NULL,
  `dms_lat` tinyint NOT NULL,
  `dms_long` tinyint NOT NULL,
  `dec_lat` tinyint NOT NULL,
  `dec_long` tinyint NOT NULL,
  `altitude` tinyint NOT NULL,
  `max_age` tinyint NOT NULL,
  `bfa_max` tinyint NOT NULL,
  `bfa_max_abs` tinyint NOT NULL,
  `frac_max` tinyint NOT NULL,
  `min_age` tinyint NOT NULL,
  `bfa_min` tinyint NOT NULL,
  `bfa_min_abs` tinyint NOT NULL,
  `frac_min` tinyint NOT NULL,
  `chron` tinyint NOT NULL,
  `age_comm` tinyint NOT NULL,
  `basin` tinyint NOT NULL,
  `subbasin` tinyint NOT NULL,
  `appr_num_spm` tinyint NOT NULL,
  `gen_loc` tinyint NOT NULL,
  `loc_synonyms` tinyint NOT NULL,
  `estimate_precip` tinyint NOT NULL,
  `estimate_temp` tinyint NOT NULL,
  `estimate_npp` tinyint NOT NULL,
  `pers_woody_cover` tinyint NOT NULL,
  `pers_pollen_ap` tinyint NOT NULL,
  `pers_pollen_nap` tinyint NOT NULL,
  `pers_pollen_other` tinyint NOT NULL,
  `hominin_skeletal_remains` tinyint NOT NULL,
  `bipedal_footprints` tinyint NOT NULL,
  `stone_tool_technology` tinyint NOT NULL,
  `stone_tool_cut_marks_on_bones` tinyint NOT NULL,
  `technological_mode_1` tinyint NOT NULL,
  `cultural_stage_1` tinyint NOT NULL,
  `regional_culture_1` tinyint NOT NULL,
  `technological_mode_2` tinyint NOT NULL,
  `cultural_stage_2` tinyint NOT NULL,
  `regional_culture_2` tinyint NOT NULL,
  `technological_mode_3` tinyint NOT NULL,
  `cultural_stage_3` tinyint NOT NULL,
  `regional_culture_3` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL,
  `mean_hypsodonty` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_export_locsp`
--

DROP TABLE IF EXISTS `now_v_export_locsp`;
/*!50001 DROP VIEW IF EXISTS `now_v_export_locsp`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_export_locsp` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `county` tinyint NOT NULL,
  `dms_lat` tinyint NOT NULL,
  `dms_long` tinyint NOT NULL,
  `dec_lat` tinyint NOT NULL,
  `dec_long` tinyint NOT NULL,
  `altitude` tinyint NOT NULL,
  `max_age` tinyint NOT NULL,
  `bfa_max` tinyint NOT NULL,
  `bfa_max_abs` tinyint NOT NULL,
  `frac_max` tinyint NOT NULL,
  `min_age` tinyint NOT NULL,
  `bfa_min` tinyint NOT NULL,
  `bfa_min_abs` tinyint NOT NULL,
  `frac_min` tinyint NOT NULL,
  `chron` tinyint NOT NULL,
  `age_comm` tinyint NOT NULL,
  `basin` tinyint NOT NULL,
  `subbasin` tinyint NOT NULL,
  `appr_num_spm` tinyint NOT NULL,
  `gen_loc` tinyint NOT NULL,
  `loc_synonyms` tinyint NOT NULL,
  `estimate_precip` tinyint NOT NULL,
  `estimate_temp` tinyint NOT NULL,
  `estimate_npp` tinyint NOT NULL,
  `pers_woody_cover` tinyint NOT NULL,
  `pers_pollen_ap` tinyint NOT NULL,
  `pers_pollen_nap` tinyint NOT NULL,
  `pers_pollen_other` tinyint NOT NULL,
  `hominin_skeletal_remains` tinyint NOT NULL,
  `bipedal_footprints` tinyint NOT NULL,
  `stone_tool_technology` tinyint NOT NULL,
  `stone_tool_cut_marks_on_bones` tinyint NOT NULL,
  `technological_mode_1` tinyint NOT NULL,
  `cultural_stage_1` tinyint NOT NULL,
  `regional_culture_1` tinyint NOT NULL,
  `technological_mode_2` tinyint NOT NULL,
  `cultural_stage_2` tinyint NOT NULL,
  `regional_culture_2` tinyint NOT NULL,
  `technological_mode_3` tinyint NOT NULL,
  `cultural_stage_3` tinyint NOT NULL,
  `regional_culture_3` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL,
  `mean_hypsodonty` tinyint NOT NULL,
  `species_id` tinyint NOT NULL,
  `order_name` tinyint NOT NULL,
  `family_name` tinyint NOT NULL,
  `subfamily_name` tinyint NOT NULL,
  `subclass_or_superorder_name` tinyint NOT NULL,
  `suborder_or_superfamily_name` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `taxonomic_status` tinyint NOT NULL,
  `body_mass` tinyint NOT NULL,
  `sv_length` tinyint NOT NULL,
  `sd_size` tinyint NOT NULL,
  `sd_display` tinyint NOT NULL,
  `tshm` tinyint NOT NULL,
  `tht` tinyint NOT NULL,
  `crowntype` tinyint NOT NULL,
  `diet1` tinyint NOT NULL,
  `diet2` tinyint NOT NULL,
  `diet3` tinyint NOT NULL,
  `locomo1` tinyint NOT NULL,
  `locomo2` tinyint NOT NULL,
  `locomo3` tinyint NOT NULL,
  `horizodonty` tinyint NOT NULL,
  `microwear` tinyint NOT NULL,
  `mesowear` tinyint NOT NULL,
  `mw_or_high` tinyint NOT NULL,
  `mw_or_low` tinyint NOT NULL,
  `mw_cs_sharp` tinyint NOT NULL,
  `mw_cs_round` tinyint NOT NULL,
  `mw_cs_blunt` tinyint NOT NULL,
  `mw_scale_min` tinyint NOT NULL,
  `mw_scale_max` tinyint NOT NULL,
  `mw_value` tinyint NOT NULL,
  `cusp_shape` tinyint NOT NULL,
  `cusp_count_buccal` tinyint NOT NULL,
  `cusp_count_lingual` tinyint NOT NULL,
  `loph_count_lon` tinyint NOT NULL,
  `loph_count_trs` tinyint NOT NULL,
  `fct_al` tinyint NOT NULL,
  `fct_ol` tinyint NOT NULL,
  `fct_sf` tinyint NOT NULL,
  `fct_ot` tinyint NOT NULL,
  `fct_cm` tinyint NOT NULL,
  `sp_status` tinyint NOT NULL,
  `sp_comment` tinyint NOT NULL,
  `sp_synonyms` tinyint NOT NULL,
  `sp_synonyms_comment` tinyint NOT NULL,
  `id_status` tinyint NOT NULL,
  `orig_entry` tinyint NOT NULL,
  `source_name` tinyint NOT NULL,
  `ls_microwear` tinyint NOT NULL,
  `ls_mesowear` tinyint NOT NULL,
  `ls_mw_or_low` tinyint NOT NULL,
  `ls_mw_or_high` tinyint NOT NULL,
  `ls_mw_cs_sharp` tinyint NOT NULL,
  `ls_mw_cs_round` tinyint NOT NULL,
  `ls_mw_cs_blunt` tinyint NOT NULL,
  `ls_mw_scale_min` tinyint NOT NULL,
  `ls_mw_scale_max` tinyint NOT NULL,
  `ls_mw_value` tinyint NOT NULL,
  `ls_mesowear_score` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_export_nonassociated_species`
--

DROP TABLE IF EXISTS `now_v_export_nonassociated_species`;
/*!50001 DROP VIEW IF EXISTS `now_v_export_nonassociated_species`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_export_nonassociated_species` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `county` tinyint NOT NULL,
  `dms_lat` tinyint NOT NULL,
  `dms_long` tinyint NOT NULL,
  `dec_lat` tinyint NOT NULL,
  `dec_long` tinyint NOT NULL,
  `altitude` tinyint NOT NULL,
  `max_age` tinyint NOT NULL,
  `bfa_max` tinyint NOT NULL,
  `bfa_max_abs` tinyint NOT NULL,
  `frac_max` tinyint NOT NULL,
  `min_age` tinyint NOT NULL,
  `bfa_min` tinyint NOT NULL,
  `bfa_min_abs` tinyint NOT NULL,
  `frac_min` tinyint NOT NULL,
  `chron` tinyint NOT NULL,
  `age_comm` tinyint NOT NULL,
  `basin` tinyint NOT NULL,
  `subbasin` tinyint NOT NULL,
  `appr_num_spm` tinyint NOT NULL,
  `gen_loc` tinyint NOT NULL,
  `loc_synonyms` tinyint NOT NULL,
  `estimate_precip` tinyint NOT NULL,
  `estimate_temp` tinyint NOT NULL,
  `estimate_npp` tinyint NOT NULL,
  `pers_woody_cover` tinyint NOT NULL,
  `pers_pollen_ap` tinyint NOT NULL,
  `pers_pollen_nap` tinyint NOT NULL,
  `pers_pollen_other` tinyint NOT NULL,
  `hominin_skeletal_remains` tinyint NOT NULL,
  `bipedal_footprints` tinyint NOT NULL,
  `stone_tool_technology` tinyint NOT NULL,
  `stone_tool_cut_marks_on_bones` tinyint NOT NULL,
  `technological_mode_1` tinyint NOT NULL,
  `cultural_stage_1` tinyint NOT NULL,
  `regional_culture_1` tinyint NOT NULL,
  `technological_mode_2` tinyint NOT NULL,
  `cultural_stage_2` tinyint NOT NULL,
  `regional_culture_2` tinyint NOT NULL,
  `technological_mode_3` tinyint NOT NULL,
  `cultural_stage_3` tinyint NOT NULL,
  `regional_culture_3` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL,
  `mean_hypsodonty` tinyint NOT NULL,
  `species_id` tinyint NOT NULL,
  `order_name` tinyint NOT NULL,
  `family_name` tinyint NOT NULL,
  `subfamily_name` tinyint NOT NULL,
  `subclass_or_superorder_name` tinyint NOT NULL,
  `suborder_or_superfamily_name` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `taxonomic_status` tinyint NOT NULL,
  `body_mass` tinyint NOT NULL,
  `sv_length` tinyint NOT NULL,
  `sd_size` tinyint NOT NULL,
  `sd_display` tinyint NOT NULL,
  `tshm` tinyint NOT NULL,
  `tht` tinyint NOT NULL,
  `crowntype` tinyint NOT NULL,
  `diet1` tinyint NOT NULL,
  `diet2` tinyint NOT NULL,
  `diet3` tinyint NOT NULL,
  `locomo1` tinyint NOT NULL,
  `locomo2` tinyint NOT NULL,
  `locomo3` tinyint NOT NULL,
  `horizodonty` tinyint NOT NULL,
  `microwear` tinyint NOT NULL,
  `mesowear` tinyint NOT NULL,
  `mw_or_high` tinyint NOT NULL,
  `mw_or_low` tinyint NOT NULL,
  `mw_cs_sharp` tinyint NOT NULL,
  `mw_cs_round` tinyint NOT NULL,
  `mw_cs_blunt` tinyint NOT NULL,
  `mw_scale_min` tinyint NOT NULL,
  `mw_scale_max` tinyint NOT NULL,
  `mw_value` tinyint NOT NULL,
  `cusp_shape` tinyint NOT NULL,
  `cusp_count_buccal` tinyint NOT NULL,
  `cusp_count_lingual` tinyint NOT NULL,
  `loph_count_lon` tinyint NOT NULL,
  `loph_count_trs` tinyint NOT NULL,
  `fct_al` tinyint NOT NULL,
  `fct_ol` tinyint NOT NULL,
  `fct_sf` tinyint NOT NULL,
  `fct_ot` tinyint NOT NULL,
  `fct_cm` tinyint NOT NULL,
  `sp_status` tinyint NOT NULL,
  `sp_comment` tinyint NOT NULL,
  `sp_synonyms` tinyint NOT NULL,
  `sp_synonyms_comment` tinyint NOT NULL,
  `id_status` tinyint NOT NULL,
  `orig_entry` tinyint NOT NULL,
  `source_name` tinyint NOT NULL,
  `ls_microwear` tinyint NOT NULL,
  `ls_mesowear` tinyint NOT NULL,
  `ls_mw_or_low` tinyint NOT NULL,
  `ls_mw_or_high` tinyint NOT NULL,
  `ls_mw_cs_sharp` tinyint NOT NULL,
  `ls_mw_cs_round` tinyint NOT NULL,
  `ls_mw_cs_blunt` tinyint NOT NULL,
  `ls_mw_scale_min` tinyint NOT NULL,
  `ls_mw_scale_max` tinyint NOT NULL,
  `ls_mw_value` tinyint NOT NULL,
  `ls_mesowear_score` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_age`
--

DROP TABLE IF EXISTS `now_v_locality_age`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_age`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_age` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `date_meth` tinyint NOT NULL,
  `min_age` tinyint NOT NULL,
  `bfa_min_abs` tinyint NOT NULL,
  `bfa_min` tinyint NOT NULL,
  `frac_min` tinyint NOT NULL,
  `max_age` tinyint NOT NULL,
  `bfa_max_abs` tinyint NOT NULL,
  `bfa_max` tinyint NOT NULL,
  `frac_max` tinyint NOT NULL,
  `chron` tinyint NOT NULL,
  `age_comm` tinyint NOT NULL,
  `basin` tinyint NOT NULL,
  `subbasin` tinyint NOT NULL,
  `lgroup` tinyint NOT NULL,
  `formation` tinyint NOT NULL,
  `member` tinyint NOT NULL,
  `bed` tinyint NOT NULL,
  `datum_plane` tinyint NOT NULL,
  `tos` tinyint NOT NULL,
  `bos` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_archaeology`
--

DROP TABLE IF EXISTS `now_v_locality_archaeology`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_archaeology`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_archaeology` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `hominin_skeletal_remains` tinyint NOT NULL,
  `bipedal_footprints` tinyint NOT NULL,
  `stone_tool_technology` tinyint NOT NULL,
  `stone_tool_cut_marks_on_bones` tinyint NOT NULL,
  `technological_mode_1` tinyint NOT NULL,
  `cultural_stage_1` tinyint NOT NULL,
  `regional_culture_1` tinyint NOT NULL,
  `technological_mode_2` tinyint NOT NULL,
  `cultural_stage_2` tinyint NOT NULL,
  `regional_culture_2` tinyint NOT NULL,
  `technological_mode_3` tinyint NOT NULL,
  `cultural_stage_3` tinyint NOT NULL,
  `regional_culture_3` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_climate`
--

DROP TABLE IF EXISTS `now_v_locality_climate`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_climate`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_climate` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `climate_type` tinyint NOT NULL,
  `temperature` tinyint NOT NULL,
  `moisture` tinyint NOT NULL,
  `disturb` tinyint NOT NULL,
  `biome` tinyint NOT NULL,
  `v_ht` tinyint NOT NULL,
  `v_struct` tinyint NOT NULL,
  `pri_prod` tinyint NOT NULL,
  `v_envi_det` tinyint NOT NULL,
  `seasonality` tinyint NOT NULL,
  `seas_intens` tinyint NOT NULL,
  `nutrients` tinyint NOT NULL,
  `water` tinyint NOT NULL,
  `pers_pollen_ap` tinyint NOT NULL,
  `pers_pollen_nap` tinyint NOT NULL,
  `pers_pollen_other` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_ecometrics`
--

DROP TABLE IF EXISTS `now_v_locality_ecometrics`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_ecometrics`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_ecometrics` (
  `lid` tinyint NOT NULL,
  `estimate_precip` tinyint NOT NULL,
  `estimate_temp` tinyint NOT NULL,
  `estimate_npp` tinyint NOT NULL,
  `pers_woody_cover` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_ecometrics_mean_hypsodonty`
--

DROP TABLE IF EXISTS `now_v_locality_ecometrics_mean_hypsodonty`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_ecometrics_mean_hypsodonty`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_ecometrics_mean_hypsodonty` (
  `lid` tinyint NOT NULL,
  `mean_hypsodonty` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_header`
--

DROP TABLE IF EXISTS `now_v_locality_header`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_header`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_header` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `county` tinyint NOT NULL,
  `site_area` tinyint NOT NULL,
  `dms_lat` tinyint NOT NULL,
  `dms_long` tinyint NOT NULL,
  `dec_lat` tinyint NOT NULL,
  `dec_long` tinyint NOT NULL,
  `approx_coord` tinyint NOT NULL,
  `altitude` tinyint NOT NULL,
  `max_age` tinyint NOT NULL,
  `bfa_max` tinyint NOT NULL,
  `bfa_max_abs` tinyint NOT NULL,
  `min_age` tinyint NOT NULL,
  `bfa_min` tinyint NOT NULL,
  `bfa_min_abs` tinyint NOT NULL,
  `date_meth` tinyint NOT NULL,
  `frac_max` tinyint NOT NULL,
  `frac_min` tinyint NOT NULL,
  `age_comm` tinyint NOT NULL,
  `chron` tinyint NOT NULL,
  `basin` tinyint NOT NULL,
  `subbasin` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL,
  `gen_loc` tinyint NOT NULL,
  `plate` tinyint NOT NULL,
  `loc_detail` tinyint NOT NULL,
  `lgroup` tinyint NOT NULL,
  `formation` tinyint NOT NULL,
  `member` tinyint NOT NULL,
  `bed` tinyint NOT NULL,
  `datum_plane` tinyint NOT NULL,
  `tos` tinyint NOT NULL,
  `bos` tinyint NOT NULL,
  `rock_type` tinyint NOT NULL,
  `rt_adj` tinyint NOT NULL,
  `lith_comm` tinyint NOT NULL,
  `depo_context1` tinyint NOT NULL,
  `depo_context2` tinyint NOT NULL,
  `depo_context3` tinyint NOT NULL,
  `depo_context4` tinyint NOT NULL,
  `depo_comm` tinyint NOT NULL,
  `sed_env_1` tinyint NOT NULL,
  `sed_env_2` tinyint NOT NULL,
  `event_circum` tinyint NOT NULL,
  `se_comm` tinyint NOT NULL,
  `climate_type` tinyint NOT NULL,
  `biome` tinyint NOT NULL,
  `v_ht` tinyint NOT NULL,
  `v_struct` tinyint NOT NULL,
  `v_envi_det` tinyint NOT NULL,
  `disturb` tinyint NOT NULL,
  `nutrients` tinyint NOT NULL,
  `water` tinyint NOT NULL,
  `seasonality` tinyint NOT NULL,
  `seas_intens` tinyint NOT NULL,
  `pri_prod` tinyint NOT NULL,
  `moisture` tinyint NOT NULL,
  `temperature` tinyint NOT NULL,
  `assem_fm` tinyint NOT NULL,
  `transport` tinyint NOT NULL,
  `trans_mod` tinyint NOT NULL,
  `weath_trmp` tinyint NOT NULL,
  `pt_conc` tinyint NOT NULL,
  `size_type` tinyint NOT NULL,
  `vert_pres` tinyint NOT NULL,
  `plant_pres` tinyint NOT NULL,
  `invert_pres` tinyint NOT NULL,
  `time_rep` tinyint NOT NULL,
  `appr_num_spm` tinyint NOT NULL,
  `num_spm` tinyint NOT NULL,
  `true_quant` tinyint NOT NULL,
  `complete` tinyint NOT NULL,
  `num_quad` tinyint NOT NULL,
  `taph_comm` tinyint NOT NULL,
  `tax_comm` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_list`
--

DROP TABLE IF EXISTS `now_v_locality_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_list` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `max_age` tinyint NOT NULL,
  `min_age` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_lithology`
--

DROP TABLE IF EXISTS `now_v_locality_lithology`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_lithology`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_lithology` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `rock_type` tinyint NOT NULL,
  `rt_adj` tinyint NOT NULL,
  `lith_comm` tinyint NOT NULL,
  `sed_env_1` tinyint NOT NULL,
  `sed_env_2` tinyint NOT NULL,
  `event_circum` tinyint NOT NULL,
  `se_comm` tinyint NOT NULL,
  `depo_context1` tinyint NOT NULL,
  `depo_context2` tinyint NOT NULL,
  `depo_context3` tinyint NOT NULL,
  `depo_context4` tinyint NOT NULL,
  `depo_comm` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_locality`
--

DROP TABLE IF EXISTS `now_v_locality_locality`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_locality`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_locality` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `county` tinyint NOT NULL,
  `loc_detail` tinyint NOT NULL,
  `site_area` tinyint NOT NULL,
  `gen_loc` tinyint NOT NULL,
  `plate` tinyint NOT NULL,
  `dms_lat` tinyint NOT NULL,
  `dec_lat` tinyint NOT NULL,
  `dms_long` tinyint NOT NULL,
  `dec_long` tinyint NOT NULL,
  `approx_coord` tinyint NOT NULL,
  `altitude` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_locality_synonym`
--

DROP TABLE IF EXISTS `now_v_locality_locality_synonym`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_locality_synonym`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_locality_synonym` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `syn_id` tinyint NOT NULL,
  `synonym` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_museum`
--

DROP TABLE IF EXISTS `now_v_locality_museum`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_museum`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_museum` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `museum` tinyint NOT NULL,
  `institution` tinyint NOT NULL,
  `city` tinyint NOT NULL,
  `country` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_project`
--

DROP TABLE IF EXISTS `now_v_locality_project`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_project`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_project` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `pid` tinyint NOT NULL,
  `proj_code` tinyint NOT NULL,
  `proj_name` tinyint NOT NULL,
  `contact` tinyint NOT NULL,
  `proj_status` tinyint NOT NULL,
  `proj_records` tinyint NOT NULL,
  `full_name` tinyint NOT NULL,
  `email` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_species`
--

DROP TABLE IF EXISTS `now_v_locality_species`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_species`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_species` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `species_id` tinyint NOT NULL,
  `order_name` tinyint NOT NULL,
  `family_name` tinyint NOT NULL,
  `subfamily_name` tinyint NOT NULL,
  `subclass_or_superorder_name` tinyint NOT NULL,
  `suborder_or_superfamily_name` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `taxonomic_status` tinyint NOT NULL,
  `id_status` tinyint NOT NULL,
  `orig_entry` tinyint NOT NULL,
  `nis` tinyint NOT NULL,
  `pct` tinyint NOT NULL,
  `quad` tinyint NOT NULL,
  `mni` tinyint NOT NULL,
  `qua` tinyint NOT NULL,
  `source_name` tinyint NOT NULL,
  `body_mass` tinyint NOT NULL,
  `dc13_mean` tinyint NOT NULL,
  `dc13_n` tinyint NOT NULL,
  `dc13_max` tinyint NOT NULL,
  `dc13_min` tinyint NOT NULL,
  `dc13_stdev` tinyint NOT NULL,
  `do18_mean` tinyint NOT NULL,
  `do18_n` tinyint NOT NULL,
  `do18_max` tinyint NOT NULL,
  `do18_min` tinyint NOT NULL,
  `do18_stdev` tinyint NOT NULL,
  `mesowear` tinyint NOT NULL,
  `mw_or_high` tinyint NOT NULL,
  `mw_or_low` tinyint NOT NULL,
  `mw_cs_sharp` tinyint NOT NULL,
  `mw_cs_round` tinyint NOT NULL,
  `mw_cs_blunt` tinyint NOT NULL,
  `mw_scale_min` tinyint NOT NULL,
  `mw_scale_max` tinyint NOT NULL,
  `mw_value` tinyint NOT NULL,
  `microwear` tinyint NOT NULL,
  `sp_status` tinyint NOT NULL,
  `sp_comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_statistics`
--

DROP TABLE IF EXISTS `now_v_locality_statistics`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_statistics`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_statistics` (
  `year` tinyint NOT NULL,
  `month` tinyint NOT NULL,
  `surname` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_taphonomy`
--

DROP TABLE IF EXISTS `now_v_locality_taphonomy`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_taphonomy`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_taphonomy` (
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `assem_fm` tinyint NOT NULL,
  `transport` tinyint NOT NULL,
  `trans_mod` tinyint NOT NULL,
  `weath_trmp` tinyint NOT NULL,
  `pt_conc` tinyint NOT NULL,
  `size_type` tinyint NOT NULL,
  `time_rep` tinyint NOT NULL,
  `vert_pres` tinyint NOT NULL,
  `appr_num_spm` tinyint NOT NULL,
  `num_spm` tinyint NOT NULL,
  `num_quad` tinyint NOT NULL,
  `true_quant` tinyint NOT NULL,
  `complete` tinyint NOT NULL,
  `taph_comm` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_update_header`
--

DROP TABLE IF EXISTS `now_v_locality_update_header`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_update_header`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_update_header` (
  `luid` tinyint NOT NULL,
  `date` tinyint NOT NULL,
  `authorizer` tinyint NOT NULL,
  `coordinator` tinyint NOT NULL,
  `comment` tinyint NOT NULL,
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_locality_updates`
--

DROP TABLE IF EXISTS `now_v_locality_updates`;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_updates`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_locality_updates` (
  `luid` tinyint NOT NULL,
  `lid` tinyint NOT NULL,
  `lau_coordinator` tinyint NOT NULL,
  `lau_authorizer` tinyint NOT NULL,
  `lau_date` tinyint NOT NULL,
  `rids` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_museum_list`
--

DROP TABLE IF EXISTS `now_v_museum_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_museum_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_museum_list` (
  `museum` tinyint NOT NULL,
  `institution` tinyint NOT NULL,
  `alt_int_name` tinyint NOT NULL,
  `city` tinyint NOT NULL,
  `state_code` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `used_now` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_people_list`
--

DROP TABLE IF EXISTS `now_v_people_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_people_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_people_list` (
  `initials` tinyint NOT NULL,
  `first_name` tinyint NOT NULL,
  `surname` tinyint NOT NULL,
  `full_name` tinyint NOT NULL,
  `format` tinyint NOT NULL,
  `email` tinyint NOT NULL,
  `user_id` tinyint NOT NULL,
  `organization` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `password_set` tinyint NOT NULL,
  `used_now` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_project_list`
--

DROP TABLE IF EXISTS `now_v_project_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_project_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_project_list` (
  `pid` tinyint NOT NULL,
  `full_name` tinyint NOT NULL,
  `proj_code` tinyint NOT NULL,
  `proj_name` tinyint NOT NULL,
  `proj_status` tinyint NOT NULL,
  `proj_records` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_project_list_user`
--

DROP TABLE IF EXISTS `now_v_project_list_user`;
/*!50001 DROP VIEW IF EXISTS `now_v_project_list_user`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_project_list_user` (
  `pid` tinyint NOT NULL,
  `full_name` tinyint NOT NULL,
  `nppinitials` tinyint NOT NULL,
  `proj_code` tinyint NOT NULL,
  `proj_name` tinyint NOT NULL,
  `proj_status` tinyint NOT NULL,
  `proj_records` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_public_locality_species`
--

DROP TABLE IF EXISTS `now_v_public_locality_species`;
/*!50001 DROP VIEW IF EXISTS `now_v_public_locality_species`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_public_locality_species` (
  `count` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_ref_cit`
--

DROP TABLE IF EXISTS `now_v_ref_cit`;
/*!50001 DROP VIEW IF EXISTS `now_v_ref_cit`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_ref_cit` (
  `rid` tinyint NOT NULL,
  `date_primary` tinyint NOT NULL,
  `title_primary` tinyint NOT NULL,
  `title_secondary` tinyint NOT NULL,
  `gen_notes` tinyint NOT NULL,
  `volume` tinyint NOT NULL,
  `issue` tinyint NOT NULL,
  `start_page` tinyint NOT NULL,
  `end_page` tinyint NOT NULL,
  `publisher` tinyint NOT NULL,
  `pub_place` tinyint NOT NULL,
  `author_surname1` tinyint NOT NULL,
  `author_surname2` tinyint NOT NULL,
  `author_surname3` tinyint NOT NULL,
  `author_surname4` tinyint NOT NULL,
  `editor_surname1` tinyint NOT NULL,
  `editor_surname2` tinyint NOT NULL,
  `editor_surname3` tinyint NOT NULL,
  `editor_surname4` tinyint NOT NULL,
  `journal_title` tinyint NOT NULL,
  `ref_type_id` tinyint NOT NULL,
  `ref_type` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_reference_header`
--

DROP TABLE IF EXISTS `now_v_reference_header`;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_header`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_reference_header` (
  `rid` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_reference_list`
--

DROP TABLE IF EXISTS `now_v_reference_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_reference_list` (
  `rid` tinyint NOT NULL,
  `date_primary` tinyint NOT NULL,
  `date_secondary` tinyint NOT NULL,
  `exact_date` tinyint NOT NULL,
  `title_primary` tinyint NOT NULL,
  `title_secondary` tinyint NOT NULL,
  `title_series` tinyint NOT NULL,
  `journal_id` tinyint NOT NULL,
  `ref_type_id` tinyint NOT NULL,
  `volume` tinyint NOT NULL,
  `issue` tinyint NOT NULL,
  `start_page` tinyint NOT NULL,
  `end_page` tinyint NOT NULL,
  `publisher` tinyint NOT NULL,
  `pub_place` tinyint NOT NULL,
  `issn_isbn` tinyint NOT NULL,
  `ref_abstract` tinyint NOT NULL,
  `web_url` tinyint NOT NULL,
  `misc_1` tinyint NOT NULL,
  `misc_2` tinyint NOT NULL,
  `gen_notes` tinyint NOT NULL,
  `printed_language` tinyint NOT NULL,
  `used_morph` tinyint NOT NULL,
  `used_now` tinyint NOT NULL,
  `used_gene` tinyint NOT NULL,
  `author_surname` tinyint NOT NULL,
  `journal_title` tinyint NOT NULL,
  `ref_type` tinyint NOT NULL,
  `cmb_title` tinyint NOT NULL,
  `cmb_author` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_reference_locality`
--

DROP TABLE IF EXISTS `now_v_reference_locality`;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_locality`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_reference_locality` (
  `rid` tinyint NOT NULL,
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `max_age` tinyint NOT NULL,
  `min_age` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_reference_species`
--

DROP TABLE IF EXISTS `now_v_reference_species`;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_species`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_reference_species` (
  `rid` tinyint NOT NULL,
  `species_id` tinyint NOT NULL,
  `order_name` tinyint NOT NULL,
  `family_name` tinyint NOT NULL,
  `subfamily_name` tinyint NOT NULL,
  `subclass_or_superorder_name` tinyint NOT NULL,
  `suborder_or_superfamily_name` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `sp_status` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_reference_tubound`
--

DROP TABLE IF EXISTS `now_v_reference_tubound`;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_tubound`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_reference_tubound` (
  `rid` tinyint NOT NULL,
  `bid` tinyint NOT NULL,
  `b_name` tinyint NOT NULL,
  `age` tinyint NOT NULL,
  `b_comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_diet`
--

DROP TABLE IF EXISTS `now_v_species_diet`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_diet`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_diet` (
  `species_id` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `diet1` tinyint NOT NULL,
  `diet2` tinyint NOT NULL,
  `diet3` tinyint NOT NULL,
  `rel_fib` tinyint NOT NULL,
  `selectivity` tinyint NOT NULL,
  `digestion` tinyint NOT NULL,
  `hunt_forage` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_header`
--

DROP TABLE IF EXISTS `now_v_species_header`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_header`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_header` (
  `species_id` tinyint NOT NULL,
  `class_name` tinyint NOT NULL,
  `order_name` tinyint NOT NULL,
  `family_name` tinyint NOT NULL,
  `subfamily_name` tinyint NOT NULL,
  `subclass_or_superorder_name` tinyint NOT NULL,
  `suborder_or_superfamily_name` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `common_name` tinyint NOT NULL,
  `sp_status` tinyint NOT NULL,
  `taxonomic_status` tinyint NOT NULL,
  `sp_author` tinyint NOT NULL,
  `strain` tinyint NOT NULL,
  `gene` tinyint NOT NULL,
  `taxon_status` tinyint NOT NULL,
  `diet1` tinyint NOT NULL,
  `diet2` tinyint NOT NULL,
  `diet3` tinyint NOT NULL,
  `diet_description` tinyint NOT NULL,
  `rel_fib` tinyint NOT NULL,
  `selectivity` tinyint NOT NULL,
  `digestion` tinyint NOT NULL,
  `feedinghab1` tinyint NOT NULL,
  `feedinghab2` tinyint NOT NULL,
  `shelterhab1` tinyint NOT NULL,
  `shelterhab2` tinyint NOT NULL,
  `locomo1` tinyint NOT NULL,
  `locomo2` tinyint NOT NULL,
  `locomo3` tinyint NOT NULL,
  `hunt_forage` tinyint NOT NULL,
  `body_mass` tinyint NOT NULL,
  `brain_mass` tinyint NOT NULL,
  `sv_length` tinyint NOT NULL,
  `activity` tinyint NOT NULL,
  `sd_size` tinyint NOT NULL,
  `sd_display` tinyint NOT NULL,
  `tshm` tinyint NOT NULL,
  `symph_mob` tinyint NOT NULL,
  `relative_blade_length` tinyint NOT NULL,
  `tht` tinyint NOT NULL,
  `crowntype` tinyint NOT NULL,
  `microwear` tinyint NOT NULL,
  `pop_struc` tinyint NOT NULL,
  `used_morph` tinyint NOT NULL,
  `used_now` tinyint NOT NULL,
  `used_gene` tinyint NOT NULL,
  `sp_comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_list`
--

DROP TABLE IF EXISTS `now_v_species_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_list` (
  `species_id` tinyint NOT NULL,
  `order_name` tinyint NOT NULL,
  `family_name` tinyint NOT NULL,
  `subfamily_name` tinyint NOT NULL,
  `subclass_or_superorder_name` tinyint NOT NULL,
  `suborder_or_superfamily_name` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `sp_status` tinyint NOT NULL,
  `taxonomic_status` tinyint NOT NULL,
  `sp_comment` tinyint NOT NULL,
  `syncount` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_locality`
--

DROP TABLE IF EXISTS `now_v_species_locality`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_locality`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_locality` (
  `species_id` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `country` tinyint NOT NULL,
  `max_age` tinyint NOT NULL,
  `min_age` tinyint NOT NULL,
  `id_status` tinyint NOT NULL,
  `orig_entry` tinyint NOT NULL,
  `source_name` tinyint NOT NULL,
  `nis` tinyint NOT NULL,
  `pct` tinyint NOT NULL,
  `quad` tinyint NOT NULL,
  `mni` tinyint NOT NULL,
  `qua` tinyint NOT NULL,
  `body_mass` tinyint NOT NULL,
  `dc13_mean` tinyint NOT NULL,
  `dc13_n` tinyint NOT NULL,
  `dc13_max` tinyint NOT NULL,
  `dc13_min` tinyint NOT NULL,
  `dc13_stdev` tinyint NOT NULL,
  `do18_mean` tinyint NOT NULL,
  `do18_n` tinyint NOT NULL,
  `do18_max` tinyint NOT NULL,
  `do18_min` tinyint NOT NULL,
  `do18_stdev` tinyint NOT NULL,
  `mesowear` tinyint NOT NULL,
  `mw_or_high` tinyint NOT NULL,
  `mw_or_low` tinyint NOT NULL,
  `mw_cs_sharp` tinyint NOT NULL,
  `mw_cs_round` tinyint NOT NULL,
  `mw_cs_blunt` tinyint NOT NULL,
  `mw_scale_min` tinyint NOT NULL,
  `mw_scale_max` tinyint NOT NULL,
  `mw_value` tinyint NOT NULL,
  `microwear` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_locomotion`
--

DROP TABLE IF EXISTS `now_v_species_locomotion`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_locomotion`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_locomotion` (
  `species_id` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `feedinghab1` tinyint NOT NULL,
  `feedinghab2` tinyint NOT NULL,
  `shelterhab1` tinyint NOT NULL,
  `shelterhab2` tinyint NOT NULL,
  `locomo1` tinyint NOT NULL,
  `locomo2` tinyint NOT NULL,
  `locomo3` tinyint NOT NULL,
  `activity` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_size`
--

DROP TABLE IF EXISTS `now_v_species_size`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_size`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_size` (
  `species_id` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `body_mass` tinyint NOT NULL,
  `brain_mass` tinyint NOT NULL,
  `sv_length` tinyint NOT NULL,
  `sd_size` tinyint NOT NULL,
  `sd_display` tinyint NOT NULL,
  `pop_struc` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_statistics`
--

DROP TABLE IF EXISTS `now_v_species_statistics`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_statistics`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_statistics` (
  `year` tinyint NOT NULL,
  `month` tinyint NOT NULL,
  `surname` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_taxonomy`
--

DROP TABLE IF EXISTS `now_v_species_taxonomy`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_taxonomy`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_taxonomy` (
  `species_id` tinyint NOT NULL,
  `class_name` tinyint NOT NULL,
  `order_name` tinyint NOT NULL,
  `family_name` tinyint NOT NULL,
  `subfamily_name` tinyint NOT NULL,
  `subclass_or_superorder_name` tinyint NOT NULL,
  `suborder_or_superfamily_name` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `taxonomic_status` tinyint NOT NULL,
  `sp_author` tinyint NOT NULL,
  `sp_status` tinyint NOT NULL,
  `sp_comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_teeth`
--

DROP TABLE IF EXISTS `now_v_species_teeth`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_teeth`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_teeth` (
  `species_id` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL,
  `tshm` tinyint NOT NULL,
  `crowntype` tinyint NOT NULL,
  `tht` tinyint NOT NULL,
  `microwear` tinyint NOT NULL,
  `symph_mob` tinyint NOT NULL,
  `relative_blade_length` tinyint NOT NULL,
  `horizodonty` tinyint NOT NULL,
  `cusp_shape` tinyint NOT NULL,
  `cusp_count_buccal` tinyint NOT NULL,
  `cusp_count_lingual` tinyint NOT NULL,
  `loph_count_lon` tinyint NOT NULL,
  `loph_count_trs` tinyint NOT NULL,
  `fct_al` tinyint NOT NULL,
  `fct_ol` tinyint NOT NULL,
  `fct_sf` tinyint NOT NULL,
  `fct_ot` tinyint NOT NULL,
  `fct_cm` tinyint NOT NULL,
  `mesowear` tinyint NOT NULL,
  `mw_or_high` tinyint NOT NULL,
  `mw_or_low` tinyint NOT NULL,
  `mw_cs_sharp` tinyint NOT NULL,
  `mw_cs_round` tinyint NOT NULL,
  `mw_cs_blunt` tinyint NOT NULL,
  `mw_scale_min` tinyint NOT NULL,
  `mw_scale_max` tinyint NOT NULL,
  `mw_value` tinyint NOT NULL,
  `functional_crown_type` tinyint NOT NULL,
  `developmental_crown_type` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_update_header`
--

DROP TABLE IF EXISTS `now_v_species_update_header`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_update_header`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_update_header` (
  `suid` tinyint NOT NULL,
  `date` tinyint NOT NULL,
  `authorizer` tinyint NOT NULL,
  `coordinator` tinyint NOT NULL,
  `comment` tinyint NOT NULL,
  `species_id` tinyint NOT NULL,
  `genus_name` tinyint NOT NULL,
  `species_name` tinyint NOT NULL,
  `unique_identifier` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_species_updates`
--

DROP TABLE IF EXISTS `now_v_species_updates`;
/*!50001 DROP VIEW IF EXISTS `now_v_species_updates`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_species_updates` (
  `suid` tinyint NOT NULL,
  `species_id` tinyint NOT NULL,
  `sau_coordinator` tinyint NOT NULL,
  `sau_authorizer` tinyint NOT NULL,
  `sau_date` tinyint NOT NULL,
  `rids` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_ss_values_list`
--

DROP TABLE IF EXISTS `now_v_ss_values_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_ss_values_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_ss_values_list` (
  `ss_value` tinyint NOT NULL,
  `category` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_time_bound`
--

DROP TABLE IF EXISTS `now_v_time_bound`;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_time_bound` (
  `bid` tinyint NOT NULL,
  `b_name` tinyint NOT NULL,
  `age` tinyint NOT NULL,
  `b_comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_time_bound_header`
--

DROP TABLE IF EXISTS `now_v_time_bound_header`;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound_header`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_time_bound_header` (
  `bid` tinyint NOT NULL,
  `b_name` tinyint NOT NULL,
  `age` tinyint NOT NULL,
  `b_comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_time_bound_list`
--

DROP TABLE IF EXISTS `now_v_time_bound_list`;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_time_bound_list` (
  `bid` tinyint NOT NULL,
  `b_name` tinyint NOT NULL,
  `age` tinyint NOT NULL,
  `b_comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_time_bound_update_header`
--

DROP TABLE IF EXISTS `now_v_time_bound_update_header`;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound_update_header`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_time_bound_update_header` (
  `buid` tinyint NOT NULL,
  `date` tinyint NOT NULL,
  `authorizer` tinyint NOT NULL,
  `coordinator` tinyint NOT NULL,
  `comment` tinyint NOT NULL,
  `bid` tinyint NOT NULL,
  `b_name` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_time_bound_updates`
--

DROP TABLE IF EXISTS `now_v_time_bound_updates`;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound_updates`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_time_bound_updates` (
  `buid` tinyint NOT NULL,
  `bid` tinyint NOT NULL,
  `bau_coordinator` tinyint NOT NULL,
  `bau_authorizer` tinyint NOT NULL,
  `bau_date` tinyint NOT NULL,
  `rids` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_time_bounds_in_time_units`
--

DROP TABLE IF EXISTS `now_v_time_bounds_in_time_units`;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bounds_in_time_units`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_time_bounds_in_time_units` (
  `bid` tinyint NOT NULL,
  `tu_name` tinyint NOT NULL,
  `tu_display_name` tinyint NOT NULL,
  `up_bnd` tinyint NOT NULL,
  `low_bnd` tinyint NOT NULL,
  `rank` tinyint NOT NULL,
  `sequence` tinyint NOT NULL,
  `tu_comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_time_unit_and_bound_updates`
--

DROP TABLE IF EXISTS `now_v_time_unit_and_bound_updates`;
/*!50001 DROP VIEW IF EXISTS `now_v_time_unit_and_bound_updates`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_time_unit_and_bound_updates` (
  `time_update_id` tinyint NOT NULL,
  `tu_name` tinyint NOT NULL,
  `tu_display_name` tinyint NOT NULL,
  `tuid` tinyint NOT NULL,
  `lower_buid` tinyint NOT NULL,
  `upper_buid` tinyint NOT NULL,
  `coordinator` tinyint NOT NULL,
  `authorizer` tinyint NOT NULL,
  `date` tinyint NOT NULL,
  `comment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `now_v_time_unit_localities`
--

DROP TABLE IF EXISTS `now_v_time_unit_localities`;
/*!50001 DROP VIEW IF EXISTS `now_v_time_unit_localities`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `now_v_time_unit_localities` (
  `tu_name` tinyint NOT NULL,
  `tu_display_name` tinyint NOT NULL,
  `lid` tinyint NOT NULL,
  `loc_name` tinyint NOT NULL,
  `bfa_min` tinyint NOT NULL,
  `bfa_max` tinyint NOT NULL,
  `loc_status` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_authors`
--

LOCK TABLES `ref_authors` WRITE;
/*!40000 ALTER TABLE `ref_authors` DISABLE KEYS */;
INSERT INTO `ref_authors` VALUES (10039,2,1,'Cande','S.C.'),(21368,2,1,'Ciochon','Russell'),(24151,2,1,'Ogg','J.G.'),(24187,2,1,'Kaakinen','A.'),(24188,2,1,'Wang','X.');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_field_name`
--

LOCK TABLES `ref_field_name` WRITE;
/*!40000 ALTER TABLE `ref_field_name` DISABLE KEYS */;
INSERT INTO `ref_field_name` VALUES (1,1,'Title',1,10,0,150,0,'title_primary'),(1,2,'Title',1,10,0,150,0,'title_primary'),(1,3,'Chapter Title',1,10,0,150,0,'title_primary'),(1,4,'Title',1,10,0,150,0,'title_primary'),(1,5,'Title',1,10,0,150,0,'title_primary'),(1,6,'Title',1,10,0,150,0,'title_primary'),(1,7,'Subject',1,10,0,150,0,'title_primary'),(1,8,'Title',1,10,0,150,0,'title_primary'),(1,9,'Title',1,10,0,150,0,'title_primary'),(1,10,'',0,NULL,NULL,NULL,NULL,'title_primary'),(1,11,'Title',1,10,0,150,0,'title_primary'),(1,12,'Subject',1,10,0,150,0,'title_primary'),(1,13,'Title',1,NULL,NULL,NULL,NULL,'title_primary'),(1,14,'title_primary',1,10,0,150,0,'title_primary'),(2,1,'Authors',1,10,50,150,50,'authors_primary'),(2,2,'Authors',1,10,50,150,50,'authors_primary'),(2,3,'Authors',1,10,50,150,50,'authors_primary'),(2,4,'Authors',1,10,50,150,50,'authors_primary'),(2,5,'Authors',1,10,50,150,50,'authors_primary'),(2,6,'Authors',1,10,50,150,50,'authors_primary'),(2,7,'Sender',1,10,50,150,50,'authors_primary'),(2,8,'Authors',1,10,50,150,50,'authors_primary'),(2,9,'Authors',1,10,50,150,50,'authors_primary'),(2,10,'Authors',1,10,0,150,0,'authors_primary'),(2,11,'Authors',1,10,50,150,50,'authors_primary'),(2,12,'Authors',1,10,50,150,50,'authors_primary'),(2,13,'Authors',1,10,0,150,0,'authors_primary'),(2,14,'authors_primary',1,10,50,150,50,'authors_primary'),(3,1,'Year',1,10,135,150,135,'date_primary'),(3,2,'Year',1,10,135,150,135,'date_primary'),(3,3,'Year',1,10,135,150,135,'date_primary'),(3,4,'Year',1,10,135,150,135,'date_primary'),(3,5,'Publication Year',1,10,135,150,135,'date_primary'),(3,6,'Last Update (Year)',1,10,135,150,135,'date_primary'),(3,7,'Year',1,10,135,150,135,'date_primary'),(3,8,'Year',1,10,135,150,135,'date_primary'),(3,9,'Year',1,10,135,150,135,'date_primary'),(3,10,'Year',1,10,85,150,85,'date_primary'),(3,11,'Date',1,10,135,150,135,'date_primary'),(3,12,'Year',1,10,135,150,135,'date_primary'),(3,13,'Year',1,10,85,150,85,'date_primary'),(3,14,'date_primary',1,10,135,150,135,'date_primary'),(4,1,'Journal',1,10,155,150,155,'journal_id'),(4,2,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,3,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,4,'',0,10,195,150,195,'journal_id'),(4,5,'Journal',1,10,310,150,310,'journal_id'),(4,6,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,7,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,8,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,9,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,10,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,11,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,12,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,13,'',0,NULL,NULL,NULL,NULL,'journal_id'),(4,14,'journal_id',1,10,155,150,155,'journal_id'),(5,1,'Volume',1,150,175,150,195,'volume'),(5,2,'Edition',1,150,280,150,300,'volume'),(5,3,'Edition',1,150,290,150,310,'volume'),(5,4,'',0,150,215,150,235,'volume'),(5,5,'Volume',1,150,330,150,350,'volume'),(5,6,'',0,NULL,NULL,NULL,NULL,'volume'),(5,7,'',0,NULL,NULL,NULL,NULL,'volume'),(5,8,'Report Number',1,150,290,150,310,'volume'),(5,9,'',0,NULL,NULL,NULL,NULL,'volume'),(5,10,'',0,NULL,NULL,NULL,NULL,'volume'),(5,11,'',0,NULL,NULL,NULL,NULL,'volume'),(5,12,'',0,NULL,NULL,NULL,NULL,'volume'),(5,13,'',0,NULL,NULL,NULL,NULL,'volume'),(5,14,'volume',1,150,175,150,195,'volume'),(6,1,'Issue',1,230,175,230,195,'issue'),(6,2,'Volume',1,230,280,230,300,'issue'),(6,3,'Chapter No',1,230,290,230,310,'issue'),(6,4,'',0,230,215,230,235,'issue'),(6,5,'Edition',1,230,330,230,350,'issue'),(6,6,'',0,NULL,NULL,NULL,NULL,'issue'),(6,7,'',0,NULL,NULL,NULL,NULL,'issue'),(6,8,'',0,NULL,NULL,NULL,NULL,'issue'),(6,9,'',0,NULL,NULL,NULL,NULL,'issue'),(6,10,'',0,NULL,NULL,NULL,NULL,'issue'),(6,11,'',0,NULL,NULL,NULL,NULL,'issue'),(6,12,'',0,NULL,NULL,NULL,NULL,'issue'),(6,13,'',0,NULL,NULL,NULL,NULL,'issue'),(6,14,'issue',1,230,175,230,195,'issue'),(7,1,'Start Page',1,310,175,310,195,'start_page'),(7,2,'',0,NULL,NULL,NULL,NULL,'start_page'),(7,3,'Start Page',1,310,290,310,310,'start_page'),(7,4,'',0,310,215,310,235,'start_page'),(7,5,'Start Page',1,310,330,310,350,'start_page'),(7,6,'',0,NULL,NULL,NULL,NULL,'start_page'),(7,7,'',0,NULL,NULL,NULL,NULL,'start_page'),(7,8,'Start Page',1,230,290,230,310,'start_page'),(7,9,'',0,NULL,NULL,NULL,NULL,'start_page'),(7,10,'',0,NULL,NULL,NULL,NULL,'start_page'),(7,11,'',0,NULL,NULL,NULL,NULL,'start_page'),(7,12,'',0,NULL,NULL,NULL,NULL,'start_page'),(7,13,'',0,NULL,NULL,NULL,NULL,'start_page'),(7,14,'start_page',1,310,175,310,195,'start_page'),(8,1,'End Page',1,390,175,390,195,'end_page'),(8,2,'No of Pages',1,390,280,390,300,'end_page'),(8,3,'End Page',1,390,290,390,310,'end_page'),(8,4,'No of Pages',1,390,215,390,235,'end_page'),(8,5,'End Page',1,390,330,390,350,'end_page'),(8,6,'',0,NULL,NULL,NULL,NULL,'end_page'),(8,7,'',0,NULL,NULL,NULL,NULL,'end_page'),(8,8,'End Page',1,310,290,310,310,'end_page'),(8,9,'',0,NULL,NULL,NULL,NULL,'end_page'),(8,10,'',0,NULL,NULL,NULL,NULL,'end_page'),(8,11,'',0,NULL,NULL,NULL,NULL,'end_page'),(8,12,'',0,NULL,NULL,NULL,NULL,'end_page'),(8,13,'',0,NULL,NULL,NULL,NULL,'end_page'),(8,14,'end_page',1,390,175,390,195,'end_page'),(9,1,'Publisher',1,10,350,150,350,'publisher'),(9,2,'Publisher',1,10,240,150,240,'publisher'),(9,3,'Publisher',1,10,330,150,330,'publisher'),(9,4,'Institution',1,10,155,150,155,'publisher'),(9,5,'Publisher',1,10,370,150,370,'publisher'),(9,6,'',0,NULL,NULL,NULL,NULL,'publisher'),(9,7,'',0,NULL,NULL,NULL,NULL,'publisher'),(9,8,'Publisher',1,10,330,150,330,'publisher'),(9,9,'',0,NULL,NULL,NULL,NULL,'publisher'),(9,10,'',0,NULL,NULL,NULL,NULL,'publisher'),(9,11,'',0,NULL,NULL,NULL,NULL,'publisher'),(9,12,'',0,NULL,NULL,NULL,NULL,'publisher'),(9,13,'',0,NULL,NULL,NULL,NULL,'publisher'),(9,14,'publisher',1,10,215,150,215,'publisher'),(10,1,'City',1,10,370,150,370,'pub_place'),(10,2,'City',1,10,260,150,260,'pub_place'),(10,3,'City',1,10,350,150,350,'pub_place'),(10,4,'',0,NULL,NULL,NULL,NULL,'pub_place'),(10,5,'City',1,10,390,150,390,'pub_place'),(10,6,'',0,NULL,NULL,NULL,NULL,'pub_place'),(10,7,'',0,NULL,NULL,NULL,NULL,'pub_place'),(10,8,'Pub Place',1,10,350,150,350,'pub_place'),(10,9,'',0,NULL,NULL,NULL,NULL,'pub_place'),(10,10,'',0,NULL,NULL,NULL,NULL,'pub_place'),(10,11,'',0,NULL,NULL,NULL,NULL,'pub_place'),(10,12,'',0,NULL,NULL,NULL,NULL,'pub_place'),(10,13,'',0,NULL,NULL,NULL,NULL,'pub_place'),(10,14,'pub_place',1,10,235,150,235,'pub_place'),(11,1,'Title of Issue',1,10,215,150,215,'title_secondary'),(11,2,'',0,NULL,NULL,NULL,NULL,'title_secondary'),(11,3,'Book Title',1,10,155,150,155,'title_secondary'),(11,4,'',0,NULL,NULL,NULL,NULL,'title_secondary'),(11,5,'Title of Conference',1,10,155,150,155,'title_secondary'),(11,6,'Organisation',1,10,175,150,175,'title_secondary'),(11,7,'',0,NULL,NULL,NULL,NULL,'title_secondary'),(11,8,'Report Name',1,10,155,150,155,'title_secondary'),(11,9,'Organisation',1,10,155,150,155,'title_secondary'),(11,10,'',0,NULL,NULL,NULL,NULL,'title_secondary'),(11,11,'Organisation',1,10,155,150,155,'title_secondary'),(11,12,'',0,NULL,NULL,NULL,NULL,'title_secondary'),(11,13,'',0,NULL,NULL,NULL,NULL,'title_secondary'),(11,14,'title_secondary',1,10,255,150,255,'title_secondary'),(12,1,'Editors of Issue',1,10,265,150,265,'authors_secondary'),(12,2,'Editors',1,10,155,150,155,'authors_secondary'),(12,3,'Editors',1,10,205,150,205,'authors_secondary'),(12,4,'',0,NULL,NULL,NULL,NULL,'authors_secondary'),(12,5,'Editors',1,10,205,150,205,'authors_secondary'),(12,6,'Editors',1,10,305,150,305,'authors_secondary'),(12,7,'Recipient',1,10,155,150,155,'authors_secondary'),(12,8,'Editors',1,10,205,150,205,'authors_secondary'),(12,9,'Editors',1,10,205,150,205,'authors_secondary'),(12,10,'Recipients',1,10,105,150,105,'authors_secondary'),(12,11,'Editors',1,10,205,150,205,'authors_secondary'),(12,12,'',0,NULL,NULL,NULL,NULL,'authors_secondary'),(12,13,'',0,NULL,NULL,NULL,NULL,'authors_secondary'),(12,14,'authors_secondary',1,10,305,150,305,'authors_secondary'),(13,1,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,2,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,3,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,4,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,5,'Year of Conference',1,10,290,150,290,'date_secondary'),(13,6,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,7,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,8,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,9,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,10,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,11,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,12,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,13,'',0,NULL,NULL,NULL,NULL,'date_secondary'),(13,14,'date_secondary',1,10,390,150,390,'date_secondary'),(14,1,'Series Title',1,10,390,150,390,'title_series'),(14,2,'Series Title',1,10,320,150,320,'title_series'),(14,3,'Series Title',1,10,370,150,370,'title_series'),(14,4,'',0,NULL,NULL,NULL,NULL,'title_series'),(14,5,'Series Title',1,10,410,150,410,'title_series'),(14,6,'',0,NULL,NULL,NULL,NULL,'title_series'),(14,7,'',0,NULL,NULL,NULL,NULL,'title_series'),(14,8,'Series Title',1,10,370,150,370,'title_series'),(14,9,'Series Title',1,10,290,150,290,'title_series'),(14,10,'',0,NULL,NULL,NULL,NULL,'title_series'),(14,11,'Series Title',1,10,290,150,290,'title_series'),(14,12,'',0,NULL,NULL,NULL,NULL,'title_series'),(14,13,'',0,NULL,NULL,NULL,NULL,'title_series'),(14,14,'title_series',1,10,410,150,410,'title_series'),(15,1,'',0,NULL,NULL,NULL,NULL,'authors_series'),(15,2,'Series Editors',1,10,370,150,370,'authors_series'),(15,3,'Series Editors',1,10,440,150,440,'authors_series'),(15,4,'',0,NULL,NULL,NULL,NULL,'authors_series'),(15,5,'Series Editors',1,10,460,150,460,'authors_series'),(15,6,'',0,NULL,NULL,NULL,NULL,'authors_series'),(15,7,'',0,NULL,NULL,NULL,NULL,'authors_series'),(15,8,'Series Editors',1,10,420,150,420,'authors_series'),(15,9,'Series Editors',1,10,340,150,340,'authors_series'),(15,10,'',0,NULL,NULL,NULL,NULL,'authors_series'),(15,11,'Series Editors',1,10,340,150,340,'authors_series'),(15,12,'',0,NULL,NULL,NULL,NULL,'authors_series'),(15,13,'',0,NULL,NULL,NULL,NULL,'authors_series'),(15,14,'authors_series',1,10,460,150,460,'authors_series'),(16,1,'ISSN/ISBN',1,10,510,150,510,'issn_isbn'),(16,2,'ISBN',1,10,525,150,525,'issn_isbn'),(16,3,'ISBN',1,10,595,150,595,'issn_isbn'),(16,4,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,5,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,6,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,7,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,8,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,9,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,10,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,11,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,12,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,13,'',0,NULL,NULL,NULL,NULL,'issn_isbn'),(16,14,'issn_isbn',1,10,545,150,545,'issn_isbn'),(17,1,'Abstract',1,10,550,150,550,'ref_abstract'),(17,2,'Abstract',1,10,565,150,565,'ref_abstract'),(17,3,'Abstract',1,10,635,150,635,'ref_abstract'),(17,4,'Abstract',1,10,315,150,315,'ref_abstract'),(17,5,'Abstract',1,10,635,150,635,'ref_abstract'),(17,6,'Abstract',1,10,390,150,390,'ref_abstract'),(17,7,'',0,NULL,NULL,NULL,NULL,'ref_abstract'),(17,8,'Abstract',1,10,595,150,595,'ref_abstract'),(17,9,'Abstract',1,10,515,150,515,'ref_abstract'),(17,10,'',0,NULL,NULL,NULL,NULL,'ref_abstract'),(17,11,'Abstract',0,10,515,150,515,'ref_abstract'),(17,12,'',0,NULL,NULL,NULL,NULL,'ref_abstract'),(17,13,'',0,NULL,NULL,NULL,NULL,'ref_abstract'),(17,14,'abstract',1,10,565,150,565,'ref_abstract'),(18,1,'Web/URL',1,10,530,150,530,'web_url'),(18,2,'Web/URL',1,10,545,150,545,'web_url'),(18,3,'Web/URL',1,10,615,150,615,'web_url'),(18,4,'Web/URL',1,10,295,150,295,'web_url'),(18,5,'Web/URL',1,10,615,150,615,'web_url'),(18,6,'Web/URL',1,10,195,150,195,'web_url'),(18,7,'',0,NULL,NULL,NULL,NULL,'web_url'),(18,8,'Web/URL',1,10,575,150,575,'web_url'),(18,9,'Web/URL',1,10,495,150,495,'web_url'),(18,10,'',0,NULL,NULL,NULL,NULL,'web_url'),(18,11,'',0,NULL,NULL,NULL,NULL,'web_url'),(18,12,'',0,NULL,NULL,NULL,NULL,'web_url'),(18,13,'',0,NULL,NULL,NULL,NULL,'web_url'),(18,14,'web_url',1,10,615,150,615,'web_url'),(19,1,'',0,NULL,NULL,NULL,NULL,'misc_1'),(19,2,'',0,NULL,NULL,NULL,NULL,'misc_1'),(19,3,'No of Volumes',0,NULL,NULL,NULL,NULL,'misc_1'),(19,4,'Degree',1,10,175,150,175,'misc_1'),(19,5,'',0,NULL,NULL,NULL,NULL,'misc_1'),(19,6,'Last Update (Day Month)',1,10,155,150,155,'misc_1'),(19,7,'Sender\'s e-mail',1,10,260,150,260,'misc_1'),(19,8,'',0,NULL,NULL,NULL,NULL,'misc_1'),(19,9,'',0,NULL,NULL,NULL,NULL,'misc_1'),(19,10,'Type',1,10,190,150,190,'misc_1'),(19,11,'',0,NULL,NULL,NULL,NULL,'misc_1'),(19,12,'',0,NULL,NULL,NULL,NULL,'misc_1'),(19,13,'',0,NULL,NULL,NULL,NULL,'misc_1'),(19,14,'misc_1',1,10,635,150,635,'misc_1'),(20,1,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,2,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,3,'Volume',1,10,420,150,420,'misc_2'),(20,4,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,5,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,6,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,7,'Recipient\'s e-mail',1,10,280,150,280,'misc_2'),(20,8,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,9,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,10,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,11,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,12,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,13,'',0,NULL,NULL,NULL,NULL,'misc_2'),(20,14,'misc_2',1,10,655,150,655,'misc_2'),(21,1,'Notes',1,10,460,150,460,'gen_notes'),(21,2,'Notes',1,10,475,150,475,'gen_notes'),(21,3,'Notes',1,10,545,150,545,'gen_notes'),(21,4,'Notes',1,10,275,150,275,'gen_notes'),(21,5,'Notes',1,10,565,150,565,'gen_notes'),(21,6,'Notes',1,10,255,150,255,'gen_notes'),(21,7,'Notes',1,10,320,150,320,'gen_notes'),(21,8,'Notes',1,10,525,150,525,'gen_notes'),(21,9,'Notes',1,10,445,150,445,'gen_notes'),(21,10,'Notes',1,10,250,150,250,'gen_notes'),(21,11,'Notes',1,10,445,150,445,'gen_notes'),(21,12,'Notes',1,10,155,150,155,'gen_notes'),(21,13,'Notes',1,10,105,150,105,'gen_notes'),(21,14,'gen_notes',1,10,675,150,675,'gen_notes'),(22,1,'Language',1,10,440,150,440,'printed_language'),(22,2,'Language',1,10,455,150,455,'printed_language'),(22,3,'Language',1,10,525,150,525,'printed_language'),(22,4,'Language',1,10,255,150,255,'printed_language'),(22,5,'Language',1,10,545,150,545,'printed_language'),(22,6,'Language',1,10,235,150,235,'printed_language'),(22,7,'Language',1,10,300,150,300,'printed_language'),(22,8,'Language',1,10,505,150,505,'printed_language'),(22,9,'Language',1,10,425,150,425,'printed_language'),(22,10,'Language',1,10,230,150,230,'printed_language'),(22,11,'Language',1,10,425,150,425,'printed_language'),(22,12,'',0,NULL,NULL,NULL,NULL,'printed_language'),(22,13,'',0,NULL,NULL,NULL,NULL,'printed_language'),(22,14,'language',1,10,725,150,725,'printed_language'),(23,1,'',0,NULL,NULL,NULL,NULL,'exact_date'),(23,2,'',0,NULL,NULL,NULL,NULL,'exact_date'),(23,3,'',0,NULL,NULL,NULL,NULL,'exact_date'),(23,4,'',0,NULL,NULL,NULL,NULL,'exact_date'),(23,5,'',0,NULL,NULL,NULL,NULL,'exact_date'),(23,6,'Access Date',1,10,215,150,215,'exact_date'),(23,7,'Date of Message',1,10,240,150,240,'exact_date'),(23,8,'',0,NULL,NULL,NULL,NULL,'exact_date'),(23,9,'',0,NULL,NULL,NULL,NULL,'exact_date'),(23,10,'Date Sent',1,10,210,150,210,'exact_date'),(23,11,'Date',1,10,495,150,495,'exact_date'),(23,12,'Date',1,10,205,150,205,'exact_date'),(23,13,'Date',1,10,155,150,155,'exact_date'),(23,14,'exact_date',1,10,745,150,745,'exact_date');
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
) ENGINE=InnoDB AUTO_INCREMENT=769 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_journal`
--

LOCK TABLES `ref_journal` WRITE;
/*!40000 ALTER TABLE `ref_journal` DISABLE KEYS */;
INSERT INTO `ref_journal` VALUES (100,'Geology','Geology','','0091-7613');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=25781 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_ref`
--

LOCK TABLES `ref_ref` WRITE;
/*!40000 ALTER TABLE `ref_ref` DISABLE KEYS */;
INSERT INTO `ref_ref` VALUES (10039,1,100,'A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic',1992,'97',NULL,13917,13951,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL),(21368,1,100,'Dated co-occurrence of Homo erectus and Gigantopithecus from Tham Khuyen Cave, Vietnam',1996,'93',NULL,3016,3020,NULL,NULL,NULL,NULL,NULL,NULL,'abstract','http://www.pnas.org/cgi/reprint/93/7/3016',NULL,NULL,NULL,'English',NULL,NULL,1,NULL),(24151,2,NULL,'A Concise Geologic Time Scale: 2016',2016,NULL,NULL,NULL,240,'Elsevier',NULL,NULL,NULL,NULL,'9780444594686',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0),(24187,13,NULL,'Helsinki Asian time update',2020,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2020-01-29',NULL,1,NULL),(24188,2,NULL,'Fossil Mammals of Asia',2013,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_ref_type`
--

LOCK TABLES `ref_ref_type` WRITE;
/*!40000 ALTER TABLE `ref_ref_type` DISABLE KEYS */;
INSERT INTO `ref_ref_type` VALUES (1,'Journal'),(2,'Book'),(3,'Book Chapter'),(4,'Thesis/Dissertation'),(5,'Conference Proceeding'),(6,'Electronic Citation'),(7,'Internet Communication'),(8,'Report'),(9,'Unpublished Work'),(10,'Personal Communication'),(11,'Manuscript'),(12,'Notes'),(13,'Editing'),(14,'Undefined');
/*!40000 ALTER TABLE `ref_ref_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `now_v_coll_meth_values_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_coll_meth_values_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_coll_meth_values_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_coll_meth_values_list` AS select `now_coll_meth_values`.`coll_meth_value` AS `coll_meth_value` from `now_coll_meth_values` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_export_loc`
--

/*!50001 DROP TABLE IF EXISTS `now_v_export_loc`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_export_loc`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_export_loc` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`state` AS `state`,`now_loc`.`county` AS `county`,`now_loc`.`dms_lat` AS `dms_lat`,`now_loc`.`dms_long` AS `dms_long`,`now_loc`.`dec_lat` AS `dec_lat`,`now_loc`.`dec_long` AS `dec_long`,`now_loc`.`altitude` AS `altitude`,`now_loc`.`max_age` AS `max_age`,`now_loc`.`bfa_max` AS `bfa_max`,`now_loc`.`bfa_max_abs` AS `bfa_max_abs`,`now_loc`.`frac_max` AS `frac_max`,`now_loc`.`min_age` AS `min_age`,`now_loc`.`bfa_min` AS `bfa_min`,`now_loc`.`bfa_min_abs` AS `bfa_min_abs`,`now_loc`.`frac_min` AS `frac_min`,`now_loc`.`chron` AS `chron`,`now_loc`.`age_comm` AS `age_comm`,`now_loc`.`basin` AS `basin`,`now_loc`.`subbasin` AS `subbasin`,`now_loc`.`appr_num_spm` AS `appr_num_spm`,`now_loc`.`gen_loc` AS `gen_loc`,group_concat(`now_syn_loc`.`synonym` separator ', ') AS `loc_synonyms`,`now_loc`.`estimate_precip` AS `estimate_precip`,`now_loc`.`estimate_temp` AS `estimate_temp`,`now_loc`.`estimate_npp` AS `estimate_npp`,`now_loc`.`pers_woody_cover` AS `pers_woody_cover`,`now_loc`.`pers_pollen_ap` AS `pers_pollen_ap`,`now_loc`.`pers_pollen_nap` AS `pers_pollen_nap`,`now_loc`.`pers_pollen_other` AS `pers_pollen_other`,`now_loc`.`hominin_skeletal_remains` AS `hominin_skeletal_remains`,`now_loc`.`bipedal_footprints` AS `bipedal_footprints`,`now_loc`.`stone_tool_technology` AS `stone_tool_technology`,`now_loc`.`stone_tool_cut_marks_on_bones` AS `stone_tool_cut_marks_on_bones`,`now_loc`.`technological_mode_1` AS `technological_mode_1`,`now_loc`.`cultural_stage_1` AS `cultural_stage_1`,`now_loc`.`regional_culture_1` AS `regional_culture_1`,`now_loc`.`technological_mode_2` AS `technological_mode_2`,`now_loc`.`cultural_stage_2` AS `cultural_stage_2`,`now_loc`.`regional_culture_2` AS `regional_culture_2`,`now_loc`.`technological_mode_3` AS `technological_mode_3`,`now_loc`.`cultural_stage_3` AS `cultural_stage_3`,`now_loc`.`regional_culture_3` AS `regional_culture_3`,`now_loc`.`loc_status` AS `loc_status`,'\\N' AS `mean_hypsodonty` from (`now_loc` left join `now_syn_loc` on(`now_loc`.`lid` = `now_syn_loc`.`lid`)) group by `now_loc`.`lid` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_export_locsp`
--

/*!50001 DROP TABLE IF EXISTS `now_v_export_locsp`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_export_locsp`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_export_locsp` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`state` AS `state`,`now_loc`.`county` AS `county`,`now_loc`.`dms_lat` AS `dms_lat`,`now_loc`.`dms_long` AS `dms_long`,`now_loc`.`dec_lat` AS `dec_lat`,`now_loc`.`dec_long` AS `dec_long`,`now_loc`.`altitude` AS `altitude`,`now_loc`.`max_age` AS `max_age`,`now_loc`.`bfa_max` AS `bfa_max`,`now_loc`.`bfa_max_abs` AS `bfa_max_abs`,`now_loc`.`frac_max` AS `frac_max`,`now_loc`.`min_age` AS `min_age`,`now_loc`.`bfa_min` AS `bfa_min`,`now_loc`.`bfa_min_abs` AS `bfa_min_abs`,`now_loc`.`frac_min` AS `frac_min`,`now_loc`.`chron` AS `chron`,`now_loc`.`age_comm` AS `age_comm`,`now_loc`.`basin` AS `basin`,`now_loc`.`subbasin` AS `subbasin`,`now_loc`.`appr_num_spm` AS `appr_num_spm`,`now_loc`.`gen_loc` AS `gen_loc`,(select group_concat(`now_syn_loc`.`synonym` separator ', ') from `now_syn_loc` where `now_syn_loc`.`lid` = `now_loc`.`lid`) AS `loc_synonyms`,`now_loc`.`estimate_precip` AS `estimate_precip`,`now_loc`.`estimate_temp` AS `estimate_temp`,`now_loc`.`estimate_npp` AS `estimate_npp`,`now_loc`.`pers_woody_cover` AS `pers_woody_cover`,`now_loc`.`pers_pollen_ap` AS `pers_pollen_ap`,`now_loc`.`pers_pollen_nap` AS `pers_pollen_nap`,`now_loc`.`pers_pollen_other` AS `pers_pollen_other`,`now_loc`.`hominin_skeletal_remains` AS `hominin_skeletal_remains`,`now_loc`.`bipedal_footprints` AS `bipedal_footprints`,`now_loc`.`stone_tool_technology` AS `stone_tool_technology`,`now_loc`.`stone_tool_cut_marks_on_bones` AS `stone_tool_cut_marks_on_bones`,`now_loc`.`technological_mode_1` AS `technological_mode_1`,`now_loc`.`cultural_stage_1` AS `cultural_stage_1`,`now_loc`.`regional_culture_1` AS `regional_culture_1`,`now_loc`.`technological_mode_2` AS `technological_mode_2`,`now_loc`.`cultural_stage_2` AS `cultural_stage_2`,`now_loc`.`regional_culture_2` AS `regional_culture_2`,`now_loc`.`technological_mode_3` AS `technological_mode_3`,`now_loc`.`cultural_stage_3` AS `cultural_stage_3`,`now_loc`.`regional_culture_3` AS `regional_culture_3`,`now_loc`.`loc_status` AS `loc_status`,'\\N' AS `mean_hypsodonty`,`com_species`.`species_id` AS `species_id`,`com_species`.`order_name` AS `order_name`,`com_species`.`family_name` AS `family_name`,`com_species`.`subfamily_name` AS `subfamily_name`,`com_species`.`subclass_or_superorder_name` AS `subclass_or_superorder_name`,`com_species`.`suborder_or_superfamily_name` AS `suborder_or_superfamily_name`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`taxonomic_status` AS `taxonomic_status`,`com_species`.`body_mass` AS `body_mass`,`com_species`.`sv_length` AS `sv_length`,`com_species`.`sd_size` AS `sd_size`,`com_species`.`sd_display` AS `sd_display`,`com_species`.`tshm` AS `tshm`,`com_species`.`tht` AS `tht`,`com_species`.`crowntype` AS `crowntype`,`com_species`.`diet1` AS `diet1`,`com_species`.`diet2` AS `diet2`,`com_species`.`diet3` AS `diet3`,`com_species`.`locomo1` AS `locomo1`,`com_species`.`locomo2` AS `locomo2`,`com_species`.`locomo3` AS `locomo3`,`com_species`.`horizodonty` AS `horizodonty`,`com_species`.`microwear` AS `microwear`,`com_species`.`mesowear` AS `mesowear`,`com_species`.`mw_or_high` AS `mw_or_high`,`com_species`.`mw_or_low` AS `mw_or_low`,`com_species`.`mw_cs_sharp` AS `mw_cs_sharp`,`com_species`.`mw_cs_round` AS `mw_cs_round`,`com_species`.`mw_cs_blunt` AS `mw_cs_blunt`,`com_species`.`mw_scale_min` AS `mw_scale_min`,`com_species`.`mw_scale_max` AS `mw_scale_max`,`com_species`.`mw_value` AS `mw_value`,`com_species`.`cusp_shape` AS `cusp_shape`,`com_species`.`cusp_count_buccal` AS `cusp_count_buccal`,`com_species`.`cusp_count_lingual` AS `cusp_count_lingual`,`com_species`.`loph_count_lon` AS `loph_count_lon`,`com_species`.`loph_count_trs` AS `loph_count_trs`,`com_species`.`fct_al` AS `fct_al`,`com_species`.`fct_ol` AS `fct_ol`,`com_species`.`fct_sf` AS `fct_sf`,`com_species`.`fct_ot` AS `fct_ot`,`com_species`.`fct_cm` AS `fct_cm`,`com_species`.`sp_status` AS `sp_status`,`com_species`.`sp_comment` AS `sp_comment`,(select group_concat(concat(`com_taxa_synonym`.`syn_genus_name`,' ',`com_taxa_synonym`.`syn_species_name`) order by `com_taxa_synonym`.`syn_genus_name` ASC separator ':') from `com_taxa_synonym` where `com_taxa_synonym`.`species_id` = `com_species`.`species_id`) AS `sp_synonyms`,(select group_concat(`com_taxa_synonym`.`syn_comment` order by `com_taxa_synonym`.`syn_genus_name` ASC separator ':') from `com_taxa_synonym` where `com_taxa_synonym`.`species_id` = `com_species`.`species_id`) AS `sp_synonyms_comment`,`now_ls`.`id_status` AS `id_status`,`now_ls`.`orig_entry` AS `orig_entry`,`now_ls`.`source_name` AS `source_name`,`now_ls`.`microwear` AS `ls_microwear`,`now_ls`.`mesowear` AS `ls_mesowear`,`now_ls`.`mw_or_low` AS `ls_mw_or_low`,`now_ls`.`mw_or_high` AS `ls_mw_or_high`,`now_ls`.`mw_cs_sharp` AS `ls_mw_cs_sharp`,`now_ls`.`mw_cs_round` AS `ls_mw_cs_round`,`now_ls`.`mw_cs_blunt` AS `ls_mw_cs_blunt`,`now_ls`.`mw_scale_min` AS `ls_mw_scale_min`,`now_ls`.`mw_scale_max` AS `ls_mw_scale_max`,`now_ls`.`mw_value` AS `ls_mw_value`,'\\N' AS `ls_mesowear_score` from ((`now_ls` left join `now_loc` on(`now_ls`.`lid` = `now_loc`.`lid`)) left join `com_species` on(`now_ls`.`species_id` = `com_species`.`species_id`)) where `com_species`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_export_nonassociated_species`
--

/*!50001 DROP TABLE IF EXISTS `now_v_export_nonassociated_species`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_export_nonassociated_species`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_export_nonassociated_species` AS select '\\N' AS `lid`,'\\N' AS `loc_name`,'\\N' AS `country`,'\\N' AS `state`,'\\N' AS `county`,'\\N' AS `dms_lat`,'\\N' AS `dms_long`,'\\N' AS `dec_lat`,'\\N' AS `dec_long`,'\\N' AS `altitude`,'\\N' AS `max_age`,'\\N' AS `bfa_max`,'\\N' AS `bfa_max_abs`,'\\N' AS `frac_max`,'\\N' AS `min_age`,'\\N' AS `bfa_min`,'\\N' AS `bfa_min_abs`,'\\N' AS `frac_min`,'\\N' AS `chron`,'\\N' AS `age_comm`,'\\N' AS `basin`,'\\N' AS `subbasin`,'\\N' AS `appr_num_spm`,'\\N' AS `gen_loc`,'\\N' AS `loc_synonyms`,'\\N' AS `estimate_precip`,'\\N' AS `estimate_temp`,'\\N' AS `estimate_npp`,'\\N' AS `pers_woody_cover`,'\\N' AS `pers_pollen_ap`,'\\N' AS `pers_pollen_nap`,'\\N' AS `pers_pollen_other`,'\\N' AS `hominin_skeletal_remains`,'\\N' AS `bipedal_footprints`,'\\N' AS `stone_tool_technology`,'\\N' AS `stone_tool_cut_marks_on_bones`,'\\N' AS `technological_mode_1`,'\\N' AS `cultural_stage_1`,'\\N' AS `regional_culture_1`,'\\N' AS `technological_mode_2`,'\\N' AS `cultural_stage_2`,'\\N' AS `regional_culture_2`,'\\N' AS `technological_mode_3`,'\\N' AS `cultural_stage_3`,'\\N' AS `regional_culture_3`,'\\N' AS `loc_status`,'\\N' AS `mean_hypsodonty`,`com_species`.`species_id` AS `species_id`,`com_species`.`order_name` AS `order_name`,`com_species`.`family_name` AS `family_name`,`com_species`.`subfamily_name` AS `subfamily_name`,`com_species`.`subclass_or_superorder_name` AS `subclass_or_superorder_name`,`com_species`.`suborder_or_superfamily_name` AS `suborder_or_superfamily_name`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`taxonomic_status` AS `taxonomic_status`,`com_species`.`body_mass` AS `body_mass`,`com_species`.`sv_length` AS `sv_length`,`com_species`.`sd_size` AS `sd_size`,`com_species`.`sd_display` AS `sd_display`,`com_species`.`tshm` AS `tshm`,`com_species`.`tht` AS `tht`,`com_species`.`crowntype` AS `crowntype`,`com_species`.`diet1` AS `diet1`,`com_species`.`diet2` AS `diet2`,`com_species`.`diet3` AS `diet3`,`com_species`.`locomo1` AS `locomo1`,`com_species`.`locomo2` AS `locomo2`,`com_species`.`locomo3` AS `locomo3`,`com_species`.`horizodonty` AS `horizodonty`,`com_species`.`microwear` AS `microwear`,`com_species`.`mesowear` AS `mesowear`,`com_species`.`mw_or_high` AS `mw_or_high`,`com_species`.`mw_or_low` AS `mw_or_low`,`com_species`.`mw_cs_sharp` AS `mw_cs_sharp`,`com_species`.`mw_cs_round` AS `mw_cs_round`,`com_species`.`mw_cs_blunt` AS `mw_cs_blunt`,`com_species`.`mw_scale_min` AS `mw_scale_min`,`com_species`.`mw_scale_max` AS `mw_scale_max`,`com_species`.`mw_value` AS `mw_value`,`com_species`.`cusp_shape` AS `cusp_shape`,`com_species`.`cusp_count_buccal` AS `cusp_count_buccal`,`com_species`.`cusp_count_lingual` AS `cusp_count_lingual`,`com_species`.`loph_count_lon` AS `loph_count_lon`,`com_species`.`loph_count_trs` AS `loph_count_trs`,`com_species`.`fct_al` AS `fct_al`,`com_species`.`fct_ol` AS `fct_ol`,`com_species`.`fct_sf` AS `fct_sf`,`com_species`.`fct_ot` AS `fct_ot`,`com_species`.`fct_cm` AS `fct_cm`,`com_species`.`sp_status` AS `sp_status`,`com_species`.`sp_comment` AS `sp_comment`,(select group_concat(concat(`com_taxa_synonym`.`syn_genus_name`,' ',`com_taxa_synonym`.`syn_species_name`) order by `com_taxa_synonym`.`syn_genus_name` ASC separator ':') from `com_taxa_synonym` where `com_taxa_synonym`.`species_id` = `com_species`.`species_id`) AS `sp_synonyms`,(select group_concat(`com_taxa_synonym`.`syn_comment` order by `com_taxa_synonym`.`syn_genus_name` ASC separator ':') from `com_taxa_synonym` where `com_taxa_synonym`.`species_id` = `com_species`.`species_id`) AS `sp_synonyms_comment`,'\\N' AS `id_status`,'\\N' AS `orig_entry`,'\\N' AS `source_name`,'\\N' AS `ls_microwear`,'\\N' AS `ls_mesowear`,'\\N' AS `ls_mw_or_low`,'\\N' AS `ls_mw_or_high`,'\\N' AS `ls_mw_cs_sharp`,'\\N' AS `ls_mw_cs_round`,'\\N' AS `ls_mw_cs_blunt`,'\\N' AS `ls_mw_scale_min`,'\\N' AS `ls_mw_scale_max`,'\\N' AS `ls_mw_value`,'\\N' AS `ls_mesowear_score` from `com_species` where !(`com_species`.`species_id` in (select `now_ls`.`species_id` from `now_ls`)) and `com_species`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_age`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_age`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_age`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_age` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`date_meth` AS `date_meth`,`now_loc`.`min_age` AS `min_age`,`now_loc`.`bfa_min_abs` AS `bfa_min_abs`,`now_loc`.`bfa_min` AS `bfa_min`,`now_loc`.`frac_min` AS `frac_min`,`now_loc`.`max_age` AS `max_age`,`now_loc`.`bfa_max_abs` AS `bfa_max_abs`,`now_loc`.`bfa_max` AS `bfa_max`,`now_loc`.`frac_max` AS `frac_max`,`now_loc`.`chron` AS `chron`,`now_loc`.`age_comm` AS `age_comm`,`now_loc`.`basin` AS `basin`,`now_loc`.`subbasin` AS `subbasin`,`now_loc`.`lgroup` AS `lgroup`,`now_loc`.`formation` AS `formation`,`now_loc`.`member` AS `member`,`now_loc`.`bed` AS `bed`,`now_loc`.`datum_plane` AS `datum_plane`,`now_loc`.`tos` AS `tos`,`now_loc`.`bos` AS `bos` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_archaeology`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_archaeology`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_archaeology`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_archaeology` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`hominin_skeletal_remains` AS `hominin_skeletal_remains`,`now_loc`.`bipedal_footprints` AS `bipedal_footprints`,`now_loc`.`stone_tool_technology` AS `stone_tool_technology`,`now_loc`.`stone_tool_cut_marks_on_bones` AS `stone_tool_cut_marks_on_bones`,`now_loc`.`technological_mode_1` AS `technological_mode_1`,`now_loc`.`cultural_stage_1` AS `cultural_stage_1`,`now_loc`.`regional_culture_1` AS `regional_culture_1`,`now_loc`.`technological_mode_2` AS `technological_mode_2`,`now_loc`.`cultural_stage_2` AS `cultural_stage_2`,`now_loc`.`regional_culture_2` AS `regional_culture_2`,`now_loc`.`technological_mode_3` AS `technological_mode_3`,`now_loc`.`cultural_stage_3` AS `cultural_stage_3`,`now_loc`.`regional_culture_3` AS `regional_culture_3` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_climate`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_climate`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_climate`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_climate` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`climate_type` AS `climate_type`,`now_loc`.`temperature` AS `temperature`,`now_loc`.`moisture` AS `moisture`,`now_loc`.`disturb` AS `disturb`,`now_loc`.`biome` AS `biome`,`now_loc`.`v_ht` AS `v_ht`,`now_loc`.`v_struct` AS `v_struct`,`now_loc`.`pri_prod` AS `pri_prod`,`now_loc`.`v_envi_det` AS `v_envi_det`,`now_loc`.`seasonality` AS `seasonality`,`now_loc`.`seas_intens` AS `seas_intens`,`now_loc`.`nutrients` AS `nutrients`,`now_loc`.`water` AS `water`,`now_loc`.`pers_pollen_ap` AS `pers_pollen_ap`,`now_loc`.`pers_pollen_nap` AS `pers_pollen_nap`,`now_loc`.`pers_pollen_other` AS `pers_pollen_other` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_ecometrics`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_ecometrics`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_ecometrics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_ecometrics` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`estimate_precip` AS `estimate_precip`,`now_loc`.`estimate_temp` AS `estimate_temp`,`now_loc`.`estimate_npp` AS `estimate_npp`,`now_loc`.`pers_woody_cover` AS `pers_woody_cover` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_ecometrics_mean_hypsodonty`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_ecometrics_mean_hypsodonty`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_ecometrics_mean_hypsodonty`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_ecometrics_mean_hypsodonty` AS select `now_ls`.`lid` AS `lid`,round(sum(case when `com_species`.`tht` = 'bra' then 1 when `com_species`.`tht` = 'mes' then 2 when `com_species`.`tht` = 'hyp' or `com_species`.`tht` = 'hys' then 3 else 0 end) / count(nullif(`com_species`.`tht`,'')),2) AS `mean_hypsodonty` from (`now_ls` left join `com_species` on(`com_species`.`species_id` = `now_ls`.`species_id`)) where `com_species`.`order_name` in ('Perissodactyla','Artiodactyla','Primates','Proboscidea','Hyracoidea','Dinocerata','Embrithopoda','Notoungulata','Astrapotheria','Pyrotheria','Litopterna','Condylarthra','Pantodonta') group by `now_ls`.`lid` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_header`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_header`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_header`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_header` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`state` AS `state`,`now_loc`.`county` AS `county`,`now_loc`.`site_area` AS `site_area`,`now_loc`.`dms_lat` AS `dms_lat`,`now_loc`.`dms_long` AS `dms_long`,`now_loc`.`dec_lat` AS `dec_lat`,`now_loc`.`dec_long` AS `dec_long`,`now_loc`.`approx_coord` AS `approx_coord`,`now_loc`.`altitude` AS `altitude`,`now_loc`.`max_age` AS `max_age`,`now_loc`.`bfa_max` AS `bfa_max`,`now_loc`.`bfa_max_abs` AS `bfa_max_abs`,`now_loc`.`min_age` AS `min_age`,`now_loc`.`bfa_min` AS `bfa_min`,`now_loc`.`bfa_min_abs` AS `bfa_min_abs`,`now_loc`.`date_meth` AS `date_meth`,`now_loc`.`frac_max` AS `frac_max`,`now_loc`.`frac_min` AS `frac_min`,`now_loc`.`age_comm` AS `age_comm`,`now_loc`.`chron` AS `chron`,`now_loc`.`basin` AS `basin`,`now_loc`.`subbasin` AS `subbasin`,`now_loc`.`loc_status` AS `loc_status`,`now_loc`.`gen_loc` AS `gen_loc`,`now_loc`.`plate` AS `plate`,`now_loc`.`loc_detail` AS `loc_detail`,`now_loc`.`lgroup` AS `lgroup`,`now_loc`.`formation` AS `formation`,`now_loc`.`member` AS `member`,`now_loc`.`bed` AS `bed`,`now_loc`.`datum_plane` AS `datum_plane`,`now_loc`.`tos` AS `tos`,`now_loc`.`bos` AS `bos`,`now_loc`.`rock_type` AS `rock_type`,`now_loc`.`rt_adj` AS `rt_adj`,`now_loc`.`lith_comm` AS `lith_comm`,`now_loc`.`depo_context1` AS `depo_context1`,`now_loc`.`depo_context2` AS `depo_context2`,`now_loc`.`depo_context3` AS `depo_context3`,`now_loc`.`depo_context4` AS `depo_context4`,`now_loc`.`depo_comm` AS `depo_comm`,`now_loc`.`sed_env_1` AS `sed_env_1`,`now_loc`.`sed_env_2` AS `sed_env_2`,`now_loc`.`event_circum` AS `event_circum`,`now_loc`.`se_comm` AS `se_comm`,`now_loc`.`climate_type` AS `climate_type`,`now_loc`.`biome` AS `biome`,`now_loc`.`v_ht` AS `v_ht`,`now_loc`.`v_struct` AS `v_struct`,`now_loc`.`v_envi_det` AS `v_envi_det`,`now_loc`.`disturb` AS `disturb`,`now_loc`.`nutrients` AS `nutrients`,`now_loc`.`water` AS `water`,`now_loc`.`seasonality` AS `seasonality`,`now_loc`.`seas_intens` AS `seas_intens`,`now_loc`.`pri_prod` AS `pri_prod`,`now_loc`.`moisture` AS `moisture`,`now_loc`.`temperature` AS `temperature`,`now_loc`.`assem_fm` AS `assem_fm`,`now_loc`.`transport` AS `transport`,`now_loc`.`trans_mod` AS `trans_mod`,`now_loc`.`weath_trmp` AS `weath_trmp`,`now_loc`.`pt_conc` AS `pt_conc`,`now_loc`.`size_type` AS `size_type`,`now_loc`.`vert_pres` AS `vert_pres`,`now_loc`.`plant_pres` AS `plant_pres`,`now_loc`.`invert_pres` AS `invert_pres`,`now_loc`.`time_rep` AS `time_rep`,`now_loc`.`appr_num_spm` AS `appr_num_spm`,`now_loc`.`num_spm` AS `num_spm`,`now_loc`.`true_quant` AS `true_quant`,`now_loc`.`complete` AS `complete`,`now_loc`.`num_quad` AS `num_quad`,`now_loc`.`taph_comm` AS `taph_comm`,`now_loc`.`tax_comm` AS `tax_comm` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_list` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`max_age` AS `max_age`,`now_loc`.`min_age` AS `min_age`,`now_loc`.`loc_status` AS `loc_status` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_lithology`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_lithology`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_lithology`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_lithology` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`rock_type` AS `rock_type`,`now_loc`.`rt_adj` AS `rt_adj`,`now_loc`.`lith_comm` AS `lith_comm`,`now_loc`.`sed_env_1` AS `sed_env_1`,`now_loc`.`sed_env_2` AS `sed_env_2`,`now_loc`.`event_circum` AS `event_circum`,`now_loc`.`se_comm` AS `se_comm`,`now_loc`.`depo_context1` AS `depo_context1`,`now_loc`.`depo_context2` AS `depo_context2`,`now_loc`.`depo_context3` AS `depo_context3`,`now_loc`.`depo_context4` AS `depo_context4`,`now_loc`.`depo_comm` AS `depo_comm` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_locality`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_locality`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_locality`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_locality` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`state` AS `state`,`now_loc`.`county` AS `county`,`now_loc`.`loc_detail` AS `loc_detail`,`now_loc`.`site_area` AS `site_area`,`now_loc`.`gen_loc` AS `gen_loc`,`now_loc`.`plate` AS `plate`,`now_loc`.`dms_lat` AS `dms_lat`,`now_loc`.`dec_lat` AS `dec_lat`,`now_loc`.`dms_long` AS `dms_long`,`now_loc`.`dec_long` AS `dec_long`,`now_loc`.`approx_coord` AS `approx_coord`,`now_loc`.`altitude` AS `altitude`,`now_loc`.`loc_status` AS `loc_status` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_locality_synonym`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_locality_synonym`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_locality_synonym`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_locality_synonym` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_syn_loc`.`syn_id` AS `syn_id`,`now_syn_loc`.`synonym` AS `synonym` from (`now_syn_loc` left join `now_loc` on(`now_loc`.`lid` = `now_syn_loc`.`lid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_museum`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_museum`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_museum`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_museum` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`com_mlist`.`museum` AS `museum`,`com_mlist`.`institution` AS `institution`,`com_mlist`.`city` AS `city`,`com_mlist`.`country` AS `country` from ((`now_mus` left join `com_mlist` on(`com_mlist`.`museum` = `now_mus`.`museum`)) left join `now_loc` on(`now_loc`.`lid` = `now_mus`.`lid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_project`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_project`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_project`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_project` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_plr`.`pid` AS `pid`,`now_proj`.`proj_code` AS `proj_code`,`now_proj`.`proj_name` AS `proj_name`,`now_proj`.`contact` AS `contact`,`now_proj`.`proj_status` AS `proj_status`,`now_proj`.`proj_records` AS `proj_records`,`com_people`.`full_name` AS `full_name`,`com_people`.`email` AS `email` from (((`now_plr` left join `now_proj` on(`now_proj`.`pid` = `now_plr`.`pid`)) left join `now_loc` on(`now_loc`.`lid` = `now_plr`.`lid`)) left join `com_people` on(`com_people`.`initials` = `now_proj`.`contact`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_species`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_species`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_species`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_species` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`com_species`.`species_id` AS `species_id`,`com_species`.`order_name` AS `order_name`,`com_species`.`family_name` AS `family_name`,`com_species`.`subfamily_name` AS `subfamily_name`,`com_species`.`subclass_or_superorder_name` AS `subclass_or_superorder_name`,`com_species`.`suborder_or_superfamily_name` AS `suborder_or_superfamily_name`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`taxonomic_status` AS `taxonomic_status`,`now_ls`.`id_status` AS `id_status`,`now_ls`.`orig_entry` AS `orig_entry`,`now_ls`.`nis` AS `nis`,`now_ls`.`pct` AS `pct`,`now_ls`.`quad` AS `quad`,`now_ls`.`mni` AS `mni`,`now_ls`.`qua` AS `qua`,`now_ls`.`source_name` AS `source_name`,`now_ls`.`body_mass` AS `body_mass`,`now_ls`.`dc13_mean` AS `dc13_mean`,`now_ls`.`dc13_n` AS `dc13_n`,`now_ls`.`dc13_max` AS `dc13_max`,`now_ls`.`dc13_min` AS `dc13_min`,`now_ls`.`dc13_stdev` AS `dc13_stdev`,`now_ls`.`do18_mean` AS `do18_mean`,`now_ls`.`do18_n` AS `do18_n`,`now_ls`.`do18_max` AS `do18_max`,`now_ls`.`do18_min` AS `do18_min`,`now_ls`.`do18_stdev` AS `do18_stdev`,`now_ls`.`mesowear` AS `mesowear`,`now_ls`.`mw_or_high` AS `mw_or_high`,`now_ls`.`mw_or_low` AS `mw_or_low`,`now_ls`.`mw_cs_sharp` AS `mw_cs_sharp`,`now_ls`.`mw_cs_round` AS `mw_cs_round`,`now_ls`.`mw_cs_blunt` AS `mw_cs_blunt`,`now_ls`.`mw_scale_min` AS `mw_scale_min`,`now_ls`.`mw_scale_max` AS `mw_scale_max`,`now_ls`.`mw_value` AS `mw_value`,`now_ls`.`microwear` AS `microwear`,`com_species`.`sp_status` AS `sp_status`,`com_species`.`sp_comment` AS `sp_comment` from ((`now_ls` left join `com_species` on(`com_species`.`species_id` = `now_ls`.`species_id`)) left join `now_loc` on(`now_loc`.`lid` = `now_ls`.`lid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_statistics`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_statistics`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_statistics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_statistics` AS select year(`now_lau`.`lau_date`) AS `year`,month(`now_lau`.`lau_date`) AS `month`,`com_people`.`surname` AS `surname` from (`now_lau` left join `com_people` on(`now_lau`.`lau_authorizer` = `com_people`.`initials`)) group by 1,2,`com_people`.`surname`,`com_people`.`first_name` order by 1 desc,2 desc,count(0) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_taphonomy`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_taphonomy`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_taphonomy`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_taphonomy` AS select `now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`assem_fm` AS `assem_fm`,`now_loc`.`transport` AS `transport`,`now_loc`.`trans_mod` AS `trans_mod`,`now_loc`.`weath_trmp` AS `weath_trmp`,`now_loc`.`pt_conc` AS `pt_conc`,`now_loc`.`size_type` AS `size_type`,`now_loc`.`time_rep` AS `time_rep`,`now_loc`.`vert_pres` AS `vert_pres`,`now_loc`.`appr_num_spm` AS `appr_num_spm`,`now_loc`.`num_spm` AS `num_spm`,`now_loc`.`num_quad` AS `num_quad`,`now_loc`.`true_quant` AS `true_quant`,`now_loc`.`complete` AS `complete`,`now_loc`.`taph_comm` AS `taph_comm` from `now_loc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_update_header`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_update_header`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_update_header`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_update_header` AS select `now_lau`.`luid` AS `luid`,`now_lau`.`lau_date` AS `date`,`l_authorizer`.`full_name` AS `authorizer`,`l_coordinator`.`full_name` AS `coordinator`,`now_lau`.`lau_comment` AS `comment`,`now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country` from (((`now_lau` left join `com_people` `l_authorizer` on(`l_authorizer`.`initials` = `now_lau`.`lau_authorizer`)) left join `com_people` `l_coordinator` on(`l_coordinator`.`initials` = `now_lau`.`lau_coordinator`)) left join `now_loc` on(`now_loc`.`lid` = `now_lau`.`lid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_locality_updates`
--

/*!50001 DROP TABLE IF EXISTS `now_v_locality_updates`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_locality_updates`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_locality_updates` AS select `now_lau`.`luid` AS `luid`,`now_lau`.`lid` AS `lid`,`now_lau`.`lau_coordinator` AS `lau_coordinator`,`now_lau`.`lau_authorizer` AS `lau_authorizer`,`now_lau`.`lau_date` AS `lau_date`,group_concat(`now_lr`.`rid` separator ',') AS `rids` from (`now_lau` join `now_lr`) where `now_lau`.`luid` = `now_lr`.`luid` group by `now_lau`.`luid` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_museum_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_museum_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_museum_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_museum_list` AS select `com_mlist`.`museum` AS `museum`,`com_mlist`.`institution` AS `institution`,`com_mlist`.`alt_int_name` AS `alt_int_name`,`com_mlist`.`city` AS `city`,`com_mlist`.`state_code` AS `state_code`,`com_mlist`.`state` AS `state`,`com_mlist`.`country` AS `country`,`com_mlist`.`used_now` AS `used_now` from `com_mlist` where `com_mlist`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_people_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_people_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_people_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_people_list` AS select `com_people`.`initials` AS `initials`,`com_people`.`first_name` AS `first_name`,`com_people`.`surname` AS `surname`,`com_people`.`full_name` AS `full_name`,`com_people`.`format` AS `format`,`com_people`.`email` AS `email`,`com_people`.`user_id` AS `user_id`,`com_people`.`organization` AS `organization`,`com_people`.`country` AS `country`,`com_people`.`password_set` AS `password_set`,`com_people`.`used_now` AS `used_now` from `com_people` where `com_people`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_project_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_project_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_project_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_project_list` AS select `now_proj`.`pid` AS `pid`,`com_people`.`full_name` AS `full_name`,`now_proj`.`proj_code` AS `proj_code`,`now_proj`.`proj_name` AS `proj_name`,`now_proj`.`proj_status` AS `proj_status`,`now_proj`.`proj_records` AS `proj_records` from (`now_proj` left join `com_people` on(`com_people`.`initials` = `now_proj`.`contact`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_project_list_user`
--

/*!50001 DROP TABLE IF EXISTS `now_v_project_list_user`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_project_list_user`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_project_list_user` AS select `now_proj`.`pid` AS `pid`,`com_people`.`full_name` AS `full_name`,`now_proj_people`.`initials` AS `nppinitials`,`now_proj`.`proj_code` AS `proj_code`,`now_proj`.`proj_name` AS `proj_name`,`now_proj`.`proj_status` AS `proj_status`,`now_proj`.`proj_records` AS `proj_records` from ((`now_proj` left join `com_people` on(`com_people`.`initials` = `now_proj`.`contact`)) join `now_proj_people` on(`now_proj`.`pid` = `now_proj_people`.`pid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_public_locality_species`
--

/*!50001 DROP TABLE IF EXISTS `now_v_public_locality_species`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_public_locality_species`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_public_locality_species` AS select count(`now_ls`.`lid`) AS `count` from ((`now_ls` left join `com_species` on(`com_species`.`species_id` = `now_ls`.`species_id`)) left join `now_loc` on(`now_loc`.`lid` = `now_ls`.`lid`)) where `com_species`.`sp_status` = 0 and `now_loc`.`loc_status` = 0 and `com_species`.`used_now` = 1 and !(`now_ls`.`lid` in (select distinct `now_plr`.`lid` from (`now_plr` join `now_proj` on(`now_plr`.`pid` = `now_proj`.`pid`)) where `now_proj`.`proj_records` = 1)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_ref_cit`
--

/*!50001 DROP TABLE IF EXISTS `now_v_ref_cit`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_ref_cit`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_ref_cit` AS select `ref_ref`.`rid` AS `rid`,`ref_ref`.`date_primary` AS `date_primary`,`ref_ref`.`title_primary` AS `title_primary`,`ref_ref`.`title_secondary` AS `title_secondary`,`ref_ref`.`gen_notes` AS `gen_notes`,`ref_ref`.`volume` AS `volume`,`ref_ref`.`issue` AS `issue`,`ref_ref`.`start_page` AS `start_page`,`ref_ref`.`end_page` AS `end_page`,`ref_ref`.`publisher` AS `publisher`,`ref_ref`.`pub_place` AS `pub_place`,`ref_authors1`.`author_surname` AS `author_surname1`,`ref_authors2`.`author_surname` AS `author_surname2`,`ref_authors3`.`author_surname` AS `author_surname3`,`ref_authors4`.`author_surname` AS `author_surname4`,`ref_editors1`.`author_surname` AS `editor_surname1`,`ref_editors2`.`author_surname` AS `editor_surname2`,`ref_editors3`.`author_surname` AS `editor_surname3`,`ref_editors4`.`author_surname` AS `editor_surname4`,`ref_journal`.`journal_title` AS `journal_title`,`ref_ref`.`ref_type_id` AS `ref_type_id`,`ref_ref_type`.`ref_type` AS `ref_type` from ((((((((((`ref_ref` left join `ref_authors` `ref_authors1` on(`ref_authors1`.`rid` = `ref_ref`.`rid` and `ref_authors1`.`field_id` = 2 and `ref_authors1`.`au_num` = 1)) left join `ref_authors` `ref_authors2` on(`ref_authors2`.`rid` = `ref_ref`.`rid` and `ref_authors2`.`field_id` = 2 and `ref_authors2`.`au_num` = 2)) left join `ref_authors` `ref_authors3` on(`ref_authors3`.`rid` = `ref_ref`.`rid` and `ref_authors3`.`field_id` = 2 and `ref_authors3`.`au_num` = 3)) left join `ref_authors` `ref_authors4` on(`ref_authors4`.`rid` = `ref_ref`.`rid` and `ref_authors4`.`field_id` = 2 and `ref_authors4`.`au_num` = 4)) left join `ref_authors` `ref_editors1` on(`ref_editors1`.`rid` = `ref_ref`.`rid` and `ref_editors1`.`field_id` = 12 and `ref_editors1`.`au_num` = 1)) left join `ref_authors` `ref_editors2` on(`ref_editors2`.`rid` = `ref_ref`.`rid` and `ref_editors2`.`field_id` = 12 and `ref_editors2`.`au_num` = 2)) left join `ref_authors` `ref_editors3` on(`ref_editors3`.`rid` = `ref_ref`.`rid` and `ref_editors3`.`field_id` = 12 and `ref_editors3`.`au_num` = 3)) left join `ref_authors` `ref_editors4` on(`ref_editors4`.`rid` = `ref_ref`.`rid` and `ref_editors4`.`field_id` = 12 and `ref_editors4`.`au_num` = 4)) left join `ref_journal` on(`ref_journal`.`journal_id` = `ref_ref`.`journal_id`)) left join `ref_ref_type` on(`ref_ref_type`.`ref_type_id` = `ref_ref`.`ref_type_id`)) where `ref_ref`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_reference_header`
--

/*!50001 DROP TABLE IF EXISTS `now_v_reference_header`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_header`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_reference_header` AS select `ref_ref`.`rid` AS `rid` from `ref_ref` where `ref_ref`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_reference_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_reference_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_reference_list` AS select `ref_ref`.`rid` AS `rid`,`ref_ref`.`date_primary` AS `date_primary`,`ref_ref`.`date_secondary` AS `date_secondary`,`ref_ref`.`exact_date` AS `exact_date`,`ref_ref`.`title_primary` AS `title_primary`,`ref_ref`.`title_secondary` AS `title_secondary`,`ref_ref`.`title_series` AS `title_series`,`ref_ref`.`journal_id` AS `journal_id`,`ref_ref`.`ref_type_id` AS `ref_type_id`,`ref_ref`.`volume` AS `volume`,`ref_ref`.`issue` AS `issue`,`ref_ref`.`start_page` AS `start_page`,`ref_ref`.`end_page` AS `end_page`,`ref_ref`.`publisher` AS `publisher`,`ref_ref`.`pub_place` AS `pub_place`,`ref_ref`.`issn_isbn` AS `issn_isbn`,`ref_ref`.`ref_abstract` AS `ref_abstract`,`ref_ref`.`web_url` AS `web_url`,`ref_ref`.`misc_1` AS `misc_1`,`ref_ref`.`misc_2` AS `misc_2`,`ref_ref`.`gen_notes` AS `gen_notes`,`ref_ref`.`printed_language` AS `printed_language`,`ref_ref`.`used_morph` AS `used_morph`,`ref_ref`.`used_now` AS `used_now`,`ref_ref`.`used_gene` AS `used_gene`,`ref_authors`.`author_surname` AS `author_surname`,`ref_journal`.`journal_title` AS `journal_title`,`ref_ref_type`.`ref_type` AS `ref_type`,if(`ref_ref`.`title_primary` is null or `ref_ref`.`title_primary` = '',if(`ref_ref`.`title_series` is null or `ref_ref`.`title_series` = '',if(`ref_ref`.`gen_notes` is null or `ref_ref`.`gen_notes` = '','',`ref_ref`.`gen_notes`),`ref_ref`.`title_series`),`ref_ref`.`title_primary`) AS `cmb_title`,if(`ref_authors`.`author_surname` is null or `ref_authors`.`author_surname` = '',if(`ref_authors2`.`author_surname` is null or `ref_authors2`.`author_surname` = '',if(`ref_authors3`.`author_surname` is null or `ref_authors3`.`author_surname` = '','',`ref_authors3`.`author_surname`),`ref_authors2`.`author_surname`),`ref_authors`.`author_surname`) AS `cmb_author` from (((((`ref_ref` left join `ref_authors` on(`ref_authors`.`rid` = `ref_ref`.`rid` and `ref_authors`.`field_id` = 2 and `ref_authors`.`au_num` = 1)) left join `ref_authors` `ref_authors2` on(`ref_authors2`.`rid` = `ref_ref`.`rid` and `ref_authors2`.`field_id` = 12 and `ref_authors2`.`au_num` = 1)) left join `ref_authors` `ref_authors3` on(`ref_authors3`.`rid` = `ref_ref`.`rid` and `ref_authors3`.`field_id` = 15 and `ref_authors3`.`au_num` = 1)) left join `ref_journal` on(`ref_journal`.`journal_id` = `ref_ref`.`journal_id`)) left join `ref_ref_type` on(`ref_ref_type`.`ref_type_id` = `ref_ref`.`ref_type_id`)) where `ref_ref`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_reference_locality`
--

/*!50001 DROP TABLE IF EXISTS `now_v_reference_locality`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_locality`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_reference_locality` AS select distinct `now_lr`.`rid` AS `rid`,`now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`max_age` AS `max_age`,`now_loc`.`min_age` AS `min_age`,`now_loc`.`loc_status` AS `loc_status` from ((`now_lr` left join `now_lau` on(`now_lau`.`luid` = `now_lr`.`luid`)) left join `now_loc` on(`now_loc`.`lid` = `now_lau`.`lid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_reference_species`
--

/*!50001 DROP TABLE IF EXISTS `now_v_reference_species`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_species`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_reference_species` AS select distinct `now_sr`.`rid` AS `rid`,`com_species`.`species_id` AS `species_id`,`com_species`.`order_name` AS `order_name`,`com_species`.`family_name` AS `family_name`,`com_species`.`subfamily_name` AS `subfamily_name`,`com_species`.`subclass_or_superorder_name` AS `subclass_or_superorder_name`,`com_species`.`suborder_or_superfamily_name` AS `suborder_or_superfamily_name`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`sp_status` AS `sp_status` from ((`now_sr` left join `now_sau` on(`now_sau`.`suid` = `now_sr`.`suid`)) left join `com_species` on(`com_species`.`species_id` = `now_sau`.`species_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_reference_tubound`
--

/*!50001 DROP TABLE IF EXISTS `now_v_reference_tubound`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_reference_tubound`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_reference_tubound` AS select distinct `now_tur`.`rid` AS `rid`,`now_tu_bound`.`bid` AS `bid`,`now_tu_bound`.`b_name` AS `b_name`,`now_tu_bound`.`age` AS `age`,`now_tu_bound`.`b_comment` AS `b_comment` from (`now_tur` left join `now_tu_bound` on(`now_tu_bound`.`bid` = `now_tur`.`bid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_diet`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_diet`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_diet`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_diet` AS select `com_species`.`species_id` AS `species_id`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`diet1` AS `diet1`,`com_species`.`diet2` AS `diet2`,`com_species`.`diet3` AS `diet3`,`com_species`.`rel_fib` AS `rel_fib`,`com_species`.`selectivity` AS `selectivity`,`com_species`.`digestion` AS `digestion`,`com_species`.`hunt_forage` AS `hunt_forage` from `com_species` where `com_species`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_header`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_header`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_header`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_header` AS select `com_species`.`species_id` AS `species_id`,`com_species`.`class_name` AS `class_name`,`com_species`.`order_name` AS `order_name`,`com_species`.`family_name` AS `family_name`,`com_species`.`subfamily_name` AS `subfamily_name`,`com_species`.`subclass_or_superorder_name` AS `subclass_or_superorder_name`,`com_species`.`suborder_or_superfamily_name` AS `suborder_or_superfamily_name`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`common_name` AS `common_name`,`com_species`.`sp_status` AS `sp_status`,`com_species`.`taxonomic_status` AS `taxonomic_status`,`com_species`.`sp_author` AS `sp_author`,`com_species`.`strain` AS `strain`,`com_species`.`gene` AS `gene`,`com_species`.`taxon_status` AS `taxon_status`,`com_species`.`diet1` AS `diet1`,`com_species`.`diet2` AS `diet2`,`com_species`.`diet3` AS `diet3`,`com_species`.`diet_description` AS `diet_description`,`com_species`.`rel_fib` AS `rel_fib`,`com_species`.`selectivity` AS `selectivity`,`com_species`.`digestion` AS `digestion`,`com_species`.`feedinghab1` AS `feedinghab1`,`com_species`.`feedinghab2` AS `feedinghab2`,`com_species`.`shelterhab1` AS `shelterhab1`,`com_species`.`shelterhab2` AS `shelterhab2`,`com_species`.`locomo1` AS `locomo1`,`com_species`.`locomo2` AS `locomo2`,`com_species`.`locomo3` AS `locomo3`,`com_species`.`hunt_forage` AS `hunt_forage`,`com_species`.`body_mass` AS `body_mass`,`com_species`.`brain_mass` AS `brain_mass`,`com_species`.`sv_length` AS `sv_length`,`com_species`.`activity` AS `activity`,`com_species`.`sd_size` AS `sd_size`,`com_species`.`sd_display` AS `sd_display`,`com_species`.`tshm` AS `tshm`,`com_species`.`symph_mob` AS `symph_mob`,`com_species`.`relative_blade_length` AS `relative_blade_length`,`com_species`.`tht` AS `tht`,`com_species`.`crowntype` AS `crowntype`,`com_species`.`microwear` AS `microwear`,`com_species`.`pop_struc` AS `pop_struc`,`com_species`.`used_morph` AS `used_morph`,`com_species`.`used_now` AS `used_now`,`com_species`.`used_gene` AS `used_gene`,`com_species`.`sp_comment` AS `sp_comment` from `com_species` where `com_species`.`used_now` = 1 group by `com_species`.`species_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_list` AS select `com_species`.`species_id` AS `species_id`,`com_species`.`order_name` AS `order_name`,`com_species`.`family_name` AS `family_name`,`com_species`.`subfamily_name` AS `subfamily_name`,`com_species`.`subclass_or_superorder_name` AS `subclass_or_superorder_name`,`com_species`.`suborder_or_superfamily_name` AS `suborder_or_superfamily_name`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`sp_status` AS `sp_status`,`com_species`.`taxonomic_status` AS `taxonomic_status`,`com_species`.`sp_comment` AS `sp_comment`,count(`com_taxa_synonym`.`synonym_id`) AS `syncount` from (`com_species` left join `com_taxa_synonym` on(`com_taxa_synonym`.`species_id` = `com_species`.`species_id`)) where `com_species`.`used_now` = 1 group by `com_species`.`species_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_locality`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_locality`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_locality`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_locality` AS select `com_species`.`species_id` AS `species_id`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`country` AS `country`,`now_loc`.`max_age` AS `max_age`,`now_loc`.`min_age` AS `min_age`,`now_ls`.`id_status` AS `id_status`,`now_ls`.`orig_entry` AS `orig_entry`,`now_ls`.`source_name` AS `source_name`,`now_ls`.`nis` AS `nis`,`now_ls`.`pct` AS `pct`,`now_ls`.`quad` AS `quad`,`now_ls`.`mni` AS `mni`,`now_ls`.`qua` AS `qua`,`now_ls`.`body_mass` AS `body_mass`,`now_ls`.`dc13_mean` AS `dc13_mean`,`now_ls`.`dc13_n` AS `dc13_n`,`now_ls`.`dc13_max` AS `dc13_max`,`now_ls`.`dc13_min` AS `dc13_min`,`now_ls`.`dc13_stdev` AS `dc13_stdev`,`now_ls`.`do18_mean` AS `do18_mean`,`now_ls`.`do18_n` AS `do18_n`,`now_ls`.`do18_max` AS `do18_max`,`now_ls`.`do18_min` AS `do18_min`,`now_ls`.`do18_stdev` AS `do18_stdev`,`now_ls`.`mesowear` AS `mesowear`,`now_ls`.`mw_or_high` AS `mw_or_high`,`now_ls`.`mw_or_low` AS `mw_or_low`,`now_ls`.`mw_cs_sharp` AS `mw_cs_sharp`,`now_ls`.`mw_cs_round` AS `mw_cs_round`,`now_ls`.`mw_cs_blunt` AS `mw_cs_blunt`,`now_ls`.`mw_scale_min` AS `mw_scale_min`,`now_ls`.`mw_scale_max` AS `mw_scale_max`,`now_ls`.`mw_value` AS `mw_value`,`now_ls`.`microwear` AS `microwear`,`now_loc`.`loc_status` AS `loc_status` from ((`now_ls` left join `com_species` on(`com_species`.`species_id` = `now_ls`.`species_id`)) left join `now_loc` on(`now_loc`.`lid` = `now_ls`.`lid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_locomotion`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_locomotion`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_locomotion`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_locomotion` AS select `com_species`.`species_id` AS `species_id`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`feedinghab1` AS `feedinghab1`,`com_species`.`feedinghab2` AS `feedinghab2`,`com_species`.`shelterhab1` AS `shelterhab1`,`com_species`.`shelterhab2` AS `shelterhab2`,`com_species`.`locomo1` AS `locomo1`,`com_species`.`locomo2` AS `locomo2`,`com_species`.`locomo3` AS `locomo3`,`com_species`.`activity` AS `activity` from `com_species` where `com_species`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_size`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_size`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_size`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_size` AS select `com_species`.`species_id` AS `species_id`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`body_mass` AS `body_mass`,`com_species`.`brain_mass` AS `brain_mass`,`com_species`.`sv_length` AS `sv_length`,`com_species`.`sd_size` AS `sd_size`,`com_species`.`sd_display` AS `sd_display`,`com_species`.`pop_struc` AS `pop_struc` from `com_species` where `com_species`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_statistics`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_statistics`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_statistics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_statistics` AS select year(`now_sau`.`sau_date`) AS `year`,month(`now_sau`.`sau_date`) AS `month`,`com_people`.`surname` AS `surname` from (`now_sau` left join `com_people` on(`now_sau`.`sau_authorizer` = `com_people`.`initials`)) group by 1,2,`com_people`.`surname`,`com_people`.`first_name` order by 1 desc,2 desc,count(0) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_taxonomy`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_taxonomy`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_taxonomy`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_taxonomy` AS select `com_species`.`species_id` AS `species_id`,`com_species`.`class_name` AS `class_name`,`com_species`.`order_name` AS `order_name`,`com_species`.`family_name` AS `family_name`,`com_species`.`subfamily_name` AS `subfamily_name`,`com_species`.`subclass_or_superorder_name` AS `subclass_or_superorder_name`,`com_species`.`suborder_or_superfamily_name` AS `suborder_or_superfamily_name`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`taxonomic_status` AS `taxonomic_status`,`com_species`.`sp_author` AS `sp_author`,`com_species`.`sp_status` AS `sp_status`,`com_species`.`sp_comment` AS `sp_comment` from `com_species` where `com_species`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_teeth`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_teeth`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_teeth`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_teeth` AS select `com_species`.`species_id` AS `species_id`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier`,`com_species`.`tshm` AS `tshm`,`com_species`.`crowntype` AS `crowntype`,`com_species`.`tht` AS `tht`,`com_species`.`microwear` AS `microwear`,`com_species`.`symph_mob` AS `symph_mob`,`com_species`.`relative_blade_length` AS `relative_blade_length`,`com_species`.`horizodonty` AS `horizodonty`,`com_species`.`cusp_shape` AS `cusp_shape`,`com_species`.`cusp_count_buccal` AS `cusp_count_buccal`,`com_species`.`cusp_count_lingual` AS `cusp_count_lingual`,`com_species`.`loph_count_lon` AS `loph_count_lon`,`com_species`.`loph_count_trs` AS `loph_count_trs`,`com_species`.`fct_al` AS `fct_al`,`com_species`.`fct_ol` AS `fct_ol`,`com_species`.`fct_sf` AS `fct_sf`,`com_species`.`fct_ot` AS `fct_ot`,`com_species`.`fct_cm` AS `fct_cm`,`com_species`.`mesowear` AS `mesowear`,`com_species`.`mw_or_high` AS `mw_or_high`,`com_species`.`mw_or_low` AS `mw_or_low`,`com_species`.`mw_cs_sharp` AS `mw_cs_sharp`,`com_species`.`mw_cs_round` AS `mw_cs_round`,`com_species`.`mw_cs_blunt` AS `mw_cs_blunt`,`com_species`.`mw_scale_min` AS `mw_scale_min`,`com_species`.`mw_scale_max` AS `mw_scale_max`,`com_species`.`mw_value` AS `mw_value`,concat(case when `com_species`.`fct_al` is null or `com_species`.`fct_al` = '' then '-' else `com_species`.`fct_al` end,case when `com_species`.`fct_ol` is null or `com_species`.`fct_ol` = '' then '-' else `com_species`.`fct_ol` end,case when `com_species`.`fct_sf` is null or `com_species`.`fct_sf` = '' then '-' else `com_species`.`fct_sf` end,case when `com_species`.`fct_ot` is null or `com_species`.`fct_ot` = '' then '-' else `com_species`.`fct_ot` end,case when `com_species`.`fct_cm` is null or `com_species`.`fct_cm` = '' then '-' else `com_species`.`fct_cm` end) AS `functional_crown_type`,concat(case when `com_species`.`cusp_shape` is null or `com_species`.`cusp_shape` = '' then '-' else `com_species`.`cusp_shape` end,case when `com_species`.`cusp_count_buccal` is null or `com_species`.`cusp_count_buccal` = '' then '-' else `com_species`.`cusp_count_buccal` end,case when `com_species`.`cusp_count_lingual` is null or `com_species`.`cusp_count_lingual` = '' then '-' else `com_species`.`cusp_count_lingual` end,case when `com_species`.`loph_count_lon` is null or `com_species`.`loph_count_lon` = '' then '-' else `com_species`.`loph_count_lon` end,case when `com_species`.`loph_count_trs` is null or `com_species`.`loph_count_trs` = '' then '-' else `com_species`.`loph_count_trs` end) AS `developmental_crown_type` from `com_species` where `com_species`.`used_now` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_update_header`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_update_header`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_update_header`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_update_header` AS select `now_sau`.`suid` AS `suid`,`now_sau`.`sau_date` AS `date`,`s_authorizer`.`full_name` AS `authorizer`,`s_coordinator`.`full_name` AS `coordinator`,`now_sau`.`sau_comment` AS `comment`,`com_species`.`species_id` AS `species_id`,`com_species`.`genus_name` AS `genus_name`,`com_species`.`species_name` AS `species_name`,`com_species`.`unique_identifier` AS `unique_identifier` from (((`now_sau` left join `com_people` `s_authorizer` on(`s_authorizer`.`initials` = `now_sau`.`sau_authorizer`)) left join `com_people` `s_coordinator` on(`s_coordinator`.`initials` = `now_sau`.`sau_coordinator`)) left join `com_species` on(`com_species`.`species_id` = `now_sau`.`species_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_species_updates`
--

/*!50001 DROP TABLE IF EXISTS `now_v_species_updates`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_species_updates`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_species_updates` AS select `now_sau`.`suid` AS `suid`,`now_sau`.`species_id` AS `species_id`,`now_sau`.`sau_coordinator` AS `sau_coordinator`,`now_sau`.`sau_authorizer` AS `sau_authorizer`,`now_sau`.`sau_date` AS `sau_date`,group_concat(`now_sr`.`rid` separator ',') AS `rids` from (`now_sau` join `now_sr`) where `now_sau`.`suid` = `now_sr`.`suid` group by `now_sau`.`suid` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_ss_values_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_ss_values_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_ss_values_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_ss_values_list` AS select `now_ss_values`.`ss_value` AS `ss_value`,`now_ss_values`.`category` AS `category` from `now_ss_values` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_time_bound`
--

/*!50001 DROP TABLE IF EXISTS `now_v_time_bound`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_time_bound` AS select `now_tu_bound`.`bid` AS `bid`,`now_tu_bound`.`b_name` AS `b_name`,`now_tu_bound`.`age` AS `age`,`now_tu_bound`.`b_comment` AS `b_comment` from `now_tu_bound` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_time_bound_header`
--

/*!50001 DROP TABLE IF EXISTS `now_v_time_bound_header`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound_header`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_time_bound_header` AS select `now_tu_bound`.`bid` AS `bid`,`now_tu_bound`.`b_name` AS `b_name`,`now_tu_bound`.`age` AS `age`,`now_tu_bound`.`b_comment` AS `b_comment` from `now_tu_bound` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_time_bound_list`
--

/*!50001 DROP TABLE IF EXISTS `now_v_time_bound_list`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_time_bound_list` AS select `now_tu_bound`.`bid` AS `bid`,`now_tu_bound`.`b_name` AS `b_name`,`now_tu_bound`.`age` AS `age`,`now_tu_bound`.`b_comment` AS `b_comment` from `now_tu_bound` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_time_bound_update_header`
--

/*!50001 DROP TABLE IF EXISTS `now_v_time_bound_update_header`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound_update_header`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_time_bound_update_header` AS select `now_bau`.`buid` AS `buid`,`now_bau`.`bau_date` AS `date`,`b_authorizer`.`full_name` AS `authorizer`,`b_coordinator`.`full_name` AS `coordinator`,`now_bau`.`bau_comment` AS `comment`,`now_tu_bound`.`bid` AS `bid`,`now_tu_bound`.`b_name` AS `b_name` from (((`now_bau` left join `com_people` `b_authorizer` on(`b_authorizer`.`initials` = `now_bau`.`bau_authorizer`)) left join `com_people` `b_coordinator` on(`b_coordinator`.`initials` = `now_bau`.`bau_coordinator`)) left join `now_tu_bound` on(`now_tu_bound`.`bid` = `now_bau`.`bid`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_time_bound_updates`
--

/*!50001 DROP TABLE IF EXISTS `now_v_time_bound_updates`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bound_updates`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_time_bound_updates` AS select `now_bau`.`buid` AS `buid`,`now_bau`.`bid` AS `bid`,`now_bau`.`bau_coordinator` AS `bau_coordinator`,`now_bau`.`bau_authorizer` AS `bau_authorizer`,`now_bau`.`bau_date` AS `bau_date`,group_concat(`now_br`.`rid` separator ',') AS `rids` from (`now_bau` join `now_br`) where `now_bau`.`buid` = `now_br`.`buid` group by `now_bau`.`buid` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_time_bounds_in_time_units`
--

/*!50001 DROP TABLE IF EXISTS `now_v_time_bounds_in_time_units`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_time_bounds_in_time_units`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_time_bounds_in_time_units` AS select `now_tu_bound`.`bid` AS `bid`,`now_time_unit`.`tu_name` AS `tu_name`,`now_time_unit`.`tu_display_name` AS `tu_display_name`,`now_time_unit`.`up_bnd` AS `up_bnd`,`now_time_unit`.`low_bnd` AS `low_bnd`,`now_time_unit`.`rank` AS `rank`,`now_time_unit`.`sequence` AS `sequence`,`now_time_unit`.`tu_comment` AS `tu_comment` from (`now_time_unit` left join `now_tu_bound` on(`now_tu_bound`.`bid` = `now_time_unit`.`low_bnd` or `now_tu_bound`.`bid` = `now_time_unit`.`up_bnd`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_time_unit_and_bound_updates`
--

/*!50001 DROP TABLE IF EXISTS `now_v_time_unit_and_bound_updates`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_time_unit_and_bound_updates`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_time_unit_and_bound_updates` AS select `now_time_update`.`time_update_id` AS `time_update_id`,`now_time_update`.`tu_name` AS `tu_name`,`now_time_unit`.`tu_display_name` AS `tu_display_name`,`now_time_update`.`tuid` AS `tuid`,`now_time_update`.`lower_buid` AS `lower_buid`,`now_time_update`.`upper_buid` AS `upper_buid`,`now_time_update`.`coordinator` AS `coordinator`,`now_time_update`.`authorizer` AS `authorizer`,`now_time_update`.`date` AS `date`,`now_time_update`.`comment` AS `comment` from (`now_time_update` join `now_time_unit`) where `now_time_update`.`tu_name` = `now_time_unit`.`tu_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `now_v_time_unit_localities`
--

/*!50001 DROP TABLE IF EXISTS `now_v_time_unit_localities`*/;
/*!50001 DROP VIEW IF EXISTS `now_v_time_unit_localities`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `now_v_time_unit_localities` AS select `now_time_unit`.`tu_name` AS `tu_name`,`now_time_unit`.`tu_display_name` AS `tu_display_name`,`now_loc`.`lid` AS `lid`,`now_loc`.`loc_name` AS `loc_name`,`now_loc`.`bfa_min` AS `bfa_min`,`now_loc`.`bfa_max` AS `bfa_max`,`now_loc`.`loc_status` AS `loc_status` from (`now_time_unit` left join `now_loc` on(`now_loc`.`bfa_min` = `now_time_unit`.`tu_name` or `now_loc`.`bfa_max` = `now_time_unit`.`tu_name`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-30 19:04:55
