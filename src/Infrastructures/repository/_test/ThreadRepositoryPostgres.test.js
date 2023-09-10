const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const NewThread = require('../../../Domains/thread/entities/NewThread');
const NewComment = require('../../../Domains/thread/entities/NewComment');

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
});
