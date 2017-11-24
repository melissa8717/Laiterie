-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mer 15 Novembre 2017 à 13:00
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `basewbat`
--

-- --------------------------------------------------------

--
-- Structure de la table `accept_right`
--

CREATE TABLE IF NOT EXISTS `accept_right` (
  `id_right` int(11) NOT NULL AUTO_INCREMENT,
  `date_accept` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `validate` tinyint(4) NOT NULL,
  PRIMARY KEY (`id_right`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `adresse`
--

CREATE TABLE IF NOT EXISTS `adresse` (
  `id_adresse` int(10) NOT NULL AUTO_INCREMENT,
  `id_contact` int(10) DEFAULT NULL,
  `id_chantier` int(10) DEFAULT NULL,
  `adresse` varchar(256) DEFAULT NULL,
  `complement_adr` varchar(100) DEFAULT NULL,
  `code_postal` varchar(5) DEFAULT NULL,
  `ville` varchar(100) NOT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `type_adr` varchar(100) DEFAULT NULL COMMENT 'pour définir perso pro etc....',
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_adresse`),
  KEY `id_contact` (`id_contact`),
  KEY `id_chantier` (`id_chantier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `agence`
--

CREATE TABLE IF NOT EXISTS `agence` (
  `id_agence` int(2) NOT NULL AUTO_INCREMENT,
  `id_contact` int(10) DEFAULT NULL,
  `logo` longblob,
  `villefact` varchar(256) DEFAULT NULL,
  `colorpied` varchar(30) DEFAULT NULL,
  `pied_page1` varchar(1000) DEFAULT NULL,
  `pied_page2` varchar(1000) DEFAULT NULL,
  `pied_page3` varchar(1000) DEFAULT NULL,
  `pied_page4` varchar(1000) DEFAULT NULL,
  `pied_page5` varchar(1000) DEFAULT NULL,
  `pied_page6` varchar(1000) DEFAULT NULL,
  `filigrane` blob,
  `responsable_a` varchar(150) DEFAULT NULL,
  `tel_a` varchar(15) DEFAULT NULL,
  `fax_a` varchar(20) DEFAULT NULL,
  `mail_a` varchar(50) DEFAULT NULL,
  `site_a` varchar(50) DEFAULT NULL,
  `siret_a` varchar(25) DEFAULT NULL,
  `adresse_a` varchar(100) DEFAULT NULL,
  `dep_a` varchar(10) DEFAULT NULL,
  `ville_a` varchar(200) DEFAULT NULL,
  `pays_a` varchar(75) DEFAULT NULL,
  `nom_a` varchar(70) DEFAULT NULL,
  `meteo` varchar(255) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_agence`),
  KEY `id_contact` (`id_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `alldevis`
--
CREATE TABLE IF NOT EXISTS `alldevis` (
`num_version` int(255)
,`accepted` tinyint(4)
,`id_devis` int(255)
,`envoye` tinyint(4)
,`date_version` timestamp
,`statut` varchar(30)
,`accompte` tinyint(4)
,`total` double
,`TS` tinyint(4)
,`factured` tinyint(4)
);
-- --------------------------------------------------------

--
-- Structure de la table `avoir`
--

CREATE TABLE IF NOT EXISTS `avoir` (
  `id_avoir` int(255) NOT NULL,
  `id_facture` int(255) NOT NULL,
  `n_situation` int(255) NOT NULL,
  `date_avoir` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_contact` int(255) DEFAULT NULL,
  `tva` int(255) NOT NULL,
  `autres` varchar(255) DEFAULT NULL,
  `users` int(255) DEFAULT NULL,
  `remise` float DEFAULT NULL,
  `pourremise` float DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_avoir`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `avoir_detail`
--

CREATE TABLE IF NOT EXISTS `avoir_detail` (
  `id_avoir` int(255) NOT NULL,
  `id_produit` int(255) NOT NULL,
  `num_version` int(255) NOT NULL,
  `pourcentage` float DEFAULT NULL,
  `prixfact` float DEFAULT NULL,
  `qtefact` float DEFAULT NULL,
  `prcrembour` float DEFAULT NULL,
  `prixrembour` float DEFAULT NULL,
  `autres` varchar(255) DEFAULT NULL,
  `users` int(255) DEFAULT NULL,
  `option` tinyint(4) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_avoir`,`id_produit`,`num_version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `bdc_detaille`
--

CREATE TABLE IF NOT EXISTS `bdc_detaille` (
  `id_bdc` int(10) NOT NULL,
  `id_produit` int(10) NOT NULL,
  `num_version` int(255) NOT NULL DEFAULT '1',
  `qte` float NOT NULL,
  `prix_prevu` float NOT NULL,
  `Qtelivre` float DEFAULT NULL,
  `Prixreel` float DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_bdc`,`id_produit`),
  KEY `id_bdc` (`id_bdc`,`id_produit`),
  KEY `id_produit` (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `bdc_imprevu`
--

CREATE TABLE IF NOT EXISTS `bdc_imprevu` (
  `id_imprevu` int(11) NOT NULL AUTO_INCREMENT,
  `id_bdc` int(255) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `libelle` varchar(255) NOT NULL,
  `unite` varchar(255) NOT NULL,
  `Prixreel` double NOT NULL,
  `Qtelivre` double NOT NULL,
  `id_produit` int(255) DEFAULT NULL,
  `num_version` int(255) NOT NULL DEFAULT '1',
  `user` int(255) DEFAULT NULL,
  `autre` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_imprevu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `bondecommandelist`
--
CREATE TABLE IF NOT EXISTS `bondecommandelist` (
`nom_chantier` varchar(100)
,`state` varchar(255)
,`Recu` tinyint(1)
,`tarifpourlivraisonreel` int(11)
,`tarifpourlivraison` float
,`livre` varchar(15)
,`id_chantier` int(10)
,`id_bdc` int(10)
,`id_devis` int(10)
,`adresselivraison` varchar(255)
,`id_fournisseur` int(10)
,`fournisseurNom` varchar(100)
,`date_livraison` timestamp
,`date_livraison_reel` timestamp
,`date_commande` timestamp
,`firstname` varchar(255)
,`lastname` varchar(255)
,`total` double
);
-- --------------------------------------------------------

--
-- Structure de la table `bon_de_commande`
--

CREATE TABLE IF NOT EXISTS `bon_de_commande` (
  `id_bdc` int(10) NOT NULL AUTO_INCREMENT,
  `id_devis` int(10) DEFAULT NULL,
  `id_version` int(10) DEFAULT NULL,
  `adresselivraison` varchar(255) DEFAULT NULL COMMENT 'correspond au lieu où il est livré si différent du chantier ou dépôt',
  `id_fournisseur` int(10) DEFAULT NULL,
  `date_livraison` timestamp NULL DEFAULT NULL,
  `date_livraison_reel` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_commande` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `livre` varchar(15) NOT NULL,
  `tarifpourlivraison` float DEFAULT NULL,
  `tarifpourlivraisonreel` int(11) NOT NULL,
  `id_user` int(255) NOT NULL,
  `id_chantier` int(255) DEFAULT NULL,
  `Recu` tinyint(1) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `factured` tinyint(4) DEFAULT NULL,
  `rappro` tinyint(4) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `nbdc` int(255) NOT NULL,
  `id_contact` int(11) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_bdc`),
  KEY `id_devis` (`id_devis`),
  KEY `id_version` (`id_version`),
  KEY `id_adresse` (`adresselivraison`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `caces`
--

CREATE TABLE IF NOT EXISTS `caces` (
  `id_caces` int(3) NOT NULL AUTO_INCREMENT,
  `caces` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_caces`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=23 ;

--
-- Contenu de la table `caces`
--

INSERT INTO `caces` (`id_caces`, `caces`, `description`, `user`, `autre`, `id_entreprise`) VALUES
(1, 'Engin de chantier CACES 1', 'Tracteur et petits engin de chantier mobile (mini-pelle, etc.)', 0, '', NULL),
(2, 'Engin de chantier CACES 2', 'Engin d’extraction et / ou de chargement (pelle hydraulique, Mécalac, etc.)', 0, '', NULL),
(3, 'Engin de chantier CACES 3', 'Engin d’extraction (tracteur à chenille, Pipe Layer, etc.)', 0, '', NULL),
(4, 'Engin de chantier CACES 4 ', 'Engin de chargement (tracto pelle, chargeuse, pelleteuse, etc.)', 0, '', NULL),
(5, 'Engin de chantier CACES 5', 'Engin de finition  (Machine à coffrage, répandeur, gravillonneur, etc.)', 0, '', NULL),
(6, 'Engin de chantier CACES 6', 'Engin de réglage (Niveleuse, etc.)', 0, '', NULL),
(7, 'Engin de chantier CACES 7', 'Engin de compactage (Compacteur)', 0, '', NULL),
(8, 'Engin de chantier CACES 8 ', 'Engin de transport ou d’extraction transport (Tracteur, décapeuse, etc.)', 0, '', NULL),
(9, 'Engin de chantier CACES 9', 'Engin de manutention (Chariot élévateur, chariot télescopique, Manitou, etc.)', 0, '', NULL),
(10, 'Engin de chantier CACES 10', 'Ce CACES vous permet de déplacer ou transporter tous les engins de chantier mais HORS PRODUCTION', 0, '', NULL),
(11, 'nacelle catégorie 1 (type 1)', 'Le véhicule est immobile au sol (on parle d’une exploitation statique)', 0, '', NULL),
(12, 'nacelle catégorie 3 (type 3)', 'Le véhicule est mobile (on parle de véhicule automoteur)', 0, '', NULL),
(13, 'CACES Nacelle 1A', 'Nacelles à mât vertical, Toucan, nacelle tractable', 0, '', NULL),
(14, 'CACES Nacelle 1B', 'Nacelle sur porteur VL et fourgon (Camion nacelle)', 0, '', NULL),
(15, 'CACES Nacelle 3A', 'Plate-forme à ciseaux, nacelle à mât vertical, nacelle Toucan, plate-forme automotrice', 0, '', NULL),
(16, 'CACES Nacelle 3B', 'Nacelle à flèche télescopique, nacelle articulée, plates-formes automotrices', 0, '', NULL),
(17, 'Cariste CACES 1', ' Transpalette électrique', 0, '', NULL),
(18, 'Cariste CACES 2', 'Chariot tracteur, tracteur électrique, tracteur de remorquage', 0, '', NULL),
(19, 'Cariste CACES 3', 'Chariot élévateur (à gaz ou électrique)', 0, '', NULL),
(20, 'Cariste CACES 4', 'Chariot élévateur', 0, '', NULL),
(21, 'Cariste CACES 5', ' Chariot élévateur à mât rétractable (à gaz ou électrique), chariot téléscopique, Gerbeur', 0, '', NULL),
(22, 'Cariste CACES 6', 'Ce caces permet de déplacer tous les véhicules sans les utiliser dans le cadre de la production.', 0, '', NULL);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `cacesalert`
--
CREATE TABLE IF NOT EXISTS `cacesalert` (
`date` timestamp
,`caces` varchar(100)
,`nom` varchar(100)
,`prenom` varchar(100)
);
-- --------------------------------------------------------

--
-- Structure de la table `cacescontact`
--

CREATE TABLE IF NOT EXISTS `cacescontact` (
  `id_cacon` int(255) NOT NULL AUTO_INCREMENT,
  `id_contact` int(255) NOT NULL,
  `id_caces` int(11) NOT NULL,
  `date_debut` timestamp NULL DEFAULT NULL,
  `date_fin` timestamp NULL DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_cacon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `cat_unite`
--

CREATE TABLE IF NOT EXISTS `cat_unite` (
  `id_unite` int(255) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) NOT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autres` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_unite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `cgv`
--

CREATE TABLE IF NOT EXISTS `cgv` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `texte` text NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `choix` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

INSERT INTO `cgv` (`id`, `texte`, `user`, `autre`, `choix`, `id_entreprise`) VALUES
(1, 'texte', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `chantier`
--

CREATE TABLE IF NOT EXISTS `chantier` (
  `id_chantier` int(10) NOT NULL AUTO_INCREMENT,
  `nom_chantier` varchar(100) NOT NULL,
  `id_contact` int(10) DEFAULT NULL,
  `id_devis` int(250) DEFAULT NULL,
  `num_version` int(255) DEFAULT NULL,
  `date_demarrage` timestamp NULL DEFAULT NULL,
  `reception_chantier` timestamp NULL DEFAULT NULL,
  `id_responsable` int(10) DEFAULT NULL COMMENT 'correspond à un id_contact',
  `retenuegarantie` varchar(3) DEFAULT NULL,
  `pourcentage` float DEFAULT NULL,
  `caution` varchar(3) DEFAULT NULL,
  `banque` varchar(150) DEFAULT NULL,
  `montant` float DEFAULT NULL,
  `maitreoeuvre` varchar(50) DEFAULT NULL,
  `telmaitre` varchar(15) DEFAULT NULL,
  `architecte` varchar(50) DEFAULT NULL,
  `telarchi` varchar(15) DEFAULT NULL,
  `autrecontact` varchar(50) DEFAULT NULL,
  `telautre` varchar(15) DEFAULT NULL,
  `telresponsable` varchar(15) DEFAULT NULL,
  `telresponsablemob` varchar(15) DEFAULT NULL,
  `responsable` varchar(50) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_chantier`),
  KEY `id_contact` (`id_contact`),
  KEY `id_responsable` (`id_responsable`),
  KEY `id_devis` (`id_devis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `chantierdevis`
--

CREATE TABLE IF NOT EXISTS `chantierdevis` (
  `id_chantier` int(255) NOT NULL,
  `id_devis` int(255) NOT NULL,
  `num_version` int(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `date_demarrage` timestamp NULL DEFAULT NULL,
  `reception_chantier` timestamp NULL DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_contact` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_chantier`,`id_devis`,`num_version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `chantierdevisencours`
--
CREATE TABLE IF NOT EXISTS `chantierdevisencours` (
`num_version` int(255)
,`accepted` tinyint(1)
,`id_devis` int(255)
,`envoye` tinyint(1)
,`date_version` timestamp
,`statut` varchar(30)
,`accompte` tinyint(1)
,`total` double
,`TS` tinyint(1)
,`factured` tinyint(1)
,`status` varchar(255)
,`id_chantier` int(255)
);
-- --------------------------------------------------------

--
-- Structure de la table `chantier_ged`
--

CREATE TABLE IF NOT EXISTS `chantier_ged` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `id_chantier` int(255) NOT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `commentaire`
--

CREATE TABLE IF NOT EXISTS `commentaire` (
  `id_com` int(15) NOT NULL AUTO_INCREMENT,
  `id_message` int(15) NOT NULL,
  `date_com` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `contenu` text NOT NULL,
  `id_user` int(255) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_com`),
  KEY `id_message` (`id_message`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `contact`
--

CREATE TABLE IF NOT EXISTS `contact` (
  `id_contact` int(255) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `titre` varchar(5) DEFAULT NULL COMMENT 'Mr,Mme,Mlle',
  `Date_naissance` timestamp NULL DEFAULT NULL,
  `lieu_naissance` varchar(100) DEFAULT NULL,
  `n_identite` varchar(30) DEFAULT NULL,
  `n_secu` int(255) DEFAULT NULL,
  `n_permis` varchar(30) DEFAULT NULL,
  `raison_sociale` varchar(100) DEFAULT NULL,
  `siret` varchar(255) DEFAULT NULL,
  `APE` varchar(5) DEFAULT NULL,
  `id_caces` tinyint(1) DEFAULT NULL,
  `poste` varchar(100) DEFAULT NULL,
  `chef_equipe` tinyint(1) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `autorisation_conduite` varchar(30) DEFAULT NULL,
  `H0B0` timestamp NULL DEFAULT NULL COMMENT 'habilitation electrique',
  `date_entree` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_sortie` timestamp NULL DEFAULT NULL,
  `secourisme` timestamp NULL DEFAULT NULL,
  `validite_amiante` timestamp NULL DEFAULT NULL,
  `travail_hauteur` timestamp NULL DEFAULT NULL,
  `visite_medicale` timestamp NULL DEFAULT NULL,
  `note` text,
  `contrat` varchar(50) DEFAULT NULL,
  `mutuelle` varchar(100) DEFAULT NULL,
  `site` varchar(512) DEFAULT NULL,
  `heuremois` float DEFAULT NULL,
  `condition_reg` varchar(255) DEFAULT NULL,
  `n_reg` varchar(255) DEFAULT NULL,
  `condition_generale` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `fonction` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `TVAintra` varchar(30) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `code_postal` varchar(255) DEFAULT NULL,
  `equipe` int(255) DEFAULT NULL,
  PRIMARY KEY (`id_contact`),
  KEY `id_caces` (`id_caces`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `contact_ged`
--

CREATE TABLE IF NOT EXISTS `contact_ged` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `id_contact` int(255) NOT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `contact_validite`
--

CREATE TABLE IF NOT EXISTS `contact_validite` (
  `id_validite` int(255) NOT NULL AUTO_INCREMENT,
  `designation` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autres` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_validite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `contrat_histo`
--

CREATE TABLE IF NOT EXISTS `contrat_histo` (
  `id_contrat` int(10) NOT NULL AUTO_INCREMENT,
  `id_contact` int(10) NOT NULL,
  `date_debut` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_fin` timestamp NULL DEFAULT NULL,
  `type_contrat` varchar(50) NOT NULL,
  `tauxhoraire` float DEFAULT NULL,
  `tauxhorairesbrute` float DEFAULT NULL,
  `tauxsurcharge` float DEFAULT NULL,
  `panier` float DEFAULT NULL,
  `heure_mois` varchar(255) DEFAULT NULL,
  `datechangement` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `agence_interim` varchar(255) DEFAULT NULL,
  `id_interim` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_contrat`),
  KEY `id_contact` (`id_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `demandeprix`
--

CREATE TABLE IF NOT EXISTS `demandeprix` (
  `id_demande` int(255) NOT NULL AUTO_INCREMENT,
  `nom_fournisseur` varchar(255) DEFAULT NULL,
  `chantier` varchar(255) DEFAULT NULL,
  `date_demande` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_demande`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `demande_detail`
--

CREATE TABLE IF NOT EXISTS `demande_detail` (
  `id_demande` int(255) NOT NULL,
  `id_produit` int(255) NOT NULL AUTO_INCREMENT,
  `nom_produit` varchar(255) DEFAULT NULL,
  `unite` varchar(255) DEFAULT NULL,
  `qte` float DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `dept`
--

CREATE TABLE IF NOT EXISTS `dept` (
  `DEPTNO` int(2) NOT NULL,
  `DNAME` varchar(10) DEFAULT NULL,
  `LOC` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`DEPTNO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `devis`
--

CREATE TABLE IF NOT EXISTS `devis` (
  `id_devis` int(10) NOT NULL AUTO_INCREMENT,
  `id_chantier` int(10) DEFAULT NULL,
  `id_contact` int(10) NOT NULL,
  `nom_chantier` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `cp` int(25) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `TS` tinyint(1) DEFAULT NULL,
  `number_version` int(255) NOT NULL,
  `valide` tinyint(1) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `libre` tinyint(4) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  `tva` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_devis`),
  KEY `id_chantier` (`id_chantier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `devisfrais`
--
CREATE TABLE IF NOT EXISTS `devisfrais` (
`num_version` int(255)
,`accepted` tinyint(1)
,`id_devis` int(255)
,`envoye` tinyint(1)
,`date_version` timestamp
,`statut` varchar(30)
,`accompte` tinyint(1)
,`total` double
,`TS` tinyint(1)
,`date_demarrage` timestamp
,`reception_chantier` timestamp
,`status` varchar(255)
,`id_chantier` int(255)
,`devismois` int(2)
,`devisannee` int(4)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `devislist`
--
CREATE TABLE IF NOT EXISTS `devislist` (
`num_version` int(255)
,`accepted` tinyint(1)
,`id_devis` int(255)
,`envoye` tinyint(1)
,`date_version` timestamp
,`statut` varchar(30)
,`accompte` tinyint(1)
,`total` double
,`TS` tinyint(1)
,`factured` tinyint(1)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `devislistlibre`
--
CREATE TABLE IF NOT EXISTS `devislistlibre` (
`num_version` int(255)
,`accepted` tinyint(1)
,`id_devis` int(255)
,`envoye` tinyint(1)
,`date_version` timestamp
,`statut` varchar(30)
,`accompte` tinyint(1)
,`total` double
,`TS` tinyint(1)
,`factured` tinyint(1)
);
-- --------------------------------------------------------

--
-- Structure de la table `devis_detaille`
--

CREATE TABLE IF NOT EXISTS `devis_detaille` (
  `num_version` int(5) NOT NULL,
  `id_devis` int(255) NOT NULL,
  `id_produit` int(10) NOT NULL,
  `produit_version` int(255) NOT NULL DEFAULT '1',
  `qte_devis` int(255) NOT NULL,
  `prix_devis` float NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_devis_libre` int(11) NOT NULL,
  `commentaire` varchar(512) DEFAULT NULL,
  `reference` int(11) NOT NULL,
  `reference_autre` varchar(255) DEFAULT NULL,
  `margedev` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  `tva` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`num_version`,`id_devis`,`id_produit`,`produit_version`),
  KEY `id_devis` (`num_version`,`id_produit`),
  KEY `id_version` (`num_version`),
  KEY `id_produit` (`id_produit`),
  KEY `devis_detaille_ibfk_4` (`id_devis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `devis_detaille_libre`
--

CREATE TABLE IF NOT EXISTS `devis_detaille_libre` (
  `id_devis` int(255) NOT NULL,
  `num_version` int(255) NOT NULL,
  `id_produit` int(255) NOT NULL AUTO_INCREMENT,
  `produit` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `qte_devis` int(255) NOT NULL,
  `prix_devis` float NOT NULL,
  `accepted` tinyint(4) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_devis_libre` int(11) DEFAULT NULL,
  `commentaire` varchar(255) DEFAULT NULL,
  `reference` int(255) DEFAULT NULL,
  `reference_autre` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `margedev` int(255) DEFAULT NULL,
  `unite` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  `tva` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_produit`),
  KEY `num_version` (`num_version`,`id_devis`),
  KEY `id_devis` (`id_devis`),
  KEY `num_version_2` (`num_version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `devis_ged`
--

CREATE TABLE IF NOT EXISTS `devis_ged` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `id_devis` int(255) DEFAULT NULL,
  `date_ajout` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `devis_option`
--

CREATE TABLE IF NOT EXISTS `devis_option` (
  `id_devis` int(255) NOT NULL,
  `num_version` int(255) NOT NULL,
  `id_produit` int(255) NOT NULL,
  `produit_version` int(255) NOT NULL DEFAULT '1',
  `qte_devis` int(255) NOT NULL,
  `prix_devis` float NOT NULL,
  `accepted` tinyint(1) NOT NULL DEFAULT '0',
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_devis_libre` int(11) NOT NULL,
  `commentaire` varchar(512) DEFAULT NULL,
  `reference` int(255) NOT NULL,
  `reference_autre` varchar(255) DEFAULT NULL,
  `margedev` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  `tva` int(30) DEFAULT NULL,
  PRIMARY KEY (`id_devis`,`num_version`,`id_produit`,`produit_version`),
  KEY `id_produit` (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `devis_option_libre`
--

CREATE TABLE IF NOT EXISTS `devis_option_libre` (
  `id_devis` int(255) NOT NULL,
  `num_version` int(255) NOT NULL,
  `id_produit` int(255) NOT NULL AUTO_INCREMENT,
  `produit` varchar(255) DEFAULT NULL,
  `qte_devis` int(255) NOT NULL,
  `prix_devis` float NOT NULL,
  `accepted` tinyint(4) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_devis_libre` int(255) NOT NULL,
  `commentaire` varchar(255) DEFAULT NULL,
  `reference` int(255) DEFAULT NULL,
  `reference_autre` varchar(255) DEFAULT NULL,
  `margedev` int(255) DEFAULT NULL,
  `unite` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  `tva` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `devis_version`
--

CREATE TABLE IF NOT EXISTS `devis_version` (
  `num_version` int(255) NOT NULL,
  `tva` float NOT NULL,
  `accepted` tinyint(1) DEFAULT NULL,
  `id_devis` int(255) NOT NULL,
  `date_version` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `statut` varchar(30) NOT NULL,
  `accompte` tinyint(1) DEFAULT NULL,
  `accompte_value` float DEFAULT '0',
  `accompte_percent` float DEFAULT '0',
  `remise` float DEFAULT NULL,
  `factured` tinyint(1) NOT NULL DEFAULT '0',
  `envoye` tinyint(1) NOT NULL DEFAULT '0',
  `montantht` float DEFAULT NULL,
  `offre` tinyint(4) DEFAULT NULL,
  `designation` varchar(256) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_devis_libre` int(11) NOT NULL,
  `libre` tinyint(4) DEFAULT NULL,
  `acompte` tinyint(4) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`num_version`,`id_devis`),
  KEY `id_devis` (`id_devis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `emp`
--

CREATE TABLE IF NOT EXISTS `emp` (
  `EMPNO` int(4) NOT NULL,
  `ENAME` varchar(6) DEFAULT NULL,
  `JOB` varchar(9) DEFAULT NULL,
  `MGR` int(4) DEFAULT NULL,
  `HIREDATE` date DEFAULT NULL,
  `SAL` decimal(6,2) DEFAULT NULL,
  `COMM` decimal(6,0) DEFAULT NULL,
  `DEPTNO` int(2) NOT NULL,
  PRIMARY KEY (`EMPNO`),
  KEY `DEPTNO` (`DEPTNO`),
  KEY `MGR` (`MGR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `entretien`
--

CREATE TABLE IF NOT EXISTS `entretien` (
  `id_entretien` int(15) NOT NULL AUTO_INCREMENT,
  `id_vehmat` int(10) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `motif` varchar(256) NOT NULL,
  `tarif` float DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_entretien`),
  KEY `id_vehmat` (`id_vehmat`),
  KEY `id_vehmat_2` (`id_vehmat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `equipe`
--

CREATE TABLE IF NOT EXISTS `equipe` (
  `id_equipe` int(255) NOT NULL AUTO_INCREMENT,
  `couleur` varchar(255) DEFAULT NULL,
  `n_equipe` int(255) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_equipe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `equipement`
--

CREATE TABLE IF NOT EXISTS `equipement` (
  `id_equipement` int(255) NOT NULL AUTO_INCREMENT,
  `id_contact` int(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `nbre` int(255) DEFAULT NULL,
  `taille` varchar(255) DEFAULT NULL,
  `commentaire` varchar(255) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autres` varchar(255) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_equipement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

CREATE TABLE IF NOT EXISTS `event` (
  `start` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` timestamp NULL DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `primaire` varchar(255) NOT NULL,
  `secondary` varchar(255) NOT NULL,
  `id_contact` int(11) NOT NULL,
  `id_chantier` int(11) DEFAULT NULL,
  `id_event` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(255) DEFAULT NULL,
  `autre` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_event`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

CREATE TABLE IF NOT EXISTS `facture` (
  `id_facture` int(10) NOT NULL AUTO_INCREMENT,
  `id_contact` int(255) DEFAULT NULL,
  `libre` tinyint(4) DEFAULT NULL,
  `n_situation` int(255) NOT NULL,
  `id_devis` int(10) DEFAULT NULL,
  `id_version` int(11) DEFAULT NULL,
  `date_fact` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_echeance` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `montant_ht` float DEFAULT NULL,
  `avoir` tinyint(1) DEFAULT NULL,
  `stade_avancement` varchar(100) DEFAULT NULL,
  `statut` varchar(30) DEFAULT NULL,
  `remise` float DEFAULT NULL,
  `nfactclient` int(255) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `factured` tinyint(4) DEFAULT NULL,
  `acompte` tinyint(4) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_facture`,`n_situation`),
  KEY `id_devis` (`id_devis`),
  KEY `id_version` (`id_version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `factureannee`
--
CREATE TABLE IF NOT EXISTS `factureannee` (
`SUM( montant_ht )` double
,`datefact` int(4)
,`dateecheance` int(4)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `facturechantiercours`
--
CREATE TABLE IF NOT EXISTS `facturechantiercours` (
`montantfact` double
,`id_devis` int(10)
);
-- --------------------------------------------------------

--
-- Structure de la table `facture_fournisseur`
--

CREATE TABLE IF NOT EXISTS `facture_fournisseur` (
  `id_factfour` int(10) NOT NULL AUTO_INCREMENT,
  `id_contact` int(10) NOT NULL COMMENT '= id fournisseur',
  `datefourn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `n_facture` varchar(255) NOT NULL,
  `montantfact` float DEFAULT NULL,
  `rappro` tinyint(4) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_factfour`,`id_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `facture_librebase`
--

CREATE TABLE IF NOT EXISTS `facture_librebase` (
  `id_fact` int(255) NOT NULL,
  `n_situation` int(255) NOT NULL,
  `id_prod` int(255) NOT NULL,
  `num_version` int(255) DEFAULT NULL,
  `prix_fact` float NOT NULL,
  `qte_fact` float NOT NULL,
  `pourcent` float DEFAULT NULL,
  `tva` float DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_fact`,`n_situation`,`id_prod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `facture_libredetail`
--

CREATE TABLE IF NOT EXISTS `facture_libredetail` (
  `id_fact` int(255) NOT NULL,
  `n_situation` int(255) NOT NULL,
  `id_prod` int(255) NOT NULL AUTO_INCREMENT,
  `nom_produit` varchar(255) DEFAULT NULL,
  `qteprod` float NOT NULL,
  `prix_prod` float NOT NULL,
  `pourcent` float DEFAULT NULL,
  `unite` varchar(255) DEFAULT NULL,
  `tva` float DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_prod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `fact_ged`
--

CREATE TABLE IF NOT EXISTS `fact_ged` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `id_facture` int(255) DEFAULT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `n_situation` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `formation`
--

CREATE TABLE IF NOT EXISTS `formation` (
  `id_formation` int(255) NOT NULL AUTO_INCREMENT,
  `designation` varchar(255) NOT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_formation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `formationalert`
--
CREATE TABLE IF NOT EXISTS `formationalert` (
`DATE` timestamp
,`designation` varchar(255)
,`nom` varchar(100)
,`prenom` varchar(100)
);
-- --------------------------------------------------------

--
-- Structure de la table `formationcontact`
--

CREATE TABLE IF NOT EXISTS `formationcontact` (
  `id_formationcontact` int(255) NOT NULL AUTO_INCREMENT,
  `id_contact` int(255) NOT NULL,
  `nom_formation` varchar(255) NOT NULL,
  `datefor` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_formation` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_formationcontact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `fournisseur_bdc`
--

CREATE TABLE IF NOT EXISTS `fournisseur_bdc` (
  `id_factfour` int(10) NOT NULL,
  `id_bdc` int(255) NOT NULL,
  `montantbdc` float NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) NOT NULL,
  PRIMARY KEY (`id_factfour`,`id_bdc`),
  KEY `id_factfour` (`id_factfour`,`id_bdc`),
  KEY `id_factfour_2` (`id_factfour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `fraisgeneraux`
--

CREATE TABLE IF NOT EXISTS `fraisgeneraux` (
  `id_frais` int(255) NOT NULL AUTO_INCREMENT,
  `designation` varchar(150) NOT NULL,
  `categorie` varchar(255) DEFAULT NULL,
  `pourcentage` float DEFAULT NULL,
  `valeur` float DEFAULT NULL,
  `date_debut` timestamp NULL DEFAULT NULL,
  `date_fin` timestamp NULL DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_frais`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `fraismoisannee`
--
CREATE TABLE IF NOT EXISTS `fraismoisannee` (
`mois` int(2)
,`annee` int(4)
,`somme` double
);
-- --------------------------------------------------------

--
-- Structure de la table `fraispourcentage`
--

CREATE TABLE IF NOT EXISTS `fraispourcentage` (
  `id_fraispour` int(255) NOT NULL AUTO_INCREMENT,
  `taux` float NOT NULL,
  `datepour_debut` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datepour_fin` timestamp NULL DEFAULT NULL,
  `autrespour` varchar(255) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) NOT NULL,
  PRIMARY KEY (`id_fraispour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `fraisprevisionnel`
--

CREATE TABLE IF NOT EXISTS `fraisprevisionnel` (
  `id_fraisprev` int(255) NOT NULL AUTO_INCREMENT,
  `montantprev` float NOT NULL,
  `dateprev` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_fraisprev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `gantt`
--

CREATE TABLE IF NOT EXISTS `gantt` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `start_date` varchar(255) NOT NULL,
  `text` varchar(255) DEFAULT NULL,
  `progress` float DEFAULT NULL,
  `duration` int(255) DEFAULT NULL,
  `parent` int(255) DEFAULT NULL,
  `id_chantier` int(255) NOT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `gantt_lien`
--

CREATE TABLE IF NOT EXISTS `gantt_lien` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `source` int(255) NOT NULL,
  `target` int(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `ged`
--

CREATE TABLE IF NOT EXISTS `ged` (
  `id_GED` int(10) NOT NULL AUTO_INCREMENT,
  `id_contact` int(10) DEFAULT NULL,
  `id_produit` int(10) DEFAULT NULL,
  `id_rapport` int(10) DEFAULT NULL,
  `adresse_GED` varchar(256) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_GED`),
  KEY `id_contact` (`id_contact`),
  KEY `id_produit` (`id_produit`),
  KEY `id_rapport` (`id_rapport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `geolocalisation`
--

CREATE TABLE IF NOT EXISTS `geolocalisation` (
  `id_geoloc` int(15) NOT NULL AUTO_INCREMENT,
  `id_vehmat` int(10) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_conducteur` int(10) NOT NULL COMMENT 'correspond à idcontact d''un employé',
  `pdi` varchar(256) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_geoloc`),
  KEY `id_vehmat` (`id_vehmat`,`id_conducteur`),
  KEY `id_vehmat_2` (`id_vehmat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `heuremois`
--
CREATE TABLE IF NOT EXISTS `heuremois` (
`id_travail` int(11)
,`nb_heure` time
,`date` timestamp
,`id_employé` int(11)
,`id_chantier` int(11)
,`valid` tinyint(1)
,`type` varchar(255)
,`user` int(255)
,`autres` varchar(255)
,`nom` varchar(100)
,`prenom` varchar(100)
,`temps` time
,`mois` int(2)
,`annee` int(4)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `heuresemaine`
--
CREATE TABLE IF NOT EXISTS `heuresemaine` (
`id_employé` int(11)
,`temps` time
,`semaine` int(2)
,`annee` int(4)
,`mois` int(2)
,`id_chantier` int(11)
,`nom` varchar(100)
,`prenom` varchar(100)
,`sumse` decimal(31,0)
,`somme` bigint(21)
,`type_contrat` varchar(50)
,`tauxhorairesbrute` float
,`tauxsurcharge` float
,`panier` float
,`heure_mois` varchar(255)
,`nom_chantier` varchar(100)
);
-- --------------------------------------------------------

--
-- Structure de la table `histo_tauxhoraire`
--

CREATE TABLE IF NOT EXISTS `histo_tauxhoraire` (
  `id_contact` int(10) NOT NULL,
  `date_histo` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `taux_horaire` float NOT NULL,
  `salaire_charge` float NOT NULL,
  `panier` float NOT NULL,
  `hbrute` float NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_contact`,`date_histo`),
  KEY `id_contact` (`id_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `listbdc`
--
CREATE TABLE IF NOT EXISTS `listbdc` (
`id_bdc` int(10)
,`annee` int(4)
,`somme` double
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `listchantierdevismois`
--
CREATE TABLE IF NOT EXISTS `listchantierdevismois` (
`id_devis` int(255)
,`num_version` int(255)
,`id_chantier` int(255)
,`nom_chantier` varchar(100)
,`responsable` varchar(50)
,`sumdet` double(19,2)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `listchantierdevisoption`
--
CREATE TABLE IF NOT EXISTS `listchantierdevisoption` (
`num_version` int(255)
,`id_chantier` int(255)
,`nom_chantier` varchar(100)
,`sumopt` double(19,2)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `listchantierfacturemois`
--
CREATE TABLE IF NOT EXISTS `listchantierfacturemois` (
`id_chantier` int(255)
,`montantht` double(19,2)
,`id_devis` int(255)
,`num_version` int(255)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `listecontacts`
--
CREATE TABLE IF NOT EXISTS `listecontacts` (
`id_contact` int(255)
,`nom` varchar(100)
,`prenom` varchar(100)
,`type` varchar(255)
,`mailPerso` varchar(150)
,`mailPro` varchar(150)
,`telFixe` varchar(30)
,`telMobile` varchar(30)
,`telPro` varchar(30)
,`adresse` varchar(256)
,`code_postal` varchar(5)
,`ville` varchar(100)
,`raison_sociale` varchar(100)
,`cadresse` varchar(255)
,`ccp` varchar(255)
,`cville` varchar(255)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `listgenerauxmois`
--
CREATE TABLE IF NOT EXISTS `listgenerauxmois` (
`categorie` varchar(255)
,`date_debut` timestamp
,`sum` double(19,2)
,`mois` int(2)
);
-- --------------------------------------------------------

--
-- Structure de la table `mail`
--

CREATE TABLE IF NOT EXISTS `mail` (
  `id_mail` int(10) NOT NULL AUTO_INCREMENT,
  `id_contact` int(10) NOT NULL,
  `mail` varchar(150) NOT NULL,
  `type_mail` varchar(100) NOT NULL,
  PRIMARY KEY (`id_mail`),
  KEY `id_contact` (`id_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE IF NOT EXISTS `message` (
  `id_message` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(150) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `contenu` text NOT NULL,
  `id_user` int(10) NOT NULL,
  `destinataire` int(10) NOT NULL,
  `id_chantier` int(255) DEFAULT NULL,
  `traite` tinyint(1) DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_message`),
  KEY `id_contact` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `ouvrier_equipe`
--

CREATE TABLE IF NOT EXISTS `ouvrier_equipe` (
  `id_contact` int(255) NOT NULL,
  `id_equipe` int(255) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_contact`),
  KEY `id_contact` (`id_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `param_ged`
--

CREATE TABLE IF NOT EXISTS `param_ged` (
  `id_param_ged` int(255) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `id_agence` int(255) DEFAULT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_param_ged`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `phase`
--

CREATE TABLE IF NOT EXISTS `phase` (
  `id_phase` int(10) NOT NULL AUTO_INCREMENT,
  `id_chantier` int(10) NOT NULL,
  `nom_phase` varchar(100) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_phase`),
  KEY `id_chantier` (`id_chantier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `photo`
--

CREATE TABLE IF NOT EXISTS `photo` (
  `photo` int(20) NOT NULL AUTO_INCREMENT,
  `id_contact` int(10) DEFAULT NULL,
  `id_produit` int(10) DEFAULT NULL,
  `adresse_photo` varchar(256) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`photo`),
  KEY `id_contact` (`id_contact`),
  KEY `id_produit` (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `prime`
--

CREATE TABLE IF NOT EXISTS `prime` (
  `id_prime` int(255) NOT NULL AUTO_INCREMENT,
  `id_contact` int(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valeurprime` float DEFAULT NULL,
  `chargeprime` float DEFAULT NULL,
  `raison` varchar(255) DEFAULT NULL,
  `primesau` varchar(255) DEFAULT NULL,
  `user` int(255) NOT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_prime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

CREATE TABLE IF NOT EXISTS `produit` (
  `id_produit` int(10) NOT NULL AUTO_INCREMENT,
  `num_version` int(11) NOT NULL DEFAULT '1',
  `date_ajout` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_user` int(255) NOT NULL DEFAULT '3',
  `type` smallint(1) NOT NULL DEFAULT '0' COMMENT 'indique si c''est produit achat (0) ou main d''oeuvre (1)',
  `image` varchar(256) DEFAULT NULL,
  `id_cat` int(3) DEFAULT NULL,
  `id_contact` int(10) DEFAULT NULL COMMENT 'fournisseur',
  `libelle` varchar(100) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `unite` varchar(10) DEFAULT NULL COMMENT 'm,tonne kilo,m², etc',
  `prix_achat` float NOT NULL,
  `marge` float NOT NULL,
  `id_tva` int(5) DEFAULT NULL,
  `prix_vente` float DEFAULT NULL,
  `tarif_du` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `description` text,
  `note` text,
  `stock` float DEFAULT NULL,
  `stockmini` float DEFAULT NULL,
  `stockmaxi` float DEFAULT NULL,
  `taux_horaire` float DEFAULT NULL,
  `heure_brute` float DEFAULT NULL,
  `salaire_charge` float NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  `ntva` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_produit`,`num_version`),
  KEY `id_contact` (`id_contact`),
  KEY `id_tva` (`id_tva`),
  KEY `id_cat` (`id_cat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `produit_categorie`
--

CREATE TABLE IF NOT EXISTS `produit_categorie` (
  `id_cat` int(3) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(100) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_cat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `produit_compose`
--

CREATE TABLE IF NOT EXISTS `produit_compose` (
  `id_prc` int(10) NOT NULL,
  `num_version` int(11) NOT NULL DEFAULT '1',
  `id_produit` int(10) NOT NULL,
  `achat_version` int(11) NOT NULL DEFAULT '1',
  `quantite` varchar(20) NOT NULL,
  `prix_achat` float DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_prc`,`id_produit`,`num_version`),
  KEY `id_prc` (`id_prc`),
  KEY `id_prc_2` (`id_prc`),
  KEY `id_prc_3` (`id_prc`),
  KEY `id_prc_4` (`id_prc`),
  KEY `produit_compose_ibfk_1` (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `produit_ged`
--

CREATE TABLE IF NOT EXISTS `produit_ged` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `id_produit` int(255) NOT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `produit_vente`
--

CREATE TABLE IF NOT EXISTS `produit_vente` (
  `id_prc` int(11) NOT NULL AUTO_INCREMENT,
  `num_version` int(11) NOT NULL DEFAULT '1',
  `libelle` varchar(255) NOT NULL,
  `unite` varchar(255) NOT NULL,
  `categorie` int(11) NOT NULL,
  `prix_achat` float DEFAULT NULL,
  `marge` float DEFAULT NULL,
  `margepc` float NOT NULL DEFAULT '0',
  `margemin` float NOT NULL DEFAULT '0',
  `prix_vente` float DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_user` int(255) NOT NULL DEFAULT '3',
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `image` varchar(256) CHARACTER SET utf8 DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_prc`,`num_version`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `qualification`
--

CREATE TABLE IF NOT EXISTS `qualification` (
  `id_qualification` int(3) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(100) NOT NULL,
  `taux_horaire` float NOT NULL,
  `heure_brute` float NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_qualification`),
  KEY `id_qualification` (`id_qualification`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `rapport_chantier`
--

CREATE TABLE IF NOT EXISTS `rapport_chantier` (
  `id_rapport` int(10) NOT NULL AUTO_INCREMENT,
  `id_chantier` int(10) NOT NULL,
  `date_rapport` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `note` text NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_rapport`),
  KEY `id_chantier` (`id_chantier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `selection_caces`
--

CREATE TABLE IF NOT EXISTS `selection_caces` (
  `id_caces` int(2) NOT NULL,
  `id_contact` int(10) NOT NULL,
  `date_validite` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_caces`,`id_contact`),
  KEY `id_caces` (`id_caces`,`id_contact`),
  KEY `id_contact` (`id_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `situation_facture`
--

CREATE TABLE IF NOT EXISTS `situation_facture` (
  `id_facture` int(10) NOT NULL,
  `n_situation` int(2) NOT NULL,
  `date_situation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_produit` int(10) NOT NULL,
  `num_version` int(255) NOT NULL,
  `pourcentage` float DEFAULT NULL,
  `stade_avancement` varchar(100) DEFAULT NULL,
  `option` tinyint(4) DEFAULT NULL,
  `qtefact` float DEFAULT NULL,
  `prixfact` float DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_facture`,`n_situation`,`id_produit`),
  KEY `id_facture` (`id_facture`),
  KEY `id_produit` (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `situation_option`
--

CREATE TABLE IF NOT EXISTS `situation_option` (
  `id_facture` int(255) NOT NULL,
  `n_situation` int(255) NOT NULL,
  `date_situation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_produit` int(255) NOT NULL,
  `num_version` int(255) NOT NULL,
  `qtefact` float NOT NULL,
  `prixfact` float NOT NULL,
  `pourcentage` float NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_facture`,`n_situation`,`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `statut_employe`
--

CREATE TABLE IF NOT EXISTS `statut_employe` (
  `id_contact` int(10) NOT NULL,
  `id_qualification` int(3) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_contact`,`id_qualification`),
  KEY `id_contact` (`id_contact`,`id_qualification`),
  KEY `id_qualification` (`id_qualification`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- --------------------------------------------------------

--
-- Structure de la table `stock`
--

CREATE TABLE IF NOT EXISTS `stock` (
  `id_produit` int(255) NOT NULL,
  `stock` int(255) NOT NULL,
  `stockmini` int(255) NOT NULL,
  `stockmaxi` int(255) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_produit`),
  KEY `id_produit` (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `sumbdc`
--
CREATE TABLE IF NOT EXISTS `sumbdc` (
`SUM( bdc_detaille.Prixreel * bdc_detaille.Qtelivre )` double
,`tarifpourlivraisonreel` bigint(11)
,`id_chantier` bigint(255)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `sumdevis`
--
CREATE TABLE IF NOT EXISTS `sumdevis` (
`date_version` timestamp
,`totaldevis` double
,`annee` int(4)
);
-- --------------------------------------------------------

--
-- Structure de la table `telephone`
--

CREATE TABLE IF NOT EXISTS `telephone` (
  `id_tel` int(10) NOT NULL AUTO_INCREMENT,
  `id_contact` int(10) NOT NULL,
  `numero` varchar(30) NOT NULL,
  `type_tel` varchar(50) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tel`),
  KEY `id_contact` (`id_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `testing`
--

CREATE TABLE IF NOT EXISTS `testing` (
  `id_valitest` int(255) NOT NULL AUTO_INCREMENT,
  `numtest` varchar(255) DEFAULT NULL,
  `datedeb` timestamp NULL DEFAULT NULL,
  `datefin` timestamp NULL DEFAULT NULL,
  `validate` tinyint(2) DEFAULT NULL,
  `id_test` int(11) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_valitest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `travail`
--

CREATE TABLE IF NOT EXISTS `travail` (
  `id_travail` int(11) NOT NULL AUTO_INCREMENT,
  `nb_heure` time NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_employé` int(11) NOT NULL,
  `id_chantier` int(11) NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT '0',
  `type` varchar(255) NOT NULL DEFAULT 'Travail',
  `user` int(255) DEFAULT NULL,
  `autres` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_travail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `travail_equipe`
--

CREATE TABLE IF NOT EXISTS `travail_equipe` (
  `id_travail` int(255) NOT NULL AUTO_INCREMENT,
  `nb_heure` varchar(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_equipe` int(255) NOT NULL,
  `id_chantier` int(255) NOT NULL,
  `valid` tinyint(1) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'Travail',
  `user` int(255) DEFAULT NULL,
  `autre` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_travail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `tva`
--

CREATE TABLE IF NOT EXISTS `tva` (
  `id_tva` int(1) NOT NULL AUTO_INCREMENT,
  `taux` float NOT NULL,
  `Libelle_tva` varchar(30) NOT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` int(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tva`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Contenu de la table `tva`
--

INSERT INTO `tva` (`id_tva`, `taux`, `Libelle_tva`, `user`, `autre`, `id_entreprise`) VALUES
(1, 20, 'Le taux normal', NULL, NULL, NULL),
(2, 10, 'Taux intermédiaire', NULL, NULL, NULL),
(3, 5.5, 'Le taux réduit ', NULL, NULL, NULL),
(4, 2.1, 'Le taux super-réduit', NULL, NULL, NULL),
(5, 0, 'Activité exonérée de TVA', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `unread_msg`
--
CREATE TABLE IF NOT EXISTS `unread_msg` (
`destinataire` int(10)
,`nbUnread` decimal(23,0)
);
-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `statut` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user',
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `firstname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `tel_bureau_user` float DEFAULT NULL,
  `tel_mob_user` float DEFAULT NULL,
  `email_user` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `id` (`id`),
  KEY `id_2` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `statut`, `password`, `username`, `firstname`, `lastname`, `tel_bureau_user`, `tel_mob_user`, `email_user`, `id_entreprise`) VALUES
(1, 'admin', '$2a$10$rp5rLf5NppOTnqF5Yk1JYuejS3rWp0e2V1Q6i0r3u6zV9nPpR1oMu', 'rexbat', 'rex', 'bat', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `usersdroits`
--

CREATE TABLE IF NOT EXISTS `usersdroits` (
  `id_droit` int(255) NOT NULL AUTO_INCREMENT,
  `id` int(255) NOT NULL,
  `accescontact` tinyint(4) DEFAULT NULL,
  `supcontact` tinyint(4) DEFAULT NULL,
  `ajoutcontact` tinyint(4) DEFAULT NULL,
  `modifcontact` tinyint(4) DEFAULT NULL,
  `validcontact` tinyint(4) DEFAULT NULL,
  `accesproa` tinyint(4) DEFAULT NULL,
  `supproa` tinyint(4) DEFAULT NULL,
  `ajoutproa` tinyint(4) DEFAULT NULL,
  `modifproa` tinyint(4) DEFAULT NULL,
  `validproa` tinyint(4) DEFAULT NULL,
  `accesprov` tinyint(4) DEFAULT NULL,
  `supprov` tinyint(4) DEFAULT NULL,
  `ajoutprov` tinyint(4) DEFAULT NULL,
  `modifprov` tinyint(4) DEFAULT NULL,
  `validprov` tinyint(4) DEFAULT NULL,
  `accescom` tinyint(4) DEFAULT NULL,
  `supcom` tinyint(4) DEFAULT NULL,
  `ajoutcom` tinyint(4) DEFAULT NULL,
  `modifcom` tinyint(4) DEFAULT NULL,
  `validcom` tinyint(4) DEFAULT NULL,
  `accescha` tinyint(4) DEFAULT NULL,
  `supcha` tinyint(4) DEFAULT NULL,
  `ajoutcha` tinyint(4) DEFAULT NULL,
  `modifcha` tinyint(4) DEFAULT NULL,
  `validcha` tinyint(4) DEFAULT NULL,
  `accesdev` tinyint(4) DEFAULT NULL,
  `supdev` tinyint(4) DEFAULT NULL,
  `ajoutdev` tinyint(4) DEFAULT NULL,
  `modifdev` tinyint(4) DEFAULT NULL,
  `validdev` tinyint(4) DEFAULT NULL,
  `accesfact` tinyint(4) DEFAULT NULL,
  `supfact` tinyint(4) DEFAULT NULL,
  `ajoutfact` tinyint(4) DEFAULT NULL,
  `modiffact` tinyint(4) DEFAULT NULL,
  `validfact` tinyint(4) DEFAULT NULL,
  `accesfour` tinyint(4) DEFAULT NULL,
  `supfour` tinyint(4) DEFAULT NULL,
  `ajoutfour` tinyint(4) DEFAULT NULL,
  `modiffour` tinyint(4) DEFAULT NULL,
  `validfour` tinyint(4) DEFAULT NULL,
  `accesfrais` tinyint(4) DEFAULT NULL,
  `supfrais` tinyint(4) DEFAULT NULL,
  `ajoutfrais` tinyint(4) DEFAULT NULL,
  `modiffrais` tinyint(4) DEFAULT NULL,
  `validfrais` tinyint(4) DEFAULT NULL,
  `accesbg` tinyint(4) DEFAULT NULL,
  `supbg` tinyint(4) DEFAULT NULL,
  `ajoutbg` tinyint(4) DEFAULT NULL,
  `modifbg` tinyint(4) DEFAULT NULL,
  `validbg` tinyint(4) DEFAULT NULL,
  `accespb` tinyint(4) DEFAULT NULL,
  `suppb` tinyint(4) DEFAULT NULL,
  `ajoutpb` tinyint(4) DEFAULT NULL,
  `modifpb` tinyint(4) DEFAULT NULL,
  `validpb` tinyint(4) DEFAULT NULL,
  `accespc` tinyint(4) DEFAULT NULL,
  `suppc` tinyint(4) DEFAULT NULL,
  `ajoutpc` tinyint(4) DEFAULT NULL,
  `modifpc` tinyint(4) DEFAULT NULL,
  `validpc` tinyint(4) DEFAULT NULL,
  `accesparam` tinyint(4) DEFAULT NULL,
  `supparam` tinyint(4) DEFAULT NULL,
  `ajoutparam` tinyint(4) DEFAULT NULL,
  `modifparam` tinyint(4) DEFAULT NULL,
  `validparam` tinyint(4) DEFAULT NULL,
  `accesstat` tinyint(4) DEFAULT NULL,
  `supstat` tinyint(4) DEFAULT NULL,
  `ajoutstat` tinyint(4) DEFAULT NULL,
  `modifstat` tinyint(4) DEFAULT NULL,
  `validstat` tinyint(4) DEFAULT NULL,
  `accesam` tinyint(4) DEFAULT NULL,
  `supam` tinyint(4) DEFAULT NULL,
  `ajoutam` tinyint(4) DEFAULT NULL,
  `modifam` tinyint(4) DEFAULT NULL,
  `validam` tinyint(4) DEFAULT NULL,
  `accesmes` tinyint(4) DEFAULT NULL,
  `supmes` tinyint(4) DEFAULT NULL,
  `ajoutmes` tinyint(4) DEFAULT NULL,
  `modifmes` tinyint(4) DEFAULT NULL,
  `validmes` tinyint(4) DEFAULT NULL,
  `accesaut` tinyint(4) DEFAULT NULL,
  `supaut` tinyint(4) DEFAULT NULL,
  `ajoutaut` tinyint(4) DEFAULT NULL,
  `modifaut` tinyint(4) DEFAULT NULL,
  `validaut` tinyint(4) DEFAULT NULL,
  `accesauti` tinyint(4) DEFAULT NULL,
  `supauti` tinyint(4) DEFAULT NULL,
  `ajoutauti` tinyint(4) DEFAULT NULL,
  `modifauti` tinyint(4) DEFAULT NULL,
  `validauti` tinyint(4) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_droit`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `usersdroits`
--

INSERT INTO `usersdroits` (`id_droit`, `id`, `accescontact`, `supcontact`, `ajoutcontact`, `modifcontact`, `validcontact`, `accesproa`, `supproa`, `ajoutproa`, `modifproa`, `validproa`, `accesprov`, `supprov`, `ajoutprov`, `modifprov`, `validprov`, `accescom`, `supcom`, `ajoutcom`, `modifcom`, `validcom`, `accescha`, `supcha`, `ajoutcha`, `modifcha`, `validcha`, `accesdev`, `supdev`, `ajoutdev`, `modifdev`, `validdev`, `accesfact`, `supfact`, `ajoutfact`, `modiffact`, `validfact`, `accesfour`, `supfour`, `ajoutfour`, `modiffour`, `validfour`, `accesfrais`, `supfrais`, `ajoutfrais`, `modiffrais`, `validfrais`, `accesbg`, `supbg`, `ajoutbg`, `modifbg`, `validbg`, `accespb`, `suppb`, `ajoutpb`, `modifpb`, `validpb`, `accespc`, `suppc`, `ajoutpc`, `modifpc`, `validpc`, `accesparam`, `supparam`, `ajoutparam`, `modifparam`, `validparam`, `accesstat`, `supstat`, `ajoutstat`, `modifstat`, `validstat`, `accesam`, `supam`, `ajoutam`, `modifam`, `validam`, `accesmes`, `supmes`, `ajoutmes`, `modifmes`, `validmes`, `accesaut`, `supaut`, `ajoutaut`, `modifaut`, `validaut`, `accesauti`, `supauti`, `ajoutauti`, `modifauti`, `validauti`, `id_entreprise`) VALUES
(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL, 1, 1, 1, 1, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `vehiculemateriel`
--

CREATE TABLE IF NOT EXISTS `vehiculemateriel` (
  `id_vehmat` int(10) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(512) NOT NULL,
  `vehimate` varchar(15) NOT NULL,
  `marque` varchar(150) DEFAULT NULL,
  `energie` varchar(30) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `annee` varchar(255) DEFAULT NULL COMMENT 'sert au type de véhicule',
  `datectrltech` timestamp NULL DEFAULT NULL,
  `immatriculation` varchar(30) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `date1ctrl` timestamp NULL DEFAULT NULL,
  `carrosserie` varchar(50) DEFAULT NULL,
  `puissance` varchar(20) DEFAULT NULL,
  `pl_ass` int(3) DEFAULT NULL,
  `nserie` varchar(100) DEFAULT NULL,
  `largeur` float DEFAULT NULL,
  `surface` varchar(30) DEFAULT NULL,
  `poidstc` float DEFAULT NULL,
  `poidsvide` float DEFAULT NULL,
  `bruit` float DEFAULT NULL,
  `regmot` int(7) DEFAULT NULL,
  `remarque` text,
  `dateachat` timestamp NULL DEFAULT NULL,
  `datevente` timestamp NULL DEFAULT NULL,
  `visite_ampliroll` timestamp NULL DEFAULT NULL,
  `visite_grue` timestamp NULL DEFAULT NULL,
  `pneu_av` varchar(30) DEFAULT NULL,
  `pneu_ar` varchar(30) DEFAULT NULL,
  `gps` varchar(100) DEFAULT NULL,
  `code_poste` varchar(100) DEFAULT NULL,
  `poidstr` varchar(30) DEFAULT NULL,
  `gr` varchar(6) DEFAULT NULL,
  `ncartegr` varchar(20) DEFAULT NULL,
  `date_depreciation` timestamp NULL DEFAULT NULL,
  `ntelepeage` varchar(30) DEFAULT NULL,
  `geolocalisation` varchar(255) DEFAULT NULL,
  `dgarant` timestamp NULL DEFAULT NULL,
  `fgarant` timestamp NULL DEFAULT NULL,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `image` varchar(256) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_vehmat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `vehimat_ged`
--

CREATE TABLE IF NOT EXISTS `vehimat_ged` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `url` varchar(512) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `id_vehmat` int(255) NOT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` int(255) DEFAULT NULL,
  `autre` varchar(255) DEFAULT NULL,
  `id_entreprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la vue `alldevis`
--
DROP TABLE IF EXISTS `alldevis`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `alldevis` AS select `devislist`.`num_version` AS `num_version`,`devislist`.`accepted` AS `accepted`,`devislist`.`id_devis` AS `id_devis`,`devislist`.`envoye` AS `envoye`,`devislist`.`date_version` AS `date_version`,`devislist`.`statut` AS `statut`,`devislist`.`accompte` AS `accompte`,`devislist`.`total` AS `total`,`devislist`.`TS` AS `TS`,`devislist`.`factured` AS `factured` from `devislist` where (`devislist`.`total` > 0) union select `devislistlibre`.`num_version` AS `num_version`,`devislistlibre`.`accepted` AS `accepted`,`devislistlibre`.`id_devis` AS `id_devis`,`devislistlibre`.`envoye` AS `envoye`,`devislistlibre`.`date_version` AS `date_version`,`devislistlibre`.`statut` AS `statut`,`devislistlibre`.`accompte` AS `accompte`,`devislistlibre`.`total` AS `total`,`devislistlibre`.`TS` AS `TS`,`devislistlibre`.`factured` AS `factured` from `devislistlibre` where (`devislistlibre`.`total` > 0);

-- --------------------------------------------------------

--
-- Structure de la vue `bondecommandelist`
--
DROP TABLE IF EXISTS `bondecommandelist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `bondecommandelist` AS select `chantier`.`nom_chantier` AS `nom_chantier`,`bon_de_commande`.`state` AS `state`,`bon_de_commande`.`Recu` AS `Recu`,`bon_de_commande`.`tarifpourlivraisonreel` AS `tarifpourlivraisonreel`,`bon_de_commande`.`tarifpourlivraison` AS `tarifpourlivraison`,`bon_de_commande`.`livre` AS `livre`,`chantier`.`id_chantier` AS `id_chantier`,`bon_de_commande`.`id_bdc` AS `id_bdc`,`bon_de_commande`.`id_devis` AS `id_devis`,`bon_de_commande`.`adresselivraison` AS `adresselivraison`,`bon_de_commande`.`id_fournisseur` AS `id_fournisseur`,`listecontacts`.`nom` AS `fournisseurNom`,`bon_de_commande`.`date_livraison` AS `date_livraison`,`bon_de_commande`.`date_livraison_reel` AS `date_livraison_reel`,`bon_de_commande`.`date_commande` AS `date_commande`,`users`.`firstname` AS `firstname`,`users`.`lastname` AS `lastname`,sum((`bdc_detaille`.`prix_prevu` * `bdc_detaille`.`qte`)) AS `total` from ((((`bon_de_commande` left join `bdc_detaille` on((`bdc_detaille`.`id_bdc` = `bon_de_commande`.`id_bdc`))) left join `users` on((`users`.`id` = `bon_de_commande`.`id_user`))) left join `listecontacts` on((`listecontacts`.`id_contact` = `bon_de_commande`.`id_fournisseur`))) left join `chantier` on((`chantier`.`id_chantier` = `bon_de_commande`.`id_chantier`))) group by `bon_de_commande`.`id_bdc` order by `bon_de_commande`.`date_livraison`;

-- --------------------------------------------------------

--
-- Structure de la vue `cacesalert`
--
DROP TABLE IF EXISTS `cacesalert`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `cacesalert` AS select `cacescontact`.`date_fin` AS `date`,`caces`.`caces` AS `caces`,`contact`.`nom` AS `nom`,`contact`.`prenom` AS `prenom` from ((`cacescontact` left join `caces` on((`cacescontact`.`id_caces` = `caces`.`id_caces`))) left join `contact` on((`contact`.`id_contact` = `cacescontact`.`id_contact`))) where (`cacescontact`.`date_fin` between now() and (now() + interval 2 month));

-- --------------------------------------------------------

--
-- Structure de la vue `chantierdevisencours`
--
DROP TABLE IF EXISTS `chantierdevisencours`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `chantierdevisencours` AS select `devislist`.`num_version` AS `num_version`,`devislist`.`accepted` AS `accepted`,`devislist`.`id_devis` AS `id_devis`,`devislist`.`envoye` AS `envoye`,`devislist`.`date_version` AS `date_version`,`devislist`.`statut` AS `statut`,`devislist`.`accompte` AS `accompte`,`devislist`.`total` AS `total`,`devislist`.`TS` AS `TS`,`devislist`.`factured` AS `factured`,`chantierdevis`.`status` AS `status`,`chantierdevis`.`id_chantier` AS `id_chantier` from (`devislist` join `chantierdevis`) where ((`chantierdevis`.`status` = 'en cours') and (`devislist`.`id_devis` = `chantierdevis`.`id_devis`) and (`devislist`.`num_version` = `chantierdevis`.`num_version`));

-- --------------------------------------------------------

--
-- Structure de la vue `devisfrais`
--
DROP TABLE IF EXISTS `devisfrais`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `devisfrais` AS select `devis_version`.`num_version` AS `num_version`,`devis_version`.`accepted` AS `accepted`,`devis_version`.`id_devis` AS `id_devis`,`devis_version`.`envoye` AS `envoye`,`devis_version`.`date_version` AS `date_version`,`devis_version`.`statut` AS `statut`,`devis_version`.`accompte` AS `accompte`,(coalesce(sum((`devis_option`.`qte_devis` * `devis_option`.`prix_devis`)),0) + sum((`devis_detaille`.`qte_devis` * `devis_detaille`.`prix_devis`))) AS `total`,`devis`.`TS` AS `TS`,`chantierdevis`.`date_demarrage` AS `date_demarrage`,`chantierdevis`.`reception_chantier` AS `reception_chantier`,`chantierdevis`.`status` AS `status`,`chantierdevis`.`id_chantier` AS `id_chantier`,month(`chantierdevis`.`date_demarrage`) AS `devismois`,year(`chantierdevis`.`date_demarrage`) AS `devisannee` from ((((`devis_version` left join `devis_detaille` on(((`devis_detaille`.`num_version` = `devis_version`.`num_version`) and (`devis_detaille`.`id_devis` = `devis_version`.`id_devis`)))) left join `devis_option` on(((`devis_option`.`num_version` = `devis_version`.`num_version`) and (`devis_option`.`id_devis` = `devis_version`.`id_devis`) and (`devis_option`.`accepted` is true)))) left join `devis` on((`devis_version`.`id_devis` = `devis`.`id_devis`))) join `chantierdevis`) where ((`devis_version`.`accepted` is true) and (`devis_version`.`id_devis` = `chantierdevis`.`id_devis`)) group by `devis_version`.`num_version`,`devis_version`.`id_devis`;

-- --------------------------------------------------------

--
-- Structure de la vue `devislist`
--
DROP TABLE IF EXISTS `devislist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `devislist` AS select `devis_version`.`num_version` AS `num_version`,`devis_version`.`accepted` AS `accepted`,`devis_version`.`id_devis` AS `id_devis`,`devis_version`.`envoye` AS `envoye`,`devis_version`.`date_version` AS `date_version`,`devis_version`.`statut` AS `statut`,`devis_version`.`accompte` AS `accompte`,(coalesce(sum((`devis_option`.`qte_devis` * `devis_option`.`prix_devis`)),0) + sum((`devis_detaille`.`qte_devis` * `devis_detaille`.`prix_devis`))) AS `total`,`devis`.`TS` AS `TS`,`devis_version`.`factured` AS `factured` from (((`devis_version` left join `devis_detaille` on(((`devis_detaille`.`num_version` = `devis_version`.`num_version`) and (`devis_detaille`.`id_devis` = `devis_version`.`id_devis`)))) left join `devis_option` on(((`devis_option`.`num_version` = `devis_version`.`num_version`) and (`devis_option`.`id_devis` = `devis_version`.`id_devis`) and (`devis_option`.`accepted` is true)))) left join `devis` on((`devis_version`.`id_devis` = `devis`.`id_devis`))) group by `devis_version`.`num_version`,`devis_version`.`id_devis`;

-- --------------------------------------------------------

--
-- Structure de la vue `devislistlibre`
--
DROP TABLE IF EXISTS `devislistlibre`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `devislistlibre` AS select `devis_version`.`num_version` AS `num_version`,`devis_version`.`accepted` AS `accepted`,`devis_version`.`id_devis` AS `id_devis`,`devis_version`.`envoye` AS `envoye`,`devis_version`.`date_version` AS `date_version`,`devis_version`.`statut` AS `statut`,`devis_version`.`accompte` AS `accompte`,(coalesce(sum((`devis_option_libre`.`qte_devis` * `devis_option_libre`.`prix_devis`)),0) + sum((`devis_detaille_libre`.`qte_devis` * `devis_detaille_libre`.`prix_devis`))) AS `total`,`devis`.`TS` AS `TS`,`devis_version`.`factured` AS `factured` from (((`devis_version` left join `devis_detaille_libre` on(((`devis_detaille_libre`.`num_version` = `devis_version`.`num_version`) and (`devis_detaille_libre`.`id_devis` = `devis_version`.`id_devis`)))) left join `devis_option_libre` on(((`devis_option_libre`.`num_version` = `devis_version`.`num_version`) and (`devis_option_libre`.`id_devis` = `devis_version`.`id_devis`) and (`devis_option_libre`.`accepted` is true)))) left join `devis` on((`devis_version`.`id_devis` = `devis`.`id_devis`))) group by `devis_version`.`num_version`,`devis_version`.`id_devis`;

-- --------------------------------------------------------

--
-- Structure de la vue `factureannee`
--
DROP TABLE IF EXISTS `factureannee`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `factureannee` AS select sum(`facture`.`montant_ht`) AS `SUM( montant_ht )`,year(`facture`.`date_fact`) AS `datefact`,year(`facture`.`date_echeance`) AS `dateecheance` from `facture` group by year(`facture`.`date_fact`);

-- --------------------------------------------------------

--
-- Structure de la vue `facturechantiercours`
--
DROP TABLE IF EXISTS `facturechantiercours`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `facturechantiercours` AS select sum(`facture`.`montant_ht`) AS `montantfact`,`facture`.`id_devis` AS `id_devis` from (`facture` join `chantierdevis`) where ((`chantierdevis`.`status` = 'en cours') and (`facture`.`id_devis` = `chantierdevis`.`id_devis`) and (`facture`.`id_version` = `chantierdevis`.`num_version`)) group by `facture`.`id_devis`;

-- --------------------------------------------------------

--
-- Structure de la vue `formationalert`
--
DROP TABLE IF EXISTS `formationalert`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `formationalert` AS select `formationcontact`.`datefor` AS `DATE`,`formation`.`designation` AS `designation`,`contact`.`nom` AS `nom`,`contact`.`prenom` AS `prenom` from ((`formationcontact` left join `formation` on((`formationcontact`.`id_formation` = `formation`.`id_formation`))) left join `contact` on((`contact`.`id_contact` = `formationcontact`.`id_contact`))) where (`formationcontact`.`datefor` between now() and (now() + interval 2 month));

-- --------------------------------------------------------

--
-- Structure de la vue `fraismoisannee`
--
DROP TABLE IF EXISTS `fraismoisannee`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `fraismoisannee` AS select month(`fraisgeneraux`.`date_debut`) AS `mois`,year(`fraisgeneraux`.`date_debut`) AS `annee`,sum(`fraisgeneraux`.`valeur`) AS `somme` from `fraisgeneraux` group by month(`fraisgeneraux`.`date_debut`),year(`fraisgeneraux`.`date_debut`);

-- --------------------------------------------------------

--
-- Structure de la vue `heuremois`
--
DROP TABLE IF EXISTS `heuremois`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `heuremois` AS select `travail`.`id_travail` AS `id_travail`,`travail`.`nb_heure` AS `nb_heure`,`travail`.`date` AS `date`,`travail`.`id_employé` AS `id_employé`,`travail`.`id_chantier` AS `id_chantier`,`travail`.`valid` AS `valid`,`travail`.`type` AS `type`,`travail`.`user` AS `user`,`travail`.`autres` AS `autres`,`contact`.`nom` AS `nom`,`contact`.`prenom` AS `prenom`,sec_to_time(sum(time_to_sec(`travail`.`nb_heure`))) AS `temps`,month(`travail`.`date`) AS `mois`,year(`travail`.`date`) AS `annee` from (`travail` left join `contact` on((`travail`.`id_employé` = `contact`.`id_contact`))) where (`travail`.`valid` is true) group by `travail`.`id_employé`,month(`travail`.`date`),year(`travail`.`date`);

-- --------------------------------------------------------

--
-- Structure de la vue `heuresemaine`
--
DROP TABLE IF EXISTS `heuresemaine`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `heuresemaine` AS select `travail`.`id_employé` AS `id_employé`,sec_to_time(sum(time_to_sec(`travail`.`nb_heure`))) AS `temps`,week(`travail`.`date`,0) AS `semaine`,year(`travail`.`date`) AS `annee`,month(`travail`.`date`) AS `mois`,`travail`.`id_chantier` AS `id_chantier`,`contact`.`nom` AS `nom`,`contact`.`prenom` AS `prenom`,sum(time_to_sec(`travail`.`nb_heure`)) AS `sumse`,count(`travail`.`date`) AS `somme`,`contrat_histo`.`type_contrat` AS `type_contrat`,`contrat_histo`.`tauxhorairesbrute` AS `tauxhorairesbrute`,`contrat_histo`.`tauxsurcharge` AS `tauxsurcharge`,`contrat_histo`.`panier` AS `panier`,`contrat_histo`.`heure_mois` AS `heure_mois`,`chantier`.`nom_chantier` AS `nom_chantier` from (((`travail` join `contact`) left join `contrat_histo` on(((`travail`.`id_employé` = `contrat_histo`.`id_contact`) and (`contrat_histo`.`date_debut` <= `travail`.`date`) and (`contrat_histo`.`date_fin` >= `travail`.`date`)))) left join `chantier` on((`chantier`.`id_chantier` = `travail`.`id_chantier`))) where ((`travail`.`valid` is true) and (`travail`.`id_employé` = `contact`.`id_contact`)) group by `travail`.`id_employé`,`travail`.`id_chantier`,week(`travail`.`date`,0),year(`travail`.`date`);

-- --------------------------------------------------------

--
-- Structure de la vue `listbdc`
--
DROP TABLE IF EXISTS `listbdc`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `listbdc` AS select `bdc_detaille`.`id_bdc` AS `id_bdc`,year(`bon_de_commande`.`date_livraison_reel`) AS `annee`,sum((`bdc_detaille`.`Qtelivre` * `bdc_detaille`.`Prixreel`)) AS `somme` from (`bon_de_commande` join `bdc_detaille`) where ((`bon_de_commande`.`Recu` is true) and (`bon_de_commande`.`id_bdc` = `bdc_detaille`.`id_bdc`)) group by year(`bon_de_commande`.`date_livraison_reel`),`bdc_detaille`.`id_bdc`;

-- --------------------------------------------------------

--
-- Structure de la vue `listchantierdevismois`
--
DROP TABLE IF EXISTS `listchantierdevismois`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `listchantierdevismois` AS select `chantierdevis`.`id_devis` AS `id_devis`,`chantierdevis`.`num_version` AS `num_version`,`chantierdevis`.`id_chantier` AS `id_chantier`,`chantier`.`nom_chantier` AS `nom_chantier`,`chantier`.`responsable` AS `responsable`,round(sum((`devis_detaille`.`qte_devis` * `devis_detaille`.`prix_devis`)),2) AS `sumdet` from (((`chantier` join `chantierdevis`) join `devis_version`) join `devis_detaille`) where ((`chantier`.`id_chantier` = `chantierdevis`.`id_chantier`) and (`chantierdevis`.`id_devis` = `devis_version`.`id_devis`) and (`chantierdevis`.`num_version` = `devis_version`.`num_version`) and (`devis_detaille`.`id_devis` = `devis_version`.`id_devis`) and (`devis_detaille`.`num_version` = `devis_version`.`num_version`)) group by `chantierdevis`.`id_devis`,`chantierdevis`.`num_version`;

-- --------------------------------------------------------

--
-- Structure de la vue `listchantierdevisoption`
--
DROP TABLE IF EXISTS `listchantierdevisoption`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `listchantierdevisoption` AS select `chantierdevis`.`num_version` AS `num_version`,`chantierdevis`.`id_chantier` AS `id_chantier`,`chantier`.`nom_chantier` AS `nom_chantier`,round(sum((`devis_option`.`qte_devis` * `devis_option`.`prix_devis`)),2) AS `sumopt` from (((`chantier` join `chantierdevis`) join `devis_version`) join `devis_option`) where ((`chantier`.`id_chantier` = `chantierdevis`.`id_chantier`) and (`chantierdevis`.`id_devis` = `devis_version`.`id_devis`) and (`chantierdevis`.`num_version` = `devis_version`.`num_version`) and (`devis_option`.`id_devis` = `devis_version`.`id_devis`) and (`devis_option`.`num_version` = `devis_version`.`num_version`)) group by `chantierdevis`.`id_devis`,`chantierdevis`.`num_version`;

-- --------------------------------------------------------

--
-- Structure de la vue `listchantierfacturemois`
--
DROP TABLE IF EXISTS `listchantierfacturemois`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `listchantierfacturemois` AS select `chantierdevis`.`id_chantier` AS `id_chantier`,round(sum(`facture`.`montant_ht`),2) AS `montantht`,`chantierdevis`.`id_devis` AS `id_devis`,`chantierdevis`.`num_version` AS `num_version` from (((`chantier` join `chantierdevis`) join `devis_version`) join `facture`) where ((`chantier`.`id_chantier` = `chantierdevis`.`id_chantier`) and (`devis_version`.`id_devis` = `chantierdevis`.`id_devis`) and (`devis_version`.`num_version` = `chantierdevis`.`num_version`) and (`facture`.`id_devis` = `devis_version`.`id_devis`)) group by `facture`.`id_facture`;

-- --------------------------------------------------------

--
-- Structure de la vue `listecontacts`
--
DROP TABLE IF EXISTS `listecontacts`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `listecontacts` AS select `contact`.`id_contact` AS `id_contact`,`contact`.`nom` AS `nom`,`contact`.`prenom` AS `prenom`,`contact`.`type` AS `type`,`m1`.`mail` AS `mailPerso`,`m2`.`mail` AS `mailPro`,`t1`.`numero` AS `telFixe`,`t2`.`numero` AS `telMobile`,`t3`.`numero` AS `telPro`,`a1`.`adresse` AS `adresse`,`a1`.`code_postal` AS `code_postal`,`a1`.`ville` AS `ville`,`contact`.`raison_sociale` AS `raison_sociale`,`contact`.`adresse` AS `cadresse`,`contact`.`code_postal` AS `ccp`,`contact`.`ville` AS `cville` from ((((((`contact` left join `mail` `m1` on(((`contact`.`id_contact` = `m1`.`id_contact`) and (`m1`.`type_mail` = 'perso')))) left join `mail` `m2` on(((`contact`.`id_contact` = `m2`.`id_contact`) and (`m2`.`type_mail` = 'pro')))) left join `telephone` `t1` on(((`contact`.`id_contact` = `t1`.`id_contact`) and (`t1`.`type_tel` = 'fixe')))) left join `telephone` `t2` on(((`contact`.`id_contact` = `t2`.`id_contact`) and (`t2`.`type_tel` = 'mobile')))) left join `telephone` `t3` on(((`contact`.`id_contact` = `t3`.`id_contact`) and (`t3`.`type_tel` = 'pro')))) left join `adresse` `a1` on((`contact`.`id_contact` = `a1`.`id_contact`))) order by `contact`.`nom`,`contact`.`prenom`;

-- --------------------------------------------------------

--
-- Structure de la vue `listgenerauxmois`
--
DROP TABLE IF EXISTS `listgenerauxmois`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `listgenerauxmois` AS select `fraisgeneraux`.`categorie` AS `categorie`,`fraisgeneraux`.`date_debut` AS `date_debut`,round(sum(`fraisgeneraux`.`valeur`),2) AS `sum`,month(`fraisgeneraux`.`date_debut`) AS `mois` from `fraisgeneraux` group by month(`fraisgeneraux`.`date_debut`),year(`fraisgeneraux`.`date_debut`),`fraisgeneraux`.`categorie`;

-- --------------------------------------------------------

--
-- Structure de la vue `sumbdc`
--
DROP TABLE IF EXISTS `sumbdc`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `sumbdc` AS select sum((`bdc_detaille`.`Prixreel` * `bdc_detaille`.`Qtelivre`)) AS `SUM( bdc_detaille.Prixreel * bdc_detaille.Qtelivre )`,`bon_de_commande`.`tarifpourlivraisonreel` AS `tarifpourlivraisonreel`,`chantierdevis`.`id_chantier` AS `id_chantier` from ((`bon_de_commande` join `chantierdevis`) join `bdc_detaille`) where ((`chantierdevis`.`id_chantier` = `bon_de_commande`.`id_chantier`) and (`bon_de_commande`.`Recu` is true) and (`bon_de_commande`.`id_bdc` = `bdc_detaille`.`id_bdc`));

-- --------------------------------------------------------

--
-- Structure de la vue `sumdevis`
--
DROP TABLE IF EXISTS `sumdevis`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `sumdevis` AS select `devislist`.`date_version` AS `date_version`,sum(`devislist`.`total`) AS `totaldevis`,year(`devislist`.`date_version`) AS `annee` from `devislist` where (`devislist`.`accepted` is true) group by year(`devislist`.`date_version`);

-- --------------------------------------------------------

--
-- Structure de la vue `unread_msg`
--
DROP TABLE IF EXISTS `unread_msg`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `unread_msg` AS select `message`.`destinataire` AS `destinataire`,sum((case when isnull(`message`.`traite`) then 1 else 0 end)) AS `nbUnread` from `message` group by `message`.`destinataire`;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
