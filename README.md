# wbat
Une web-application facilitant le travail des entreprises du batiment

## Environnement de développement

### Installation
Installer sur sa machine :
 * [NodeJs](https://nodejs.org/en/download/)
 * [Wamp](http://www.wampserver.com), ou juste [MySql server](https://www.mysql.com/downloads/) + [PhpMyAdmin](https://www.phpmyadmin.net)

Code :

    git clone  https://github.com/manonwbat/Manon


 Serveur (back-end) et Client (front-end) dans leurs répertoires respectifs :

     npm install

Base de donnée :
 * Lancer Wamp
 * Barre des tâches > icone Wamp > phpMyAdmin
 * Panneau gauche : Nouvelle base de donnée (nom : wbat, interclassement : utf8_unicode_ci)
 * Cliquer la base wbat créée > Importer > Fichier scripts/bdinit.sql

### Démarrage

Base de donnée : Lancer Wamp

Serveur :

    node server.js

Client :

    npm start
