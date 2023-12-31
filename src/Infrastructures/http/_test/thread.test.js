const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
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
      expect(resThread.statusCode).toEqual(201);
      expect(resThreadJson.status).toEqual('success');
      expect(resThreadJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // data salah
      const wrongDataThread = {
        title: 'Coba Thread',
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
        payload: wrongDataThread,
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
      // data salah
      const wrongDataThread = {
        title: 'Coba Thread',
        body: { data: `Isi Thread` },
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
        payload: wrongDataThread,
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
      expect(resGetThread.statusCode).toEqual(200);
      expect(resGetThreadJson.status).toEqual('success');
      expect(resGetThreadJson.message).toEqual('Berhasil ambil data thread!');
    });
    it('should get threads not found', async () => {
      const server = await createServer(container);
      const resGetThread = await server.inject({
        method: 'GET',
        url: `/threads/xxx`,
      });
      const resGetThreadJson = JSON.parse(resGetThread.payload);
      expect(resGetThread.statusCode).toEqual(404);
      expect(resGetThreadJson.status).toEqual('fail');
      expect(resGetThreadJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('POST Comment', () => {
    it('should currenly', async () => {
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
      expect(resComment.statusCode).toEqual(201);
      expect(resCommentJson.status).toEqual('success');
      expect(resCommentJson.data.addedComment).toBeDefined();
    });
    it('should wrong data comment, property not found', async () => {
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
      const { id: threadId, owner } = resThreadJson.data.addedThread;

      // data salah
      const wrongDataComment = {
        threadId: threadId,
        owner,
      };

      const resComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: wrongDataComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resCommentJson = JSON.parse(resComment.payload);
      expect(resComment.statusCode).toEqual(400);
      expect(resCommentJson).toStrictEqual({
        status: 'fail',
        message:
          'tidak dapat tambah komentar thread baru, properti tidak di temukan',
      });
    });
    it('should wrong data comment, property not found', async () => {
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
      const { id: threadId, owner } = resThreadJson.data.addedThread;

      // data salah
      const wrongDataComment = {
        threadId: threadId,
        owner,
        content: { data: 'Isi Komentar' },
      };

      const resComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: wrongDataComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resCommentJson = JSON.parse(resComment.payload);
      expect(resComment.statusCode).toEqual(400);
      expect(resCommentJson).toStrictEqual({
        status: 'fail',
        message:
          'tidak dapat tambah komentar thread baru, tipe data tidak sesuai',
      });
    });
  });

  describe('DELETE Comment', () => {
    it('should currenly', async () => {
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

      expect(resDeleteCommentJson).toStrictEqual({
        status: 'success',
        message: 'Berhasil hapus data comment!',
      });
    });
    it('should delete comment but comment not found', async () => {
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

      const resDeleteComment = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resDeleteCommentJson = JSON.parse(resDeleteComment.payload);

      expect(resDeleteCommentJson).toStrictEqual({
        status: 'fail',
        message: 'Komentar thread tidak di temukan!',
      });
    });
  });

  describe('POST Reply', () => {
    it('should currenly', async () => {
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
      expect(resReply.statusCode).toEqual(201);
      expect(resReplyJson.status).toEqual('success');
      expect(resReplyJson.data.addedReply).toBeDefined();
    });
    it('should data property not found', async () => {
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
      const { id: commentId, owner } = resCommentJson.data.addedComment;
      // data salah
      const wrongDataReply = {
        commentId,
        owner,
      };

      const resReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: wrongDataReply,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resReplyJson = JSON.parse(resReply.payload);
      expect(resReply.statusCode).toEqual(400);
      expect(resReplyJson).toStrictEqual({
        status: 'fail',
        message:
          'tidak dapat tambah balasan komentar baru, properti tidak di temukan',
      });
    });
    it('should data type wrong', async () => {
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
      const { id: commentId, owner } = resCommentJson.data.addedComment;

      // data salah
      const wrongDataReply = {
        commentId,
        owner,
        content: { data: 'Isi Balasan' },
      };

      const resReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: wrongDataReply,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resReplyJson = JSON.parse(resReply.payload);
      expect(resReply.statusCode).toEqual(400);
      expect(resReplyJson).toStrictEqual({
        status: 'fail',
        message:
          'tidak dapat tambah balasan komentar baru, tipe data tidak sesuai',
      });
    });
  });

  describe('Delete Reply', () => {
    it('should currenly', async () => {
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
      expect(resDeleteReplyJson).toStrictEqual({
        status: 'success',
        message: 'Berhasil hapus balasan!',
      });
    });
    it('should wrong reply not found', async () => {
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

      const resDeleteReply = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resDeleteReplyJson = JSON.parse(resDeleteReply.payload);
      expect(resDeleteReplyJson).toStrictEqual({
        status: 'fail',
        message: 'Balasan komentar tidak di temukan!',
      });
    });
  });
});
