-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 09 juin 2026 à 16:36
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `barber_shop`
--
CREATE DATABASE IF NOT EXISTS `barber_shop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `barber_shop`;

-- --------------------------------------------------------

--
-- Structure de la table `app_admin_config`
--
-- Erreur de lecture de structure pour la table barber_shop.app_admin_config : #1932 - Table 'barber_shop.app_admin_config' doesn't exist in engine
-- Erreur de lecture des données pour la table barber_shop.app_admin_config : #1064 - Erreur de syntaxe près de 'FROM `barber_shop`.`app_admin_config`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `barber_admins`
--
-- Erreur de lecture de structure pour la table barber_shop.barber_admins : #1932 - Table 'barber_shop.barber_admins' doesn't exist in engine
-- Erreur de lecture des données pour la table barber_shop.barber_admins : #1064 - Erreur de syntaxe près de 'FROM `barber_shop`.`barber_admins`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `blocked_users`
--
-- Erreur de lecture de structure pour la table barber_shop.blocked_users : #1932 - Table 'barber_shop.blocked_users' doesn't exist in engine
-- Erreur de lecture des données pour la table barber_shop.blocked_users : #1064 - Erreur de syntaxe près de 'FROM `barber_shop`.`blocked_users`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `client_otp_codes`
--
-- Erreur de lecture de structure pour la table barber_shop.client_otp_codes : #1932 - Table 'barber_shop.client_otp_codes' doesn't exist in engine
-- Erreur de lecture des données pour la table barber_shop.client_otp_codes : #1064 - Erreur de syntaxe près de 'FROM `barber_shop`.`client_otp_codes`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--
-- Erreur de lecture de structure pour la table barber_shop.reservations : #1932 - Table 'barber_shop.reservations' doesn't exist in engine
-- Erreur de lecture des données pour la table barber_shop.reservations : #1064 - Erreur de syntaxe près de 'FROM `barber_shop`.`reservations`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `services`
--
-- Erreur de lecture de structure pour la table barber_shop.services : #1932 - Table 'barber_shop.services' doesn't exist in engine
-- Erreur de lecture des données pour la table barber_shop.services : #1064 - Erreur de syntaxe près de 'FROM `barber_shop`.`services`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `work_schedule`
--
-- Erreur de lecture de structure pour la table barber_shop.work_schedule : #1932 - Table 'barber_shop.work_schedule' doesn't exist in engine
-- Erreur de lecture des données pour la table barber_shop.work_schedule : #1064 - Erreur de syntaxe près de 'FROM `barber_shop`.`work_schedule`' à la ligne 1
--
-- Base de données : `basketball_ocr`
--
CREATE DATABASE IF NOT EXISTS `basketball_ocr` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `basketball_ocr`;

-- --------------------------------------------------------

--
-- Structure de la table `final_result`
--
-- Erreur de lecture de structure pour la table basketball_ocr.final_result : #1932 - Table 'basketball_ocr.final_result' doesn't exist in engine
-- Erreur de lecture des données pour la table basketball_ocr.final_result : #1064 - Erreur de syntaxe près de 'FROM `basketball_ocr`.`final_result`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `matches`
--
-- Erreur de lecture de structure pour la table basketball_ocr.matches : #1932 - Table 'basketball_ocr.matches' doesn't exist in engine
-- Erreur de lecture des données pour la table basketball_ocr.matches : #1064 - Erreur de syntaxe près de 'FROM `basketball_ocr`.`matches`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `period_results`
--
-- Erreur de lecture de structure pour la table basketball_ocr.period_results : #1932 - Table 'basketball_ocr.period_results' doesn't exist in engine
-- Erreur de lecture des données pour la table basketball_ocr.period_results : #1064 - Erreur de syntaxe près de 'FROM `basketball_ocr`.`period_results`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `team_a_players`
--
-- Erreur de lecture de structure pour la table basketball_ocr.team_a_players : #1932 - Table 'basketball_ocr.team_a_players' doesn't exist in engine
-- Erreur de lecture des données pour la table basketball_ocr.team_a_players : #1064 - Erreur de syntaxe près de 'FROM `basketball_ocr`.`team_a_players`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `team_b_players`
--
-- Erreur de lecture de structure pour la table basketball_ocr.team_b_players : #1932 - Table 'basketball_ocr.team_b_players' doesn't exist in engine
-- Erreur de lecture des données pour la table basketball_ocr.team_b_players : #1064 - Erreur de syntaxe près de 'FROM `basketball_ocr`.`team_b_players`' à la ligne 1
--
-- Base de données : `black_energie`
--
CREATE DATABASE IF NOT EXISTS `black_energie` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `black_energie`;

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `created_at`) VALUES
(1, 'hamza.emilie23@gmail.com', '$2a$10$9GfS1qK1q7oK3cZV6d7.J.X8oR1d7oK3cZV6d7.J.X8oR1d7oK3cZ', '2026-05-09 04:04:53');

-- --------------------------------------------------------

--
-- Structure de la table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_amount`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, 'SAIF', 'percentage', 50.00, 100.00, '2026-05-01 00:00:00', '2026-06-30 23:59:59', 1, '2026-05-14 20:15:13');

-- --------------------------------------------------------

--
-- Structure de la table `delivery_costs`
--

CREATE TABLE `delivery_costs` (
  `id` int(11) NOT NULL,
  `city` varchar(255) NOT NULL,
  `cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('single','group','all') NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `target_ids` text DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `product_name` text NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_whatsapp` varchar(50) NOT NULL,
  `customer_address` text NOT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `product_name`, `customer_name`, `customer_whatsapp`, `customer_address`, `weight`, `quantity`, `total_price`, `status`, `created_at`) VALUES
(1, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Aurelia Solis', '0618317760', '21 Avenue Hassan II, Rabat', '250g', 1, 19.00, 'confirmed', '2026-05-21 17:14:37'),
(2, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Dorian Grey', '0644552356', '47 Avenue Hassan II, Tangier', '250g', 2, 40.00, 'confirmed', '2026-05-20 12:11:01'),
(3, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Sophia Sterling', '0648361736', '94 Avenue Hassan II, Casablanca', '500g', 1, 40.00, 'confirmed', '2026-05-20 12:14:38'),
(4, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Elena Rostova', '0662672503', '8 Avenue Hassan II, Marrakech', '250g', 1, 18.00, 'pending', '2026-05-20 14:37:40'),
(5, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Aurelia Solis', '0643816221', '47 Avenue Hassan II, Agadir', '500g', 1, 38.00, 'confirmed', '2026-05-20 13:50:50'),
(6, 'Strong Espresso | High-Performance Energy by Black Energie', 'Olivia Dupont', '0634573086', '39 Avenue Hassan II, Rabat', '250g', 1, 22.00, 'confirmed', '2026-05-20 06:51:27'),
(7, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Cassian Drake', '0653305293', '42 Avenue Hassan II, Rabat', '500g', 1, 40.00, 'confirmed', '2026-05-19 06:16:13'),
(8, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Elena Rostova', '0649563923', '15 Avenue Hassan II, Marrakech', '500g', 2, 80.00, 'cancelled', '2026-05-18 10:16:30'),
(9, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Olivia Dupont', '0644132803', '53 Avenue Hassan II, Marrakech', '500g', 2, 72.00, 'confirmed', '2026-05-18 12:44:47'),
(10, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Olivia Dupont', '0691683488', '69 Avenue Hassan II, Fes', '250g', 2, 42.00, 'confirmed', '2026-05-18 09:14:29'),
(11, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Isabella Sterling', '0672181653', '28 Avenue Hassan II, Marrakech', '250g', 1, 18.00, 'pending', '2026-05-18 16:11:09'),
(12, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Julian Mercer', '0684441505', '98 Avenue Hassan II, Agadir', '1kg', 1, 68.00, 'confirmed', '2026-05-18 13:25:50'),
(13, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Marcus Vance', '0665446518', '85 Avenue Hassan II, Rabat', '500g', 2, 64.00, 'confirmed', '2026-05-18 13:45:46'),
(14, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Cassian Drake', '0692752928', '39 Avenue Hassan II, Casablanca', '250g', 1, 21.00, 'cancelled', '2026-05-17 14:09:17'),
(15, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Seraphina Finch', '0673441370', '33 Avenue Hassan II, Fes', '250g', 1, 19.00, 'confirmed', '2026-05-17 07:21:27'),
(16, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Aurelia Solis', '0676396648', '42 Avenue Hassan II, Agadir', '250g', 1, 18.00, 'confirmed', '2026-05-17 15:02:23'),
(17, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Seraphina Finch', '0689201859', '67 Avenue Hassan II, Fes', '1kg', 1, 75.00, 'confirmed', '2026-05-16 17:22:10'),
(18, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Aurelia Solis', '0689221158', '39 Avenue Hassan II, Fes', '250g', 1, 18.00, 'confirmed', '2026-05-15 13:23:00'),
(19, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Tristan Vance', '0653757611', '61 Avenue Hassan II, Marrakech', '250g', 2, 40.00, 'pending', '2026-05-15 11:08:37'),
(20, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Cassian Drake', '0692311813', '14 Avenue Hassan II, Rabat', '1kg', 2, 150.00, 'confirmed', '2026-05-15 07:07:22'),
(21, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Olivia Dupont', '0698863463', '26 Avenue Hassan II, Rabat', '1kg', 2, 120.00, 'confirmed', '2026-05-15 17:22:36'),
(22, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Vivienne Westwood', '0618375320', '26 Avenue Hassan II, Marrakech', '500g', 1, 34.00, 'pending', '2026-05-15 10:48:44'),
(23, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Cassian Drake', '0636504271', '14 Avenue Hassan II, Rabat', '250g', 1, 18.00, 'confirmed', '2026-05-15 10:41:07'),
(24, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Maximilian Cruz', '0663824624', '11 Avenue Hassan II, Agadir', '500g', 1, 36.00, 'pending', '2026-05-14 08:22:41'),
(25, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Elena Rostova', '0630655628', '59 Avenue Hassan II, Agadir', '500g', 2, 68.00, 'pending', '2026-05-14 09:24:01'),
(26, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Marcus Vance', '0628693035', '63 Avenue Hassan II, Marrakech', '250g', 2, 38.00, 'confirmed', '2026-05-14 10:23:18'),
(27, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Dorian Grey', '0636070211', '83 Avenue Hassan II, Marrakech', '250g', 2, 34.00, 'confirmed', '2026-05-14 13:28:53'),
(28, 'Strong Espresso | High-Performance Energy by Black Energie', 'Elena Rostova', '0679852798', '58 Avenue Hassan II, Rabat', '500g', 2, 84.00, 'confirmed', '2026-05-14 10:28:23'),
(29, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Tristan Vance', '0646398348', '45 Avenue Hassan II, Agadir', '1kg', 2, 150.00, 'confirmed', '2026-05-14 17:08:33'),
(30, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Alexander Thorne', '0637066475', '93 Avenue Hassan II, Tangier', '500g', 1, 36.00, 'confirmed', '2026-05-13 14:58:09'),
(31, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Dorian Grey', '0684444061', '27 Avenue Hassan II, Rabat', '1kg', 1, 65.00, 'confirmed', '2026-05-13 16:20:47'),
(32, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Gideon Ward', '0611026851', '25 Avenue Hassan II, Marrakech', '250g', 1, 19.00, 'confirmed', '2026-05-13 13:22:18'),
(33, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Marcus Vance', '0692556712', '26 Avenue Hassan II, Casablanca', '250g', 1, 21.00, 'confirmed', '2026-05-13 16:33:56'),
(34, 'Strong Espresso | High-Performance Energy by Black Energie', 'Vivienne Westwood', '0653223635', '13 Avenue Hassan II, Agadir', '1kg', 1, 80.00, 'confirmed', '2026-05-12 11:29:27'),
(35, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Cassian Drake', '0651966105', '73 Avenue Hassan II, Casablanca', '500g', 1, 32.00, 'confirmed', '2026-05-12 08:36:18'),
(36, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Isabella Sterling', '0662349330', '71 Avenue Hassan II, Fes', '1kg', 1, 60.00, 'pending', '2026-05-12 12:43:25'),
(37, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Cassian Drake', '0672000159', '43 Avenue Hassan II, Marrakech', '500g', 2, 80.00, 'confirmed', '2026-05-12 09:35:37'),
(38, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Amara Sinclair', '0692344565', '4 Avenue Hassan II, Tangier', '500g', 2, 64.00, 'confirmed', '2026-05-12 14:54:28'),
(39, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Cassian Drake', '0666584154', '61 Avenue Hassan II, Fes', '1kg', 2, 120.00, 'pending', '2026-05-11 17:32:23'),
(40, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Elena Rostova', '0612124870', '21 Avenue Hassan II, Marrakech', '500g', 2, 76.00, 'confirmed', '2026-05-10 10:38:03'),
(41, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Sophia Sterling', '0615840790', '9 Avenue Hassan II, Fes', '500g', 2, 76.00, 'confirmed', '2026-05-09 16:21:11'),
(42, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Vivienne Westwood', '0665565849', '50 Avenue Hassan II, Fes', '250g', 1, 18.00, 'confirmed', '2026-05-09 15:57:51'),
(43, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Isabella Sterling', '0696893126', '16 Avenue Hassan II, Marrakech', '250g', 2, 40.00, 'confirmed', '2026-05-09 06:26:11'),
(44, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Aurelia Solis', '0645672520', '36 Avenue Hassan II, Tangier', '500g', 1, 36.00, 'confirmed', '2026-05-08 12:18:28'),
(45, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Alexander Thorne', '0694869279', '45 Avenue Hassan II, Agadir', '250g', 1, 21.00, 'confirmed', '2026-05-08 12:39:47'),
(46, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Elena Rostova', '0648092171', '28 Avenue Hassan II, Rabat', '500g', 1, 36.00, 'pending', '2026-05-07 08:40:48'),
(47, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Julian Mercer', '0665241511', '57 Avenue Hassan II, Casablanca', '250g', 2, 34.00, 'confirmed', '2026-05-07 12:50:43'),
(48, 'Strong Espresso | High-Performance Energy by Black Energie', 'Isabella Sterling', '0633261865', '98 Avenue Hassan II, Rabat', '250g', 2, 44.00, 'confirmed', '2026-05-07 11:33:57'),
(49, 'Strong Espresso | High-Performance Energy by Black Energie', 'Gideon Ward', '0679970629', '46 Avenue Hassan II, Casablanca', '500g', 2, 84.00, 'confirmed', '2026-05-07 12:44:20'),
(50, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Isabella Sterling', '0641795498', '22 Avenue Hassan II, Tangier', '1kg', 1, 68.00, 'confirmed', '2026-05-07 14:08:38'),
(51, 'Strong Espresso | High-Performance Energy by Black Energie', 'Amara Sinclair', '0641611379', '79 Avenue Hassan II, Rabat', '500g', 2, 84.00, 'pending', '2026-05-07 07:51:09'),
(52, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Marcus Vance', '0685031424', '2 Avenue Hassan II, Fes', '1kg', 1, 72.00, 'confirmed', '2026-05-06 17:14:13'),
(53, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Sophia Sterling', '0674584839', '99 Avenue Hassan II, Rabat', '500g', 2, 64.00, 'confirmed', '2026-05-06 12:48:50'),
(54, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Alexander Thorne', '0625373217', '92 Avenue Hassan II, Rabat', '1kg', 1, 75.00, 'confirmed', '2026-05-05 08:58:35'),
(55, 'Strong Espresso | High-Performance Energy by Black Energie', 'Seraphina Finch', '0631541974', '6 Avenue Hassan II, Agadir', '500g', 2, 84.00, 'confirmed', '2026-05-05 12:37:12'),
(56, 'Strong Espresso | High-Performance Energy by Black Energie', 'Dorian Grey', '0618898899', '82 Avenue Hassan II, Fes', '500g', 2, 84.00, 'confirmed', '2026-05-05 10:11:57'),
(57, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Elena Rostova', '0649641280', '12 Avenue Hassan II, Agadir', '1kg', 1, 75.00, 'confirmed', '2026-05-04 09:29:15'),
(58, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Tristan Vance', '0633482643', '11 Avenue Hassan II, Casablanca', '1kg', 1, 60.00, 'confirmed', '2026-05-03 09:04:40'),
(59, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Julian Mercer', '0641115395', '60 Avenue Hassan II, Fes', '500g', 1, 38.00, 'confirmed', '2026-05-03 06:20:29'),
(60, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Dorian Grey', '0632908902', '50 Avenue Hassan II, Agadir', '500g', 1, 34.00, 'confirmed', '2026-05-03 06:59:39'),
(61, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Aurelia Solis', '0664938907', '39 Avenue Hassan II, Agadir', '1kg', 1, 72.00, 'confirmed', '2026-05-03 09:07:13'),
(62, 'Strong Espresso | High-Performance Energy by Black Energie', 'Aurelia Solis', '0620302958', '55 Avenue Hassan II, Marrakech', '1kg', 1, 80.00, 'confirmed', '2026-05-03 16:46:40'),
(63, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Vivienne Westwood', '0635978870', '51 Avenue Hassan II, Agadir', '500g', 2, 80.00, 'confirmed', '2026-05-02 10:16:39'),
(64, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Amara Sinclair', '0666244474', '39 Avenue Hassan II, Rabat', '250g', 1, 21.00, 'confirmed', '2026-05-02 16:56:11'),
(65, 'Strong Espresso | High-Performance Energy by Black Energie', 'Alexander Thorne', '0698078918', '2 Avenue Hassan II, Tangier', '500g', 1, 42.00, 'confirmed', '2026-05-02 06:08:45'),
(66, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Aurelia Solis', '0693934598', '26 Avenue Hassan II, Fes', '250g', 1, 17.00, 'confirmed', '2026-05-02 06:28:30'),
(67, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Isabella Sterling', '0665434243', '53 Avenue Hassan II, Marrakech', '500g', 1, 40.00, 'confirmed', '2026-05-02 09:11:52'),
(68, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Amara Sinclair', '0698476143', '64 Avenue Hassan II, Fes', '1kg', 1, 75.00, 'pending', '2026-05-01 09:56:52'),
(69, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Cassian Drake', '0622741609', '69 Avenue Hassan II, Fes', '250g', 1, 21.00, 'confirmed', '2026-05-01 16:33:35'),
(70, 'Strong Espresso | High-Performance Energy by Black Energie', 'Marcus Vance', '0623444314', '17 Avenue Hassan II, Agadir', '1kg', 2, 160.00, 'confirmed', '2026-05-01 13:27:31'),
(71, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Amara Sinclair', '0682518644', '14 Avenue Hassan II, Casablanca', '500g', 2, 76.00, 'confirmed', '2026-05-01 13:55:04'),
(72, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Vivienne Westwood', '0667828761', '47 Avenue Hassan II, Rabat', '250g', 2, 40.00, 'confirmed', '2026-05-01 11:59:18'),
(73, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Dorian Grey', '0663688969', '57 Avenue Hassan II, Casablanca', '500g', 2, 76.00, 'confirmed', '2026-05-01 10:38:19'),
(74, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Tristan Vance', '0620654239', '23 Avenue Hassan II, Tangier', '500g', 2, 80.00, 'confirmed', '2026-04-30 11:26:27'),
(75, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Dorian Grey', '0643758385', '26 Avenue Hassan II, Tangier', '1kg', 1, 68.00, 'confirmed', '2026-04-30 11:15:32'),
(76, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Amara Sinclair', '0667840328', '43 Avenue Hassan II, Tangier', '500g', 2, 68.00, 'pending', '2026-04-30 11:59:40'),
(77, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Alexander Thorne', '0620810405', '7 Avenue Hassan II, Rabat', '500g', 2, 80.00, 'confirmed', '2026-04-29 10:24:50'),
(78, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Marcus Vance', '0670252130', '59 Avenue Hassan II, Casablanca', '1kg', 1, 60.00, 'confirmed', '2026-04-29 09:59:24'),
(79, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Seraphina Finch', '0615818166', '41 Avenue Hassan II, Fes', '1kg', 2, 130.00, 'cancelled', '2026-04-28 09:44:54'),
(80, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Cassian Drake', '0684300897', '58 Avenue Hassan II, Casablanca', '250g', 2, 38.00, 'pending', '2026-04-28 10:04:55'),
(81, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Amara Sinclair', '0642600451', '50 Avenue Hassan II, Marrakech', '500g', 2, 64.00, 'cancelled', '2026-04-27 12:03:18'),
(82, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Tristan Vance', '0661050248', '47 Avenue Hassan II, Fes', '1kg', 1, 65.00, 'pending', '2026-04-27 14:40:30'),
(83, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Marcus Vance', '0681298185', '73 Avenue Hassan II, Tangier', '250g', 1, 20.00, 'confirmed', '2026-04-27 17:52:02'),
(84, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Dorian Grey', '0619667206', '48 Avenue Hassan II, Rabat', '1kg', 2, 130.00, 'confirmed', '2026-04-27 12:50:32'),
(85, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Seraphina Finch', '0669405151', '6 Avenue Hassan II, Fes', '250g', 2, 36.00, 'confirmed', '2026-04-27 11:53:19'),
(86, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Elena Rostova', '0652250729', '63 Avenue Hassan II, Rabat', '500g', 2, 68.00, 'pending', '2026-04-27 13:02:06'),
(87, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Marcus Vance', '0642860557', '95 Avenue Hassan II, Marrakech', '500g', 1, 40.00, 'cancelled', '2026-04-26 15:20:54'),
(88, 'Strong Espresso | High-Performance Energy by Black Energie', 'Tristan Vance', '0647920573', '11 Avenue Hassan II, Fes', '250g', 2, 44.00, 'confirmed', '2026-04-25 08:23:10'),
(89, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'Marcus Vance', '0673951673', '52 Avenue Hassan II, Tangier', '250g', 2, 34.00, 'pending', '2026-04-25 11:54:01'),
(90, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Olivia Dupont', '0625165513', '24 Avenue Hassan II, Marrakech', '1kg', 2, 136.00, 'confirmed', '2026-04-25 16:21:03'),
(91, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Isabella Sterling', '0620386903', '79 Avenue Hassan II, Casablanca', '500g', 2, 80.00, 'pending', '2026-04-25 15:29:29'),
(92, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Julian Mercer', '0691993592', '34 Avenue Hassan II, Marrakech', '250g', 1, 18.00, 'confirmed', '2026-04-24 11:08:26'),
(93, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Sophia Sterling', '0685963756', '62 Avenue Hassan II, Marrakech', '1kg', 1, 75.00, 'pending', '2026-04-24 08:23:38'),
(94, 'Strong Espresso | High-Performance Energy by Black Energie', 'Sophia Sterling', '0659653375', '84 Avenue Hassan II, Marrakech', '250g', 2, 44.00, 'confirmed', '2026-04-24 06:59:16'),
(95, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Amara Sinclair', '0622388653', '71 Avenue Hassan II, Casablanca', '500g', 2, 76.00, 'confirmed', '2026-04-24 10:17:20'),
(96, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'Isabella Sterling', '0697038940', '4 Avenue Hassan II, Tangier', '1kg', 2, 136.00, 'confirmed', '2026-04-23 17:16:00'),
(97, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Seraphina Finch', '0641865531', '53 Avenue Hassan II, Rabat', '1kg', 1, 75.00, 'confirmed', '2026-04-23 12:42:01'),
(98, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'Maximilian Cruz', '0661496858', '13 Avenue Hassan II, Casablanca', '500g', 2, 80.00, 'confirmed', '2026-04-23 10:15:01'),
(99, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'Tristan Vance', '0610642764', '98 Avenue Hassan II, Tangier', '500g', 1, 34.00, 'confirmed', '2026-04-23 10:57:06'),
(100, 'Heavy Body | Premium Coffee Blend by Black Energie', 'Maximilian Cruz', '0647281268', '83 Avenue Hassan II, Tangier', '1kg', 1, 72.00, 'pending', '2026-04-23 07:15:53');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `price` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `product_type` enum('single','pack') DEFAULT 'single',
  `intensity` int(11) DEFAULT 5,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `price`, `description`, `product_type`, `intensity`, `image_url`, `created_at`) VALUES
(3, 'Colombia Supremo | Single Origin Excellence by Black Energie', 'colombia-supremo', '18.00', 'Discover the gold standard of South American coffee with Colombia Supremo. Sourced from the high-altitude Andean peaks, this single-origin selection represents the largest and highest quality beans Colombia has to offer. It is a refined, classic cup designed for those who appreciate balance, clarity, and a hint of natural sweetness.', 'single', 3, 'http://localhost:5000/uploads/1778529753329-993749041.png', '2026-05-14 03:57:04'),
(4, 'Heavy Body | Premium Coffee Blend by Black Energie', 'heavy-body', '20.00', 'Experience the pinnacle of bold, morning fuel with Heavy Body. Designed for those who demand a powerful kick and a velvety texture, this blend is a masterclass in depth and intensity.', 'single', 5, 'http://localhost:5000/uploads/1778529781608-132198330.png', '2026-05-14 03:57:04'),
(5, 'Brazil Velvet | Single Origin Smoothness by Black Energie', 'brazil-velvet', '17.00', 'Indulge in the creamy, comforting essence of South America with Brazil Velvet. Sourced from the sun-drenched Cerrado plains, this single-origin selection is defined by its exceptionally low acidity and luxurious texture. It is a smooth, dependable cup that feels as soft on the palate as its name suggests.', 'single', 2, 'http://localhost:5000/uploads/1778529873285-856367590.png', '2026-05-14 03:57:04'),
(6, 'Smooth Classic | Balanced Heritage Blend by Black Energie', 'smooth-classic', '19.00', 'Discover the perfect everyday essential with Smooth Classic. This blend is the bridge between intensity and refinement, crafted for those who appreciate the timeless tradition of a well-balanced cup. It’s the reliable companion for your morning ritual or your afternoon reset.', 'single', 4, 'http://localhost:5000/uploads/1778529903998-380561424.png', '2026-05-14 03:57:04'),
(7, 'Strong Espresso | High-Performance Energy by Black Energie', 'strong-espresso', '22.00', 'Elevate your expectations with Strong Espresso. Engineered for the bold and the driven, this blend is designed to provide a sharp, clean focus. Whether you’re fueling up for a long night of coding or a high-intensity workout, this is the definitive choice for those who need their coffee to work as hard as they do.', 'single', 5, 'http://localhost:5000/uploads/1778529967096-444751596.png', '2026-05-14 03:57:04'),
(8, 'Aroma Light | Floral & Vibrant Blend by Black Energie', 'aroma-light', '21.00', 'Experience coffee at its most fragrant with Aroma Light. This blend is a tribute to the delicate and complex side of the bean, focusing on brightness and perfume rather than bitterness. It is the perfect choice for the connoisseur who seeks a sophisticated, tea-like clarity in their cup.', 'single', 1, 'http://localhost:5000/uploads/1778530069995-276816408.png', '2026-05-14 03:57:04'),
(9, 'asdas', 'asdas', '123', 'asda as das d', 'pack', 5, 'http://localhost:5000/uploads/1778731139792-253152421.png', '2026-05-14 03:58:59'),
(10, 'asdas das das', 'asdas-das-das', '12', 'asd asdasda', 'pack', 5, 'http://localhost:5000/uploads/1778731238689-902859082.png', '2026-05-14 04:00:38');

-- --------------------------------------------------------

--
-- Structure de la table `product_weights`
--

CREATE TABLE `product_weights` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `weight_value` varchar(50) NOT NULL,
  `weight_unit` varchar(20) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product_weights`
--

INSERT INTO `product_weights` (`id`, `product_id`, `weight_value`, `weight_unit`, `price`) VALUES
(19, 3, '250', 'g', 18.00),
(20, 3, '500', 'g', 34.00),
(21, 3, '1', 'kg', 65.00),
(22, 4, '250', 'g', 20.00),
(23, 4, '500', 'g', 38.00),
(24, 4, '1', 'kg', 72.00),
(25, 5, '250', 'g', 17.00),
(26, 5, '500', 'g', 32.00),
(27, 5, '1', 'kg', 60.00),
(28, 6, '250', 'g', 19.00),
(29, 6, '500', 'g', 36.00),
(30, 6, '1', 'kg', 68.00),
(31, 7, '250', 'g', 22.00),
(32, 7, '500', 'g', 42.00),
(33, 7, '1', 'kg', 80.00),
(34, 8, '250', 'g', 21.00),
(35, 8, '500', 'g', 40.00),
(36, 8, '1', 'kg', 75.00),
(37, 9, '100', 'g', 123.00),
(38, 10, '20', 'g', 12.00);

-- --------------------------------------------------------

--
-- Structure de la table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `product_slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Index pour la table `delivery_costs`
--
ALTER TABLE `delivery_costs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `city` (`city`);

--
-- Index pour la table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Index pour la table `product_weights`
--
ALTER TABLE `product_weights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `delivery_costs`
--
ALTER TABLE `delivery_costs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `product_weights`
--
ALTER TABLE `product_weights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `product_weights`
--
ALTER TABLE `product_weights`
  ADD CONSTRAINT `product_weights_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
--
-- Base de données : `coachhelper`
--
CREATE DATABASE IF NOT EXISTS `coachhelper` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `coachhelper`;

-- --------------------------------------------------------

--
-- Structure de la table `coach_seasons`
--

CREATE TABLE `coach_seasons` (
  `id` int(11) NOT NULL,
  `coach_id` int(11) NOT NULL,
  `club_name` varchar(255) NOT NULL,
  `season_year` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `coach_seasons`
--

INSERT INTO `coach_seasons` (`id`, `coach_id`, `club_name`, `season_year`, `created_at`) VALUES
(1, 1, 'husabasketball', '2023', '2026-06-08 22:57:28');

-- --------------------------------------------------------

--
-- Structure de la table `match_player_stats`
--

CREATE TABLE `match_player_stats` (
  `id` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `in_game` tinyint(1) DEFAULT 0,
  `points` int(11) DEFAULT 0,
  `fouls` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(50) DEFAULT 'New',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `subject`, `message`, `status`, `created_at`) VALUES
(1, 'test', 'hamza.emilie23@gmail.com', 'asdas ', 'as dasd asd as', 'New', '2026-06-06 03:47:48'),
(2, 'David Johnson', 'david.johnson@test.com', 'Bug report', 'I cannot log in to my account since yesterday.', 'New', '2026-06-02 04:10:36'),
(3, 'Emma Rodriguez', 'emma.rodriguez@test.com', 'Feature request', 'It would be great if you could add a calendar integration.', 'New', '2026-06-03 23:27:36'),
(4, 'Sarah Miller', 'sarah.miller@test.com', 'Bug report', 'The dashboard is not loading properly on my phone.', 'New', '2026-06-05 11:31:00'),
(5, 'Sophia Brown', 'sophia.brown@test.com', 'Login issue', 'I cannot log in to my account since yesterday.', 'New', '2026-06-07 08:06:18'),
(6, 'Sarah Jones', 'sarah.jones@test.com', 'Question about Elite Plan', 'The dashboard is not loading properly on my phone.', 'New', '2026-06-06 15:09:38'),
(7, 'Michael Jones', 'michael.jones@test.com', 'Bug report', 'I cannot log in to my account since yesterday.', 'New', '2026-06-03 23:55:49'),
(8, 'William Brown', 'william.brown@test.com', 'Login issue', 'I cannot log in to my account since yesterday.', 'New', '2026-06-06 23:34:15'),
(9, 'William Miller', 'william.miller@test.com', 'Feature request', 'The dashboard is not loading properly on my phone.', 'New', '2026-06-05 16:02:01'),
(10, 'Olivia Williams', 'olivia.williams@test.com', 'Feature request', 'It would be great if you could add a calendar integration.', 'New', '2026-06-06 19:14:52'),
(11, 'David Williams', 'david.williams@test.com', 'Question about Elite Plan', 'The dashboard is not loading properly on my phone.', 'New', '2026-06-04 17:20:37');

-- --------------------------------------------------------

--
-- Structure de la table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `period` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `is_popular` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offers`
--

INSERT INTO `offers` (`id`, `name`, `price`, `period`, `description`, `is_popular`, `created_at`) VALUES
(1, 'Basic Plan', 29.99, 'Monthly', 'Access to basic features.', 0, '2026-06-06 03:33:05'),
(2, 'Pro Plan', 49.99, 'Monthly', 'Access to all features + priority support.', 1, '2026-06-06 03:33:05'),
(4, 'test', 100.00, 'month', 'asd adasdas das', 1, '2026-06-06 03:33:23');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_email` varchar(255) NOT NULL,
  `plan` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `rejection_reason` text DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `receipt_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `customer_email`, `plan`, `amount`, `status`, `created_at`, `rejection_reason`, `payment_method`, `receipt_image`) VALUES
(1, 7, 'hamza.emilie23@gmail.com', 'monthly', 29.00, 'Pending', '2026-06-06 03:47:14', NULL, NULL, NULL),
(2, 9, 'hamza.emilie23@gmail.com', 'monthly', 29.00, 'Pending', '2026-06-06 04:09:54', NULL, NULL, NULL),
(3, 10, 'hamza.emilie23@gmail.com', 'monthly', 29.00, 'Pending', '2026-06-06 04:14:21', 'the payment is not passed', NULL, NULL),
(5, 12, 'hamza.emilie23@gmail.com', 'yearly', 290.00, 'Confirmed', '2026-06-07 22:17:10', NULL, 'cih', '/uploads/1780870647095.webp'),
(6, 21, 'jane.garcia770@example.com', 'Pro Plan', 49.99, 'Pending', '2026-05-28 11:09:33', NULL, 'Credit Card', NULL),
(7, 27, 'robert.johnson970@example.com', 'test', 100.00, 'Rejected', '2026-05-09 21:14:29', NULL, 'PayPal', NULL),
(8, 27, 'robert.johnson970@example.com', 'Pro Plan', 49.99, 'Pending', '2026-06-02 11:09:55', NULL, 'Crypto', NULL),
(9, 18, 'david.rodriguez711@example.com', 'Pro Plan', 49.99, 'Rejected', '2026-05-07 16:22:11', NULL, 'Crypto', NULL),
(10, 20, 'sarah.jones271@example.com', 'test', 100.00, 'Confirmed', '2026-05-01 10:24:21', NULL, 'PayPal', NULL),
(11, 16, 'sophia.garcia534@example.com', 'test', 100.00, 'Confirmed', '2026-05-03 06:51:43', NULL, 'Crypto', NULL),
(12, 25, 'emma.johnson871@example.com', 'test', 100.00, 'Rejected', '2026-05-04 17:54:30', NULL, 'PayPal', NULL),
(13, 19, 'david.smith904@example.com', 'Basic Plan', 29.99, 'Confirmed', '2026-05-23 04:49:24', NULL, 'Credit Card', NULL),
(14, 22, 'robert.rodriguez304@example.com', 'Basic Plan', 29.99, 'Confirmed', '2026-05-12 03:20:13', NULL, 'Bank Transfer', NULL),
(15, 27, 'robert.johnson970@example.com', 'Basic Plan', 29.99, 'Pending', '2026-05-20 21:27:05', NULL, 'Credit Card', NULL),
(16, 21, 'jane.garcia770@example.com', 'Pro Plan', 49.99, 'Rejected', '2026-05-20 11:14:10', NULL, 'PayPal', NULL),
(17, 15, 'sarah.brown376@example.com', 'test', 100.00, 'Pending', '2026-05-04 13:58:20', NULL, 'PayPal', NULL),
(18, 16, 'sophia.garcia534@example.com', 'Basic Plan', 29.99, 'Pending', '2026-05-13 11:28:20', NULL, 'Credit Card', NULL),
(19, 24, 'olivia.jones550@example.com', 'Basic Plan', 29.99, 'Rejected', '2026-06-04 22:37:06', NULL, 'Credit Card', NULL),
(20, 18, 'david.rodriguez711@example.com', 'Pro Plan', 49.99, 'Pending', '2026-05-18 07:00:14', NULL, 'Credit Card', NULL),
(21, 22, 'robert.rodriguez304@example.com', 'Pro Plan', 49.99, 'Rejected', '2026-05-19 06:27:02', NULL, 'Bank Transfer', NULL),
(22, 24, 'olivia.jones550@example.com', 'Pro Plan', 49.99, 'Pending', '2026-05-26 14:42:17', NULL, 'Bank Transfer', NULL),
(23, 23, 'michael.smith989@example.com', 'test', 100.00, 'Confirmed', '2026-05-01 16:44:27', NULL, 'Crypto', NULL),
(24, 16, 'sophia.garcia534@example.com', 'test', 100.00, 'Rejected', '2026-05-26 07:41:04', NULL, 'PayPal', NULL),
(25, 15, 'sarah.brown376@example.com', 'Pro Plan', 49.99, 'Rejected', '2026-05-24 05:49:03', NULL, 'PayPal', NULL),
(26, 16, 'sophia.garcia534@example.com', 'Pro Plan', 49.99, 'Rejected', '2026-05-09 02:19:56', NULL, 'PayPal', NULL),
(27, 16, 'sophia.garcia534@example.com', 'test', 100.00, 'Confirmed', '2026-05-28 06:33:02', NULL, 'Bank Transfer', NULL),
(28, 17, 'jane.miller165@example.com', 'Pro Plan', 49.99, 'Pending', '2026-05-12 15:39:28', NULL, 'Bank Transfer', NULL),
(29, 20, 'sarah.jones271@example.com', 'Pro Plan', 49.99, 'Rejected', '2026-05-31 17:20:45', NULL, 'Bank Transfer', NULL),
(30, 22, 'robert.rodriguez304@example.com', 'Pro Plan', 49.99, 'Confirmed', '2026-05-04 08:22:21', NULL, 'PayPal', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rib` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `rib`, `created_at`) VALUES
(1, 'cih', '12321232112312312', '2026-06-07 22:12:12'),
(2, 'banka lik', '3242343242342343232', '2026-06-07 22:12:21');

-- --------------------------------------------------------

--
-- Structure de la table `season_matches`
--

CREATE TABLE `season_matches` (
  `id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `competition` varchar(255) DEFAULT NULL,
  `match_name` varchar(255) DEFAULT NULL,
  `match_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `referee_1` varchar(100) DEFAULT NULL,
  `referee_2` varchar(100) DEFAULT NULL,
  `team_a_name` varchar(255) DEFAULT NULL,
  `team_b_name` varchar(255) DEFAULT NULL,
  `score_a` int(11) DEFAULT 0,
  `score_b` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `season_players`
--

CREATE TABLE `season_players` (
  `id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `player_name` varchar(255) NOT NULL,
  `jersey_number` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `club_name` varchar(255) DEFAULT NULL,
  `plan` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_email_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `plan_end_date` datetime DEFAULT NULL,
  `plan_start_date` datetime DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `name`, `phone`, `club_name`, `plan`, `payment_method`, `created_at`, `is_email_verified`, `verification_token`, `plan_end_date`, `plan_start_date`, `city`) VALUES
(1, 'admin@coachhelper.com', 'admin123', 'admin', NULL, NULL, NULL, NULL, NULL, '2026-06-06 03:46:21', 0, NULL, NULL, NULL, NULL),
(2, 'user@coachhelper.com', 'user123', 'user', NULL, NULL, NULL, NULL, NULL, '2026-06-06 03:46:21', 0, NULL, NULL, NULL, NULL),
(12, 'hamza.emilie23@gmail.com', 'saif', 'user', 'saif Belfaquir', '+212649157151', 'husabasketball', 'yearly', 'cih', '2026-06-07 22:17:10', 1, NULL, '2027-06-07 22:18:15', '2026-06-07 22:18:15', 'Agadir'),
(13, 'sarah.davis207@example.com', 'password123', 'user', 'Sarah Davis', '+18282711594', 'Bulls Club', 'Pro Plan', 'Bank Transfer', '2026-06-08 03:24:37', 1, NULL, '2026-04-06 14:46:37', '2026-03-07 15:46:37', 'Los Angeles'),
(14, 'jane.brown579@example.com', 'password123', 'user', 'Jane Brown', '+14539446956', 'Heat Club', 'Basic Plan', 'PayPal', '2026-06-08 03:24:37', 0, NULL, NULL, NULL, 'San Antonio'),
(15, 'sarah.brown376@example.com', 'password123', 'user', 'Sarah Brown', '+19328266355', 'Celtics Club', 'Pro Plan', 'Bank Transfer', '2026-06-08 03:24:37', 0, NULL, NULL, NULL, 'Dallas'),
(16, 'sophia.garcia534@example.com', 'password123', 'user', 'Sophia Garcia', '+12447068078', 'Raptors Club', 'Pro Plan', 'Bank Transfer', '2026-06-08 03:24:37', 0, NULL, NULL, NULL, 'Chicago'),
(17, 'jane.miller165@example.com', 'password123', 'user', 'Jane Miller', '+14568006391', 'Mavericks Club', 'test', 'PayPal', '2026-06-08 03:24:37', 1, NULL, '2026-05-27 07:02:26', '2026-04-27 07:02:26', 'San Jose'),
(18, 'david.rodriguez711@example.com', 'password123', 'user', 'David Rodriguez', '+17137796311', 'Raptors Club', 'Pro Plan', 'Credit Card', '2026-06-08 03:24:37', 1, NULL, NULL, NULL, 'Houston'),
(19, 'david.smith904@example.com', 'password123', 'user', 'David Smith', '+16865069798', 'Bulls Club', 'Basic Plan', 'Crypto', '2026-06-08 03:24:37', 0, NULL, NULL, NULL, 'Los Angeles'),
(20, 'sarah.jones271@example.com', 'password123', 'user', 'Sarah Jones', '+14768749645', 'Mavericks Club', 'test', 'PayPal', '2026-06-08 03:24:37', 0, NULL, NULL, NULL, 'Los Angeles'),
(21, 'jane.garcia770@example.com', 'password123', 'user', 'Jane Garcia', '+11045006670', 'Spurs Club', 'test', 'Bank Transfer', '2026-06-08 03:24:37', 0, NULL, NULL, NULL, 'San Jose'),
(22, 'robert.rodriguez304@example.com', 'password123', 'user', 'Robert Rodriguez', '+11929687502', 'Raptors Club', 'Basic Plan', 'Credit Card', '2026-06-08 03:24:37', 1, NULL, '2026-02-03 14:44:32', '2026-01-04 14:44:32', 'San Jose'),
(23, 'michael.smith989@example.com', 'password123', 'user', 'Michael Smith', '+18427639917', 'Celtics Club', 'Pro Plan', 'Bank Transfer', '2026-06-08 03:24:38', 1, NULL, '2026-02-03 01:52:29', '2026-01-04 01:52:29', 'San Diego'),
(24, 'olivia.jones550@example.com', 'password123', 'user', 'Olivia Jones', '+18067992231', 'Heat Club', 'Basic Plan', 'Crypto', '2026-06-08 03:24:38', 0, NULL, NULL, NULL, 'New York'),
(25, 'emma.johnson871@example.com', 'password123', 'user', 'Emma Johnson', '+15857184732', 'Celtics Club', 'Basic Plan', 'Credit Card', '2026-06-08 03:24:38', 1, NULL, '2026-05-26 02:31:54', '2026-04-26 02:31:54', 'Los Angeles'),
(26, 'david.brown113@example.com', 'password123', 'user', 'David Brown', '+18600562377', 'Bulls Club', 'Basic Plan', 'PayPal', '2026-06-08 03:24:38', 1, NULL, NULL, NULL, 'Houston'),
(27, 'robert.johnson970@example.com', 'password123', 'user', 'Robert Johnson', '+14930634308', 'Bucks Club', 'Basic Plan', 'PayPal', '2026-06-08 03:24:38', 0, NULL, NULL, NULL, 'San Antonio');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `coach_seasons`
--
ALTER TABLE `coach_seasons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coach_id` (`coach_id`);

--
-- Index pour la table `match_player_stats`
--
ALTER TABLE `match_player_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_match_player` (`match_id`,`player_id`),
  ADD KEY `player_id` (`player_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `season_matches`
--
ALTER TABLE `season_matches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `season_id` (`season_id`);

--
-- Index pour la table `season_players`
--
ALTER TABLE `season_players`
  ADD PRIMARY KEY (`id`),
  ADD KEY `season_id` (`season_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `coach_seasons`
--
ALTER TABLE `coach_seasons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `match_player_stats`
--
ALTER TABLE `match_player_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `season_matches`
--
ALTER TABLE `season_matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `season_players`
--
ALTER TABLE `season_players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `coach_seasons`
--
ALTER TABLE `coach_seasons`
  ADD CONSTRAINT `coach_seasons_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `match_player_stats`
--
ALTER TABLE `match_player_stats`
  ADD CONSTRAINT `match_player_stats_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `season_matches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `match_player_stats_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `season_players` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `season_matches`
--
ALTER TABLE `season_matches`
  ADD CONSTRAINT `season_matches_ibfk_1` FOREIGN KEY (`season_id`) REFERENCES `coach_seasons` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `season_players`
--
ALTER TABLE `season_players`
  ADD CONSTRAINT `season_players_ibfk_1` FOREIGN KEY (`season_id`) REFERENCES `coach_seasons` (`id`) ON DELETE CASCADE;
--
-- Base de données : `coffee_db`
--
CREATE DATABASE IF NOT EXISTS `coffee_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `coffee_db`;

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Base de données : `forexpeak_new`
--
CREATE DATABASE IF NOT EXISTS `forexpeak_new` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `forexpeak_new`;

-- --------------------------------------------------------

--
-- Structure de la table `accounts`
--

CREATE TABLE `accounts` (
  `id` char(36) NOT NULL,
  `ownerId` char(36) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `capital` decimal(15,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `commissionPerLot` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `accounts`
--

INSERT INTO `accounts` (`id`, `ownerId`, `label`, `capital`, `createdAt`, `commissionPerLot`) VALUES
('286843d1-7b6b-44bc-83e8-acae67fe3e63', '72552a2c-c29f-4598-addd-ab015cb273f7', '100K Sample Data', 100000.00, '2026-04-16 00:23:51', 7.00),
('cde706df-ea68-4405-85a8-ef313409e010', '72552a2c-c29f-4598-addd-ab015cb273f7', '100K Sample Data', 100000.00, '2026-04-16 00:23:51', 0.00);

-- --------------------------------------------------------

--
-- Structure de la table `calendar_collections`
--

CREATE TABLE `calendar_collections` (
  `id` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `type` varchar(50) DEFAULT 'details'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `calendar_collections`
--

INSERT INTO `calendar_collections` (`id`, `userId`, `name`, `startDate`, `endDate`, `createdAt`, `type`) VALUES
('1105dfde-d9e3-46d7-9cff-c76869403a28', '72552a2c-c29f-4598-addd-ab015cb273f7', '2024-2026', '2024-01-01 01:00:00', '2026-01-01 01:00:00', '2026-04-16 21:59:07', 'rr'),
('1abd2ba0-49ed-4cdf-86fa-f243ee3e6485', '60721b54-f718-4639-8ee6-3d3f269eb248', 'knghkg', '2026-02-01 01:00:00', '2026-02-06 01:00:00', '2026-04-22 00:32:26', 'simple'),
('341b89d8-17fe-47c0-adc7-7b6c1dcf88f9', '60721b54-f718-4639-8ee6-3d3f269eb248', 'last day bis', '2026-01-01 01:00:00', '2026-12-01 01:00:00', '2026-05-13 02:33:59', 'rr'),
('6fa2ae29-9213-4fd3-b2a3-da563af2180b', '60721b54-f718-4639-8ee6-3d3f269eb248', 'FVG STR ', '2023-01-01 01:00:00', '2026-12-01 01:00:00', '2026-04-16 05:36:25', 'rr');

-- --------------------------------------------------------

--
-- Structure de la table `calendar_daily_logs`
--

CREATE TABLE `calendar_daily_logs` (
  `id` char(36) NOT NULL,
  `collectionId` char(36) NOT NULL,
  `date` date NOT NULL,
  `trades` text DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `calendar_trades`
--

CREATE TABLE `calendar_trades` (
  `id` char(36) NOT NULL,
  `collectionId` char(36) NOT NULL,
  `date` date NOT NULL,
  `pair` varchar(50) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `result` varchar(20) DEFAULT NULL,
  `entryPrice` varchar(50) DEFAULT NULL,
  `sl` varchar(50) DEFAULT NULL,
  `tp` varchar(50) DEFAULT NULL,
  `openTime` varchar(20) DEFAULT NULL,
  `closeTime` varchar(20) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `rr` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `calendar_trades`
--

INSERT INTO `calendar_trades` (`id`, `collectionId`, `date`, `pair`, `type`, `result`, `entryPrice`, `sl`, `tp`, `openTime`, `closeTime`, `note`, `rr`, `createdAt`) VALUES
('305e6894-39d9-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-03', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-04-16 22:14:00'),
('3214373a-39d9-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-05', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', NULL, '2026-04-16 22:14:03'),
('53bca499-39e7-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-11', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', NULL, '2026-04-16 23:55:13'),
('55112f3c-394e-11f1-8ab8-ecb1d73fcbe9', '6fa2ae29-9213-4fd3-b2a3-da563af2180b', '2026-04-10', 'EUR/USD', 'Buy', 'Win', '', '', '', '', '', '', 5.00, '2026-04-16 05:40:02'),
('5ae5bc51-3dda-11f1-bb23-ecb1d73fcbe9', '1abd2ba0-49ed-4cdf-86fa-f243ee3e6485', '2026-02-04', 'EUR/USD', 'Buy', 'Win', '', '', '', '', '', '', NULL, '2026-04-22 00:32:26'),
('5ae5d810-3dda-11f1-bb23-ecb1d73fcbe9', '1abd2ba0-49ed-4cdf-86fa-f243ee3e6485', '2026-02-05', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', NULL, '2026-04-22 00:32:26'),
('5ae5f47c-3dda-11f1-bb23-ecb1d73fcbe9', '1abd2ba0-49ed-4cdf-86fa-f243ee3e6485', '2026-02-02', 'EUR/USD', 'Buy', 'Win', '', '', '', '', '', '', NULL, '2026-04-22 00:32:26'),
('5ae5fd32-3dda-11f1-bb23-ecb1d73fcbe9', '1abd2ba0-49ed-4cdf-86fa-f243ee3e6485', '2026-02-03', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', NULL, '2026-04-22 00:32:26'),
('6b96dc23-4e6d-11f1-8b8f-ecb1d73fcbe9', '341b89d8-17fe-47c0-adc7-7b6c1dcf88f9', '2026-01-02', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', NULL, '2026-05-13 02:45:28'),
('707b3706-4e6d-11f1-8b8f-ecb1d73fcbe9', '341b89d8-17fe-47c0-adc7-7b6c1dcf88f9', '2026-01-05', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-05-13 02:45:37'),
('7425aefc-4e6d-11f1-8b8f-ecb1d73fcbe9', '341b89d8-17fe-47c0-adc7-7b6c1dcf88f9', '2026-01-06', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-05-13 02:45:43'),
('7f8504c5-39d9-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-09', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', 2.00, '2026-04-16 22:16:13'),
('804e2497-39ea-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-17', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-04-17 00:17:56'),
('9171544c-39d8-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-04', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', NULL, '2026-04-16 22:09:34'),
('96e86dd7-4e6d-11f1-8b8f-ecb1d73fcbe9', '341b89d8-17fe-47c0-adc7-7b6c1dcf88f9', '2026-01-07', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', NULL, '2026-05-13 02:46:41'),
('a98c0ab5-39ea-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-18', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-04-17 00:19:05'),
('b616fe3d-4e6d-11f1-8b8f-ecb1d73fcbe9', '341b89d8-17fe-47c0-adc7-7b6c1dcf88f9', '2026-01-08', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-05-13 02:47:33'),
('c1086c78-39d7-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-01', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-04-16 22:03:44'),
('c569396c-39e7-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-12', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', NULL, '2026-04-16 23:58:23'),
('ccdd01e3-39d9-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-10', 'EUR/USD', 'Buy', 'Win', '', '', '', '', '', '', 3.00, '2026-04-16 22:18:23'),
('ce3ae1f7-4e6d-11f1-8b8f-ecb1d73fcbe9', '341b89d8-17fe-47c0-adc7-7b6c1dcf88f9', '2026-01-09', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-05-13 02:48:14'),
('ded902d2-39e8-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-16', 'EUR/USD', 'Buy', 'Loss', '', '', '', '', '', '', 2.60, '2026-04-17 00:06:16'),
('efa4c327-39d7-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-02', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-04-16 22:05:02'),
('f3e4625a-39e7-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-15', 'EUR/USD', 'Buy', 'BE', '', '', '', '', '', '', NULL, '2026-04-16 23:59:41'),
('f70f5cba-39d8-11f1-a1db-ecb1d73fcbe9', '1105dfde-d9e3-46d7-9cff-c76869403a28', '2024-01-08', 'EUR/USD', 'Buy', 'Win', '', '', '', '', '', '', 4.00, '2026-04-16 22:12:24');

-- --------------------------------------------------------

--
-- Structure de la table `journal`
--

CREATE TABLE `journal` (
  `id` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `accountId` char(36) NOT NULL,
  `ticketId` varchar(50) DEFAULT NULL,
  `symbol` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `volume` decimal(15,2) DEFAULT NULL,
  `openPrice` decimal(20,8) DEFAULT NULL,
  `sl` decimal(20,8) DEFAULT NULL,
  `tp` decimal(20,8) DEFAULT NULL,
  `openTime` datetime DEFAULT NULL,
  `closeTime` datetime DEFAULT NULL,
  `closePrice` decimal(20,8) DEFAULT NULL,
  `commission` decimal(15,2) DEFAULT NULL,
  `swap` decimal(15,2) DEFAULT NULL,
  `profit` decimal(15,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `result` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `journal`
--

INSERT INTO `journal` (`id`, `userId`, `accountId`, `ticketId`, `symbol`, `type`, `volume`, `openPrice`, `sl`, `tp`, `openTime`, `closeTime`, `closePrice`, `commission`, `swap`, `profit`, `description`, `result`) VALUES
('29af3202-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -677.42, 'Seed trade 0', 'LOSS'),
('29affd9d-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -47.41, 'Seed trade 1', 'LOSS'),
('29b0ab77-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1018.67, 'Seed trade 2', 'WIN'),
('29b21e91-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 763.89, 'Seed trade 3', 'WIN'),
('29b2b2b1-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 304.38, 'Seed trade 4', 'WIN'),
('29b34607-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -765.51, 'Seed trade 5', 'LOSS'),
('29b3e146-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1122.60, 'Seed trade 6', 'WIN'),
('29b4717c-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 634.94, 'Seed trade 7', 'WIN'),
('29b50395-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -476.07, 'Seed trade 8', 'LOSS'),
('29b6bf78-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -593.81, 'Seed trade 9', 'LOSS'),
('29b74d22-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 735.64, 'Seed trade 10', 'WIN'),
('29b7d62b-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -164.58, 'Seed trade 11', 'LOSS'),
('29b87c68-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 216.50, 'Seed trade 12', 'WIN'),
('29b9297f-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1133.54, 'Seed trade 13', 'WIN'),
('29b9bdd4-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 401.11, 'Seed trade 14', 'WIN'),
('29ba4833-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 732.78, 'Seed trade 15', 'WIN'),
('29bacb8d-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1049.52, 'Seed trade 16', 'WIN'),
('29bb5a62-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -67.58, 'Seed trade 17', 'LOSS'),
('29bbed25-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -313.40, 'Seed trade 18', 'LOSS'),
('29bc770a-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -92.95, 'Seed trade 19', 'LOSS'),
('29bd0bda-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 690.76, 'Seed trade 20', 'WIN'),
('29bd93ff-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 690.76, 'Seed trade 21', 'WIN'),
('29be1d47-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 851.36, 'Seed trade 22', 'WIN'),
('29beabe5-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 333.82, 'Seed trade 23', 'WIN'),
('29bf3aac-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -316.74, 'Seed trade 24', 'LOSS'),
('29bfd615-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -59.07, 'Seed trade 25', 'LOSS'),
('29c06459-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 750.09, 'Seed trade 26', 'WIN'),
('29c10a14-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -181.34, 'Seed trade 27', 'LOSS'),
('29c19c84-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 83.52, 'Seed trade 28', 'WIN'),
('29c22d4e-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 441.55, 'Seed trade 29', 'WIN'),
('29c2b56a-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 784.65, 'Seed trade 30', 'WIN'),
('29c34792-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 884.25, 'Seed trade 31', 'WIN'),
('29c3d4b5-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -579.02, 'Seed trade 32', 'LOSS'),
('29c466bb-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 87.76, 'Seed trade 33', 'WIN'),
('29c50a64-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 699.64, 'Seed trade 34', 'WIN'),
('29c592b4-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 582.67, 'Seed trade 35', 'WIN'),
('29c6234f-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 367.37, 'Seed trade 36', 'WIN'),
('29c6b267-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 824.91, 'Seed trade 37', 'WIN'),
('29c767b0-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 327.42, 'Seed trade 38', 'WIN'),
('29c7f613-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1184.47, 'Seed trade 39', 'WIN'),
('29c87bdd-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 610.25, 'Seed trade 40', 'WIN'),
('29c90cc4-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -402.49, 'Seed trade 41', 'LOSS'),
('29c99c0c-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -549.89, 'Seed trade 42', 'LOSS'),
('29ca2582-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1092.75, 'Seed trade 43', 'WIN'),
('29cab8fc-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -656.59, 'Seed trade 44', 'LOSS'),
('29cb47ca-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 932.65, 'Seed trade 45', 'WIN'),
('29cbd324-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -325.17, 'Seed trade 46', 'LOSS'),
('29cc699a-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -288.87, 'Seed trade 47', 'LOSS'),
('29ccfdf7-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 865.97, 'Seed trade 48', 'WIN'),
('29cd9147-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -225.69, 'Seed trade 49', 'LOSS'),
('29ce09ee-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -328.52, 'Seed trade 50', 'LOSS'),
('29ce7e16-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 147.03, 'Seed trade 51', 'WIN'),
('29cf1836-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1042.59, 'Seed trade 52', 'WIN'),
('29cf960c-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 880.05, 'Seed trade 53', 'WIN'),
('29d008f5-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 974.89, 'Seed trade 54', 'WIN'),
('29d08434-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -256.99, 'Seed trade 55', 'LOSS'),
('29d10116-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1103.11, 'Seed trade 56', 'WIN'),
('29d17801-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 129.61, 'Seed trade 57', 'WIN'),
('29d1f2b9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 156.02, 'Seed trade 58', 'WIN'),
('29d27431-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 418.29, 'Seed trade 59', 'WIN'),
('29d2ec31-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 812.41, 'Seed trade 60', 'WIN'),
('29d36289-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -32.47, 'Seed trade 61', 'LOSS'),
('29d3dcc9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 93.33, 'Seed trade 62', 'WIN'),
('29d46842-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -770.94, 'Seed trade 63', 'LOSS'),
('29d4f6bb-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 701.05, 'Seed trade 64', 'WIN'),
('29d575c0-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 366.07, 'Seed trade 65', 'WIN'),
('29d610ea-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -630.75, 'Seed trade 66', 'LOSS'),
('29d68766-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 436.80, 'Seed trade 67', 'WIN'),
('29d718d9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -617.40, 'Seed trade 68', 'LOSS'),
('29d792d0-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 969.03, 'Seed trade 69', 'WIN'),
('29d81ae0-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -81.97, 'Seed trade 70', 'LOSS'),
('29d94889-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 419.52, 'Seed trade 71', 'WIN'),
('29d9dd63-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 985.59, 'Seed trade 72', 'WIN'),
('29da7751-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -137.85, 'Seed trade 73', 'LOSS'),
('29db0172-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 293.55, 'Seed trade 74', 'WIN'),
('29db7d12-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -748.92, 'Seed trade 75', 'LOSS'),
('29dbf594-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 674.11, 'Seed trade 76', 'WIN'),
('29dc6ab9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1107.44, 'Seed trade 77', 'WIN'),
('29dcea22-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 486.84, 'Seed trade 78', 'WIN'),
('29dd6501-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -250.02, 'Seed trade 79', 'LOSS'),
('29ddf706-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -172.79, 'Seed trade 80', 'LOSS'),
('29de759d-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -25.66, 'Seed trade 81', 'LOSS'),
('29df63fa-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 137.20, 'Seed trade 82', 'WIN'),
('29dfe9d2-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -713.50, 'Seed trade 83', 'LOSS'),
('29e07747-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1066.25, 'Seed trade 84', 'WIN'),
('29e0ff5d-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 258.43, 'Seed trade 85', 'WIN'),
('29e19d41-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -580.53, 'Seed trade 86', 'LOSS'),
('29e2287a-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 1095.25, 'Seed trade 87', 'WIN'),
('29e2ab0f-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 296.27, 'Seed trade 88', 'WIN'),
('29e33528-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -80.75, 'Seed trade 89', 'LOSS'),
('29e3b85d-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -495.78, 'Seed trade 90', 'LOSS'),
('29e434eb-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -167.20, 'Seed trade 91', 'LOSS'),
('29e4b53c-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 163.17, 'Seed trade 92', 'WIN'),
('29e5377b-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -706.62, 'Seed trade 93', 'LOSS'),
('29e5ce85-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 211.65, 'Seed trade 94', 'WIN'),
('29e654de-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 425.02, 'Seed trade 95', 'WIN'),
('29e6d258-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, 753.70, 'Seed trade 96', 'WIN'),
('29e752e2-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -269.22, 'Seed trade 97', 'LOSS'),
('29e7da08-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -418.68, 'Seed trade 98', 'LOSS'),
('29e85814-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, 7.00, NULL, -158.45, 'Seed trade 99', 'LOSS'),
('29eaa1bd-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1055.18, 'Seed trade 0', 'WIN'),
('29eb2df0-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -593.45, 'Seed trade 1', 'LOSS'),
('29ebaa58-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1168.81, 'Seed trade 2', 'WIN'),
('29ec3cc3-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1147.27, 'Seed trade 3', 'WIN'),
('29ecd203-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -287.70, 'Seed trade 4', 'LOSS'),
('29ed68bb-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -32.68, 'Seed trade 5', 'LOSS'),
('29ee5c53-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -433.28, 'Seed trade 6', 'LOSS'),
('29ef0a74-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 698.61, 'Seed trade 7', 'WIN'),
('29efbc99-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 184.37, 'Seed trade 8', 'WIN'),
('29f04fe5-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1041.92, 'Seed trade 9', 'WIN'),
('29f0e60a-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1143.29, 'Seed trade 10', 'WIN'),
('29f176b9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -626.71, 'Seed trade 11', 'LOSS'),
('29f1f1d5-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 469.78, 'Seed trade 12', 'WIN'),
('29f27234-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 205.79, 'Seed trade 13', 'WIN'),
('29f2edd6-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -192.60, 'Seed trade 14', 'LOSS'),
('29f36399-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 135.78, 'Seed trade 15', 'WIN'),
('29f3e503-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 178.17, 'Seed trade 16', 'WIN'),
('29f47491-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -796.05, 'Seed trade 17', 'LOSS'),
('29f504a5-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 591.11, 'Seed trade 18', 'WIN'),
('29f586a1-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 800.43, 'Seed trade 19', 'WIN'),
('29f630d0-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -45.60, 'Seed trade 20', 'LOSS'),
('29f6aa36-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 521.28, 'Seed trade 21', 'WIN'),
('29f72914-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 634.83, 'Seed trade 22', 'WIN'),
('29f7a252-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -425.74, 'Seed trade 23', 'LOSS'),
('29f82da8-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 153.14, 'Seed trade 24', 'WIN'),
('29f8b6b4-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -16.32, 'Seed trade 25', 'LOSS'),
('29f93355-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -312.36, 'Seed trade 26', 'LOSS'),
('29f9aab4-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -77.23, 'Seed trade 27', 'LOSS'),
('29fa2767-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -94.73, 'Seed trade 28', 'LOSS'),
('29fa9d9e-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 85.95, 'Seed trade 29', 'WIN'),
('29fb1579-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -165.19, 'Seed trade 30', 'LOSS'),
('29fb96d9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 976.49, 'Seed trade 31', 'WIN'),
('29fc2d2d-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -145.94, 'Seed trade 32', 'LOSS'),
('29fca3d9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -614.95, 'Seed trade 33', 'LOSS'),
('29fd2256-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -576.41, 'Seed trade 34', 'LOSS'),
('29fd9c07-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -311.24, 'Seed trade 35', 'LOSS'),
('29fe112d-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1171.06, 'Seed trade 36', 'WIN'),
('29fe94d8-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -603.14, 'Seed trade 37', 'LOSS'),
('29ff11ef-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1.63, 'Seed trade 38', 'WIN'),
('29ff885f-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -776.80, 'Seed trade 39', 'LOSS'),
('2a00022b-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -490.23, 'Seed trade 40', 'LOSS'),
('2a008064-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 375.68, 'Seed trade 41', 'WIN'),
('2a00f3c2-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 189.28, 'Seed trade 42', 'WIN'),
('2a016ecc-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -331.45, 'Seed trade 43', 'LOSS'),
('2a01ee7e-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 336.34, 'Seed trade 44', 'WIN'),
('2a026374-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -251.91, 'Seed trade 45', 'LOSS'),
('2a02d67b-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 703.92, 'Seed trade 46', 'WIN'),
('2a0373b2-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 865.34, 'Seed trade 47', 'WIN'),
('2a03f000-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -423.65, 'Seed trade 48', 'LOSS'),
('2a046ea6-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 241.16, 'Seed trade 49', 'WIN'),
('2a04eb49-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 212.58, 'Seed trade 50', 'WIN'),
('2a0565da-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 146.62, 'Seed trade 51', 'WIN'),
('2a05dd5b-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -270.92, 'Seed trade 52', 'LOSS'),
('2a065b19-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 104.17, 'Seed trade 53', 'WIN'),
('2a06d817-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -428.18, 'Seed trade 54', 'LOSS'),
('2a074a3e-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 358.01, 'Seed trade 55', 'WIN'),
('2a07c862-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 781.85, 'Seed trade 56', 'WIN'),
('2a0847af-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -181.70, 'Seed trade 57', 'LOSS'),
('2a08e800-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 858.61, 'Seed trade 58', 'WIN'),
('2a097b40-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 755.68, 'Seed trade 59', 'WIN'),
('2a09fec1-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -410.84, 'Seed trade 60', 'LOSS'),
('2a0aa4eb-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 286.64, 'Seed trade 61', 'WIN'),
('2a0b3017-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -501.31, 'Seed trade 62', 'LOSS'),
('2a0bb4a9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 7.17, 'Seed trade 63', 'WIN'),
('2a0c4cc0-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -197.76, 'Seed trade 64', 'LOSS'),
('2a0cda4e-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 771.13, 'Seed trade 65', 'WIN'),
('2a0d8ea7-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 333.19, 'Seed trade 66', 'WIN'),
('2a0e664e-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -441.87, 'Seed trade 67', 'LOSS'),
('2a0fffc2-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -537.05, 'Seed trade 68', 'LOSS'),
('2a10ad50-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 28.56, 'Seed trade 69', 'WIN'),
('2a117ac4-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -555.51, 'Seed trade 70', 'LOSS'),
('2a121ec7-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1128.54, 'Seed trade 71', 'WIN'),
('2a12a8f9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 880.65, 'Seed trade 72', 'WIN'),
('2a13349b-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 725.90, 'Seed trade 73', 'WIN'),
('2a13bb59-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -113.80, 'Seed trade 74', 'LOSS'),
('2a143e11-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 68.61, 'Seed trade 75', 'WIN');
INSERT INTO `journal` (`id`, `userId`, `accountId`, `ticketId`, `symbol`, `type`, `volume`, `openPrice`, `sl`, `tp`, `openTime`, `closeTime`, `closePrice`, `commission`, `swap`, `profit`, `description`, `result`) VALUES
('2a15149d-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -355.02, 'Seed trade 76', 'LOSS'),
('2a1596b5-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 280.52, 'Seed trade 77', 'WIN'),
('2a186121-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 637.95, 'Seed trade 78', 'WIN'),
('2a18db3a-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -487.33, 'Seed trade 79', 'LOSS'),
('2a194cc6-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -350.75, 'Seed trade 80', 'LOSS'),
('2a19bea4-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 389.80, 'Seed trade 81', 'WIN'),
('2a1a31c6-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 930.86, 'Seed trade 82', 'WIN'),
('2a1aa317-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -771.78, 'Seed trade 83', 'LOSS'),
('2a1b1073-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -76.08, 'Seed trade 84', 'LOSS'),
('2a1b9f92-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -249.67, 'Seed trade 85', 'LOSS'),
('2a1c0f50-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 414.38, 'Seed trade 86', 'WIN'),
('2a1cc822-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 673.90, 'Seed trade 87', 'WIN'),
('2a1d3e0c-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 278.13, 'Seed trade 88', 'WIN'),
('2a1db082-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -348.56, 'Seed trade 89', 'LOSS'),
('2a1e1df4-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 1074.91, 'Seed trade 90', 'WIN'),
('2a1e8ee5-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'XAUUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 290.91, 'Seed trade 91', 'WIN'),
('2a1f0a48-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 780.78, 'Seed trade 92', 'WIN'),
('2a1f79e9-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -114.40, 'Seed trade 93', 'LOSS'),
('2a1feb09-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 792.15, 'Seed trade 94', 'WIN'),
('2a206099-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 316.19, 'Seed trade 95', 'WIN'),
('2a20d391-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -185.28, 'Seed trade 96', 'LOSS'),
('2a214487-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'GBPUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 841.48, 'Seed trade 97', 'WIN'),
('2a21c9ad-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'EURUSD', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, -787.20, 'Seed trade 98', 'LOSS'),
('2a226047-3922-11f1-8339-ecb1d73fcbe9', '72552a2c-c29f-4598-addd-ab015cb273f7', 'cde706df-ea68-4405-85a8-ef313409e010', NULL, 'NAS100', 'buy', 1.00, 1.12000000, 1.10000000, 1.15000000, '2026-04-16 00:23:51', '2026-04-16 00:23:51', NULL, NULL, NULL, 766.43, 'Seed trade 99', 'WIN');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` char(36) NOT NULL,
  `salonId` char(36) NOT NULL,
  `senderId` char(36) NOT NULL,
  `content` text DEFAULT NULL,
  `type` varchar(20) DEFAULT 'text',
  `attachmentUrl` text DEFAULT NULL,
  `pollData` text DEFAULT NULL,
  `replyToId` char(36) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `message` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payouts`
--

CREATE TABLE `payouts` (
  `id` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `accountId` char(36) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `date` datetime NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `payouts`
--

INSERT INTO `payouts` (`id`, `userId`, `accountId`, `amount`, `date`, `description`, `imageUrl`, `createdAt`) VALUES
('c76333b4-1e9f-4fe7-be26-a629a7efce87', '72552a2c-c29f-4598-addd-ab015cb273f7', '286843d1-7b6b-44bc-83e8-acae67fe3e63', 1000.00, '2026-04-16 00:25:00', 'adasd  ad asdas ', '/uploads/1776299159466-561067024-saif-Belfaquir 86.41$.jpeg', '2026-04-16 01:25:59');

-- --------------------------------------------------------

--
-- Structure de la table `salons`
--

CREATE TABLE `salons` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'custom',
  `ownerId` char(36) DEFAULT NULL,
  `category` varchar(50) DEFAULT 'custom',
  `topic` varchar(255) DEFAULT NULL,
  `isSilenced` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `salon_members`
--

CREATE TABLE `salon_members` (
  `salonId` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `joinedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `plan` varchar(50) DEFAULT 'basic',
  `googleId` varchar(255) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT 0,
  `verificationCode` varchar(10) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `passwordHash`, `role`, `plan`, `googleId`, `isVerified`, `verificationCode`, `createdAt`) VALUES
('60721b54-f718-4639-8ee6-3d3f269eb248', 'Saif Belfaquir', 'hamza.emilie23@gmail.com', '', 'user', 'basic', '101551823524062872766', 1, NULL, '2026-04-15 22:39:33'),
('72552a2c-c29f-4598-addd-ab015cb273f7', 'saif belfaquir', 'blsayf3@gmail.com', '$2b$10$pfWSis3linyTNPKdnnEK5eWXBIr/rCg5txZzjlxyOnQ73aYoSMHby', 'user', 'basic', NULL, 1, NULL, '2026-04-15 22:51:17'),
('f623ed19-b1e6-4c54-bc45-932c9de9d1cd', 'Tester', 'tester@example.com', '$2b$10$i1FpvU7uXD0k42JGZpjxCOxPxVqFj0IZad7/mZ4ZkXVee6LNRHzkG', 'user', 'basic', NULL, 0, '389387', '2026-04-15 22:48:55');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`);

--
-- Index pour la table `calendar_collections`
--
ALTER TABLE `calendar_collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `calendar_daily_logs`
--
ALTER TABLE `calendar_daily_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collectionId` (`collectionId`);

--
-- Index pour la table `calendar_trades`
--
ALTER TABLE `calendar_trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collectionId` (`collectionId`);

--
-- Index pour la table `journal`
--
ALTER TABLE `journal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `accountId` (`accountId`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salonId` (`salonId`),
  ADD KEY `senderId` (`senderId`),
  ADD KEY `replyToId` (`replyToId`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `payouts`
--
ALTER TABLE `payouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `accountId` (`accountId`);

--
-- Index pour la table `salons`
--
ALTER TABLE `salons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`);

--
-- Index pour la table `salon_members`
--
ALTER TABLE `salon_members`
  ADD PRIMARY KEY (`salonId`,`userId`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `calendar_collections`
--
ALTER TABLE `calendar_collections`
  ADD CONSTRAINT `calendar_collections_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `calendar_daily_logs`
--
ALTER TABLE `calendar_daily_logs`
  ADD CONSTRAINT `calendar_daily_logs_ibfk_1` FOREIGN KEY (`collectionId`) REFERENCES `calendar_collections` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `calendar_trades`
--
ALTER TABLE `calendar_trades`
  ADD CONSTRAINT `calendar_trades_ibfk_1` FOREIGN KEY (`collectionId`) REFERENCES `calendar_collections` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `journal`
--
ALTER TABLE `journal`
  ADD CONSTRAINT `journal_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `journal_ibfk_2` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`salonId`) REFERENCES `salons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`replyToId`) REFERENCES `messages` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `payouts`
--
ALTER TABLE `payouts`
  ADD CONSTRAINT `payouts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payouts_ibfk_2` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `salons`
--
ALTER TABLE `salons`
  ADD CONSTRAINT `salons_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `salon_members`
--
ALTER TABLE `salon_members`
  ADD CONSTRAINT `salon_members_ibfk_1` FOREIGN KEY (`salonId`) REFERENCES `salons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `salon_members_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
--
-- Base de données : `husa_basketball`
--
CREATE DATABASE IF NOT EXISTS `husa_basketball` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `husa_basketball`;

-- --------------------------------------------------------

--
-- Structure de la table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
('1cc9a806-5034-4003-843f-e2a297413a9e', 'Saif belfaquir', 'hamza.emilie23@gmail.com', 'lihwak', 'sdqdq', '2026-02-12 13:59:11'),
('7bb26cba-1174-4bf3-81e5-1e0cf4625247', 'Saif belfaquir', 'hamza.emilie23@gmail.com', 'ssssssssssss', 'ssssssssssssss', '2026-02-12 16:01:34'),
('fab320db-9f86-4764-90da-dffdee2ee0cd', 'tttttttttt', 'hamza.emilie23@gmail.com', 'lihwak', 'dqsdq', '2026-02-14 02:20:04');

-- --------------------------------------------------------

--
-- Structure de la table `kids_reservations`
--

CREATE TABLE `kids_reservations` (
  `id` varchar(36) NOT NULL,
  `parent_full_name` varchar(255) NOT NULL,
  `kid_name` varchar(255) NOT NULL,
  `kid_age` int(11) NOT NULL,
  `kid_sex` varchar(50) NOT NULL,
  `parent_phone` varchar(50) NOT NULL,
  `preferred_day` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `kids_reservations`
--

INSERT INTO `kids_reservations` (`id`, `parent_full_name`, `kid_name`, `kid_age`, `kid_sex`, `parent_phone`, `preferred_day`, `created_at`) VALUES
('50e8cd01-74fb-4ba0-b227-576f9c12bfc3', 'saif belfaquir', 'ayman belfaquir', 10, 'Male', '0649157151', 'Wednesday', '2026-02-12 12:48:14');

-- --------------------------------------------------------

--
-- Structure de la table `matches`
--

CREATE TABLE `matches` (
  `id` varchar(36) NOT NULL,
  `opponent` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `result` enum('win','loss','draw','scheduled') DEFAULT 'scheduled',
  `score_husa` int(11) DEFAULT NULL,
  `score_opponent` int(11) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `score` varchar(50) DEFAULT '-',
  `status` varchar(50) DEFAULT 'scheduled',
  `strategy_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`strategy_id`)),
  `starters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`starters`)),
  `bench` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bench`)),
  `competition` varchar(255) DEFAULT NULL,
  `season` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `matches`
--

INSERT INTO `matches` (`id`, `opponent`, `date`, `result`, `score_husa`, `score_opponent`, `location`, `score`, `status`, `strategy_id`, `starters`, `bench`, `competition`, `season`, `created_at`) VALUES
('270681a1-5771-452e-a853-74f4aee16ec9', 'OCK', '2025-11-08 17:00:00', 'scheduled', NULL, NULL, 'SALLE AL AMAL -\n                                                                                                             Khouribga', '-', 'scheduled', '[1]', '[\"pl9\",\"pl10\",\"pl11\",\"pl12\",\"pl13\"]', '[\"pl6\",\"pl7\",\"pl8\",\"pl14\",\"pl15\",\"pl16\",\"pl5\"]', NULL, NULL, '2026-02-12 22:16:04'),
('3053cdb3-b709-4066-9c43-e5abfbfd6d2b', 'N/A', '0000-00-00 00:00:00', 'scheduled', NULL, NULL, 'N/A', '-', 'scheduled', '[]', '[]', '[]', NULL, NULL, '2026-02-23 04:41:53'),
('58120ace-2a09-4fad-8222-d2703bd65dd8', 'OCK', '2026-02-21 16:00:00', 'scheduled', NULL, NULL, 'SALLE COUVERTE INBIAT -\n                                                                                                             Agadir', '-', 'scheduled', '[1]', '[\"pl7\",\"pl8\",\"pl9\",\"pl10\",\"pl11\"]', '[\"pl6\",\"pl12\",\"pl13\",\"pl14\",\"pl15\",\"pl16\",\"pl5\"]', NULL, NULL, '2026-02-17 13:19:04'),
('d2cea3dd-b657-4597-aeb1-258f65608bb7', 'OCK', '0000-00-00 00:00:00', 'scheduled', NULL, NULL, '', '-', 'scheduled', '[1]', '[\"pl7\",\"pl8\",\"pl9\",\"pl10\",\"pl11\"]', '[\"pl6\",\"pl12\",\"pl13\",\"pl14\",\"pl15\",\"pl16\",\"pl5\"]', NULL, NULL, '2026-02-15 22:44:33'),
('d37181b7-148b-4883-a31c-44640aac5e42', 'N/A', '2026-02-23 00:00:00', 'scheduled', NULL, NULL, 'N/A', '-', 'scheduled', '[]', '[]', '[]', NULL, NULL, '2026-02-23 04:48:52'),
('e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'ACSMM', '2025-11-15 18:00:00', 'scheduled', NULL, NULL, 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', '-', 'scheduled', '[1]', '[\"pl7\",\"pl8\",\"pl9\",\"pl10\",\"pl6\"]', '[\"pl11\",\"pl12\",\"pl13\",\"pl14\",\"pl15\",\"pl16\",\"pl5\"]', NULL, NULL, '2026-02-14 02:11:36');

-- --------------------------------------------------------

--
-- Structure de la table `match_intel`
--

CREATE TABLE `match_intel` (
  `id` int(11) NOT NULL,
  `match_id` varchar(50) DEFAULT NULL,
  `report` text DEFAULT NULL,
  `player_stats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`player_stats`)),
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `match_lineups`
--

CREATE TABLE `match_lineups` (
  `id` int(11) NOT NULL,
  `match_id` varchar(36) DEFAULT NULL,
  `player_id` varchar(36) DEFAULT NULL,
  `is_starter` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `match_lineups`
--

INSERT INTO `match_lineups` (`id`, `match_id`, `player_id`, `is_starter`) VALUES
(37, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl6', 0),
(38, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl7', 0),
(39, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl8', 0),
(40, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl9', 1),
(41, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl10', 1),
(42, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl11', 1),
(43, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl12', 1),
(44, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl13', 1),
(45, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl14', 0),
(46, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl15', 0),
(47, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl16', 0),
(48, '270681a1-5771-452e-a853-74f4aee16ec9', 'pl5', 0),
(49, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl6', 1),
(50, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl7', 1),
(51, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl8', 1),
(52, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl9', 1),
(53, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl10', 1),
(54, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl11', 0),
(55, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl12', 0),
(56, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl13', 0),
(57, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl14', 0),
(58, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl15', 0),
(59, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl16', 0),
(60, 'e484bd4d-0dfb-47ff-bbe4-6a9c8ec110ba', 'pl5', 0),
(61, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl6', 0),
(62, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl7', 1),
(63, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl8', 1),
(64, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl9', 1),
(65, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl10', 1),
(66, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl11', 1),
(67, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl12', 0),
(68, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl13', 0),
(69, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl14', 0),
(70, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl15', 0),
(71, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl16', 0),
(72, 'd2cea3dd-b657-4597-aeb1-258f65608bb7', 'pl5', 0),
(73, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl6', 0),
(74, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl7', 1),
(75, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl8', 1),
(76, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl9', 1),
(77, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl10', 1),
(78, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl11', 1),
(79, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl12', 0),
(80, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl13', 0),
(81, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl14', 0),
(82, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl15', 0),
(83, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl16', 0),
(84, '58120ace-2a09-4fad-8222-d2703bd65dd8', 'pl5', 0);

-- --------------------------------------------------------

--
-- Structure de la table `match_schedule`
--

CREATE TABLE `match_schedule` (
  `id` int(11) NOT NULL,
  `external_id` varchar(50) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `home` varchar(255) DEFAULT NULL,
  `away` varchar(255) DEFAULT NULL,
  `score` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `news_title` varchar(255) DEFAULT NULL,
  `news_content` text DEFAULT NULL,
  `news_image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `match_schedule`
--

INSERT INTO `match_schedule` (`id`, `external_id`, `date`, `time`, `venue`, `home`, `away`, `score`, `updated_at`, `news_title`, `news_content`, `news_image_url`) VALUES
(1, NULL, '08/11/2025', '17:00', 'SALLE AL AMAL -\n                                                                                                             Khouribga', 'OCK', 'HUSA', '69 - 66', '2026-02-14 12:36:52', NULL, NULL, NULL),
(2, NULL, '15/11/2025', '18:00', 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', 'HUSA', 'ACSMM', '71 - 48', '2026-02-14 12:36:52', NULL, NULL, NULL),
(3, NULL, '03/01/2026', '18:00', 'SALLE HASSAN EL HIRES -\n                                                                                                             Casablanca', 'WSC', 'HUSA', '42 - 46', '2026-02-14 12:36:52', NULL, NULL, NULL),
(4, NULL, '30/11/2025', '17:00', 'SALLE IBN ROCHD -\n                                                                                                             Rabat', 'COJ', 'HUSA', '53 - 59', '2026-02-14 12:36:52', NULL, NULL, NULL),
(5, NULL, '21/12/2025', '15:00', 'SALLE MOULAY EL HASSAN -\n                                                                                                             Oued Zem', 'RCOZ', 'HUSA', '55 - 56', '2026-02-14 12:36:52', NULL, NULL, NULL),
(6, NULL, '11/01/2026', '19:00', 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', 'HUSA', 'OCY', '60 - 55', '2026-02-14 12:36:52', NULL, NULL, NULL),
(7, NULL, '18/01/2026', '15:00', 'SALLE OMNISPORTS -\n                                                                                                             Settat', 'RSS', 'HUSA', '62 - 57', '2026-02-14 12:36:53', NULL, NULL, NULL),
(8, NULL, '11/02/2026', '19:00', 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', 'HUSA', 'CSBA', '45 - 68', '2026-02-14 12:36:53', NULL, NULL, NULL),
(25, NULL, '21/02/2026', '16:00', 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', 'HUSA', 'OCK', '69 - 84', '2026-05-22 22:34:20', 'Dominateur à Domicile : HUSA reçoit OCK', 'Dans le cadre de la compétition en cours, HUSA Basketball affronte OCK. Le match s\'est terminé sur un score de 69 - 84. Une rencontre qui s\'annonce intense pour nos joueurs qui comptent sur votre soutien indéfectible.', 'http://localhost:5000/uploads/news/1779489260251-117ba5f1.webp'),
(74, '1DNH151', '01/03/2026', '22:00', 'SALLE MOULAY RACHID-DAOUDIAT -\n                                                                                                             Marrakech', 'ACSMM', 'HUSA', '80 - 69', '2026-03-23 15:47:38', NULL, NULL, NULL),
(75, '1DNH167', '25/04/2026', '19:00', 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', 'HUSA', 'WSC', '35 - 63', '2026-05-23 15:21:28', NULL, NULL, NULL),
(76, '1DNH180', '29/03/2026', '18:00', 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', 'HUSA', 'COJ', '41 - 64', '2026-05-23 15:21:28', NULL, NULL, NULL),
(77, '1DNH210', '02/05/2026', '18:00', 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', 'HUSA', 'RCOZ', '85 - 84', '2026-05-23 15:21:28', NULL, NULL, NULL),
(78, '1DNH222', '10/05/2026', '14:00', 'COMPLEXE SPORTIF DAKHLA -\n                                                                                                             Youssoufia', 'OCY', 'HUSA', '88 - 46', '2026-05-23 15:21:28', NULL, NULL, NULL),
(79, '1DNH237', '16/05/2026', '16:00', 'SALLE ZERKTOUNI -\n                                                                                                             Agadir', 'HUSA', 'RSS', '60 - 72', '2026-05-23 15:21:28', NULL, NULL, NULL),
(80, '1DNH252', '22/05/2026', '18:30', 'SALLE COUVERTE QODS -\n                                                                                                             Agadir', 'CSBA', 'HUSA', '-', '2026-05-23 15:21:28', NULL, NULL, NULL),
(145, 'TEST_MATCH_01', '30/05/2026', '18:00', 'Test Arena', 'HUSA', 'TEST TEAM', '-', '2026-05-23 16:14:49', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `match_stats`
--

CREATE TABLE `match_stats` (
  `id` int(11) NOT NULL,
  `match_id` varchar(36) DEFAULT NULL,
  `general_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`general_info`)),
  `team_a_players` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`team_a_players`)),
  `team_b_players` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`team_b_players`)),
  `score_progression` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`score_progression`)),
  `quarter_scores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`quarter_scores`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `match_stats`
--

INSERT INTO `match_stats` (`id`, `match_id`, `general_info`, `team_a_players`, `team_b_players`, `score_progression`, `quarter_scores`, `created_at`) VALUES
(1, '3053cdb3-b709-4066-9c43-e5abfbfd6d2b', '{\"matchNumber\":\"N/A\",\"competition\":\"N/A\",\"date\":\"N/A\",\"location\":\"N/A\",\"teamA\":\"N/A\",\"teamB\":\"N/A\"}', '[]', '[]', '[{\"a\":\"603\",\"b\":\"0\"},{\"a\":\"00\",\"b\":\"2\"},{\"a\":\"727\",\"b\":\"17\"},{\"a\":\"1\",\"b\":\"1\"},{\"a\":\"775\",\"b\":\"26\"},{\"a\":\"71\",\"b\":\"7\"}]', '[{\"period\":1,\"a\":\"0\",\"b\":\"0\"},{\"period\":2,\"a\":\"0\",\"b\":\"0\"},{\"period\":3,\"a\":\"0\",\"b\":\"0\"},{\"period\":4,\"a\":\"0\",\"b\":\"0\"}]', '2026-02-23 04:41:53'),
(2, 'd37181b7-148b-4883-a31c-44640aac5e42', '{\"matchNumber\":\"N/A\",\"competition\":\"N/A\",\"date\":\"N/A\",\"location\":\"N/A\",\"teamA\":\"N/A\",\"teamB\":\"75 AC AS sisi isimmsisnsissstiont\"}', '[]', '[{\"license\":\"7701\",\"name\":\"VD ogi\",\"number\":\"??\",\"inPlay\":false,\"fouls\":0}]', '[{\"a\":\"03\",\"b\":\"0\"},{\"a\":\"00\",\"b\":\"2\"},{\"a\":\"27\",\"b\":\"17\"},{\"a\":\"1\",\"b\":\"1\"},{\"a\":\"75\",\"b\":\"26\"},{\"a\":\"71\",\"b\":\"7\"}]', '[{\"period\":1,\"a\":\"0\",\"b\":\"0\"},{\"period\":2,\"a\":\"0\",\"b\":\"0\"},{\"period\":3,\"a\":\"0\",\"b\":\"0\"},{\"period\":4,\"a\":\"0\",\"b\":\"0\"}]', '2026-02-23 04:48:52');

-- --------------------------------------------------------

--
-- Structure de la table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_important` tinyint(1) DEFAULT 0,
  `is_presidential` tinyint(1) DEFAULT 0,
  `author_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `author_type` varchar(50) DEFAULT 'general'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `image_url`, `is_important`, `is_presidential`, `author_id`, `created_at`, `author_type`) VALUES
(1, 'Victoire saif de HUSA Basketball Face au WAC', 'HUSA a remporté une victoire historique hier soir avec un score de 89-78. Les joueurs ont montré une détermination sans faille...', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200', 1, 0, 'st2', '2026-03-23 13:21:18', 'general'),
(2, 'Nouveau Projet Scolaire : Basket-études', 'Le club lance son programme basket-études pour la saison prochaine. Ce projet vise à allier excellence académique et excellence sportive...', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200', 0, 0, 'st2', '2026-03-23 13:21:18', 'general'),
(3, 'Note pour les Supporters de HUSA', 'Nous tenons à remercier notre public pour son soutien indéfectible lors des derniers matchs. Ensemble, nous sommes plus forts.', 'http://localhost:5000/uploads/players/President.jpg', 0, 1, 'st3', '2026-03-23 13:21:18', 'president'),
(6, 'I LOVE THE MOMENT', 'I spent three incredible years with the husa Club basketball team. This was such a special part of my life—I played at my best, grew so much, and loved every moment with the team. These memories will stay with me forever.', 'http://localhost:5000/uploads/players/preview_1776908002097_nobg.png', 0, 0, 'usr_1776908024166', '2026-05-22 20:35:56', 'player'),
(7, 'am ready to the next match ', 'i hop the coach chose me and trust me ', 'http://localhost:5000/uploads/players/LaamraniYouness.jpg', 0, 0, 'pl8', '2026-05-22 20:53:43', 'player'),
(8, 'the next match is gone to be crayz', 'we ready we trust the prosses and we win ', 'http://localhost:5000/uploads/players/coach.jpg', 0, 0, 'st3', '2026-05-22 20:56:08', 'coach');

-- --------------------------------------------------------

--
-- Structure de la table `players`
--

CREATE TABLE `players` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(50) NOT NULL,
  `jersey_number` int(11) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `weight` varchar(10) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `players`
--

INSERT INTO `players` (`id`, `name`, `position`, `jersey_number`, `height`, `weight`, `age`, `photo_url`, `bio`, `is_active`, `created_at`, `email`, `phone`) VALUES
('pl10', 'Choua M\'Barek', 'Center', 10, '208cm', '110kg', 29, 'http://localhost:5000/uploads/players/ChouaMBarek.jpg', 'Defensive anchor.', 1, '2026-02-10 10:48:25', 'choua.m\'barek@husa.ma', '+212 60000000'),
('pl11', 'Choua Ismail', 'Forward', 11, '200cm', '95kg', 27, 'http://localhost:5000/uploads/players/ChouaIsmail.jpg', 'Athletic finisher at the rim.', 1, '2026-02-10 10:48:25', NULL, NULL),
('pl12', 'Bentabjaoute Youssef', 'Guard', 12, '185cm', '80kg', 22, 'http://localhost:5000/uploads/players/BentabjaouteYoussef.jpg', 'Quick and tenacious defender.', 1, '2026-02-10 10:48:25', NULL, NULL),
('pl13', 'Soufiane Banyahya', 'Forward', 13, '195cm', '88kg', 24, 'http://localhost:5000/uploads/players/default.png', 'Developing talent.', 1, '2026-05-22 15:57:45', NULL, NULL),
('pl14', 'Mouad Chanouni', 'Guard', 14, '188cm', '83kg', 23, 'http://localhost:5000/uploads/players/default.png', 'Solid backup guard.', 1, '2026-05-22 15:57:45', NULL, NULL),
('pl15', 'Elbika Reda', 'Forward', 15, '197cm', '91kg', 25, 'http://localhost:5000/uploads/players/default.png', 'Physical forward.', 1, '2026-05-22 15:57:45', NULL, NULL),
('pl16', 'Bouchentouf Rabii', 'Guard', 16, '192cm', '86kg', 26, 'http://localhost:5000/uploads/players/BouchentoufRabii.jpg', 'Experienced leader.', 1, '2026-02-10 10:48:25', NULL, NULL),
('pl5', 'Moudden Mohamed', 'Guard', 5, '190cm', '85kg', 24, 'http://localhost:5000/uploads/players/MouddenMohamed.jpg', 'Agile playmaker with excellent vision.', 1, '2026-02-10 10:48:25', NULL, NULL),
('pl6', 'Echraouqi Khalid', 'Forward', 6, '198cm', '92kg', 26, 'http://localhost:5000/uploads/players/EchraouqiKhalid.jpg', 'Strong defensive presence.', 1, '2026-02-10 10:48:25', NULL, NULL),
('pl7', 'Ech Charany Mohamed', 'Guard', 7, '188cm', '82kg', 23, 'http://localhost:5000/uploads/players/EchCharanyMohamed.jpg', 'Sharp shooter from deep.', 1, '2026-02-10 10:48:25', NULL, NULL),
('pl8', 'Laamrani Youness', 'Center', 8, '205cm', '105kg', 28, 'http://localhost:5000/uploads/players/LaamraniYouness.jpg', 'Dominant in the paint.', 1, '2026-02-10 10:48:25', NULL, NULL),
('pl9', 'Guaouzi Zoubir', 'Forward', 9, '196cm', '90kg', 25, 'http://localhost:5000/uploads/players/GuaouziZoubir.jpg', 'Versatile wing player.', 1, '2026-02-10 10:48:25', NULL, NULL),
('usr_1776908024166', 'saif belfaquir ', 'Point Guard', 1, '192cm', '86kg', 24, 'http://localhost:5000/uploads/players/preview_1776908002097_nobg.png', 'Professional basketball player for HUSA Basketball. Committed to the team\'s victory.', 1, '2026-04-23 01:33:44', 'saif.belfaquir @husa.ma', '+212 6XX-XXXXXX');

-- --------------------------------------------------------

--
-- Structure de la table `rankings`
--

CREATE TABLE `rankings` (
  `id` int(11) NOT NULL,
  `pos` int(11) DEFAULT NULL,
  `club` varchar(255) DEFAULT NULL,
  `logo` varchar(512) DEFAULT NULL,
  `pts` int(11) DEFAULT NULL,
  `p` int(11) DEFAULT NULL,
  `w` int(11) DEFAULT NULL,
  `l` int(11) DEFAULT NULL,
  `pf` int(11) DEFAULT NULL,
  `pa` int(11) DEFAULT NULL,
  `diff` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `rankings`
--

INSERT INTO `rankings` (`id`, `pos`, `club`, `logo`, `pts`, `p`, `w`, `l`, `pf`, `pa`, `diff`, `updated_at`) VALUES
(821, 1, 'OCY', ' https://application.frmbb.ma/fotoupload/62633.jpg ', 27, 16, 11, 5, 1012, 866, 146, '2026-05-23 16:40:54'),
(822, 2, 'OCK', ' https://application.frmbb.ma/fotoupload/36943.png ', 25, 15, 10, 5, 1016, 973, 43, '2026-05-23 16:40:54'),
(823, 3, 'COJ', ' https://application.frmbb.ma/fotoupload/64709.png ', 24, 15, 9, 6, 931, 842, 89, '2026-05-23 16:40:54'),
(824, 4, 'RSS', ' https://application.frmbb.ma/fotoupload/52054.png ', 24, 15, 9, 6, 894, 871, 23, '2026-05-23 16:40:54'),
(825, 5, 'WSC', ' https://application.frmbb.ma/fotoupload/62754.png ', 23, 15, 8, 7, 846, 785, 61, '2026-05-23 16:40:54'),
(826, 6, 'CSBA', ' https://application.frmbb.ma/fotoupload/78256.png ', 21, 15, 6, 9, 878, 912, -34, '2026-05-23 16:40:54'),
(827, 7, 'ACSMM', ' https://application.frmbb.ma/fotoupload/69549.png ', 21, 15, 6, 9, 876, 989, -113, '2026-05-23 16:40:54'),
(828, 8, 'HUSA', ' https://application.frmbb.ma/fotoupload/15729.png ', 21, 15, 6, 9, 865, 987, -122, '2026-05-23 16:40:54'),
(829, 9, 'RCOZ', ' https://application.frmbb.ma/fotoupload/43597.png ', 17, 15, 3, 12, 783, 876, -93, '2026-05-23 16:40:54'),
(830, 10, 'AABB', ' https://application.frmbb.ma/fotoupload/44843.png ', 0, 0, 0, 0, 0, 0, 0, '2026-05-23 16:40:54');

-- --------------------------------------------------------

--
-- Structure de la table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `sender_id` varchar(36) NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `recipient_role` varchar(50) NOT NULL,
  `recipient_id` varchar(36) DEFAULT NULL,
  `player_id` varchar(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(50) DEFAULT 'technical',
  `priority` varchar(20) DEFAULT 'normal',
  `status` varchar(20) DEFAULT 'unseen',
  `response` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reports`
--

INSERT INTO `reports` (`id`, `sender_id`, `sender_name`, `recipient_role`, `recipient_id`, `player_id`, `title`, `content`, `type`, `priority`, `status`, `response`, `created_at`) VALUES
(1, 'st1', 'Mohamed Haib', 'president', NULL, 'st1', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(2, 'st1', 'Mohamed Haib', 'player', NULL, 'pl5', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(3, 'st1', 'Mohamed Haib', 'player', NULL, 'pl11', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(4, 'st1', 'Mohamed Haib', 'player', NULL, 'pl6', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(5, 'st1', 'Mohamed Haib', 'player', NULL, 'pl12', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(6, 'st1', 'Mohamed Haib', 'player', NULL, 'pl14', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(7, 'st1', 'Mohamed Haib', 'player', NULL, 'pl13', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(8, 'st1', 'Mohamed Haib', 'player', NULL, 'pl7', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(9, 'st1', 'Mohamed Haib', 'player', NULL, 'pl8', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(10, 'st1', 'Mohamed Haib', 'player', NULL, 'pl9', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(11, 'st1', 'Mohamed Haib', 'player', NULL, 'pl15', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(12, 'st1', 'Mohamed Haib', 'player', NULL, 'pl10', 'nahwi mok', 'test test ', 'performance', 'normal', 'seen', 'zbiii', '2026-02-13 21:47:10'),
(13, 'st1', 'Mohamed Haib', 'player', NULL, 'pl16', 'nahwi mok', 'test test ', 'performance', 'normal', 'unseen', NULL, '2026-02-13 21:47:10'),
(14, 'pl10', 'Choua M\'Barek', 'coach', NULL, 'pl10', 'testtttt', 'qsdoiqndlkkqndqskdnq', 'technical', 'normal', 'unseen', NULL, '2026-02-13 22:28:57');

-- --------------------------------------------------------

--
-- Structure de la table `staff`
--

CREATE TABLE `staff` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(100) NOT NULL,
  `department` enum('coaching','medical','office') NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `height` varchar(50) DEFAULT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `staff`
--

INSERT INTO `staff` (`id`, `name`, `role`, `department`, `photo_url`, `email`, `phone`, `created_at`, `height`, `weight`, `age`, `bio`) VALUES
('st1', 'Mohamed Haib', 'Head Coach', 'coaching', 'http://localhost:5000/uploads/players/coach.jpg', 'mohamed.haib@husa.ma', '+212 6XX-XXXXXX', '2026-02-10 10:48:25', '182cm', '78kg', 45, 'Elite tactical mind with 15+ years of experience in regional basketball championships. Specialized in high-pressure defensive systems.'),
('st2', 'Youssef Abid', 'President', 'office', 'http://localhost:5000/uploads/players/President.jpg', NULL, NULL, '2026-02-10 10:48:25', '178cm', '80kg', 52, 'Strategic leadership and organizational management. Dedicated to elevating HUSA Basketball to the national elite.'),
('st3', 'Social Media', 'Social Media Management', 'office', 'http://localhost:5000/uploads/players/default.png', NULL, NULL, '2026-05-22 15:57:48', '175cm', '70kg', 30, 'Official Social Media Manager. Handles store inventory and news bulletins.');

-- --------------------------------------------------------

--
-- Structure de la table `store_products`
--

CREATE TABLE `store_products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `in_stock` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `store_products`
--

INSERT INTO `store_products` (`id`, `name`, `price`, `description`, `category`, `image_url`, `in_stock`, `created_at`) VALUES
('0f772296-5257-40e5-8d36-0c810ee56497', 'HUSA Official Kit (Promo) - Red', 150.00, 'Official promotional kit for HUSA Basketball fans. Red Home Color.', 'Kit', '[\"http://localhost:5000/uploads/shop/images-1776907402883-479676687.jpg\",\"http://localhost:5000/uploads/shop/images-1776907402884-872887462.jpg\",\"http://localhost:5000/uploads/shop/images-1776907402884-982077762.jpg\"]', 1, '2026-02-18 08:22:36'),
('1f141335-066a-4e91-9f48-e969702f711d', 'HUSA Official Kit (Match) - Red', 250.00, 'Authentic match kit worn by HUSA players. Red Home Color.', 'Kit', '[\"http://localhost:5000/uploads/shop/images-1776907421084-176613454.jpg\",\"http://localhost:5000/uploads/shop/images-1776907421084-37952289.jpg\",\"http://localhost:5000/uploads/shop/images-1776907421085-15883461.jpg\"]', 1, '2026-02-18 08:22:36'),
('640f95e1-1a3f-497d-976e-dcb5e15a01bc', 'HUSA Official Kit (Match) - White', 250.00, 'Authentic match kit worn by HUSA players. White Away Color.', 'Kit', '[\"http://localhost:5000/uploads/shop/images-1776907453543-815111502.png\",\"http://localhost:5000/uploads/shop/images-1776907453551-514557164.png\"]', 1, '2026-02-18 08:22:36');

-- --------------------------------------------------------

--
-- Structure de la table `store_reservations`
--

CREATE TABLE `store_reservations` (
  `id` varchar(36) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `size` varchar(10) NOT NULL,
  `color` varchar(20) NOT NULL,
  `status` enum('pending','contacted','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `store_reservations`
--

INSERT INTO `store_reservations` (`id`, `product_name`, `price`, `customer_name`, `location`, `phone`, `size`, `color`, `status`, `created_at`) VALUES
('cb8a27fd-feb1-4c31-b751-4490543ff7b1', 'HUSA Official Kit (Promo)', '150 DH', 'Saif belfaquir', 'agadir', '0649157151', 'M', 'Red', 'pending', '2026-02-12 15:58:41'),
('d3a6263d-b589-430b-848a-83e8c20e3310', 'HUSA Official Kit (Match)', '250 DH', 'Saif belfaquir', 'agadir', '0649157151', 'M', 'Red', 'pending', '2026-02-14 02:34:19');

-- --------------------------------------------------------

--
-- Structure de la table `tactics`
--

CREATE TABLE `tactics` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'full',
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `user_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tactics`
--

INSERT INTO `tactics` (`id`, `name`, `type`, `data`, `user_id`, `created_at`) VALUES
(1, 'new one ', 'full', '[{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":60.77662985393659,\"y\":50.78917870883698},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":73.15385006870578,\"y\":83.3621133630222},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":69.67954263999864,\"y\":12.787421612287558},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":78.1481669974723,\"y\":39.15598776091369},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":94.75969939097834,\"y\":64.16734829894877},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":62.77662985393659,\"y\":52.78917870883698}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":60.77662985393659,\"y\":50.78917870883698},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":73.15385006870578,\"y\":83.3621133630222},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":69.67954263999864,\"y\":12.787421612287558},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":78.1481669974723,\"y\":39.15598776091369},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":94.75969939097834,\"y\":64.16734829894877},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":73.80528271158838,\"y\":82.78045381562605}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":69.35382631855734,\"y\":14.726286770274774},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":73.15385006870578,\"y\":83.3621133630222},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":95.30255992671383,\"y\":12.399648580690116},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":78.1481669974723,\"y\":62.42236965676028},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":35.47214396073798},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":78.0395948903252,\"y\":64.74900784634494}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":69.35382631855734,\"y\":14.726286770274774},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":85.1070920052107},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":95.30255992671383,\"y\":12.399648580690116},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":78.1481669974723,\"y\":62.42236965676028},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":35.47214396073798},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":70.33097528288124,\"y\":15.30794631767094}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":69.35382631855734,\"y\":14.726286770274774},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":85.1070920052107},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":95.30255992671383,\"y\":12.399648580690116},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":78.1481669974723,\"y\":62.42236965676028},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":35.47214396073798},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":93.67397831950736,\"y\":12.98130812808628}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":84.6624934262982,\"y\":45.5542427822715},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":85.1070920052107},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":95.30255992671383,\"y\":12.399648580690116},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":80.42818124756137,\"y\":31.98218667636099},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":88.46251717644664,\"y\":31.012754097367385},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":93.67397831950736,\"y\":12.98130812808628}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":84.6624934262982,\"y\":45.5542427822715},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":85.1070920052107},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":95.30255992671383,\"y\":12.399648580690116},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":80.42818124756137,\"y\":31.98218667636099},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":88.46251717644664,\"y\":31.012754097367385},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":87.26822399782856,\"y\":47.10533490866127}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":84.6624934262982,\"y\":45.5542427822715},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":85.1070920052107},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":95.30255992671383,\"y\":12.399648580690116},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":80.42818124756137,\"y\":31.98218667636099},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":88.46251717644664,\"y\":31.012754097367385},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":92.80540146233058,\"y\":50.59529219303827}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1770722241690-3bwshrnt9\",\"label\":\"1\",\"type\":\"offense\",\"x\":84.6624934262982,\"y\":45.5542427822715},{\"id\":\"token-1770722242266-i8it3lqnk\",\"label\":\"2\",\"type\":\"offense\",\"x\":94.10826674809574,\"y\":85.1070920052107},{\"id\":\"token-1770722242832-275jrojtm\",\"label\":\"3\",\"type\":\"offense\",\"x\":95.30255992671383,\"y\":12.399648580690116},{\"id\":\"token-1770722243422-khxo9aae3\",\"label\":\"4\",\"type\":\"offense\",\"x\":80.42818124756137,\"y\":31.98218667636099},{\"id\":\"token-1770722243929-evdk7vtid\",\"label\":\"5\",\"type\":\"offense\",\"x\":88.46251717644664,\"y\":31.012754097367385},{\"id\":\"token-1770722265347-vpmgy9o2p\",\"label\":\"🏀\",\"type\":\"ball\",\"x\":92.80540146233058,\"y\":50.59529219303827}],\"paths\":[]}]', 'c1', '2026-02-10 11:19:00'),
(7, 'qs', 'full', '[{\"tokens\":[{\"id\":\"token-1774275944963-pppfoiql7\",\"label\":\"2\",\"type\":\"offense\",\"x\":67.96875,\"y\":8.928571428571429}],\"paths\":[]}]', 'st1', '2026-03-23 14:25:54'),
(8, 'Design Lab', 'full', '[{\"tokens\":[{\"id\":\"token-1774285233197-D2\",\"type\":\"defense\",\"label\":\"D2\",\"x\":50,\"y\":50}],\"paths\":[]}]', NULL, '2026-03-23 17:00:37'),
(9, 'jhjjhjkh', 'full', '[{\"tokens\":[{\"id\":\"token-1776908319964-1\",\"type\":\"offense\",\"label\":\"1\",\"x\":60.26376146788991,\"y\":46.531421988992705},{\"id\":\"token-1776908320359-2\",\"type\":\"offense\",\"label\":\"2\",\"x\":68.29128440366972,\"y\":70.69627543837194},{\"id\":\"token-1776908320729-3\",\"type\":\"offense\",\"label\":\"3\",\"x\":68.97935779816514,\"y\":20.318699603225394},{\"id\":\"token-1776908321090-4\",\"type\":\"offense\",\"label\":\"4\",\"x\":92.71788990825688,\"y\":31.786765646998592},{\"id\":\"token-1776908321648-5\",\"type\":\"offense\",\"label\":\"5\",\"x\":91.34174311926606,\"y\":68.03404582106745}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1776908319964-1\",\"type\":\"offense\",\"label\":\"1\",\"x\":62.44266055045872,\"y\":68.03404582106745},{\"id\":\"token-1776908320359-2\",\"type\":\"offense\",\"label\":\"2\",\"x\":77.69495412844036,\"y\":45.71227441443747},{\"id\":\"token-1776908320729-3\",\"type\":\"offense\",\"label\":\"3\",\"x\":62.32798165137615,\"y\":35.47292973249712},{\"id\":\"token-1776908321090-4\",\"type\":\"offense\",\"label\":\"4\",\"x\":92.71788990825688,\"y\":31.786765646998592},{\"id\":\"token-1776908321648-5\",\"type\":\"offense\",\"label\":\"5\",\"x\":91.34174311926606,\"y\":68.03404582106745}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1776908319964-1\",\"type\":\"offense\",\"label\":\"1\",\"x\":71.61697247706422,\"y\":84.41699731217203},{\"id\":\"token-1776908320359-2\",\"type\":\"offense\",\"label\":\"2\",\"x\":72.53440366972477,\"y\":17.246896198643284},{\"id\":\"token-1776908320729-3\",\"type\":\"offense\",\"label\":\"3\",\"x\":65.0802752293578,\"y\":62.09522590554205},{\"id\":\"token-1776908321090-4\",\"type\":\"offense\",\"label\":\"4\",\"x\":92.71788990825688,\"y\":31.786765646998592},{\"id\":\"token-1776908321648-5\",\"type\":\"offense\",\"label\":\"5\",\"x\":91.34174311926606,\"y\":68.03404582106745}],\"paths\":[]},{\"tokens\":[{\"id\":\"token-1776908319964-1\",\"type\":\"offense\",\"label\":\"1\",\"x\":71.61697247706422,\"y\":84.41699731217203},{\"id\":\"token-1776908320359-2\",\"type\":\"offense\",\"label\":\"2\",\"x\":72.53440366972477,\"y\":17.246896198643284},{\"id\":\"token-1776908320729-3\",\"type\":\"offense\",\"label\":\"3\",\"x\":65.0802752293578,\"y\":62.09522590554205},{\"id\":\"token-1776908321090-4\",\"type\":\"offense\",\"label\":\"4\",\"x\":92.71788990825688,\"y\":31.786765646998592},{\"id\":\"token-1776908321648-5\",\"type\":\"offense\",\"label\":\"5\",\"x\":91.34174311926606,\"y\":68.03404582106745}],\"paths\":[]}]', NULL, '2026-04-23 01:39:10');

-- --------------------------------------------------------

--
-- Structure de la table `tryouts`
--

CREATE TABLE `tryouts` (
  `id` varchar(36) NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `height` varchar(10) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `experience` text DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','reviewed','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tryouts`
--

INSERT INTO `tryouts` (`id`, `applicant_name`, `age`, `height`, `position`, `email`, `phone`, `experience`, `file_url`, `status`, `created_at`) VALUES
('1217d565-8c16-4102-8e05-6373f8728639', 'Saif belfaquir', 1, '190cm', 'Point Guard (1)', 'hamza.emilie23@gmail.com', '0649157151', 'gbfgd', 'https://chatgpt.com/', 'accepted', '2026-02-10 11:06:01');

-- --------------------------------------------------------

--
-- Structure de la table `tshirts`
--

CREATE TABLE `tshirts` (
  `number` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tshirts`
--

INSERT INTO `tshirts` (`number`, `created_at`) VALUES
(1, '2026-05-22 14:52:12'),
(2, '2026-05-22 14:52:12'),
(3, '2026-05-22 14:52:12'),
(4, '2026-05-22 14:52:12'),
(5, '2026-05-22 14:52:12'),
(6, '2026-05-22 14:52:12'),
(7, '2026-05-22 14:52:12'),
(8, '2026-05-22 14:52:12'),
(9, '2026-05-22 14:52:12'),
(10, '2026-05-22 14:52:12'),
(11, '2026-05-22 14:52:12'),
(12, '2026-05-22 14:52:12'),
(13, '2026-05-22 14:52:12'),
(14, '2026-05-22 14:52:12'),
(15, '2026-05-22 14:52:12'),
(16, '2026-05-22 14:52:12'),
(17, '2026-05-22 14:52:12'),
(18, '2026-05-22 14:52:12');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'Player',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
('pl10', 'Choua M\'Barek', '10ChouaMBarek', 'Player', '2026-02-10 10:48:25'),
('pl11', 'Choua Ismail', '11ChouaIsmail', 'Player', '2026-02-10 10:48:25'),
('pl12', 'Bentabjaoute Youssef', '12BentabjaouteYoussef', 'Player', '2026-02-10 10:48:25'),
('pl13', 'Soufiane Banyahya', '13SoufianeBanyahya', 'Player', '2026-05-22 15:57:45'),
('pl14', 'Mouad Chanouni', '14MouadChanouni', 'Player', '2026-05-22 15:57:45'),
('pl15', 'Elbika Reda', '15ElbikaReda', 'Player', '2026-05-22 15:57:45'),
('pl16', 'Bouchentouf Rabii', '16BouchentoufRabii', 'Player', '2026-02-10 10:48:25'),
('pl5', 'Moudden Mohamed', '05MouddenMohamed', 'Player', '2026-02-10 10:48:25'),
('pl6', 'Echraouqi Khalid', '06EchraouqiKhalid', 'Player', '2026-02-10 10:48:25'),
('pl7', 'Ech Charany Mohamed', '07EchCharanyMohamed', 'Player', '2026-02-10 10:48:25'),
('pl8', 'Laamrani Youness', '08LaamraniYouness', 'Player', '2026-02-10 10:48:25'),
('pl9', 'Guaouzi Zoubir', '09GuaouziZoubir', 'Player', '2026-02-10 10:48:25'),
('st1', 'Mohamed Haib', 'HCMohamedHaib', 'Coach', '2026-02-10 10:48:25'),
('st2', 'Youssef Abid', 'PRYoussefAbid', 'President', '2026-02-10 10:48:25'),
('st3', 'Social Media', 'SMSocialMedia', 'SocialMedia', '2026-05-22 15:57:45'),
('usr_1776908024166', 'saif belfaquir ', 'saif belfaquir ', 'Player', '2026-04-23 01:33:44');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `kids_reservations`
--
ALTER TABLE `kids_reservations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `match_intel`
--
ALTER TABLE `match_intel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `match_id` (`match_id`);

--
-- Index pour la table `match_lineups`
--
ALTER TABLE `match_lineups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `match_id` (`match_id`);

--
-- Index pour la table `match_schedule`
--
ALTER TABLE `match_schedule`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_match` (`date`,`home`,`away`),
  ADD UNIQUE KEY `unique_external_id` (`external_id`);

--
-- Index pour la table `match_stats`
--
ALTER TABLE `match_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_match_report` (`match_id`);

--
-- Index pour la table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `rankings`
--
ALTER TABLE `rankings`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `store_products`
--
ALTER TABLE `store_products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `store_reservations`
--
ALTER TABLE `store_reservations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tactics`
--
ALTER TABLE `tactics`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tryouts`
--
ALTER TABLE `tryouts`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tshirts`
--
ALTER TABLE `tshirts`
  ADD PRIMARY KEY (`number`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `match_intel`
--
ALTER TABLE `match_intel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `match_lineups`
--
ALTER TABLE `match_lineups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT pour la table `match_schedule`
--
ALTER TABLE `match_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT pour la table `match_stats`
--
ALTER TABLE `match_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `rankings`
--
ALTER TABLE `rankings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=831;

--
-- AUTO_INCREMENT pour la table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `tactics`
--
ALTER TABLE `tactics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `match_lineups`
--
ALTER TABLE `match_lineups`
  ADD CONSTRAINT `match_lineups_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `match_stats`
--
ALTER TABLE `match_stats`
  ADD CONSTRAINT `match_stats_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE;
--
-- Base de données : `kiosk_db`
--
CREATE DATABASE IF NOT EXISTS `kiosk_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `kiosk_db`;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--
-- Erreur de lecture de structure pour la table kiosk_db.orders : #1932 - Table 'kiosk_db.orders' doesn't exist in engine
-- Erreur de lecture des données pour la table kiosk_db.orders : #1064 - Erreur de syntaxe près de 'FROM `kiosk_db`.`orders`' à la ligne 1
--
-- Base de données : `lblend_db`
--
CREATE DATABASE IF NOT EXISTS `lblend_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `lblend_db`;

-- --------------------------------------------------------

--
-- Structure de la table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `github_url` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `help_needed` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pos_x` float DEFAULT 0,
  `pos_y` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `announcements`
--

INSERT INTO `announcements` (`id`, `user_id`, `project_name`, `description`, `github_url`, `is_active`, `help_needed`, `created_at`, `pos_x`, `pos_y`) VALUES
(2, 2, 'bel', 'sadas', 'https://www.figma.com/design/eiXvjxUO7SyOEtXnopkUE5/E-commerce-Website-Template--Freebie---Community-?node-id=39-1402&t=Iroumw41PU4Qg7Ik-1', 1, 'Design', '2026-04-27 22:13:42', 0, 0),
(3, 2, 'test', 'adasas', 'https://www.figma.com/design/y8tZhXhHP8vwFYMqUx398Z/Digital-Marketing-Website-UI-Kit--Community-?node-id=0-1&t=O7uD5NRhgvYgyVvc-1', 1, 'Design,Development', '2026-04-27 22:36:10', 50, 50),
(6, 1, 'sadasda s', 'adasd asd asdas das', '', 1, 'Development', '2026-05-13 15:54:30', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('DESIGN','DEVELOP') DEFAULT 'DEVELOP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `branches`
--

INSERT INTO `branches` (`id`, `project_id`, `name`, `user_id`, `created_at`, `type`) VALUES
(2, 2, 'main', 2, '2026-04-27 22:13:42', 'DEVELOP'),
(3, 3, 'main', 2, '2026-04-27 22:36:10', 'DEVELOP'),
(6, 3, 'main', 2, '2026-04-28 01:14:52', 'DESIGN'),
(7, 2, 'main', 2, '2026-04-28 01:15:37', 'DESIGN'),
(12, 6, 'main', 1, '2026-05-13 15:54:55', 'DEVELOP');

-- --------------------------------------------------------

--
-- Structure de la table `commits`
--

CREATE TABLE `commits` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `sha` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pos_x` float DEFAULT 0,
  `pos_y` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commits`
--

INSERT INTO `commits` (`id`, `branch_id`, `sha`, `message`, `author`, `file_url`, `user_id`, `created_at`, `pos_x`, `pos_y`) VALUES
(3, 3, NULL, 'Genesis: Project Initialized', NULL, NULL, 2, '2026-04-27 22:36:10', 400, 50),
(4, 3, NULL, 'i update the page of test ', NULL, NULL, 2, '2026-04-27 22:41:01', 603, 167),
(45, 12, NULL, 'we start dt day', NULL, NULL, 1, '2026-05-13 15:55:08', 0, 0),
(46, 12, NULL, 'sddasa', NULL, 'http://localhost:5000/datafiles/1778687720065.pdf', 1, '2026-05-13 15:55:20', 0, 0),
(48, 6, NULL, 'image\nhttps://www.figma.com/design/y8tZhXhHP8vwFYMqUx398Z/Digital-Marketing-Website-UI-Kit--Community-?node-id=0-1&t=GZR5idDrbPzyiXgj-1', NULL, NULL, 2, '2026-06-01 19:08:33', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `commit_connections`
--

CREATE TABLE `commit_connections` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `from_commit_id` varchar(50) NOT NULL,
  `from_side` varchar(10) NOT NULL,
  `to_commit_id` varchar(50) NOT NULL,
  `to_side` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commit_connections`
--

INSERT INTO `commit_connections` (`id`, `project_id`, `from_commit_id`, `from_side`, `to_commit_id`, `to_side`, `created_at`) VALUES
(10, 3, '4', 'left', '10', 'left', '2026-04-28 01:15:02'),
(11, 3, 'principal', 'right', '10', 'left', '2026-04-28 01:15:02');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 1, 'bel has requested clearance for mission saif .', 'request', 1, '2026-04-27 22:10:49'),
(2, 2, 'Clearance Granted: You are now an active member of saif !', 'acceptance', 0, '2026-04-27 22:10:56'),
(3, 1, 'New Mission Broadcast: bel is now live!', 'broadcast', 1, '2026-04-27 22:13:42'),
(4, 1, 'New Mission Broadcast: test is now live!', 'broadcast', 1, '2026-04-27 22:36:10'),
(5, 2, 'New Mission Broadcast: Lblend is now live!', 'broadcast', 0, '2026-04-28 00:01:33'),
(6, 1, 'bel has requested clearance for mission Lblend.', 'request', 1, '2026-04-28 00:59:13'),
(7, 2, 'Clearance Granted: You are now an active member of Lblend!', 'acceptance', 0, '2026-04-28 00:59:18'),
(8, 2, 'saif belfaquir has requested clearance for mission test.', 'request', 0, '2026-04-28 21:21:06'),
(9, 1, 'Clearance Granted: You are now an active member of test!', 'acceptance', 1, '2026-04-28 21:21:47'),
(10, 2, 'New Mission Broadcast: lblan is now live!', 'broadcast', 0, '2026-04-28 21:24:12'),
(11, 2, 'New Mission Broadcast: sadasda s is now live!', 'broadcast', 0, '2026-05-13 15:54:30'),
(12, 2, 'saif belfaquir created a new branch: asdas', 'branch', 0, '2026-06-01 18:56:50'),
(13, 3, 'New Mission Broadcast: hhygg is now live!', 'broadcast', 0, '2026-06-01 19:04:55'),
(14, 2, 'New Mission Broadcast: hhygg is now live!', 'broadcast', 0, '2026-06-01 19:04:55'),
(15, 1, 'bel added a commit to main in test', 'commit', 0, '2026-06-01 19:08:34'),
(16, 1, 'bel added a commit to main in test', 'commit', 0, '2026-06-01 19:10:42');

-- --------------------------------------------------------

--
-- Structure de la table `project_members`
--

CREATE TABLE `project_members` (
  `id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_blocked` tinyint(1) DEFAULT 0,
  `is_accepted` tinyint(1) DEFAULT 0,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `project_members`
--

INSERT INTO `project_members` (`id`, `announcement_id`, `user_id`, `is_blocked`, `is_accepted`, `joined_at`) VALUES
(3, 3, 1, 0, 1, '2026-04-28 21:21:06');

-- --------------------------------------------------------

--
-- Structure de la table `project_messages`
--

CREATE TABLE `project_messages` (
  `id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `project_messages`
--

INSERT INTO `project_messages` (`id`, `announcement_id`, `user_id`, `message`, `created_at`) VALUES
(1, 3, 1, 'awach ', '2026-04-28 21:21:19'),
(2, 3, 1, 'asdasd', '2026-04-28 21:21:21'),
(3, 6, 1, 'xasdas ', '2026-05-13 16:00:04'),
(4, 6, 1, 'asdas das', '2026-05-13 16:00:06');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `occupation` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `google_avatar` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `occupation`, `description`, `google_id`, `avatar`, `google_avatar`, `is_verified`, `verification_token`, `created_at`) VALUES
(1, 'saif belfaquir', 'hamza.emilie23@gmail.com', '$2b$10$8ETkwnneDRNKX5WvBil3JeJBM6UDKaBpqWO8xRfrXf1Cfz.KhmnSa', 'user', 'Developer', NULL, '101551823524062872766', 'https://lh3.googleusercontent.com/a/ACg8ocJEXJmjUsjOM2aX6jgfybCf2OKJO_sUOA19ipujosn4ceVTOMpTDA=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJEXJmjUsjOM2aX6jgfybCf2OKJO_sUOA19ipujosn4ceVTOMpTDA=s96-c', 1, NULL, '2026-04-27 21:27:21'),
(2, 'bel', 'blsayf3@gmail.com', '$2b$10$/IUOxuxpfHBrHqGxPqLDneX61mTMAiruRl2BqIfLTBJ0Bgk7LGnmq', 'user', 'Designer', '', '112047102800170261946', 'http://localhost:5000/uploads/1777675532780.webp', 'https://lh3.googleusercontent.com/a/ACg8ocIJIwqOjDYolr436Fi7v33X4wFnWKksBwIgsngw20k5iEEiqFNf=s96-c', 1, NULL, '2026-04-27 22:09:36'),
(3, 'Administrator', 'admin@admin.com', '$2b$10$I5HNCwBDNaFtbhcChyMYiebHFwgq9rNCJUBdkMdtdS/elUzkTT5rK', 'admin', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-06-01 18:40:18'),
(4, 'Bilal Ht', 'htbilal10@gmail.com', '$2b$10$WCSROKD2aeQ/otfx4cQ02.kZr2hldfrmJIB9TC63tllk4LVTKeSK2', 'user', 'student(bac)', '', '114831080628877659877', 'https://lh3.googleusercontent.com/a/ACg8ocIfzt4zYOnHeKGSQJUwknA_fd1VA0K8ojp50H7RUKUV3pHT=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocIfzt4zYOnHeKGSQJUwknA_fd1VA0K8ojp50H7RUKUV3pHT=s96-c', 1, NULL, '2026-06-02 13:25:37');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `commits`
--
ALTER TABLE `commits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `commit_connections`
--
ALTER TABLE `commit_connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_id` (`announcement_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `project_messages`
--
ALTER TABLE `project_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_id` (`announcement_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `commits`
--
ALTER TABLE `commits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT pour la table `commit_connections`
--
ALTER TABLE `commit_connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=333;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `project_members`
--
ALTER TABLE `project_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `project_messages`
--
ALTER TABLE `project_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `branches_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `branches_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `commits`
--
ALTER TABLE `commits`
  ADD CONSTRAINT `commits_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `commits_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `commit_connections`
--
ALTER TABLE `commit_connections`
  ADD CONSTRAINT `commit_connections_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `project_members`
--
ALTER TABLE `project_members`
  ADD CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `project_messages`
--
ALTER TABLE `project_messages`
  ADD CONSTRAINT `project_messages_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
--
-- Base de données : `login_system`
--
CREATE DATABASE IF NOT EXISTS `login_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `login_system`;

-- --------------------------------------------------------

--
-- Structure de la table `orders_user_19`
--
-- Erreur de lecture de structure pour la table login_system.orders_user_19 : #1932 - Table 'login_system.orders_user_19' doesn't exist in engine
-- Erreur de lecture des données pour la table login_system.orders_user_19 : #1064 - Erreur de syntaxe près de 'FROM `login_system`.`orders_user_19`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `orders_user_20`
--
-- Erreur de lecture de structure pour la table login_system.orders_user_20 : #1932 - Table 'login_system.orders_user_20' doesn't exist in engine
-- Erreur de lecture des données pour la table login_system.orders_user_20 : #1064 - Erreur de syntaxe près de 'FROM `login_system`.`orders_user_20`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `orders_user_21`
--
-- Erreur de lecture de structure pour la table login_system.orders_user_21 : #1932 - Table 'login_system.orders_user_21' doesn't exist in engine
-- Erreur de lecture des données pour la table login_system.orders_user_21 : #1064 - Erreur de syntaxe près de 'FROM `login_system`.`orders_user_21`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `products_user_19`
--
-- Erreur de lecture de structure pour la table login_system.products_user_19 : #1932 - Table 'login_system.products_user_19' doesn't exist in engine
-- Erreur de lecture des données pour la table login_system.products_user_19 : #1064 - Erreur de syntaxe près de 'FROM `login_system`.`products_user_19`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `products_user_20`
--
-- Erreur de lecture de structure pour la table login_system.products_user_20 : #1932 - Table 'login_system.products_user_20' doesn't exist in engine
-- Erreur de lecture des données pour la table login_system.products_user_20 : #1064 - Erreur de syntaxe près de 'FROM `login_system`.`products_user_20`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `products_user_21`
--
-- Erreur de lecture de structure pour la table login_system.products_user_21 : #1932 - Table 'login_system.products_user_21' doesn't exist in engine
-- Erreur de lecture des données pour la table login_system.products_user_21 : #1064 - Erreur de syntaxe près de 'FROM `login_system`.`products_user_21`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `users`
--
-- Erreur de lecture de structure pour la table login_system.users : #1932 - Table 'login_system.users' doesn't exist in engine
-- Erreur de lecture des données pour la table login_system.users : #1064 - Erreur de syntaxe près de 'FROM `login_system`.`users`' à la ligne 1
--
-- Base de données : `newstore`
--
CREATE DATABASE IF NOT EXISTS `newstore` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `newstore`;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--
-- Erreur de lecture de structure pour la table newstore.orders : #1932 - Table 'newstore.orders' doesn't exist in engine
-- Erreur de lecture des données pour la table newstore.orders : #1064 - Erreur de syntaxe près de 'FROM `newstore`.`orders`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `products`
--
-- Erreur de lecture de structure pour la table newstore.products : #1932 - Table 'newstore.products' doesn't exist in engine
-- Erreur de lecture des données pour la table newstore.products : #1064 - Erreur de syntaxe près de 'FROM `newstore`.`products`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--
-- Erreur de lecture de structure pour la table newstore.product_images : #1932 - Table 'newstore.product_images' doesn't exist in engine
-- Erreur de lecture des données pour la table newstore.product_images : #1064 - Erreur de syntaxe près de 'FROM `newstore`.`product_images`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `users`
--
-- Erreur de lecture de structure pour la table newstore.users : #1932 - Table 'newstore.users' doesn't exist in engine
-- Erreur de lecture des données pour la table newstore.users : #1064 - Erreur de syntaxe près de 'FROM `newstore`.`users`' à la ligne 1
--
-- Base de données : `new_store`
--
CREATE DATABASE IF NOT EXISTS `new_store` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `new_store`;

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--
-- Erreur de lecture de structure pour la table new_store.cache : #1932 - Table 'new_store.cache' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.cache : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`cache`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--
-- Erreur de lecture de structure pour la table new_store.cache_locks : #1932 - Table 'new_store.cache_locks' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.cache_locks : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`cache_locks`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--
-- Erreur de lecture de structure pour la table new_store.failed_jobs : #1932 - Table 'new_store.failed_jobs' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.failed_jobs : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`failed_jobs`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--
-- Erreur de lecture de structure pour la table new_store.jobs : #1932 - Table 'new_store.jobs' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.jobs : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`jobs`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--
-- Erreur de lecture de structure pour la table new_store.job_batches : #1932 - Table 'new_store.job_batches' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.job_batches : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`job_batches`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--
-- Erreur de lecture de structure pour la table new_store.migrations : #1932 - Table 'new_store.migrations' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.migrations : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`migrations`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--
-- Erreur de lecture de structure pour la table new_store.orders : #1932 - Table 'new_store.orders' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.orders : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`orders`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--
-- Erreur de lecture de structure pour la table new_store.password_reset_tokens : #1932 - Table 'new_store.password_reset_tokens' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.password_reset_tokens : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`password_reset_tokens`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--
-- Erreur de lecture de structure pour la table new_store.personal_access_tokens : #1932 - Table 'new_store.personal_access_tokens' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.personal_access_tokens : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`personal_access_tokens`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `products`
--
-- Erreur de lecture de structure pour la table new_store.products : #1932 - Table 'new_store.products' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.products : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`products`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--
-- Erreur de lecture de structure pour la table new_store.sessions : #1932 - Table 'new_store.sessions' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.sessions : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`sessions`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `users`
--
-- Erreur de lecture de structure pour la table new_store.users : #1932 - Table 'new_store.users' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.users : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`users`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `user_admin`
--
-- Erreur de lecture de structure pour la table new_store.user_admin : #1932 - Table 'new_store.user_admin' doesn't exist in engine
-- Erreur de lecture des données pour la table new_store.user_admin : #1064 - Erreur de syntaxe près de 'FROM `new_store`.`user_admin`' à la ligne 1
--
-- Base de données : `ofppt_attendance`
--
CREATE DATABASE IF NOT EXISTS `ofppt_attendance` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ofppt_attendance`;

-- --------------------------------------------------------

--
-- Structure de la table `active_checkins`
--

CREATE TABLE `active_checkins` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `group_id` varchar(50) NOT NULL,
  `status` enum('PRESENT','ABSENT','LATE') DEFAULT 'PRESENT',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'System Admin', 'admin@ofppt.ma', '$2a$10$vI8AAn.PyueTVUf4D6./juR3L6T/vT.hYj9f1.hS8GgJm.8G/5/mu', '2026-04-22 21:39:38');

-- --------------------------------------------------------

--
-- Structure de la table `filiere`
--

CREATE TABLE `filiere` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `filiere`
--

INSERT INTO `filiere` (`id`, `nom`, `created_at`) VALUES
(1, 'Développement Digital', '2026-05-13 16:14:09'),
(2, 'Infrastructure Digitale', '2026-05-13 16:14:09'),
(3, 'Intelligence Artificielle', '2026-05-13 16:14:09'),
(4, 'Gestion des Entreprises', '2026-05-13 16:14:09');

-- --------------------------------------------------------

--
-- Structure de la table `formateurs`
--

CREATE TABLE `formateurs` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('Parrain','Vacataire') DEFAULT 'Parrain',
  `first_login` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `formateurs`
--

INSERT INTO `formateurs` (`id`, `name`, `email`, `password`, `type`, `first_login`, `created_at`) VALUES
(1, 'Ahmed Alami', 'ahmed.alami@ofppt.ma', '$2a$10$GYXsAAlwk6XMEqxQxaqSfeifscbUN1aurNXbP9KrPAO1bRlvNktr.', 'Parrain', 0, '2026-05-13 16:14:09'),
(2, 'Fatima Zahra', 'fatima.zahra@ofppt.ma', '$2a$10$NXK5dpVwCuu/r4WtWQut7emCmIPKMenIRYWgP9mLH93pa.78Q0U/.', 'Vacataire', 1, '2026-05-13 16:14:09'),
(3, 'Youssef Mansouri', 'youssef.mansouri@ofppt.ma', '$2a$10$bJVDUnJV.1CIdoK5Qq3hW.79c8OSHeSyqhGfLW0rhbXhwRuovw.lW', 'Parrain', 1, '2026-05-13 16:14:09'),
(4, 'Siham Bennani', 'siham.bennani@ofppt.ma', '$2a$10$NXK5dpVwCuu/r4WtWQut7emCmIPKMenIRYWgP9mLH93pa.78Q0U/.', 'Parrain', 1, '2026-05-13 16:14:09'),
(5, 'Omar Kabbaj', 'omar.kabbaj@ofppt.ma', '$2a$10$NXK5dpVwCuu/r4WtWQut7emCmIPKMenIRYWgP9mLH93pa.78Q0U/.', 'Vacataire', 1, '2026-05-13 16:14:09'),
(6, 'utyt', 'utyt@ofppt.ma', '$2a$10$RY/mVDVdLFE3NnLNW8z2ZuhNzf8BowGoLEOFgO.Bp2xqpQDbEkKB2', 'Parrain', 1, '2026-05-18 21:35:49');

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE `groups` (
  `id` varchar(50) NOT NULL,
  `annee_scolaire` varchar(50) DEFAULT '2025/2026',
  `filiereId` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `groups`
--

INSERT INTO `groups` (`id`, `annee_scolaire`, `filiereId`, `created_at`) VALUES
('AI101', '2025/2026', 3, '2026-05-13 16:14:09'),
('DEV101', '2025/2026', 1, '2026-05-13 16:14:09'),
('DEV102', '2025/2026', 1, '2026-05-13 16:14:09'),
('DEV202', '2025/2026', 1, '2026-06-02 22:11:43'),
('GE101', '2025/2026', 4, '2026-05-13 16:14:09'),
('ID101', '2025/2026', 2, '2026-05-13 16:14:09');

-- --------------------------------------------------------

--
-- Structure de la table `groups_supervisors`
--

CREATE TABLE `groups_supervisors` (
  `group_id` varchar(50) NOT NULL,
  `formateur_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `groups_supervisors`
--

INSERT INTO `groups_supervisors` (`group_id`, `formateur_id`) VALUES
('AI101', 2),
('DEV101', 1),
('DEV101', 4),
('DEV101', 6),
('DEV102', 5),
('DEV202', 1),
('DEV202', 2),
('GE101', 3),
('GE101', 5),
('ID101', 4);

-- --------------------------------------------------------

--
-- Structure de la table `group_salles`
--

CREATE TABLE `group_salles` (
  `group_id` varchar(50) NOT NULL,
  `salle_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `group_salles`
--

INSERT INTO `group_salles` (`group_id`, `salle_id`) VALUES
('AI101', 6),
('DEV101', 3),
('DEV102', 1),
('DEV202', 5),
('GE101', 1),
('ID101', 1);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` enum('request','message','alert','success') DEFAULT 'message',
  `category` varchar(50) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `category`, `title`, `message`, `is_read`, `created_at`) VALUES
(1, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV101', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 1, '2026-05-13 16:26:08'),
(2, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV101', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 1, '2026-05-18 21:22:32'),
(3, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV101', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 1, '2026-05-20 00:19:48'),
(4, 1, 'message', 'PLANNING', 'Nouveau Groupe Assigné', 'Vous avez été assigné comme superviseur pour le groupe DEV202.', 1, '2026-06-02 22:11:43'),
(5, 2, 'message', 'PLANNING', 'Nouveau Groupe Assigné', 'Vous avez été assigné comme superviseur pour le groupe DEV202.', 0, '2026-06-02 22:11:43'),
(6, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV101', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 1, '2026-06-03 01:55:55'),
(7, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV202', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 1, '2026-06-03 17:42:46'),
(8, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV101', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 1, '2026-06-03 22:03:41'),
(9, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV101', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 0, '2026-06-04 17:30:52'),
(10, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV202', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 0, '2026-06-04 18:06:57'),
(11, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV101', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 0, '2026-06-04 20:26:13'),
(12, 1, 'message', 'RAPPORT', 'Nouveau rapport : DEV101', 'Le formateur Ahmed Alami a soumis le rapport de présence pour le module SESSION.', 0, '2026-06-04 20:32:55');

-- --------------------------------------------------------

--
-- Structure de la table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `report_code` varchar(50) NOT NULL,
  `formateur_id` int(11) NOT NULL,
  `group_id` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `subject` varchar(255) NOT NULL,
  `salleId` int(11) DEFAULT NULL,
  `heure` varchar(100) DEFAULT NULL,
  `signature` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reports`
--

INSERT INTO `reports` (`id`, `report_code`, `formateur_id`, `group_id`, `date`, `subject`, `salleId`, `heure`, `signature`, `created_at`) VALUES
(23, 'REP-DEV202-2026-06-04-7420', 1, 'DEV202', '2026-06-04', 'SESSION', NULL, '08:30-11:00', 'SCANNER_AUTO_ISTA', '2026-06-04 18:06:57'),
(24, 'REP-DEV101-2026-06-04-2974', 1, 'DEV101', '2026-06-04', 'SESSION', NULL, '08:30-11:00', 'data:image/png;base64,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', '2026-06-04 20:26:12');
INSERT INTO `reports` (`id`, `report_code`, `formateur_id`, `group_id`, `date`, `subject`, `salleId`, `heure`, `signature`, `created_at`) VALUES
(25, 'REP-DEV101-2026-06-04-5186', 1, 'DEV101', '2026-06-04', 'SESSION', NULL, '08:30-11:00', 'data:image/png;base64,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', '2026-06-04 20:32:55');

-- --------------------------------------------------------

--
-- Structure de la table `report_attendance`
--

CREATE TABLE `report_attendance` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `status` enum('PRESENT','ABSENT','LATE') NOT NULL,
  `Justifier` enum('ABSENCE','JUSTIFIÉ','NON JUSTIFIÉ') DEFAULT 'ABSENCE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `report_attendance`
--

INSERT INTO `report_attendance` (`id`, `report_id`, `student_id`, `status`, `Justifier`) VALUES
(146, 24, 'STG746182058', 'ABSENT', 'ABSENCE'),
(147, 24, 'STG746462359', 'ABSENT', 'ABSENCE'),
(148, 24, 'STG746778617', 'ABSENT', 'ABSENCE'),
(149, 24, 'STG747391660', 'ABSENT', 'ABSENCE'),
(150, 24, 'STG747993391', 'ABSENT', 'ABSENCE'),
(151, 25, 'STG745277605', 'ABSENT', 'ABSENCE'),
(152, 25, 'STG745868509', 'ABSENT', 'ABSENCE'),
(153, 25, 'STG746182058', 'ABSENT', 'ABSENCE'),
(154, 25, 'STG746462359', 'ABSENT', 'ABSENCE'),
(155, 25, 'STG746778617', 'ABSENT', 'ABSENCE'),
(156, 25, 'STG747391660', 'ABSENT', 'ABSENCE'),
(157, 25, 'STG747993391', 'ABSENT', 'ABSENCE'),
(158, 25, 'STG748368524', 'ABSENT', 'ABSENCE'),
(159, 25, 'STG748707976', 'ABSENT', 'ABSENCE'),
(160, 25, 'STG748996029', 'ABSENT', 'ABSENCE'),
(161, 25, 'STG749302048', 'ABSENT', 'ABSENCE'),
(162, 25, 'STG749641832', 'ABSENT', 'ABSENCE'),
(163, 25, 'STG750071189', 'ABSENT', 'ABSENCE'),
(164, 25, 'STG750515513', 'ABSENT', 'ABSENCE'),
(165, 25, 'STG750960103', 'ABSENT', 'ABSENCE'),
(166, 25, 'STG751490446', 'ABSENT', 'ABSENCE'),
(167, 25, 'STG752023508', 'ABSENT', 'ABSENCE'),
(168, 25, 'STG752377578', 'ABSENT', 'ABSENCE'),
(169, 25, 'STG752724252', 'ABSENT', 'ABSENCE'),
(170, 25, 'STG753346065', 'ABSENT', 'ABSENCE');

-- --------------------------------------------------------

--
-- Structure de la table `salles`
--

CREATE TABLE `salles` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `salles`
--

INSERT INTO `salles` (`id`, `nom`) VALUES
(5, 'Labo A'),
(6, 'Labo B'),
(1, 'Salle 1'),
(2, 'Salle 2'),
(3, 'Salle 3'),
(4, 'Salle 4');

-- --------------------------------------------------------

--
-- Structure de la table `stagiaires`
--

CREATE TABLE `stagiaires` (
  `NumInscription` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `group_id` varchar(50) DEFAULT NULL,
  `filiereId` int(11) DEFAULT NULL,
  `Active` tinyint(1) DEFAULT 1,
  `qr_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tele` varchar(20) DEFAULT NULL,
  `cin` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stagiaires`
--

INSERT INTO `stagiaires` (`NumInscription`, `name`, `group_id`, `filiereId`, `Active`, `qr_path`, `created_at`, `tele`, `cin`, `email`) VALUES
('STG0001', 'Alice Martin', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_ALICE_MARTIN.png', '2026-05-13 16:14:09', '0635837143', 'AB571034', 'alicemartin@ofppt-edu.ma'),
('STG0002', 'Bob Bernard', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_BOB_BERNARD.png', '2026-05-13 16:14:09', '0652227326', 'AB169792', 'bobbernard@ofppt-edu.ma'),
('STG0003', 'Charlie Dubois', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_CHARLIE_DUBOIS.png', '2026-05-13 16:14:09', '0666039784', 'AB445703', 'charliedubois@ofppt-edu.ma'),
('STG0004', 'David Thomas', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_DAVID_THOMAS.png', '2026-05-13 16:14:09', '0663119981', 'AB256620', 'davidthomas@ofppt-edu.ma'),
('STG0005', 'Emma Richard', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_EMMA_RICHARD.png', '2026-05-13 16:14:09', '0698131417', 'AB879367', 'emmarichard@ofppt-edu.ma'),
('STG0006', 'Hamza BEN6', 'DEV102', 1, 1, '/uploads/card_id/STG0006.png', '2026-05-13 16:14:09', '0636114672', 'AB242648', 'hamzaben6@ofppt-edu.ma'),
('STG0007', 'Layla CH7', 'DEV102', 1, 1, '/uploads/card_id/STG0007.png', '2026-05-13 16:14:09', '0693475431', 'AB578891', 'laylach7@ofppt-edu.ma'),
('STG0008', 'Othmane EL8', 'DEV102', 1, 1, '/uploads/card_id/STG0008.png', '2026-05-13 16:14:09', '0649337829', 'AB972910', 'othmaneel8@ofppt-edu.ma'),
('STG0009', 'Salma OU9', 'DEV102', 1, 1, '/uploads/card_id/STG0009.png', '2026-05-13 16:14:09', '0668854792', 'AB563987', 'salmaou9@ofppt-edu.ma'),
('STG0010', 'Mehdi EL10', 'DEV102', 1, 1, '/uploads/card_id/STG0010.png', '2026-05-13 16:14:09', '0638562932', 'AB730232', 'mehdiel10@ofppt-edu.ma'),
('STG0016', 'Walid CH16', 'AI101', 3, 1, '/uploads/card_id/STG0016.png', '2026-05-13 16:14:09', '0619108620', 'AB195715', 'walidch16@ofppt-edu.ma'),
('STG0017', 'Rania BEN17', 'AI101', 3, 1, '/uploads/card_id/STG0017.png', '2026-05-13 16:14:09', '0657240349', 'AB262323', 'raniaben17@ofppt-edu.ma'),
('STG0018', 'Younes CH18', 'AI101', 3, 1, '/uploads/card_id/STG0018.png', '2026-05-13 16:14:09', '0618119945', 'AB423148', 'younesch18@ofppt-edu.ma'),
('STG0019', 'Sara BEN19', 'AI101', 3, 1, '/uploads/card_id/STG0019.png', '2026-05-13 16:14:09', '0645598807', 'AB248011', 'saraben19@ofppt-edu.ma'),
('STG0020', 'Adil CH20', 'AI101', 3, 1, '/uploads/card_id/STG0020.png', '2026-05-13 16:14:09', '0628524239', 'AB465830', 'adilch20@ofppt-edu.ma'),
('STG0021', 'Nora OU21', 'GE101', 4, 1, '/uploads/card_id/STG0021.png', '2026-05-13 16:14:09', '0662697338', 'AB863211', 'noraou21@ofppt-edu.ma'),
('STG0022', 'Tarik BEN22', 'GE101', 4, 1, '/uploads/card_id/STG0022.png', '2026-05-13 16:14:09', '0645035003', 'AB989137', 'tarikben22@ofppt-edu.ma'),
('STG0023', 'Ghita CH23', 'GE101', 4, 1, '/uploads/card_id/STG0023.png', '2026-05-13 16:14:09', '0644831015', 'AB962402', 'ghitach23@ofppt-edu.ma'),
('STG0024', 'Ismail CH24', 'GE101', 4, 1, '/uploads/card_id/STG0024.png', '2026-05-13 16:14:09', '0643859661', 'AB236859', 'ismailch24@ofppt-edu.ma'),
('STG0025', 'Kenza OU25', 'GE101', 4, 1, '/uploads/card_id/STG0025.png', '2026-05-13 16:14:10', '0626214890', 'AB201564', 'kenzaou25@ofppt-edu.ma'),
('STG346554617', 'AEMAMRA OTMAN', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AEMAMRA_OTMAN.png', '2026-05-19 14:52:26', '0662223360', 'AB417427', 'aemamraotman@ofppt-edu.ma'),
('STG346810386', 'AEMAMRA  MUSTAPHA', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AEMAMRA__MUSTAPHA.png', '2026-05-19 14:52:26', '0694639595', 'AB516790', 'aemamramustapha@ofppt-edu.ma'),
('STG347064298', 'AERAKI MOHAMED', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AERAKI_MOHAMED.png', '2026-05-19 14:52:27', '0642601048', 'AB704743', 'aerakimohamed@ofppt-edu.ma'),
('STG347334099', 'AEGHMER KAWTAR', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AEGHMER_KAWTAR.png', '2026-05-19 14:52:27', '0640182133', 'AB739832', 'aeghmerkawtar@ofppt-edu.ma'),
('STG347615531', 'AEMAMRA KHALID', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AEMAMRA_KHALID.png', '2026-05-19 14:52:27', '0653981566', 'AB138277', 'aemamrakhalid@ofppt-edu.ma'),
('STG347878378', 'Aessila OUMNIA', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AESSILA_OUMNIA.png', '2026-05-19 14:52:27', '0658328666', 'AB778598', 'aessilaoumnia@ofppt-edu.ma'),
('STG348166830', 'AEBOUDOU-LLAH FATIHA', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AEBOUDOU-LLAH_FATIHA.png', '2026-05-19 14:52:28', '0649396258', 'AB550181', 'aeboudou-llahfatiha@ofppt-edu.ma'),
('STG348426462', 'AE109353 HAJAR', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AE109353_HAJAR.png', '2026-05-19 14:52:28', '0628602554', 'AB595975', 'ae109353hajar@ofppt-edu.ma'),
('STG348697836', 'AE324298 AE324298', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AE324298_AE324298.png', '2026-05-19 14:52:28', '0672534961', 'AB480874', 'ae324298ae324298@ofppt-edu.ma'),
('STG348941334', 'AELLAOUI WAFAA', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AELLAOUI_WAFAA.png', '2026-05-19 14:52:28', '0641847514', 'AB617628', 'aellaouiwafaa@ofppt-edu.ma'),
('STG349201739', 'AMZIL AZIZA', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AMZIL_AZIZA.png', '2026-05-19 14:52:29', '0684506292', 'AB335692', 'amzilaziza@ofppt-edu.ma'),
('STG349450751', 'AMEKRAZ YOUSSEF', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AMEKRAZ_YOUSSEF.png', '2026-05-19 14:52:29', '0614199988', 'AB647079', 'amekrazyoussef@ofppt-edu.ma'),
('STG349742503', 'AMANKAL ABDESSAMAD', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AMANKAL_ABDESSAMAD.png', '2026-05-19 14:52:29', '0666271537', 'AB880458', 'amankalabdessamad@ofppt-edu.ma'),
('STG349981127', 'amrah youssef', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AMRAH_YOUSSEF.png', '2026-05-19 14:52:29', '0694954544', 'AB836992', 'amrahyoussef@ofppt-edu.ma'),
('STG350256483', 'Amzil Nouhaila', 'AI101', 3, 1, '/uploads/Qr_Id/AI101/QR_AMZIL_NOUHAILA.png', '2026-05-19 14:52:30', '0667033811', 'AB255414', 'amzilnouhaila@ofppt-edu.ma'),
('STG745277605', 'AEMAMRA OTMAN', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AEMAMRA_OTMAN.png', '2026-05-19 14:42:25', '0669278342', 'AB112225', 'aemamraotman@ofppt-edu.ma'),
('STG745592551', 'AEMAMRA  MUSTAPHA', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AEMAMRA__MUSTAPHA.png', '2026-05-19 14:42:25', '0651981179', 'AB372725', 'aemamramustapha@ofppt-edu.ma'),
('STG745868509', 'AERAKI MOHAMED', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AERAKI_MOHAMED.png', '2026-05-19 14:42:25', '0637923233', 'AB259813', 'aerakimohamed@ofppt-edu.ma'),
('STG746182058', 'AEGHMER KAWTAR', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AEGHMER_KAWTAR.png', '2026-05-19 14:42:26', '0639088573', 'AB646809', 'aeghmerkawtar@ofppt-edu.ma'),
('STG746462359', 'AEMAMRA KHALID', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AEMAMRA_KHALID.png', '2026-05-19 14:42:26', '0631056635', 'AB831021', 'aemamrakhalid@ofppt-edu.ma'),
('STG746778617', 'Aessila OUMNIA', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AESSILA_OUMNIA.png', '2026-05-19 14:42:26', '0654645022', 'AB921951', 'aessilaoumnia@ofppt-edu.ma'),
('STG747073715', 'AEBOUDOU-LLAH FATIHA', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AEBOUDOU-LLAH_FATIHA.png', '2026-05-19 14:42:27', '0662765002', 'AB367592', 'aeboudou-llahfatiha@ofppt-edu.ma'),
('STG747391660', 'AE109353 HAJAR', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AE109353_HAJAR.png', '2026-05-19 14:42:27', '0621653290', 'AB864933', 'ae109353hajar@ofppt-edu.ma'),
('STG747702236', 'AE324298 AE324298', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AE324298_AE324298.png', '2026-05-19 14:42:27', '0626641342', 'AB637345', 'ae324298ae324298@ofppt-edu.ma'),
('STG747993391', 'AELLAOUI WAFAA', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AELLAOUI_WAFAA.png', '2026-05-19 14:42:27', '0661975314', 'AB843569', 'aellaouiwafaa@ofppt-edu.ma'),
('STG748368524', 'AMZIL AZIZA', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMZIL_AZIZA.png', '2026-05-19 14:42:28', '0669931919', 'AB991216', 'amzilaziza@ofppt-edu.ma'),
('STG748707976', 'AMEKRAZ YOUSSEF', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMEKRAZ_YOUSSEF.png', '2026-05-19 14:42:28', '0633437579', 'AB242652', 'amekrazyoussef@ofppt-edu.ma'),
('STG748996029', 'AMANKAL ABDESSAMAD', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMANKAL_ABDESSAMAD.png', '2026-05-19 14:42:28', '0698629842', 'AB717353', 'amankalabdessamad@ofppt-edu.ma'),
('STG749302048', 'amrah youssef', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMRAH_YOUSSEF.png', '2026-05-19 14:42:29', '0664669330', 'AB588517', 'amrahyoussef@ofppt-edu.ma'),
('STG749641832', 'Amzil Nouhaila', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMZIL_NOUHAILA.png', '2026-05-19 14:42:29', '0642704803', 'AB389725', 'amzilnouhaila@ofppt-edu.ma'),
('STG750071189', 'Amayod Ali', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMAYOD_ALI.png', '2026-05-19 14:42:30', '0689244435', 'AB105937', 'amayodali@ofppt-edu.ma'),
('STG750515513', 'Amdah  Lahcen', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMDAH__LAHCEN.png', '2026-05-19 14:42:30', '0616941582', 'AB678181', 'amdahlahcen@ofppt-edu.ma'),
('STG750960103', 'AMCHIKAK ISMAIL', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMCHIKAK_ISMAIL.png', '2026-05-19 14:42:30', '0667424572', 'AB606776', 'amchikakismail@ofppt-edu.ma'),
('STG751490446', 'AMARA WALID', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMARA_WALID.png', '2026-05-19 14:42:31', '0625845150', 'AB641687', 'amarawalid@ofppt-edu.ma'),
('STG752023508', 'Amine Mouad', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMINE_MOUAD.png', '2026-05-19 14:42:32', '0682855305', 'AB389260', 'aminemouad@ofppt-edu.ma'),
('STG752377578', 'Amrane Mustapha', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMRANE_MUSTAPHA.png', '2026-05-19 14:42:32', '0690579465', 'AB669389', 'amranemustapha@ofppt-edu.ma'),
('STG752724252', 'Amejkouk Karim', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AMEJKOUK_KARIM.png', '2026-05-19 14:42:32', '0617583212', 'AB488744', 'amejkoukkarim@ofppt-edu.ma'),
('STG753041896', 'AARRAD IBTISSAM', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AARRAD_IBTISSAM.png', '2026-05-19 14:42:33', '0673143229', 'AB254571', 'aarradibtissam@ofppt-edu.ma'),
('STG753346065', 'AABBARE ESSAADIA', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AABBARE_ESSAADIA.png', '2026-05-19 14:42:33', '0694463084', 'AB400937', 'aabbareessaadia@ofppt-edu.ma'),
('STG754215297', 'AALLAIOUANE LAILA', 'DEV101', 1, 1, '/uploads/Qr_Id/DEV101/QR_AALLAIOUANE_LAILA.png', '2026-05-19 14:42:34', '0670071646', 'AB452360', 'aallaiouanelaila@ofppt-edu.ma');

-- --------------------------------------------------------

--
-- Structure de la table `suiviedisipline`
--

CREATE TABLE `suiviedisipline` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `penalty_type` enum('Blâme 1','Blâme 2','Blâme 3') NOT NULL,
  `date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `active_checkins`
--
ALTER TABLE `active_checkins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `filiere`
--
ALTER TABLE `filiere`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `formateurs`
--
ALTER TABLE `formateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `filiereId` (`filiereId`);

--
-- Index pour la table `groups_supervisors`
--
ALTER TABLE `groups_supervisors`
  ADD PRIMARY KEY (`group_id`,`formateur_id`),
  ADD KEY `formateur_id` (`formateur_id`);

--
-- Index pour la table `group_salles`
--
ALTER TABLE `group_salles`
  ADD PRIMARY KEY (`group_id`,`salle_id`),
  ADD KEY `salle_id` (`salle_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `report_code` (`report_code`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `formateur_id` (`formateur_id`),
  ADD KEY `salleId` (`salleId`);

--
-- Index pour la table `report_attendance`
--
ALTER TABLE `report_attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Index pour la table `salles`
--
ALTER TABLE `salles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`);

--
-- Index pour la table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD PRIMARY KEY (`NumInscription`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `filiereId` (`filiereId`);

--
-- Index pour la table `suiviedisipline`
--
ALTER TABLE `suiviedisipline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `active_checkins`
--
ALTER TABLE `active_checkins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=401;

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `filiere`
--
ALTER TABLE `filiere`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `formateurs`
--
ALTER TABLE `formateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `report_attendance`
--
ALTER TABLE `report_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;

--
-- AUTO_INCREMENT pour la table `salles`
--
ALTER TABLE `salles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `suiviedisipline`
--
ALTER TABLE `suiviedisipline`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `active_checkins`
--
ALTER TABLE `active_checkins`
  ADD CONSTRAINT `active_checkins_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `stagiaires` (`NumInscription`) ON DELETE CASCADE,
  ADD CONSTRAINT `active_checkins_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`filiereId`) REFERENCES `filiere` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `groups_supervisors`
--
ALTER TABLE `groups_supervisors`
  ADD CONSTRAINT `groups_supervisors_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `groups_supervisors_ibfk_2` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `group_salles`
--
ALTER TABLE `group_salles`
  ADD CONSTRAINT `group_salles_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_salles_ibfk_2` FOREIGN KEY (`salle_id`) REFERENCES `salles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`salleId`) REFERENCES `salles` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `report_attendance`
--
ALTER TABLE `report_attendance`
  ADD CONSTRAINT `report_attendance_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `report_attendance_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `stagiaires` (`NumInscription`) ON DELETE CASCADE;

--
-- Contraintes pour la table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD CONSTRAINT `stagiaires_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stagiaires_ibfk_2` FOREIGN KEY (`filiereId`) REFERENCES `filiere` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `suiviedisipline`
--
ALTER TABLE `suiviedisipline`
  ADD CONSTRAINT `suiviedisipline_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `stagiaires` (`NumInscription`) ON DELETE CASCADE;
--
-- Base de données : `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Structure de la table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Structure de la table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Structure de la table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Structure de la table `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Structure de la table `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

-- --------------------------------------------------------

--
-- Structure de la table `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Structure de la table `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Structure de la table `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Structure de la table `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Structure de la table `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Déchargement des données de la table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"coachhelper\",\"table\":\"users\"},{\"db\":\"ofppt_attendance\",\"table\":\"reports\"},{\"db\":\"ofppt_attendance\",\"table\":\"report_attendance\"},{\"db\":\"ofppt_attendance\",\"table\":\"groups_supervisors\"},{\"db\":\"ofppt_attendance\",\"table\":\"group_salles\"},{\"db\":\"ofppt_attendance\",\"table\":\"stagiaires\"},{\"db\":\"husa_basketball\",\"table\":\"users\"},{\"db\":\"husa_basketball\",\"table\":\"news\"},{\"db\":\"husa_basketball\",\"table\":\"players\"},{\"db\":\"black_energie\",\"table\":\"products\"}]');

-- --------------------------------------------------------

--
-- Structure de la table `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Structure de la table `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Structure de la table `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Structure de la table `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Structure de la table `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

-- --------------------------------------------------------

--
-- Structure de la table `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Structure de la table `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Déchargement des données de la table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2026-06-09 14:22:02', '{\"Console\\/Mode\":\"collapse\",\"lang\":\"fr\"}');

-- --------------------------------------------------------

--
-- Structure de la table `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Structure de la table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Index pour la table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Index pour la table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Index pour la table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Index pour la table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Index pour la table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Index pour la table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Index pour la table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Index pour la table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Index pour la table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Index pour la table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Index pour la table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Index pour la table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Index pour la table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Index pour la table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Index pour la table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Index pour la table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Index pour la table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Base de données : `puzzel_db`
--
CREATE DATABASE IF NOT EXISTS `puzzel_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `puzzel_db`;

-- --------------------------------------------------------

--
-- Structure de la table `sticky_notes`
--
-- Erreur de lecture de structure pour la table puzzel_db.sticky_notes : #1932 - Table 'puzzel_db.sticky_notes' doesn't exist in engine
-- Erreur de lecture des données pour la table puzzel_db.sticky_notes : #1064 - Erreur de syntaxe près de 'FROM `puzzel_db`.`sticky_notes`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `users`
--
-- Erreur de lecture de structure pour la table puzzel_db.users : #1932 - Table 'puzzel_db.users' doesn't exist in engine
-- Erreur de lecture des données pour la table puzzel_db.users : #1064 - Erreur de syntaxe près de 'FROM `puzzel_db`.`users`' à la ligne 1
--
-- Base de données : `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
--
-- Base de données : `testphp`
--
CREATE DATABASE IF NOT EXISTS `testphp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `testphp`;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pass` varchar(25) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Base de données : `tradefury_test`
--
CREATE DATABASE IF NOT EXISTS `tradefury_test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tradefury_test`;

-- --------------------------------------------------------

--
-- Structure de la table `community_1111`
--
-- Erreur de lecture de structure pour la table tradefury_test.community_1111 : #1932 - Table 'tradefury_test.community_1111' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.community_1111 : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`community_1111`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `journal`
--
-- Erreur de lecture de structure pour la table tradefury_test.journal : #1932 - Table 'tradefury_test.journal' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.journal : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`journal`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `login`
--
-- Erreur de lecture de structure pour la table tradefury_test.login : #1932 - Table 'tradefury_test.login' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.login : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`login`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--
-- Erreur de lecture de structure pour la table tradefury_test.messages : #1932 - Table 'tradefury_test.messages' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.messages : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`messages`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--
-- Erreur de lecture de structure pour la table tradefury_test.notifications : #1932 - Table 'tradefury_test.notifications' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.notifications : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`notifications`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `online_status`
--
-- Erreur de lecture de structure pour la table tradefury_test.online_status : #1932 - Table 'tradefury_test.online_status' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.online_status : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`online_status`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `parties`
--
-- Erreur de lecture de structure pour la table tradefury_test.parties : #1932 - Table 'tradefury_test.parties' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.parties : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`parties`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `party_members`
--
-- Erreur de lecture de structure pour la table tradefury_test.party_members : #1932 - Table 'tradefury_test.party_members' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.party_members : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`party_members`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `users`
--
-- Erreur de lecture de structure pour la table tradefury_test.users : #1932 - Table 'tradefury_test.users' doesn't exist in engine
-- Erreur de lecture des données pour la table tradefury_test.users : #1064 - Erreur de syntaxe près de 'FROM `tradefury_test`.`users`' à la ligne 1
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
