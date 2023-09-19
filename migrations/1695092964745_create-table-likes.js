exports.up = (pgm) => {
  pgm.createTable('likes_comment', {
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
    date: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint(
    'likes_comment',
    'fk_likes_comment.comment_id_comment.id',
    'FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('likes_comment');
};
