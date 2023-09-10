class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }
  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const comment = await this._threadRepository.getCommentThread(threadId);
    const reply = await this._threadRepository.getReply(threadId);

    const comments = comment.map(
      ({ id, username, date, deleted, content }) => ({
        id,
        username,
        date,
        content: deleted ? '**komentar dihapus**' : content,
        replies: reply
          .filter(({ comment_id }) => comment_id == id)
          .map(({ id, content, deleted, date, username }) => ({
            id,
            content: deleted ? '**balasan komentar dihapus**' : content,
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
