const dbName = 'commentaires_tmdb';
const dbVersion = 1;
let db;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
      console.error('Erreur lors de l\'ouverture de la base de données IndexedDB : ', event.target.errorCode);
      reject();
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('commentaires', { keyPath: 'id', autoIncrement:true });
      objectStore.createIndex('movieId', 'movieId', { unique: false });
      objectStore.createIndex('comment', 'comment', { unique: false });
      console.log('Base de données IndexedDB mise à jour avec succès.');
    };
  });
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

export const getCommentFromIndexedDB = (movieId) => {
    console.log(db);
    return new Promise((resolve, reject) => {
      if (typeof db !== 'undefined') {
        const transaction = db.transaction(['commentaires'], 'readonly');
        const objectStore = transaction.objectStore('commentaires');
        const index = objectStore.index('movieId');
        const request = index.get(movieId);

        console.log(request);
  
        request.onsuccess = (event) => {
          const commentData = event.target.result;
          if (commentData) {
            resolve(commentData.comment);
          } else {
            resolve(null);
          }
        };
  
        request.onerror = (event) => {
          console.error('Erreur lors de la récupération du commentaire depuis IndexedDB : ', event.target.errorCode);
          reject();
        };
      } else {
        setTimeout(() => {
          getCommentFromIndexedDB(movieId)
            .then(resolve)
            .catch(reject);
        }, 1000);
      }
    });
};