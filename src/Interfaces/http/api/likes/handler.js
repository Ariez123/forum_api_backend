const LikeUnlikeUseCase = require('../../../../Applications/use_case/LikeUnlikeCommentUseCase');
const autoBind = require('auto-bind');

class LikesHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async putLikeUnlikeHandler({ params, auth }, h) {
    const likeUnlikeUseCase = this._container.getInstance(
      LikeUnlikeUseCase.name
    );

    const dataPayload = {
      threadId: params.threadId,
      commentId: params.commentId,
      userId: auth.credentials.id,
    };

    await likeUnlikeUseCase.execute(dataPayload);

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
