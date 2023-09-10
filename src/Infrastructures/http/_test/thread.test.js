const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /threads', () => {
    it('should response 201 and new thread', async () => {
      const dataPayload = {
        title: 'Coba Thread',
        body: 'Isi Thread',
      };

      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding12',
          password: 'secret',
          fullname: 'Dicoding',
        },
      });

      const resAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding12',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(resAuth.payload).data;
      const resThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: dataPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resThreadJson = JSON.parse(resThread.payload);
      expect(resThread.statusCode).toEqual(201);
      expect(resThreadJson.status).toEqual('success');
      expect(resThreadJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const dataPayload = {
        title: 'Coba Thread',
      };

      const server = await createServer(container);
      // Add User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding',
        },
      });

      // Action
      const resAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(resAuth.payload).data;
      const resThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: dataPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resThreadJson = JSON.parse(resThread.payload);
      expect(resThread.statusCode).toEqual(400);
      expect(resThreadJson.status).toEqual('fail');
      expect(resThreadJson.message).toEqual(
        'tidak dapat tambah thread baru, properti tidak di temukan'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const dataPayload = {
        title: 'Coba Thread',
        body: { data: `Isi Thread` },
      };

      const server = await createServer(container);
      // Add User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding3',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const resAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding3',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(resAuth.payload).data;
      const resThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: dataPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resThreadJson = JSON.parse(resThread.payload);
      expect(resThread.statusCode).toEqual(400);
      expect(resThreadJson.status).toEqual('fail');
      expect(resThreadJson.message).toEqual(
        'tidak dapat tambah thread baru, tipe data tidak sesuai'
      );
    });
  });
});
