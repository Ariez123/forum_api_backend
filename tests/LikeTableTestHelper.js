/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-1',
    commentId = 'comment-1',
    userId = 'user-1',
    date = '2023-09-09T03:14:51.495Z',
  }) {
    await pool.query({
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3, $4)',
      values: [id, commentId, userId, date],
    });
  },

  async getLikeById(id) {
    const { rows } = await pool.query({
      text: 'SELECT * FROM likes_comment WHERE id = $1',
      values: [id],
    });

    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes_comment WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
