import Dexie from 'dexie';

const dbName = 'commentaires_tmdb';
const dbVersion = 1;

class CommentairesDatabase extends Dexie {
  constructor() {
    super(dbName);
    this.version(dbVersion).stores({
      commentaires: '++id, movieId, comment',
    });
  }
}

const db = new CommentairesDatabase();

export const addComment = (movieId, comment) => {
    return getCommentFromIndexedDB(movieId)
      .then(existingComment => {
        if (existingComment) {
          return db.commentaires
            .where('movieId')
            .equals(movieId)
            .modify({ comment }); 
        } else {
          return db.commentaires.put({ movieId, comment });
        }
      });
  };

export const getCommentFromIndexedDB = (movieId) => {
  return db.commentaires
    .where('movieId')
    .equals(movieId)
    .first()
    .then((commentData) => {
      return commentData ? commentData.comment : null;
    });
};

export const initDB = () => {
  return db.open();
};