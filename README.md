# Projet MyKlinica Application Web 

## Présentation

L'application Myklinica propose une carte interactive représentant l'attractivité des EPCI en france pour les praticiens de santé.

##  :wrench: Liste des technologies et frameworks utilisés

1. Backend
   - [NodeJS](https://nodejs.org/en)
   - [Express](https://expressjs.com/fr/)
  
2. Frontend
   - [React](https://reactjs.org/)
   - [React-leaflet](https://react-leaflet.js.org)
    

3. Base de données
   - [PostgreSQL](https://www.postgresql.org)

##  :rocket: Installation

1. Installer les dépendances

   ```sh
   yarn install-all
   ```

2. lancer les serveurs

   ```sh
   yarn dev
   ```

## :mag_right: Explication rapide du fonctionnement

L'application Myklinica utilise react leaflet pour afficher les differents EPCI sur la carte de France sous forme de polygones.

Chaque polygone peut etre remplis avec differentes informations qui peuvent ëtre récupérées de la base de donnée à l'aide de l'API données.

## :book: API de données

Voici quelques exemples de routes utilisables pour récupérer les données de l'API


### Récupérer la liste de tous les EPCI et leurs données
```http
GET /api/epcis/pagination/{pageNumber}
```

| Parameter    | Type     | Description                   |
| :----------- | :------- | :---------------------------- |
| `pageNumber` | `number` | **Requis**. Numéro de la page |

### Récupérer un type de donnée pour une commune
```http
GET /api/commune/{name}/{libelle}
```

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `name`    | `string` | **Requis**. Nom de la commune               |
| `libelle` | `string` | **Requis**. Libellé de la donnée recherchée |

### Documentation complète de l'API
```http
GET /api/documentation
```
# myklinika-exam
# myklinika-exam
