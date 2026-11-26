# Aide

## À quoi sert Prompter ?

Prompter est un téléprompteur local dans le navigateur. Vous pouvez écrire ou ouvrir un script, régler la durée cible et la lisibilité, puis lancer le mode présentation.

## Démarrage rapide

1. Collez du texte dans le champ de texte.
2. Réglez la durée cible directement ou à l’aide d’un préréglage, la taille de police, l’interligne, la police, les couleurs, le mode miroir, la ligne de repère et le compte à rebours.
3. Vérifiez l’« Aperçu » ou lancez la présentation.
4. En mode présentation, appuyez sur la barre d’espace pour mettre en pause ou reprendre.
5. Utilisez les flèches haut et bas pour modifier la vitesse.
6. Utilisez les flèches gauche/droite ou Page précédente/Page suivante pour passer d’un titre ou repère de section à l’autre.
7. Appuyez sur `R` pour réinitialiser et sur Échap pour revenir à l’éditeur. Les passages terminés ou interrompus apparaissent dans l’historique des présentations.

## Aperçu et mise en forme

L’aperçu utilise le même affichage que le mode présentation et peut être lu, mais il n’affiche pas le compte à rebours et n’ajoute aucun passage à l’historique. Les changements de taille de police, d’interligne, de mode miroir et de ligne de repère y sont visibles immédiatement.

L’éditeur prend en charge Markdown dans le script. Les titres, le **gras** et l’*italique* sont affichés dans l’aperçu et la présentation. Les lignes horizontales (`---`) peuvent servir de repères de section.

## Utilisation du clavier

- `Tab` : accéder aux commandes de l’éditeur et de la présentation.
- `Space` : démarrer, mettre en pause ou reprendre la présentation.
- `Arrow Up` / `Arrow Down` : modifier la vitesse.
- `Arrow Left` / `Arrow Right` ou `Page Up` / `Page Down` : passer d’une section à l’autre.
- `R` : réinitialiser la présentation.
- `Escape` : fermer l’aperçu ou la présentation.

## Enregistrer et ouvrir des projets

Le brouillon actuel est enregistré automatiquement dans le navigateur. Cet enregistrement sert uniquement à récupérer le brouillon dans le même navigateur.

Pour créer une sauvegarde durable, enregistrez un fichier `.prompter` avec « Enregistrer le projet ». Vous pourrez le recharger plus tard avec « Ouvrir un projet ». L’ouverture remplace le brouillon actuel ; l’application demande une confirmation au préalable.

Vous pouvez également importer directement des fichiers `.txt` et `.md` comme texte de script. Ils ne sont pas traités comme des projets complets.

Les fichiers invalides, trop volumineux ou utilisant une version de projet non prise en charge sont refusés. Le brouillon actuel est alors conservé.

## Supprimer les données

« Nouveau » supprime le brouillon enregistré dans ce navigateur et restaure le projet d’exemple. L’historique des présentations dispose de son propre bouton d’effacement et peut être exporté au format CSV. Après « Nouveau » et « Effacer », une action d’annulation est disponible jusqu’à ce que vous repreniez le travail ou fermiez l’onglet. Vous pouvez aussi supprimer les données du site dans les paramètres du navigateur.

## Appareils compatibles et limites

Prompter est conçu pour les navigateurs modernes sur ordinateur et mobile. L’application utilise `localStorage`, l’API plein écran du navigateur, Web Audio pour le signal de fin, Wake Lock pendant la présentation si le navigateur le permet, et un service worker pour les fonctionnalités PWA.

Les fichiers de projet sont des fichiers JSON avec l’extension `.prompter`. La limite d’importation actuelle est de 500 Ko. Les textes très longs sont limités à 100 000 caractères.

## Retours

- [Signaler un problème](https://haak3.atlassian.net/jira/software/form/69a50efc-0474-445e-8f01-66eb6b747cc1)
- [Suggérer une fonctionnalité](https://haak3.atlassian.net/jira/software/form/50d4fc51-bff4-4e21-b46e-8fd987b90d24)
- Vous pouvez aussi écrire à [apps@haak3.de](mailto:apps@haak3.de).

Ne partagez pas de contenu de script privé.
