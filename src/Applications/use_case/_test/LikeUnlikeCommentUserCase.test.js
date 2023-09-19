const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUnlikeCommentUseCase = require('../LikeUnlikeCommentUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('LikeUnlikeCommentUseCase use', () => {
  it('should orchestrating the unlike comment action correctly', async () => {
    const dataPayload = {
      threadId: 'thread-1',
      commentId: 'comment-1',
      userId: 'user-12',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockLikeRepository.unlikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const likeUnlikeComment = new LikeUnlikeCommentUseCase({
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    const isLike = await likeUnlikeComment.execute(dataPayload);

    expect(isLike).toEqual(1);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(
      dataPayload.threadId
    );
    expect(mockThreadRepository.verifyCommentThread).toBeCalledWith(
      dataPayload.commentId,
      dataPayload.threadId
    );
    expect(mockLikeRepository.checkLikeComment).toBeCalledWith(dataPayload);
    expect(mockLikeRepository.unlikeComment).toBeCalledWith(dataPayload);
  });

  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const dataPayload = {
      threadId: 'thread-1',
      commentId: 'comment-1',
      userId: 'user-1',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
      mockThreadRepository.verifyCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(0));
    mockLikeRepository.likeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const likeUnlikeComment = new LikeUnlikeCommentUseCase({
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    const isUnlike = await likeUnlikeComment.execute(dataPayload);

    expect(isUnlike).toEqual(1);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(
      dataPayload.threadId
    );
    expect(mockThreadRepository.verifyCommentThread).toBeCalledWith(
      dataPayload.commentId,
      dataPayload.threadId
    );
    expect(mockLikeRepository.checkLikeComment).toBeCalledWith(dataPayload);
    expect(mockLikeRepository.likeComment).toBeCalledWith(dataPayload);
  });
});
