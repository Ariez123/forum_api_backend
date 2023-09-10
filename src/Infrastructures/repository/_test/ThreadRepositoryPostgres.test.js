const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const NewThread = require('../../../Domains/thread/entities/NewThread');
const NewComment = require('../../../Domains/thread/entities/NewComment');
const NewReply = require('../../../Domains/thread/entities/NewReply');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
    await pool.end();
  });

  // thread
  describe('addThread function', () => {
    it('should new thread and return added thread correctly', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
      };

      await UserTableTestHelper.addUser(dataUser);

      const newThread = new NewThread(dataThread);

      const fakeId = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      const addThread = await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadTableTestHelper.getThread('thread-1');
      expect(addThread).toStrictEqual({
        id: 'thread-1',
        owner: dataThread.owner,
        title: dataThread.title,
      });
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const dataUser = {
        id: 'user-2',
        username: 'dicoding2',
        password: 'secret',
      };
      const dataThread = {
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
      };

      await UserTableTestHelper.addUser(dataUser);

      const newThread = new NewThread(dataThread);

      const fakeId = () => '2';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      const addThread = await threadRepositoryPostgres.addThread(newThread);

      expect(addThread).toStrictEqual({
        id: 'thread-2',
        title: dataThread.title,
        owner: dataThread.owner,
      });
    });
  });

  describe('getThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThread('thread-1')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      const dataUser = {
        id: 'user-3',
        username: 'dicoding3',
        password: 'secret',
      };

      const dataAddThread = {
        id: 'thread-12345',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };

      await UserTableTestHelper.addUser(dataUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await ThreadTableTestHelper.addThread(dataAddThread);

      const dataThread = await threadRepositoryPostgres.getThread(
        dataAddThread.id
      );

      expect(dataThread).toStrictEqual({
        id: dataAddThread.id,
        title: dataAddThread.title,
        body: dataAddThread.body,
        username: dataAddThread.username,
        date: dataAddThread.date,
      });
    });
  });

  describe('verifyThread function', () => {
    it('should throw error when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThread('thread-1')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      const dataUser = {
        id: 'user-4',
        username: 'dicoding4',
        password: 'secret_password',
      };
      const dataThread = { id: 'thread-10', owner: dataUser.id };

      await UserTableTestHelper.addUser(dataUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread(dataThread);

      await expect(
        threadRepositoryPostgres.verifyThread(dataThread.id)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  // comment
  describe('addComment function', () => {
    it('addComment function should add database entry for said comment', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        content: 'Isi Komentar',
        threadId: dataThread.id,
        owner: dataThread.owner,
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);

      const newComment = new NewComment(dataComment);

      const fakeId = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      const addComment = await threadRepositoryPostgres.addComment(newComment);
      const comments = await ThreadTableTestHelper.getComment(addComment.id);

      expect(addComment).toStrictEqual({
        id: 'comment-1',
        content: newComment.content,
        owner: newComment.owner,
      });
      expect(comments).toHaveLength(1);
    });

    it('should return add comment correctly', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        content: 'Isi Komentar',
        threadId: dataThread.id,
        owner: dataThread.owner,
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      const newComment = new NewComment(dataComment);

      const fakeId = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      const addComment = await threadRepositoryPostgres.addComment(newComment);

      expect(addComment).toStrictEqual({
        id: 'comment-1',
        content: newComment.content,
        owner: newComment.owner,
      });
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return true when comment owner is the same as the payload', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        content: 'Isi Komentar',
        threadId: dataThread.id,
        owner: dataThread.owner,
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      const newComment = new NewComment(dataComment);

      const fakeId = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      await threadRepositoryPostgres.addComment(newComment);

      const commentOwner = await threadRepositoryPostgres.verifyCommentOwner(
        'comment-1',
        dataComment.owner
      );

      expect(commentOwner).toBeTruthy();
    });

    it('should return Authorizationerror when comment owner is not the same as the payload', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        content: 'Isi Komentar',
        threadId: dataThread.id,
        owner: dataThread.owner,
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      const newComment = new NewComment(dataComment);

      const fakeId = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      await threadRepositoryPostgres.addComment(newComment);

      await expect(
        threadRepositoryPostgres.verifyCommentOwner('comment-1', 'user-2')
      ).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentThread function', () => {
    it('should return all comments from a thread correctly', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);

      const firstComment = {
        id: 'comment-1',
        content: 'Komentar Pertama',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const secondComment = {
        id: 'comment-2',
        content: 'Komentar Kedua',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };

      await ThreadTableTestHelper.addComment({
        ...firstComment,
        threadId: dataThread.id,
      });
      await ThreadTableTestHelper.addComment({
        ...secondComment,
        threadId: dataThread.id,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const getComment = await threadRepositoryPostgres.getCommentThread(
        dataThread.id
      );

      const mapDataComment = getComment.map(
        ({ id, content, date, username }) => ({
          id,
          content,
          date,
          username,
        })
      );

      expect(mapDataComment).toEqual([
        { ...firstComment, username: dataUser.username },
        { ...secondComment, username: dataUser.username },
      ]);
    });

    it('should return an empty array when no comments exist for the thread', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const getComment = await threadRepositoryPostgres.getCommentThread(
        'thread-1'
      );
      expect(getComment).toStrictEqual([]);
    });
  });

  describe('verifyCommentThread function', () => {
    it('should throw NotFoundError when thread is not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyCommentThread(
          'thread-123',
          'comment-123'
        )
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment is not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyCommentThread(
          'thread-123',
          'comment-123'
        )
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread and comment are available', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        id: 'comment-1',
        threadId: dataThread.id,
        owner: dataThread.owner,
        content: 'Isi Komentar',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      await ThreadTableTestHelper.addComment(dataComment);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyCommentThread(
          dataComment.id,
          dataThread.id
        )
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should throw NotFoundError when comment is not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.deleteComment('comment-1')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment correctly', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        id: 'comment-1',
        threadId: dataThread.id,
        owner: dataThread.owner,
        content: 'Isi Komentar',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      await ThreadTableTestHelper.addComment(dataComment);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await threadRepositoryPostgres.deleteComment(dataComment.id);

      const getComment = await ThreadTableTestHelper.getComment(dataComment.id);
      expect(getComment[0].deleted).toEqual(true);
    });
  });

  // reply
  describe('AddReply function', () => {
    it('AddReply function should add database', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        id: 'comment-1',
        threadId: dataThread.id,
        owner: dataThread.owner,
        content: 'Isi Komentar',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataReply = {
        commentId: dataComment.id,
        content: 'Isi Balasan',
        owner: dataComment.owner,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      await ThreadTableTestHelper.addComment(dataComment);

      const newReply = new NewReply(dataReply);

      const fakeId = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      const addReply = await threadRepositoryPostgres.addReply(newReply);
      const getReply = await ThreadTableTestHelper.getReply('reply-1');

      // assert
      expect(addReply).toStrictEqual({
        id: 'reply-1',
        content: newReply.content,
        owner: newReply.owner,
      });
      expect(getReply).toHaveLength(1);
    });
  });

  describe('verifyReply function', () => {
    it('should throw NotFoundError when reply is not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyReply('thread-1', 'comment-1', 'reply-1')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply is available', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        id: 'comment-1',
        threadId: dataThread.id,
        owner: dataThread.owner,
        content: 'Isi Komentar',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataReply = {
        id: 'reply-1',
        commentId: dataComment.id,
        content: 'Isi Balasan',
        owner: dataComment.owner,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      await ThreadTableTestHelper.addComment(dataComment);
      await ThreadTableTestHelper.addReply(dataReply);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyReply(
          dataThread.id,
          dataComment.id,
          dataReply.id
        )
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply is not owner', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        id: 'comment-1',
        threadId: dataThread.id,
        owner: dataThread.owner,
        content: 'Isi Komentar',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataReply = {
        id: 'reply-1',
        commentId: dataComment.id,
        content: 'Isi Balasan',
        owner: dataComment.owner,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      await ThreadTableTestHelper.addComment(dataComment);
      await ThreadTableTestHelper.addReply(dataReply);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyReplyOwner(dataReply.id, 'user-321')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when reply is owner', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        id: 'comment-1',
        threadId: dataThread.id,
        owner: dataThread.owner,
        content: 'Isi Komentar',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataReply = {
        id: 'reply-1',
        commentId: dataComment.id,
        content: 'Isi Balasan',
        owner: dataComment.owner,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      await ThreadTableTestHelper.addComment(dataComment);
      await ThreadTableTestHelper.addReply(dataReply);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyReplyOwner(dataReply.id, dataUser.id)
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply from database', async () => {
      const dataUser = {
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      };
      const dataThread = {
        id: 'thread-1',
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: dataUser.id,
        username: dataUser.username,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataComment = {
        id: 'comment-1',
        threadId: dataThread.id,
        owner: dataThread.owner,
        content: 'Isi Komentar',
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      const dataReply = {
        id: 'reply-1',
        commentId: dataComment.id,
        content: 'Isi Balasan',
        owner: dataComment.owner,
        date: new Date('2023-09-09T03:14:51.495Z'),
      };
      await UserTableTestHelper.addUser(dataUser);
      await ThreadTableTestHelper.addThread(dataThread);
      await ThreadTableTestHelper.addComment(dataComment);
      await ThreadTableTestHelper.addReply(dataReply);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await threadRepositoryPostgres.deleteReply(dataReply.id);

      const replies = await ThreadTableTestHelper.getReply(dataReply.id);
      expect(replies).toHaveLength(1);
      expect(replies[0].deleted).toEqual(true);
    });

    it('should throw NotFoundError when reply is not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.deleteReply('reply-123')
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
