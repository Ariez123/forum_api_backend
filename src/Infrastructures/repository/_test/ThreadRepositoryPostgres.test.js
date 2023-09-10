const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/thread/entities/NewThread');
const pool = require('../../database/postgres/pool');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should new thread and return added thread correctly', async () => {
      await UserTableTestHelper.addUser({
        id: 'user-1',
        username: 'dicoding1',
        password: 'secret_password',
      });
      const newThread = new NewThread({
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: 'user-1',
      });

      const fakeId = () => '321';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      const dataThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadTableTestHelper.getThread('thread-321');
      expect(dataThread).toStrictEqual({
        id: 'thread-321',
        owner: 'user-1',
        title: 'Coba Thread',
      });
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      await UserTableTestHelper.addUser({
        id: 'user-2',
        username: 'dicoding2',
        password: 'secret',
      });
      const dataPayload = {
        title: 'Coba Thread',
        body: 'Isi Thread',
        owner: 'user-2',
      };
      const newThread = new NewThread(dataPayload);

      const fakeId = () => '321';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeId
      );

      const dataThread = await threadRepositoryPostgres.addThread(newThread);

      expect(dataThread).toStrictEqual({
        id: 'thread-321',
        title: 'Coba Thread',
        owner: 'user-2',
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
      await UserTableTestHelper.addUser({
        id: 'user-3',
        username: 'dicoding3',
        password: 'secret',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({
        id: 'thread-12345',
        owner: 'user-3',
      });

      const dataThread = await threadRepositoryPostgres.getThread('thread-12345');
      expect(dataThread).toStrictEqual({
        id: 'thread-12345',
        title: 'Coba Thread',
        body: 'Isi Thread',
        username: 'dicoding3',
        date: new Date('2023-09-09T03:14:51.495Z'),
      });
    });
  });

  // describe('verifyThread function', () => {
  //   it('should throw NotFoundError when thread not found', async () => {
  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

  //     await expect(
  //       threadRepositoryPostgres.verifyThread('thread-1')
  //     ).rejects.toThrowError(NotFoundError);
  //   });

  //   it('should not throw NotFoundError when thread found', async () => {
  //     await UserTableTestHelper.addUser({
  //        id : 'user-4'
  //       username: 'dicoding',
  //       password: 'secret_password',
  //     });

  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
  //     await ThreadTableTestHelper.addThread({ id: 'thread-123' });

  //     await expect(
  //       threadRepositoryPostgres.verifyThread('thread-123')
  //     ).resolves.not.toThrowError(NotFoundError);
  //   });
  // });
});
