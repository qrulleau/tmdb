const dbName = 'commentaires_tmdb';
const dbVersion = 1;
let db;

export const initDB = (callback) => {
    const request = window.indexedDB.open(dbName, dbVersion);
  
    request.onerror = (event) => {
      console.error('Erreur lors de l\'ouverture de la base de données IndexedDB : ', event.target.errorCode);
      callback('Erreur lors de l\'initialisation de la base de données IndexedDB.');
    };
  
    request.onsuccess = (event) => {
      db = event.target.result;
      callback(null, db);
    };
  
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('commentaires', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('movieId', 'movieId', { unique: false });
      objectStore.createIndex('comment', 'comment', { unique: false });
    };
};

export const addComment = (movieId, comment) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['commentaires'], 'readwrite');
    const objectStore = transaction.objectStore('commentaires');
    const request = objectStore.add({ movieId, comment });

    request.onsuccess = (event) => {
      console.log('Commentaire ajouté avec succès à la base de données IndexedDB.');
      resolve();
    };

    request.onerror = (event) => {
      console.error('Erreur lors de l\'ajout du commentaire à la base de données IndexedDB : ', event.target.errorCode);
      reject();
    };
  });
};

export const getCommentFromIndexedDB = (movieId, callback) => {
    const transaction = db.transaction(['commentaires'], 'readonly');
    const objectStore = transaction.objectStore('commentaires');
    const index = objectStore.index('movieId');
    const request = index.get(movieId);
  
    request.onsuccess = (event) => {
      const commentData = event.target.result;
      if (commentData) {
        callback(null, commentData.comment);
      } else {
        callback(null, null);
      }
    };
  
    request.onerror = (event) => {
      console.error('Erreur lors de la récupération du commentaire depuis IndexedDB : ', event.target.errorCode);
      callback('Erreur lors de la récupération du commentaire depuis IndexedDB.');
    };
};