exports.up = (pgm) => {
  pgm.createTable('reply', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
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
    'reply',
    'fk_reply.comment_id_comment.id',
    'FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'reply',
    'fk_reply.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('reply', 'fk_reply.comment_id_comment.id');
  pgm.dropConstraint('reply', 'fk_reply.owner_users.id');
  pgm.dropTable('reply');
};
