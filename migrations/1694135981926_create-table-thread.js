exports.up = (pgm) => {
  pgm.createTable('thread', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('now()'),
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'thread',
    'fk_thread.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );

  pgm.createIndex('thread', 'owner');
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread', 'fk_thread.owner_users.id');
  pgm.dropTable('thread');
};
