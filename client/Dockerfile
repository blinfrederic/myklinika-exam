# Utilisez une image Node.js comme base
FROM node:lts-alpine
# Créez et définissez le répertoire de travail dans le conteneur
WORKDIR /usr/app

# Copiez le package.json et le package-lock.json (si présent) dans le répertoire de travail
COPY package*.json ./

# Installez les dépendances du projet
RUN yarn

# Copiez le reste des fichiers du projet dans le répertoire de travail du conteneur
COPY . .

# Exposez le port sur lequel l'application React sera en cours d'exécution
EXPOSE 3010

# Commande pour démarrer l'application React
CMD yarn start