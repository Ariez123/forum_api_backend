const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should delete reply correctly', async () => {
    const dataPayload = {
      replyId: 'reply-1',
      commentId: 'comment-1',
      threadId: 'thread-1',
      owner: 'user-1',
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(dataPayload);

    expect(mockThreadRepository.verifyReply).toBeCalledWith(
      dataPayload.threadId,
      dataPayload.commentId,
      dataPayload.replyId
    );
    expect(mockThreadRepository.verifyReplyOwner).toBeCalledWith(
      dataPayload.replyId,
      dataPayload.owner
    );
    expect(mockThreadRepository.deleteReply).toBeCalledWith(
      dataPayload.replyId
    );
  });
});
