class GetThreadUseCase {
  constructor({ threadRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
  }
  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const comment = await this._threadRepository.getCommentThread(threadId);
    const reply = await this._threadRepository.getReply(threadId);
    const likesCount = await this._likeRepository.getLikeCountComment(
      threadId
    );

    const comments = comment.map(
      ({ id, username, date, deleted, content }) => ({
        id,
        username,
        date,
        content: deleted ? '**komentar telah dihapus**' : content,
        likeCount: likesCount.filter(({ comment_id }) => comment_id === id)
          .length,
        replies: reply
          .filter(({ comment_id }) => comment_id == id)
          .map(({ id, content, deleted, date, username }) => ({
            id,
            content: deleted ? '**balasan telah dihapus**' : content,
            date,
            username,
          })),
      })
    );

    return {
      ...thread,
      comments,
    };
  }
}

module.exports = GetThreadUseCase;
