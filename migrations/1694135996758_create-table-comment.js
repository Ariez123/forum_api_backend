exports.up = (pgm) => {
  pgm.createTable('comment', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('now()'),
    },
    deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint(
    'comment',
    'fk_comment.thread_id_thread.id',
    'FOREIGN KEY(thread_id) REFERENCES thread(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'comment',
    'fk_comment.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('comment', 'fk_comment.thread_id_thread.id');
  pgm.dropConstraint('comment', 'fk_comment.owner_users.id');
  pgm.dropTable('comment');
};
