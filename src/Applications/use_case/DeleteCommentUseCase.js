class DeleteCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }
  async execute({ commentId, threadId, owner }) {
    await this._threadRepository.verifyCommentThread(commentId, threadId);
    await this._threadRepository.verifyCommentOwner(commentId, owner);
    await this._threadRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
