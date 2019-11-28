-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: acsas
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `EmailAddress` varchar(40) NOT NULL,
  `FirstName` varchar(20) NOT NULL,
  `LastName` varchar(25) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `EmailList` tinyint(1) NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  PRIMARY KEY (`EmailAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('example2@gmail.com','ExamplePerson','ExampleLast','password123\n',0,'123-456-7891'),('test@gmail.com','Test','Tester','example123',1,'111-2222');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `EmailAddress` varchar(45) NOT NULL,
  `FirstName` varchar(45) DEFAULT NULL,
  `LastName` varchar(45) DEFAULT NULL,
  `Password` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`EmailAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('example@gmail.com','Bob','Test','example123');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderedparts`
--

DROP TABLE IF EXISTS `orderedparts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderedparts` (
  `OrderId` int(10) unsigned NOT NULL,
  `PartId` int(11) NOT NULL,
  `OrderedQuantity` int(11) NOT NULL,
  PRIMARY KEY (`OrderId`,`PartId`),
  KEY `PartId` (`PartId`),
  CONSTRAINT `orderedparts_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`OrderId`),
  CONSTRAINT `orderedparts_ibfk_2` FOREIGN KEY (`PartId`) REFERENCES `parts` (`PartId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderedparts`
--

LOCK TABLES `orderedparts` WRITE;
/*!40000 ALTER TABLE `orderedparts` DISABLE KEYS */;
INSERT INTO `orderedparts` VALUES (1,1,4),(1,3,1);
/*!40000 ALTER TABLE `orderedparts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `OrderId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ShippingId` int(10) unsigned NOT NULL,
  `PaymentId` int(10) unsigned NOT NULL,
  `EmailAddress` varchar(40) NOT NULL,
  `OrderStatus` varchar(20) NOT NULL,
  PRIMARY KEY (`OrderId`),
  KEY `ShippingId` (`ShippingId`),
  KEY `PaymentId` (`PaymentId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`ShippingId`) REFERENCES `shippingdetails` (`ShippingId`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`PaymentId`) REFERENCES `paymentdetails` (`PaymentId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,2,'example2@gmail.com','Processed');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parts`
--

DROP TABLE IF EXISTS `parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parts` (
  `PartId` int(11) NOT NULL AUTO_INCREMENT,
  `QuantityOnHand` int(11) DEFAULT NULL,
  `PriceUSD` double DEFAULT NULL,
  `PartDescription` text,
  `Brand` varchar(45) DEFAULT NULL,
  `Category` varchar(45) DEFAULT NULL,
  `Picture` text,
  `ItemName` text,
  PRIMARY KEY (`PartId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parts`
--

LOCK TABLES `parts` WRITE;
/*!40000 ALTER TABLE `parts` DISABLE KEYS */;
INSERT INTO `parts` VALUES (1,1,138000,'Replacement For Detroit 14.0L Turbo HE531VE Turbocharger DDECV VI NEW',NULL,NULL,'replace','Replacement For Detroit 14.0L Turbo HE531VE Turbocharger'),(2,4,7200,'HD Value Automatic Slack Adjuster, Haldex Style, 5-1/2 or 6-1/2 Arm Length with 10 Splines and a 1-1/2 Spline DiameterCross Reference Information40010143, AS1032, AS1034, OTR10143',NULL,NULL,'slack','Auto Slack Brand: HDValue Part#: HDV-10143'),(3,2,10300,'P WABCO Meritor Style System Purge Air Dryer - 12VCross Reference Information 170955205, 955205P, 955205X, 955300X, D6336, OTR955205, R955205, S13728, S4324130010',NULL,NULL,'drier','Air Dryer Brand: Power Products Part#: 955205P'),(4,4,9200,'freightliner cascadia Air Spring Brand: HDValue Part#: HDV9781',NULL,NULL,'hdv','freightliner cascadia Air Spring Brand: HDValue Part#: HDV9781'),(5,2,12000,'Freightliner Cascadia Columbia Century Class Heavy Duty Truck Airbag Air Spring continental',NULL,NULL,'contitech','Freightliner Cascadia Columbia Century Class Heavy Duty Truck Airbag Air Spring'),(6,4,59000,'New Fuel Pump 3417674 For Cummins Diesel Engine M11 QSM11 ISM11',NULL,NULL,'pump','New Fuel Pump 3417674 For Cummins Diesel Engine M11 QSM11 ISM11'),(7,4,19000,'Coolant Tank HD Solutions Fits 03-18 International 5900 9200 9900i Prostar NEW',NULL,NULL,'prostar','Coolant Tank HD Solutions Fits 03-18 International 5900 9200 9900i Prostar NEW'),(8,10,5800,'4921517 Engine Oil Pressure Sensor With Electrical Connector For Cummins ISX ISM',NULL,NULL,'cummins3','4921517 Engine Oil Pressure Sensor With Electrical Connector For Cummins ISX ISM'),(9,4,4800,'Crankcase Oil Pan Pressure Sensor For Volvo D12 D13 VN VNL VHD Engine 630 670',NULL,NULL,'cumminsd','Crankcase Oil Pan Pressure Sensor For Volvo D12 D13 VN VNL VHD Engine 630 670'),(10,2,6500,'Automatic Slack Adjuster, 28 Spline, x 5.5, Replaces Haldex 40010211 H-26411',NULL,NULL,'slack1','Automatic Slack Adjuster, 28 Spline, x 5.5, Replaces Haldex 40010211 H-26411'),(11,2,39800,'3090942 Cummins M11 / N14 / ISM Fuel Pump',NULL,NULL,'fuel','3090942 Cummins M11 / N14 / ISM Fuel Pump');
/*!40000 ALTER TABLE `parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentdetails`
--

DROP TABLE IF EXISTS `paymentdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentdetails` (
  `PaymentId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CardNum` int(10) unsigned NOT NULL,
  `CardMonth` varchar(10) NOT NULL,
  `CardYear` varchar(10) NOT NULL,
  `SecurityCode` varchar(10) NOT NULL,
  `BillingAddress` varchar(40) NOT NULL,
  `BillingAddress2` varchar(40) NOT NULL,
  `BillingFirstName` varchar(20) NOT NULL,
  `BillingLastName` varchar(25) NOT NULL,
  `BillingCountry` varchar(30) NOT NULL,
  `BillingCity` varchar(20) NOT NULL,
  `BillingState` varchar(20) NOT NULL,
  `BillingZIP` varchar(15) NOT NULL,
  `BillingPhone` varchar(15) NOT NULL,
  `EmailAddress` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`PaymentId`),
  KEY `EmailAddress` (`EmailAddress`),
  CONSTRAINT `paymentdetails_ibfk_1` FOREIGN KEY (`EmailAddress`) REFERENCES `accounts` (`EmailAddress`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentdetails`
--

LOCK TABLES `paymentdetails` WRITE;
/*!40000 ALTER TABLE `paymentdetails` DISABLE KEYS */;
INSERT INTO `paymentdetails` VALUES (2,1234,'Jan','2019','123','Example Road','NA','Bob','Test','USA','Poughkeepsie','NY','12345','111-2222','test@gmail.com');
/*!40000 ALTER TABLE `paymentdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippingdetails`
--

DROP TABLE IF EXISTS `shippingdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shippingdetails` (
  `ShippingId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ShippingAddress` varchar(40) NOT NULL,
  `ShippingAddress2` varchar(40) NOT NULL,
  `ShippingFirstName` varchar(20) NOT NULL,
  `ShippingLastName` varchar(25) NOT NULL,
  `ShippingCountry` varchar(30) NOT NULL,
  `ShippingCity` varchar(20) NOT NULL,
  `ShippingState` varchar(20) NOT NULL,
  `ShippingZIP` varchar(15) NOT NULL,
  `ShippingPhone` varchar(15) NOT NULL,
  `EmailAddress` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`ShippingId`),
  KEY `EmailAddress` (`EmailAddress`),
  CONSTRAINT `shippingdetails_ibfk_1` FOREIGN KEY (`EmailAddress`) REFERENCES `accounts` (`EmailAddress`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippingdetails`
--

LOCK TABLES `shippingdetails` WRITE;
/*!40000 ALTER TABLE `shippingdetails` DISABLE KEYS */;
INSERT INTO `shippingdetails` VALUES (1,'ExampleRoad','NA','Bob','Rob','USA','Town','NY','12335','111-2222\n','example2@gmail.com');
/*!40000 ALTER TABLE `shippingdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trailers`
--

DROP TABLE IF EXISTS `trailers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trailers` (
  `TrailerId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `EmailAddress` varchar(40) NOT NULL,
  `Brand` varchar(25) NOT NULL,
  `Length` float DEFAULT NULL,
  `Width` float DEFAULT NULL,
  `Picture` blob,
  `TrailerName` varchar(40) NOT NULL,
  `Color` varchar(20) NOT NULL,
  `TrailerDescription` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`TrailerId`),
  KEY `EmailAddress` (`EmailAddress`),
  CONSTRAINT `trailers_ibfk_1` FOREIGN KEY (`EmailAddress`) REFERENCES `accounts` (`EmailAddress`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trailers`
--

LOCK TABLES `trailers` WRITE;
/*!40000 ALTER TABLE `trailers` DISABLE KEYS */;
INSERT INTO `trailers` VALUES (3,'example2@gmail.com','Dodge',20,7,NULL,'2000 Dodge Trailer','Black','Used Trailer');
/*!40000 ALTER TABLE `trailers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trucks`
--

DROP TABLE IF EXISTS `trucks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trucks` (
  `TruckId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `EmailAddress` varchar(40) NOT NULL,
  `Brand` varchar(25) NOT NULL,
  `Picture` blob,
  `TruckName` varchar(40) NOT NULL,
  `DriveType` varchar(20) NOT NULL,
  `KMPerHour` varchar(10) NOT NULL,
  `FuelType` varchar(15) NOT NULL,
  `TruckDescription` varchar(200) DEFAULT NULL,
  `Color` varchar(20) NOT NULL,
  PRIMARY KEY (`TruckId`),
  KEY `EmailAddress` (`EmailAddress`),
  CONSTRAINT `trucks_ibfk_1` FOREIGN KEY (`EmailAddress`) REFERENCES `accounts` (`EmailAddress`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trucks`
--

LOCK TABLES `trucks` WRITE;
/*!40000 ALTER TABLE `trucks` DISABLE KEYS */;
INSERT INTO `trucks` VALUES (1,'test@gmail.com','Ford',NULL,'2018 Ford Truck','Rear','240','Diesel','Used Truck Want Sell','Red'),(2,'example2@gmail.com','Ford',NULL,'Test truck','Four Wheel','200','',NULL,'Red'),(3,'example2@gmail.com','Ford2',NULL,'Test truck2','Four Wheel','','Diesel2',NULL,'Blue'),(4,'example2@gmail.com','dwcwcde',NULL,'Test truck3','feg','45','dfve',NULL,'feg'),(5,'example2@gmail.com','Ford',NULL,'truck','feg','45','Diesel',NULL,'Blue'),(6,'example2@gmail.com','Ford',NULL,'Test trucknew','Four Wheel','200','Diesel',NULL,'Blue');
/*!40000 ALTER TABLE `trucks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-24 12:11:26
