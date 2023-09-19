const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeUnlikeCommentRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkLikeComment({ commentId, userId }) {
    const { rowCount } = await this._pool.query({
      text: 'SELECT 1 FROM likes_comment WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    });

    return rowCount;
  }

  async likeComment({ commentId, userId, date = new Date().toISOString() }) {
    const id = `like-${this._idGenerator()}`;

    const { rowCount } = await this._pool.query({
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3, $4)',
      values: [id, commentId, userId, date],
    });

    return rowCount;
  }

  async unlikeComment({ commentId, userId }) {
    const { rowCount } = await this._pool.query({
      text: 'DELETE FROM likes_comment WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    });

    return rowCount;
  }

  async getLikeCountComment(threadId) {
    const { rows } = await this._pool.query({
      text: 'SELECT comment_id FROM likes_comment WHERE comment_id IN (SELECT id FROM comment WHERE thread_id = $1)',
      values: [threadId],
    });

    return rows;
  }
}

module.exports = LikeUnlikeCommentRepositoryPostgres;
