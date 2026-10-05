# Shams El Djazair — Admin (structure de base)

React + Vite + Tailwind + composants shadcn/ui, en JavaScript (JSX), avec react-router-dom.

## Démarrer

```bash
npm install
npm run dev
```

## Structure

```
src/
├── main.jsx            # Point d'entrée (thème clair/sombre + App)
├── App.jsx             # TOUTES les routes
├── pages/              # Une page = un dossier : Page.jsx + page.css
│   ├── dashboard/      # Aperçu général (page vide, sert de modèle)
│   ├── tasks/          # Exemple : tableau + bouton "Ajouter" qui ouvre un panneau latéral
│   ├── sign-in/        # Connexion
│   └── errors/         # Page 404
├── layouts/            # Mise en page
│   ├── sidebar/        # Les 2 sidebars : sidebar1 (icônes) + sidebar2 (liens)
│   ├── data/           # sidebar-data.js : les sections et liens du menu
│   ├── header.jsx      # En-tête (bouton sidebar + recherche Ctrl+K + dark mode)
│   └── main.jsx        # Conteneur du contenu
├── components/
│   ├── ui/             # Composants shadcn réutilisables (Button, Input, Card, Dialog, Table...)
│   ├── theme-switch.jsx
│   └── sign-out-dialog.jsx
├── context/            # theme-provider (dark mode), search-provider (Ctrl+K)
├── stores/             # auth-store (utilisateur connecté)
├── lib/                # cn() pour combiner les classes
└── styles/             # CSS global + couleurs du thème
```

## Ajouter une page (ex : Marques)

1. Copier `src/pages/dashboard/` en `src/pages/marques/` et renommer :
   `Marques.jsx` (fonction `Marques`) et `marques.css`
2. Ajouter la route dans `src/App.jsx` :
   `<Route path='/marques' element={<Marques />} />`
3. Ajouter le lien dans `src/layouts/data/sidebar-data.js` (`MENU_ITEMS2`, avec `parent` = la section)
