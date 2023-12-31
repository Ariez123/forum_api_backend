class DeleteReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ replyId, commentId, threadId, owner }) {
    await this._threadRepository.verifyReply(threadId, commentId, replyId);
    await this._threadRepository.verifyReplyOwner(replyId, owner);
    await this._threadRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
