const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/thread/ThreadRepository');
const AddThread = require('../../Domains/thread/entities/AddThread');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddComment = require('../../Domains/thread/entities/AddComment');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async getThread(threadId) {
    const { rows, rowCount } = await this._pool.query({
      text: `SELECT th.id, th.title,
        th.body, th.date, us.username
        FROM thread th
        LEFT JOIN users us ON th.owner = us.id
        WHERE th.id = $1`,
      values: [threadId],
    });

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return rows[0];
  }

  async addThread({ title, body, owner, date = new Date().toISOString() }) {
    const id = `thread-${this._idGenerator()}`;

    const { rows } = await this._pool.query({
      text: `INSERT INTO thread 
      VALUES($1, $2, $3, $4, $5) 
      RETURNING id, title, owner`,
      values: [id, title, body, date, owner],
    });

    return rows[0];
  }

  async verifyThread(threadId) {
    const { rowCount } = await this._pool.query({
      text: 'SELECT * FROM thread WHERE id = $1',
      values: [threadId],
    });

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return rowCount;
  }

  // comment
  async addComment({
    content,
    threadId,
    owner,
    date = new Date().toISOString(),
  }) {
    const id = `comment-${this._idGenerator()}`;
    const { rows } = await this._pool.query({
      text: `INSERT INTO comment 
      VALUES($1, $2, $3, $4, $5) 
      RETURNING id, content, owner`,
      values: [id, threadId, owner, content, date],
    });
    return rows[0];
  }
  async verifyCommentThread(commentId, threadId) {
    const { rowCount } = await this._pool.query({
      text: `SELECT * FROM comment 
      WHERE id = $1 AND thread_id = $2`,
      values: [commentId, threadId],
    });

    if (!rowCount) {
      throw new NotFoundError('Komentar thread tidak di temukan!');
    }

    return rowCount;
  }
  async verifyCommentOwner(commentId, owner) {
    const { rowCount } = await this._pool.query({
      text: `SELECT * FROM comment 
      WHERE id = $1 AND owner = $2`,
      values: [commentId, owner],
    });

    if (!rowCount) {
      throw new AuthorizationError('Anda tidak memiliki aksess!');
    }

    return rowCount;
  }

  async deleteComment(commentId) {
    const { rowCount } = await this._pool.query({
      text: 'UPDATE comment SET deleted = TRUE WHERE id = $1',
      values: [commentId],
    });

    if (!rowCount) {
      throw new NotFoundError('Komentar thread tidak di temukan!');
    }

    return rowCount;
  }

  async getCommentThread(threadId) {
    const { rows } = await this._pool.query({
      text: `SELECT cm.*, us.username
        FROM comment cm 
        LEFT JOIN users us ON cm.owner = us.id
        WHERE cm.thread_id = $1
        ORDER BY cm.date ASC`,
      values: [threadId],
    });

    return rows;
  }

  // reply
  async addReply({
    content,
    owner,
    commentId,
    date = new Date().toISOString(),
  }) {
    const id = `reply-${this._idGenerator()}`;

    const { rows } = await this._pool.query({
      text: `INSERT INTO reply 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING id, content, owner`,
      values: [id, commentId, owner, content, date],
    });

    return rows[0];
  }

  async verifyReply(threadId, commentId, replyId) {
    const { rowCount } = await this._pool.query({
      text: `SELECT * 
            FROM reply rp
            LEFT JOIN comment cm ON rp.comment_id = cm.id
            WHERE rp.id = $1
            AND rp.comment_id = $2
            AND cm.thread_id = $3
            AND rp.deleted = false`,
      values: [replyId, commentId, threadId],
    });

    if (!rowCount) {
      throw new NotFoundError('Balasan komentar tidak di temukan!');
    }

    return rowCount;
  }

  async verifyReplyOwner(replyId, owner) {
    const { rowCount } = await this._pool.query({
      text: 'SELECT * FROM reply WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    });

    if (!rowCount) {
      throw new AuthorizationError('Anda tidak memiliki aksess!');
    }

    return rowCount;
  }

  async deleteReply(replyId) {
    const { rowCount } = await this._pool.query({
      text: `UPDATE reply SET deleted = TRUE WHERE id=$1`,
      values: [replyId],
    });

    if (!rowCount) {
      throw new NotFoundError('Balasan komentar tidak di temukan!');
    }

    return rowCount;
  }

  async getReply(threadId) {
    const { rows } = await this._pool.query({
      text: `SELECT rp.*, us.username
            FROM reply rp
            LEFT JOIN comment cm ON rp.comment_id = cm.id
            LEFT JOIN users us ON rp.owner = us.id
            WHERE cm.thread_id = $1
            ORDER BY rp.date ASC`,
      values: [threadId],
    });

    return rows;
  }
}

module.exports = ThreadRepositoryPostgres;
