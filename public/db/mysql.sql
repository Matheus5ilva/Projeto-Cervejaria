-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: saboroso
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_contacts`
--

CREATE DATABASE `trocabeer`;

USE `trocabeer`;

DROP TABLE IF EXISTS `tb_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `message` text NOT NULL,
  `register` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_contacts`
--

LOCK TABLES `tb_contacts` WRITE;
/*!40000 ALTER TABLE `tb_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_emails`
--

DROP TABLE IF EXISTS `tb_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(256) NOT NULL,
  `register` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_emails`
--

LOCK TABLES `tb_emails` WRITE;
/*!40000 ALTER TABLE `tb_emails` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_menus`
--


CREATE TABLE `tb_beers` (
  `id_beer` int(11) NOT NULL AUTO_INCREMENT, --Id da Cerveja
  `id_cervejeiro` int(11) NOT NULL, --Id do cervejeiro (Chave estrangeira)
  `title` varchar(128) NOT NULL, --Nome da cerveja
  `description` varchar(512) NOT NULL, --Descrição da cerveja
  `categories` varchar(128) NOT NULL, --Categoria da cerveja (O tipo dela "Pilsen", "Trigo", "IPA","...")
  `exchange` varchar(128) NOT NULL, --Troca por outros tipos de cervejas (Como se fosse o preço)
  `available` varchar(256) NOT NULL, --Disponivel, quantas garrafas estão disponiveis
  `photo` varchar(256) NOT NULL, --Foto do rotulo da cerveja ou das garrafas 
  `register` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `ìd_cervejeiro` FOREIGN KEY(`id_cervejeiro`) REFERENCES `tb_users`(`id_cervejeiro`)


) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_menus`
--

LOCK TABLES `tb_menus` WRITE;
/*!40000 ALTER TABLE `tb_menus` DISABLE KEYS */;
INSERT INTO `tb_beers` VALUES (1, 1,'Cerveja Mistério da fé','Cerveja Pilsen com um leve aroma de maçã. Feita com ingredientes de qualidade.', 'Pilsen', 'Cerveja de Trigo ou Ipa', '4 garrafas','images/img_1.jpg','2018-09-12 19:48:58');
/*!40000 ALTER TABLE `tb_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_reservations`
--

DROP TABLE IF EXISTS `tb_exchange`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_exchange` (
  `id` int(11) NOT NULL AUTO_INCREMENT,-- Id da troca
  `id_beer` int(11) NOT NULL, --Id da cerveja escolhida
  `name` varchar(256) NOT NULL, --Nome do "trocador"
  `email` varchar(256) NOT NULL, --Email para contato "trocador"
  `phone` varchar(256) NOT NULL, --Telefone para conta "trocador" (preferencia celular)
  `address` varchar(256) NOT NULL, --Endereço do "trocador"
  `n_bottle` int(11) NOT NULL, --Número de garrafas oferecidas para o cervejeiro
  `comments` varchar(512) NOT NULL, --Observações adicionais para facilitar a troca
  `categories` varchar(128) NOT NULL, --Categoria da cerveja (O tipo dela "Pilsen", "Trigo", "IPA","...")
  `register` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `ìd_beer` FOREIGN KEY(`id_beer`) REFERENCES `tb_beers`(`id_beer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_reservations`
--

LOCK TABLES `tb_reservations` WRITE;
/*!40000 ALTER TABLE `tb_reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_users` (
  `id_cervejeiro` int(11) NOT NULL AUTO_INCREMENT, --Id do cervejeiro
  `name` varchar(256) NOT NULL, --Nome do cervejeiro
  `email` varchar(256) NOT NULL, --Email do cervejeiro
  `password` varchar(256) NOT NULL, --Senha do cervejeiro
  `phone` varchar(256), --Telefone de contato do cervejeiro 
  `address` varchar(256) NOT NULL, --Endereço do cerveijeiro (Para haver um filtro e alem do consumidor saber de onde vem a cerveja)
  `city` varchar(256) NOT NULL, --Cidade do cervejeiro (Para haver um filtro e alem do consumidor saber de onde vem a cerveja)
  `mobile_phone` varchar(256) NOT NULL, --Telefone celular do cervejeiro (Preferencia whatsapp)
  `register` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_users`
--

LOCK TABLES `tb_users` WRITE;
/*!40000 ALTER TABLE `tb_users` DISABLE KEYS */;
INSERT INTO `tb_users` VALUES (1,'Matheus Cervejeiro','matheusxandre@live.com','123456','3835310241','Rua Adaleia Lessa', 'Diamantina', '38988499084','2018-09-12 19:48:58' );
/*!40000 ALTER TABLE `tb_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'saboroso'
--

--
-- Dumping routines for database 'saboroso'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-17  8:18:38
