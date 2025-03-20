# Eazylink_webapp

Eazylink est une plateforme de collaboration qui intègre Notion et Figma pour simplifier la gestion de projets.

## Technologies utilisées

- **Frontend** : Next.js, TypeScript, Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **Intégrations** : 
  - Notion (via MCP Server)
  - Figma (via MCP Server)

## Configuration requise

- Node.js 18+
- npm ou yarn

## Installation

```bash
# Cloner le repository
git clone https://github.com/AdminEZK/Eazylink_webapp.git
cd Eazylink_webapp

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Structure du projet

```
src/
  ├── app/              # Pages et routes Next.js
  ├── components/       # Composants React réutilisables
  ├── lib/             # Utilitaires et configurations
  └── types/           # Types TypeScript
```

## Fonctionnalités

- Authentification avec Supabase
- Intégration sécurisée avec Notion
- Intégration sécurisée avec Figma
- Gestion des workspaces collaboratifs

## Sécurité

Les tokens API sensibles (Notion, Figma) sont gérés de manière sécurisée via des serveurs MCP dédiés et ne sont jamais exposés côté client.
