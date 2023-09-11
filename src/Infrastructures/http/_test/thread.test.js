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
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await pool.end();
  });

  // thread
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
      const dataPayload = {
        title: 'Coba Thread',
      };

      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding',
        },
      });

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
      const dataPayload = {
        title: 'Coba Thread',
        body: { data: `Isi Thread` },
      };

      const server = await createServer(container);
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

  describe('GET /threads', () => {
    it('should currenly', async () => {
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

      const resReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: dataReply,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resGetThread = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const resGetThreadJson = JSON.parse(resGetThread.payload);

      expect(resGetThreadJson.status).toEqual('success');
    });
  });

  describe('DELETE Comment', () => {
    it('should currenly', async () => {
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

      const resDeleteComment = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resDeleteCommentJson = JSON.parse(resDeleteComment.payload);

      expect(resDeleteCommentJson.status).toEqual('success');
    });
  });

  describe('Delete Reply', () => {
    it('should currenly', async () => {
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

      const resReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: dataReply,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resReplyJson = JSON.parse(resReply.payload);
      const replyId = resReplyJson.data.addedReply.id;

      const resDeleteReply = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resDeleteReplyJson = JSON.parse(resDeleteReply.payload);

      expect(resDeleteReplyJson.status).toEqual('success');
    });
  });
});
