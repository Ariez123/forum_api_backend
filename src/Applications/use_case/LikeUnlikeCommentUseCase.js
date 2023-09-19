class LikeUnlikeComment {
  constructor({ threadRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
  }

  async execute(dataPayload) {
    await this._threadRepository.verifyThread(dataPayload.threadId);
    await this._threadRepository.verifyCommentThread(
      dataPayload.commentId,
      dataPayload.threadId
    );

    const isLike = await this._likeRepository.checkLikeComment(dataPayload);

    if (isLike > 0) {
      return this._likeRepository.unlikeComment(dataPayload);
    }

    return this._likeRepository.likeComment(dataPayload);
  }
}

module.exports = LikeUnlikeComment;
