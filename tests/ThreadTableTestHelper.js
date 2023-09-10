const pool = require('../src/Infrastructures/database/postgres/pool');

const threadTableTestHelper = {
  // thread
  async addThread({
    id = 'thread-1',
    title = 'Coba Thread',
    body = 'Isi Thread',
    owner = 'user-1',
    date = new Date('2023-09-09T03:14:51.495Z'),
  }) {
    await pool.query({
      text: 'INSERT INTO thread VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, owner],
    });
  },

  async getThread(id) {
    const { rows } = await pool.query({
      text: 'SELECT * FROM thread WHERE id = $1',
      values: [id],
    });
    return rows;
  },

  // comment
  async addComment({
    id = 'comment-1',
    threadId = 'thread-1',
    owner = 'user-1',
    content = 'Isi Komentar',
    date = new Date('2023-09-09T03:14:51.495Z'),
  }) {
    await pool.query({
      text: 'INSERT INTO comment VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, owner, content, date],
    });
  },

  async getComment(id) {
    const { rows } = await pool.query({
      text: 'SELECT * FROM comment WHERE id = $1',
      values: [id],
    });

    return rows;
  },

  // reply
  async addReply({
    id = 'reply-1',
    commentId = 'comment-1',
    owner = 'user-1',
    content = 'Isi Balasan Komentar',
    date = new Date('2023-09-09T03:14:51.495Z'),
  }) {
    const query = {
      text: 'INSERT INTO reply VALUES($1, $2, $3, $4, $5)',
      values: [id, commentId, owner, content, date],
    };

    await pool.query(query);
  },

  async getReply(id) {
    const query = {
      text: 'SELECT * FROM reply WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async deleteReply(id) {
    const query = {
      text: 'UPDATE reply SET deleted = TRUE WHERE id=$1',
      values: [id],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query(
      `DELETE FROM thread WHERE 1=1;
      DELETE FROM comment WHERE 1=1;
      DELETE FROM reply WHERE 1=1`
    );
  },
};

module.exports = threadTableTestHelper;
