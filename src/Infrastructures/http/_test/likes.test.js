const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikeTableTestHelper');

describe('endpoints likes', () => {
  // data benar yang dibutuh kan untuk test
  const dataUser = {
    username: 'dicoding',
    password: 'secret',
    fullname: 'User Dicoding',
  };
  const dataThread = {
    title: 'Coba Thread',
    body: 'Isi Thread',
  };
  const dataComment = {
    threadId: dataThread.id,
    owner: dataThread.owner,
    content: 'Isi Komentar',
  };
  const dataReply = {
    commentId: dataComment.id,
    content: 'Isi Balasan',
    owner: dataComment.owner,
  };
  //

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 when request not contain access token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/xxxx/comments/xxxx/likes',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: dataUser,
      });

      const resAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: dataUser.username,
          password: dataUser.password,
        },
      });
      const { accessToken } = JSON.parse(resAuth.payload).data;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/xxxx/comments/xxxx/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: dataUser,
      });

      const resAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: dataUser.username,
          password: dataUser.password,
        },
      });
      const { accessToken } = JSON.parse(resAuth.payload).data;
      const resThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: dataThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resThreadJson = JSON.parse(resThread.payload);
      const threadId = resThreadJson.data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/comment-123/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'Komentar thread tidak di temukan!'
      );
    });

    it('should response 200 when add like success', async () => {
        const server = await createServer(container);
        await server.inject({
        method: 'POST',
        url: '/users',
        payload: dataUser,
      });

      const resAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: dataUser.username,
          password: dataUser.password,
        },
      });
      const { accessToken } = JSON.parse(resAuth.payload).data;
      const resThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: dataThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resThreadJson = JSON.parse(resThread.payload);
      const threadId = resThreadJson.data.addedThread.id;

      const resComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: dataComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resCommentJson = JSON.parse(resComment.payload);
      const commentId = resCommentJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
