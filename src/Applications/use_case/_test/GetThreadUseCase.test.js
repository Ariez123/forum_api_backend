const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('GetThreadUseCase', () => {
  it('should get thread correctly', async () => {
    const dataPayload = {
      threadId: 'thread-1',
    };

    const dataGetThread = {
      id: 'thread-1',
      title: 'Coba Thread',
      body: 'Isi Thread',
      date: '2023-09-09T03:14:51.495Z',
      username: 'user-1',
    };
    const dataComment = [
      {
        id: 'comment-1',
        username: 'user-2',
        date: '2023-09-09T03:14:51.495Z',
        content: 'Isi Komentar',
        deleted: false,
      },
    ];

    const dataReply = [
      {
        id: 'reply-1',
        content: 'Isi Balasan Komentar',
        date: '2023-09-09T03:14:51.495Z',
        username: 'user-3',
        comment_id: 'comment-1',
        deleted: false,
      },
    ];

    const mapDataComment = dataComment.map(
      ({ deleted: deletedComment, ...otherProperti }) => otherProperti
    );
    const mapDataReply = dataReply.map(
      ({ comment_id, deleted, ...otherProperti }) => otherProperti
    );

    const dataCommentReply = [
      {
        ...mapDataComment[0],
        replies: mapDataReply,
      },
    ];

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(dataGetThread));

    mockThreadRepository.getCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(dataComment));

    mockThreadRepository.getReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(dataReply));

    const mockGetThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const theThread = await mockGetThreadUseCase.execute(dataPayload.threadId);

    expect(theThread).toStrictEqual({
      ...dataGetThread,
      comments: dataCommentReply,
    });

    expect(mockThreadRepository.getThread).toBeCalledWith(dataPayload.threadId);
    expect(mockThreadRepository.getCommentThread).toBeCalledWith(
      dataPayload.threadId
    );
    expect(mockThreadRepository.getReply).toBeCalledWith(dataPayload.threadId);
  });

  it('should get thread delete comment and reply', async () => {
    const dataPayload = {
      threadId: 'thread-1',
    };

    const dataGetThread = {
      id: 'thread-1',
      title: 'Coba Thread',
      body: 'Isi Thread',
      date: '2023-09-09T03:14:51.495Z',
      username: 'user-1',
    };
    const dataComment = [
      {
        id: 'comment-1',
        username: 'user-2',
        date: '2023-09-09T03:14:51.495Z',
        content: '**komentar telah dihapus**',
        deleted: true,
      },
    ];

    const dataReply = [
      {
        id: 'reply-1',
        content: '**balasan telah dihapus**',
        date: '2023-09-09T03:14:51.495Z',
        username: 'user-3',
        comment_id: 'comment-1',
        deleted: true,
      },
    ];

    const mapDataComment = dataComment.map(
      ({ deleted: deletedComment, ...otherProperti }) => otherProperti
    );
    const mapDataReply = dataReply.map(
      ({ comment_id, deleted, ...otherProperti }) => otherProperti
    );

    const dataCommentReply = [
      {
        ...mapDataComment[0],
        replies: mapDataReply,
      },
    ];

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(dataGetThread));

    mockThreadRepository.getCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(dataComment));

    mockThreadRepository.getReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(dataReply));

    const mockGetThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const theThread = await mockGetThreadUseCase.execute(dataPayload.threadId);

    expect(theThread).toStrictEqual({
      ...dataGetThread,
      comments: dataCommentReply,
    });
    expect(mockThreadRepository.getThread).toBeCalledWith(dataPayload.threadId);
  });
});
