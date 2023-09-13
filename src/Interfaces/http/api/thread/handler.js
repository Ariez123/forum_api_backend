const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const autoBind = require('auto-bind');

class ThreadHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async getThreadHandler(req) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const result = await getThreadUseCase.execute(req?.params?.threadId);

    return {
      status: 'success',
      message: 'Berhasil ambil data thread!',
      data: {
        thread: result,
      },
    };
  }

  async postThreadHandler({ payload, auth }, h) {
    const dataPayload = {
      title: payload.title,
      body: payload.body,
      owner: auth.credentials.id,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const resultAdd = await addThreadUseCase.execute(dataPayload);

    const response = h.response({
      status: 'success',
      message: 'Berhasil simpan thread!',
      data: {
        addedThread: resultAdd,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler({ payload, auth, params }, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const resultAdd = await addCommentUseCase.execute({
      content: payload.content,
      threadId: params.threadId,
      owner: auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
      message: 'Berhasil simpan data comment!',
      data: {
        addedComment: resultAdd,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler({ params, auth }, h) {
    const dataPayload = {
      commentId: params.commentId,
      threadId: params.threadId,
      owner: auth.credentials.id,
    };
    const deleteComment = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await deleteComment.execute(dataPayload);

    return {
      status: 'success',
      message: `Berhasil hapus data comment!`,
    };
  }

  // reply
  async postReplyHandler({ payload, params, auth }, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const { content } = payload;
    const { threadId, commentId } = params;
    const { id: owner } = auth.credentials;

    const resultAdd = await addReplyUseCase.execute({
      content,
      threadId,
      commentId,
      owner,
    });

    const response = h.response({
      status: 'success',
      message: `Berhasil simpan data balasan!`,
      data: {
        addedReply: resultAdd,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler({ payload, params, auth }, h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    const { threadId, commentId, replyId } = params;
    const { id: owner } = auth.credentials;

    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      owner,
    });

    return {
      status: 'success',
      message: 'Berhasil hapus balasan!',
    };
  }
}

module.exports = ThreadHandler;
