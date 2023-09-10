const pool = require('../src/Infrastructures/database/postgres/pool');

const threadTableTestHelper = {
  async addThread({
    id = 'thread-123456',
    title = 'Coba Thread',
    body = 'Isi Thread',
    owner = 'user-123',
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

  async cleanTable() {
    await pool.query('DELETE FROM thread WHERE 1=1');
  },
};

module.exports = threadTableTestHelper;
