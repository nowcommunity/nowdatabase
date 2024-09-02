/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: now_log_test
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
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_time` datetime DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `server_name` varchar(50) DEFAULT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `pk_data` varchar(200) DEFAULT NULL,
  `column_name` varchar(50) DEFAULT NULL,
  `log_action` int(11) DEFAULT NULL,
  `old_data` varchar(255) DEFAULT NULL,
  `new_data` varchar(255) DEFAULT NULL,
  `luid` int(11) DEFAULT NULL,
  `suid` int(11) DEFAULT NULL,
  `tuid` int(11) DEFAULT NULL,
  `buid` int(11) DEFAULT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=636535 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES
(54377,NULL,'Gudrun','sysbiol','com_species','5.25009;','species',3,'legidensis-koenigswaldi','legidensis',NULL,24260,NULL,NULL),
(54378,NULL,'Gudrun','sysbiol','com_species','5.25009;','unique',3,'-','legidensis-koenigswaldi',NULL,24260,NULL,NULL),
(111748,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','lid',2,NULL,'24750',35350,NULL,NULL,NULL),
(111749,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_syn_loc','4.2315;','syn_id',2,NULL,'2315',35350,NULL,NULL,NULL),
(111750,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_plr','5.24750;1.3;','lid',2,NULL,'24750',35350,NULL,NULL,NULL),
(111751,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','bfa_max',2,NULL,'MN 13',35350,NULL,NULL,NULL),
(111752,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_syn_loc','4.2315;','lid',2,NULL,'24750',35350,NULL,NULL,NULL),
(111753,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_plr','5.24750;1.3;','pid',2,NULL,'3',35350,NULL,NULL,NULL),
(111754,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','bfa_min',2,NULL,'MN 13',35350,NULL,NULL,NULL),
(111755,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_syn_loc','4.2315;','synonym',2,NULL,'Romanya d\'Emporda',35350,NULL,NULL,NULL),
(111756,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','loc_name',2,NULL,'Romanyà d\'Empordà',35350,NULL,NULL,NULL),
(111757,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','date_meth',2,NULL,'time_unit',35350,NULL,NULL,NULL),
(111758,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','max_age',2,NULL,'7.1',35350,NULL,NULL,NULL),
(111759,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','min_age',2,NULL,'5.3',35350,NULL,NULL,NULL),
(111760,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','dms_lat',2,NULL,'42 9 58 N',35350,NULL,NULL,NULL),
(111761,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','dms_long',2,NULL,'2 39 58 E',35350,NULL,NULL,NULL),
(111762,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','dec_lat',2,NULL,'42.166',35350,NULL,NULL,NULL),
(111763,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','dec_long',2,NULL,'2.666',35350,NULL,NULL,NULL),
(111764,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','country',2,NULL,'Spain',35350,NULL,NULL,NULL),
(111765,'2006-10-16 15:48:27','susanna_sova','sysbiol','now_loc','5.24750;','loc_status',2,NULL,'0',35350,NULL,NULL,NULL),
(113088,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_plr','5.24797;1.3;','lid',2,NULL,'24797',35536,NULL,NULL,NULL),
(113089,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','lid',2,NULL,'24797',35536,NULL,NULL,NULL),
(113090,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_plr','5.24797;1.3;','pid',2,NULL,'3',35536,NULL,NULL,NULL),
(113091,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','bfa_max',2,NULL,'MN 5',35536,NULL,NULL,NULL),
(113092,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','bfa_min',2,NULL,'MN 5',35536,NULL,NULL,NULL),
(113093,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','loc_name',2,NULL,'Las Umbrias 1',35536,NULL,NULL,NULL),
(113094,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','date_meth',2,NULL,'time_unit',35536,NULL,NULL,NULL),
(113095,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','max_age',2,NULL,'17.0',35536,NULL,NULL,NULL),
(113096,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','min_age',2,NULL,'15.2',35536,NULL,NULL,NULL),
(113097,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','dms_lat',2,NULL,'40 7 12 N',35536,NULL,NULL,NULL),
(113098,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','dms_long',2,NULL,'0 24 0 W',35536,NULL,NULL,NULL),
(113099,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','dec_lat',2,NULL,'40.12',35536,NULL,NULL,NULL),
(113100,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','dec_long',2,NULL,'-0.4',35536,NULL,NULL,NULL),
(113101,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','country',2,NULL,'Spain',35536,NULL,NULL,NULL),
(113102,'2006-10-25 17:28:00','susanna_sova','sysbiol','now_loc','5.24797;','loc_status',2,NULL,'0',35536,NULL,NULL,NULL),
(468221,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','species_id',2,NULL,'84357',NULL,98809,NULL,NULL),
(468222,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','class_name',2,NULL,'Mammalia',NULL,98809,NULL,NULL),
(468223,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','order_name',2,NULL,'Pinnipedia',NULL,98809,NULL,NULL),
(468224,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','family_name',2,NULL,'Odobenidae',NULL,98809,NULL,NULL),
(468225,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','genus_name',2,NULL,'Prototaria',NULL,98809,NULL,NULL),
(468226,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','species_name',2,NULL,'planicephala',NULL,98809,NULL,NULL),
(468227,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','unique_identifier',2,NULL,'-',NULL,98809,NULL,NULL),
(468228,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','sp_status',2,NULL,'0',NULL,98809,NULL,NULL),
(468229,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','used_morph',2,NULL,'0',NULL,98809,NULL,NULL),
(468230,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','used_now',2,NULL,'1',NULL,98809,NULL,NULL),
(468231,'2016-10-12 14:49:16','new_now','sysbiol','com_species','5.84357;','used_gene',2,NULL,'0',NULL,98809,NULL,NULL),
(468232,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','lid',2,NULL,'28518',62383,NULL,NULL,NULL),
(468233,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','bfa_max',2,NULL,'Langhian',62383,NULL,NULL,NULL),
(468234,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','bfa_min',2,NULL,'Langhian',62383,NULL,NULL,NULL),
(468235,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','loc_name',2,NULL,'Goishi',62383,NULL,NULL,NULL),
(468236,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','date_meth',2,NULL,'time_unit',62383,NULL,NULL,NULL),
(468237,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','max_age',2,NULL,'16.4',62383,NULL,NULL,NULL),
(468238,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','min_age',2,NULL,'14.8',62383,NULL,NULL,NULL),
(468239,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','dms_lat',2,NULL,'38 12 0 N',62383,NULL,NULL,NULL),
(468240,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','dms_long',2,NULL,'137 36 0 E',62383,NULL,NULL,NULL),
(468241,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','dec_lat',2,NULL,'38.2',62383,NULL,NULL,NULL),
(468242,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','dec_long',2,NULL,'137.6',62383,NULL,NULL,NULL),
(468243,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','approx_coord',2,NULL,'1',62383,NULL,NULL,NULL),
(468244,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','country',2,NULL,'Japan',62383,NULL,NULL,NULL),
(468245,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','state',2,NULL,'Miyagi Prefecture',62383,NULL,NULL,NULL),
(468246,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','formation',2,NULL,'Moniwa',62383,NULL,NULL,NULL),
(468247,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','rock_type',2,NULL,'sandstone',62383,NULL,NULL,NULL),
(468248,'2016-10-12 14:49:16','new_now','sysbiol','now_loc','5.28518;','loc_status',2,NULL,'0',62383,NULL,NULL,NULL),
(468249,'2016-10-12 14:49:16','new_now','sysbiol','now_mus','5.28518;4.SSME;','lid',2,NULL,'28518',62383,NULL,NULL,NULL),
(468250,'2016-10-12 14:49:16','new_now','sysbiol','now_mus','5.28518;4.SSME;','museum',2,NULL,'SSME',62383,NULL,NULL,NULL),
(468251,'2016-10-12 14:49:16','new_now','sysbiol','now_plr','5.28518;2.23;','lid',2,NULL,'28518',62383,NULL,NULL,NULL),
(468252,'2016-10-12 14:49:16','new_now','sysbiol','now_plr','5.28518;2.23;','pid',2,NULL,'23',62383,NULL,NULL,NULL),
(468253,'2016-10-12 14:49:16','new_now','sysbiol','now_ls','5.28518;5.84357;','lid',2,NULL,'28518',62383,98810,NULL,NULL),
(468254,'2016-10-12 14:49:16','new_now','sysbiol','now_ls','5.28518;5.84357;','species_id',2,NULL,'84357',62383,98810,NULL,NULL),
(503720,'2019-12-24 22:14:30','new_now','sysbiol','now_tu_bound','2.11;','age',3,'1.757','1.173',NULL,NULL,NULL,4),
(503723,'2019-12-24 22:18:28','new_now','sysbiol','now_tu_bound','2.14;','age',3,'1.983','1.945',NULL,NULL,NULL,5),
(503724,'2019-12-24 22:18:28','new_now','sysbiol','now_tu_bound','2.11;','age',3,'1.173','1.1778',NULL,NULL,NULL,6),
(503732,'2019-12-24 22:19:30','new_now','sysbiol','now_tu_bound','2.11;','age',3,'1.1778','1.778',NULL,NULL,NULL,7),
(503827,'2019-12-28 13:48:29','new_now','sysbiol','now_tu_bound','3.272;','age',3,'9.149','9.426',NULL,NULL,NULL,47),
(503835,'2019-12-28 13:49:23','new_now','sysbiol','now_tu_bound','3.273;','age',3,'9.428','9.647',NULL,NULL,NULL,48),
(503870,'2019-12-28 13:57:42','new_now','sysbiol','now_tu_bound','3.276;','age',3,'9.777','9.984',NULL,NULL,NULL,51),
(503877,'2019-12-28 14:15:15','new_now','sysbiol','now_tu_bound','3.117;','age',3,'10.834','11.056',NULL,NULL,NULL,52),
(503920,'2019-12-28 14:21:32','new_now','sysbiol','now_tu_bound','3.277;','age',3,'10.94','11.146',NULL,NULL,NULL,53),
(503921,'2019-12-28 14:22:45','new_now','sysbiol','now_tu_bound','3.278;','age',3,'10.989','11.188',NULL,NULL,NULL,54),
(503924,'2019-12-28 14:23:46','new_now','sysbiol','now_tu_bound','3.279;','age',3,'11.378','11.592',NULL,NULL,NULL,55),
(503935,'2019-12-28 14:26:16','new_now','sysbiol','now_tu_bound','3.132;','age',3,'11.852','12.049',NULL,NULL,NULL,57),
(504015,'2019-12-28 16:17:02','new_now','sysbiol','now_tu_bound','3.281;','age',3,'12','12.174',NULL,NULL,NULL,58),
(504054,'2019-12-28 16:33:04','new_now','sysbiol','now_tu_bound','3.145;','age',3,'14.608','14.609',NULL,NULL,NULL,72),
(504055,'2019-12-28 16:33:55','new_now','sysbiol','now_tu_bound','3.146;','age',3,'14.8','14.775',NULL,NULL,NULL,73),
(504447,'2020-01-29 16:46:40','new_now','sysbiol','now_tu_bound','5.20213;','bid',2,NULL,'20213',NULL,NULL,NULL,193),
(504448,'2020-01-29 16:46:40','new_now','sysbiol','now_tu_bound','5.20213;','b_name',2,NULL,'MioceneLate-low',NULL,NULL,NULL,193),
(504449,'2020-01-29 16:46:40','new_now','sysbiol','now_tu_bound','5.20213;','age',2,NULL,'11.63',NULL,NULL,NULL,193),
(504450,'2020-01-29 16:46:40','new_now','sysbiol','now_tu_bound','5.20214;','bid',2,NULL,'20214',NULL,NULL,NULL,194),
(504451,'2020-01-29 16:46:40','new_now','sysbiol','now_tu_bound','5.20214;','b_name',2,NULL,'Bahean/Baodean',NULL,NULL,NULL,194),
(504452,'2020-01-29 16:46:40','new_now','sysbiol','now_tu_bound','5.20214;','age',2,NULL,'7.2',NULL,NULL,NULL,194),
(504453,'2020-01-29 16:46:40','new_now','sysbiol','now_time_unit','6.Bahean;','up_bnd',3,'20202','20214',NULL,NULL,5,NULL),
(504454,'2020-01-29 16:46:40','new_now','sysbiol','now_time_unit','6.Bahean;','low_bnd',3,'20200','20213',NULL,NULL,5,NULL),
(504520,'2020-01-29 16:57:23','new_now','sysbiol','now_tu_bound','5.20214;','b_name',3,'CNMU9/CNMU10','Bahean/Baodean',NULL,NULL,NULL,195),
(504521,'2020-01-29 16:57:23','new_now','sysbiol','now_tu_bound','5.20214;','age',3,'9','7.2',NULL,NULL,NULL,195),
(504522,'2020-01-29 16:57:23','new_now','sysbiol','now_tu_bound','5.20214;','b_comment',3,'NM10/NM11','',NULL,NULL,NULL,195),
(504563,'2020-01-29 17:06:40','new_now','sysbiol','now_tu_bound','2.65;','b_name',3,'CNMU5/CNMU6','MN5/MN6',NULL,NULL,NULL,197),
(504564,'2020-01-29 17:06:40','new_now','sysbiol','now_tu_bound','2.65;','age',3,'15.2','14.2',NULL,NULL,NULL,197),
(504565,'2020-01-29 17:06:40','new_now','sysbiol','now_tu_bound','2.65;','b_comment',3,'MN5/MN6','',NULL,NULL,NULL,197),
(504566,'2020-01-29 17:06:40','new_now','sysbiol','now_tu_bound','5.20213;','b_name',3,'CNMU7/CNMU8','MioceneLate-low',NULL,NULL,NULL,198),
(504567,'2020-01-29 17:06:40','new_now','sysbiol','now_tu_bound','5.20213;','age',3,'11.2','11.63',NULL,NULL,NULL,198),
(504568,'2020-01-29 17:06:40','new_now','sysbiol','now_tu_bound','5.20213;','b_comment',3,'MN8/MN9','',NULL,NULL,NULL,198),
(504583,'2020-01-29 17:08:49','new_now','sysbiol','now_tu_bound','2.65;','b_name',3,'CNMU5/CNMU6','MN5/MN6',NULL,NULL,NULL,199),
(504584,'2020-01-29 17:08:49','new_now','sysbiol','now_tu_bound','2.65;','age',3,'15.2','14.2',NULL,NULL,NULL,199),
(504585,'2020-01-29 17:08:49','new_now','sysbiol','now_tu_bound','2.65;','b_comment',3,'MN5/MN6','',NULL,NULL,NULL,199),
(505440,'2020-01-30 17:03:01','new_now','sysbiol','now_time_unit','7.Olduvai;','sequence',3,'miscequivalents','magneticpolarityts',NULL,NULL,28,NULL),
(505441,'2020-01-30 17:03:01','new_now','sysbiol','now_time_unit','7.Olduvai;','tu_comment',3,'','C2n',NULL,NULL,28,NULL),
(510478,'2020-04-21 11:50:37','new_now','sysbiol','now_tu_bound','3.418;','b_comment',3,'Ogg & Gradstein (2016). A Concise Geologic Time Scale: 2016. Elsevier.','Ogg & Gradstein (2016)',NULL,NULL,NULL,315),
(511477,'2020-05-08 19:47:22','new_now','sysbiol','now_tu_bound','2.33;','age',3,'0.01','0.0117',NULL,NULL,NULL,384),
(511693,'2020-05-08 19:49:29','new_now','sysbiol','now_tu_bound','2.33;','b_name',3,'Rlb/Hol','Holocene/Pleistocene',NULL,NULL,NULL,385),
(511696,'2020-05-08 19:52:51','new_now','sysbiol','now_tu_bound','2.33;','b_name',3,'L. Pleist./Holoc.','Holocene/Pleistocene',NULL,NULL,NULL,387),
(511697,'2020-05-08 19:52:51','new_now','sysbiol','now_tu_bound','2.33;','age',3,'0.01','0.0117',NULL,NULL,NULL,387),
(511726,'2020-05-08 20:00:12','new_now','sysbiol','now_tu_bound','3.418;','b_name',3,'Piac/Gelas','Pliocene/Pleistocene',NULL,NULL,NULL,391),
(511727,'2020-05-08 20:00:12','new_now','sysbiol','now_tu_bound','3.418;','b_comment',3,'Ogg & Gradstein (2016)','',NULL,NULL,NULL,391),
(512170,'2020-05-08 20:00:54','new_now','sysbiol','now_tu_bound','2.33;','b_name',3,'Holocene/Pleistocene','Pleistocene/Holocene',NULL,NULL,NULL,392),
(512211,'2020-05-08 20:06:48','new_now','sysbiol','now_tu_bound','2.33;','b_name',3,'Pleis/Holo','Pleistocene/Holocene',NULL,NULL,NULL,397),
(512212,'2020-05-08 20:06:48','new_now','sysbiol','now_tu_bound','2.33;','age',3,'0.0118','0.0117',NULL,NULL,NULL,397),
(512213,'2020-05-08 20:06:48','new_now','sysbiol','now_tu_bound','2.33;','b_comment',3,'Ogg & Gradstein (2016). A Concise Geologic Time Scale: 2016. Elsevier.','',NULL,NULL,NULL,397),
(512507,'2020-05-08 20:14:38','new_now','sysbiol','now_tu_bound','2.49;','b_name',3,'Lan/Srv','Langhian/Serravallian',NULL,NULL,NULL,403),
(512508,'2020-05-08 20:14:38','new_now','sysbiol','now_tu_bound','2.49;','age',3,'14.8','13.82',NULL,NULL,NULL,403),
(512614,'2020-05-08 20:15:43','new_now','sysbiol','now_tu_bound','2.50;','b_name',3,'Bur/Lan','Burdigalian/Langhian',NULL,NULL,NULL,404),
(512615,'2020-05-08 20:15:43','new_now','sysbiol','now_tu_bound','2.50;','age',3,'16.4','15.97',NULL,NULL,NULL,404),
(514001,'2020-05-09 09:57:13','new_now','sysbiol','now_tu_bound','2.33;','b_name',3,'Pleis/Holo','Pleistocene/Holocene',NULL,NULL,NULL,425),
(514002,'2020-05-09 09:57:13','new_now','sysbiol','now_tu_bound','2.33;','age',3,'0.0118','0.0117',NULL,NULL,NULL,425),
(514003,'2020-05-09 09:57:13','new_now','sysbiol','now_tu_bound','2.33;','b_comment',3,'Ogg & Gradstein (2016). A Concise Geologic Time Scale: 2016. Elsevier.','',NULL,NULL,NULL,425),
(514005,'2020-05-09 09:58:30','new_now','sysbiol','now_tu_bound','2.33;','b_name',3,'Pleis/Holo','Pleistocene/Holocene',NULL,NULL,NULL,426),
(514006,'2020-05-09 09:58:30','new_now','sysbiol','now_tu_bound','2.33;','age',3,'0.0118','0.0117',NULL,NULL,NULL,426),
(514007,'2020-05-09 09:58:30','new_now','sysbiol','now_tu_bound','2.33;','b_comment',3,'Ogg & Gradstein (2016). A Concise Geologic Time Scale: 2016. Elsevier.','',NULL,NULL,NULL,426),
(543671,'2020-09-15 15:17:04','new_now','sysbiol','now_tu_bound','2.33;','age',3,'0.0117','0.0118',NULL,NULL,NULL,511),
(544022,'2020-09-15 15:26:13','new_now','sysbiol','now_tu_bound','2.33;','age',3,'0.0118','0.0117',NULL,NULL,NULL,512),
(557147,'2020-12-01 12:32:57','new_now','sysbiol','now_time_unit','8.langhian;','rank',3,'Stage','Age',NULL,NULL,175,NULL),
(579017,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','species_id',2,NULL,'85729',NULL,118820,NULL,NULL),
(579018,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','class_name',2,NULL,'Mammalia',NULL,118820,NULL,NULL),
(579019,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','order_name',2,NULL,'Artiodactyla',NULL,118820,NULL,NULL),
(579020,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','family_name',2,NULL,'Bovidae',NULL,118820,NULL,NULL),
(579021,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','subclass_or_superorder_name',2,NULL,'Eutheria',NULL,118820,NULL,NULL),
(579022,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','genus_name',2,NULL,'Gallogoral',NULL,118820,NULL,NULL),
(579023,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','species_name',2,NULL,'meneghinii',NULL,118820,NULL,NULL),
(579024,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','unique_identifier',2,NULL,'sickenbergii',NULL,118820,NULL,NULL),
(579025,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','sp_status',2,NULL,'0',NULL,118820,NULL,NULL),
(579026,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','used_morph',2,NULL,'0',NULL,118820,NULL,NULL),
(579027,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','used_now',2,NULL,'1',NULL,118820,NULL,NULL),
(579028,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85729;','used_gene',2,NULL,'0',NULL,118820,NULL,NULL),
(579029,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','species_id',2,NULL,'85730',NULL,118821,NULL,NULL),
(579030,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','class_name',2,NULL,'Mammalia',NULL,118821,NULL,NULL),
(579031,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','order_name',2,NULL,'Artiodactyla',NULL,118821,NULL,NULL),
(579032,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','family_name',2,NULL,'Bovidae',NULL,118821,NULL,NULL),
(579033,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','subclass_or_superorder_name',2,NULL,'Eutheria',NULL,118821,NULL,NULL),
(579034,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','genus_name',2,NULL,'Pontoceros',NULL,118821,NULL,NULL),
(579035,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','species_name',2,NULL,'surprine',NULL,118821,NULL,NULL),
(579036,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','unique_identifier',2,NULL,'-',NULL,118821,NULL,NULL),
(579037,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','sp_status',2,NULL,'0',NULL,118821,NULL,NULL),
(579038,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','used_morph',2,NULL,'0',NULL,118821,NULL,NULL),
(579039,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','used_now',2,NULL,'1',NULL,118821,NULL,NULL),
(579040,'2022-02-08 12:00:17','now','sysbiol','com_species','5.85730;','used_gene',2,NULL,'0',NULL,118821,NULL,NULL),
(636481,'2024-05-27 17:07:05','now_test','sysbiol','now_mus','5.24797;4.IPMC;','lid',2,NULL,'24797',98500,NULL,NULL,NULL),
(636482,'2024-05-27 17:07:05','now_test','sysbiol','now_mus','5.24797;4.IPMC;','museum',2,NULL,'IPMC',98500,NULL,NULL,NULL),
(636523,'2024-05-27 17:26:53','now_test','sysbiol','now_mus','5.24797;3.RGM;','lid',2,NULL,'24797',98521,NULL,NULL,NULL),
(636524,'2024-05-27 17:26:53','now_test','sysbiol','now_mus','5.24797;3.RGM;','museum',2,NULL,'RGM',98521,NULL,NULL,NULL),
(636525,'2024-05-27 17:27:07','now_test','sysbiol','now_mus','5.24797;4.IPMC;','lid',1,'24797',NULL,98522,NULL,NULL,NULL),
(636526,'2024-05-27 17:27:07','now_test','sysbiol','now_mus','5.24797;4.IPMC;','museum',1,'IPMC',NULL,98522,NULL,NULL,NULL),
(636527,'2024-05-27 17:27:07','now_test','sysbiol','now_mus','5.24797;3.RGM;','lid',1,'24797',NULL,98522,NULL,NULL,NULL),
(636528,'2024-05-27 17:27:07','now_test','sysbiol','now_mus','5.24797;3.RGM;','museum',1,'RGM',NULL,98522,NULL,NULL,NULL),
(636529,'2024-05-29 07:41:59','now_test','sysbiol','now_loc','5.24750;','bfa_max',3,'mn13','NULL',98523,NULL,NULL,NULL),
(636530,'2024-05-29 07:41:59','now_test','sysbiol','now_loc','5.24750;','bfa_max_abs',3,'','Ar/Ar',98523,NULL,NULL,NULL),
(636531,'2024-05-29 07:41:59','now_test','sysbiol','now_loc','5.24750;','bfa_min',3,'mn13','NULL',98523,NULL,NULL,NULL),
(636532,'2024-05-29 07:41:59','now_test','sysbiol','now_loc','5.24750;','bfa_min_abs',3,'','AAR',98523,NULL,NULL,NULL),
(636533,'2024-05-29 07:41:59','now_test','sysbiol','now_loc','5.24750;','date_meth',3,'time_unit','absolute',98523,NULL,NULL,NULL),
(636534,'2024-05-30 18:50:25','now_test','sysbiol','com_species','5.21426','body_mass',3,'','1238',NULL,129167,NULL,NULL);
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-09-02 19:01:32
