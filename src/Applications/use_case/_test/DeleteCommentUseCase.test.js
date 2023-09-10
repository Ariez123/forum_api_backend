const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should delete comment correctly', async () => {
    const dataPayload = {
      commentId: 'comment-1',
      threadId: 'thread-1',
      owner: 'user-1',
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(dataPayload);

    expect(mockThreadRepository.verifyCommentThread).toBeCalledWith(
      dataPayload.commentId,
      dataPayload.threadId
    );
    expect(mockThreadRepository.verifyCommentOwner).toBeCalledWith(
      dataPayload.commentId,
      dataPayload.owner
    );
    expect(mockThreadRepository.deleteComment).toBeCalledWith(
      dataPayload.commentId
    );
  });
});
