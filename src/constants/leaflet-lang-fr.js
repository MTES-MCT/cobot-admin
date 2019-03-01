import L from 'leaflet';

L.drawLocal.draw.toolbar.buttons.polygon = 'Dessiner un polygone';
L.drawLocal.draw.toolbar.buttons.rectangle = 'Dessiner un rectangle';

L.drawLocal.draw.toolbar.actions = {
  title: 'Annuler le dessin',
  text: 'Annuler',
};

L.drawLocal.draw.toolbar.finish = {
  title: 'Terminer le dessin',
  text: 'Terminer',
};

L.drawLocal.draw.toolbar.undo = {
  title: 'Supprimer le dernier point tiré',
  text: 'Supprimer le dernier point',
};

L.drawLocal.draw.handlers.rectangle.tooltip = 'Cliquez et faites glisser pour dessiner le rectangle.';
L.drawLocal.draw.handlers.polygon.tooltip = {
  start: 'Cliquez pour commencer à dessiner.',
  cont: 'Cliquez pour continuer à dessiner.',
  end: 'Cliquez sur le dernier point pour fermer cette forme.',
};

L.drawLocal.edit = {
  toolbar: {
    actions: {
      save: {
        title: 'Sauvegarder les modifications.',
        text: 'Sauvegarder',
      },
      cancel: {
        title: "Annuler l'édition, rejette toutes les modifications.",
        text: 'Annuler',
      },
      clearAll: {
        title: 'Effacez toutes les formes.',
        text: 'Tout effacer',
      },
    },
    buttons: {
      edit: 'Modifier les collections.',
      editDisabled: 'Pas de collections à éditer.',
      remove: 'Supprimez les collections.',
      removeDisabled: 'Pas de collections à supprimer.',
    },
  },
  handlers: {
    edit: {
      tooltip: {
        subtext: 'Cliquez sur annuler pour rétablir les modifications.',
        text: 'Sélectionnez les poignées ou le marqueur pour modifier la forme.',
      },
    },
    remove: {
      tooltip: {
        text: 'Cliquez sur une forme pour la supprimer',
      },
    },
  },
};
