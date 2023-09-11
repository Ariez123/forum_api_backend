const ThreadRepository = require('../ThreadRepository');

describe('Thread Repository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadRepository = new ThreadRepository();
    // thread
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.getThread('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.verifyThread('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    // comment
    await expect(threadRepository.addComment({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(
      threadRepository.verifyCommentOwner('', '')
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.deleteComment('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.getCommentThread('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.verifyCommentThread('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    // reply
    await expect(threadRepository.addReply({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(
      threadRepository.verifyReplyOwner('', '')
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.deleteReply('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.verifyReply('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.getReply('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
