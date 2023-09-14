const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/thread/entities/NewReply');
const AddReply = require('../../../Domains/thread/entities/AddReply');

describe('AddReplyUseCase', () => {
  it('should add reply correctly', async () => {
    const dataPayload = {
      commentId: 'comment-1',
      threadId: 'thread-1',
      content: 'Isi Balasan Komentar',
      owner: 'user-1',
    };

    const dataReply = new AddReply({
      id: 'reply-1',
      content: dataPayload.content,
      owner: dataPayload.owner,
      date: '2023',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.verifyCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.addReply = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddReply({
          id: dataReply.id,
          content: dataReply.content,
          owner: dataReply.owner,
          date: '2023-09-09T03:14:51.495Z',
        })
      )
    );

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    const addReply = await addReplyUseCase.execute(dataPayload);

    expect(addReply).toStrictEqual(dataReply);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(
      dataPayload.threadId
    );
    expect(mockThreadRepository.verifyCommentThread).toBeCalledWith(
      dataPayload.commentId,
      dataPayload.threadId
    );
    expect(mockThreadRepository.addReply).toBeCalledWith(
      new NewReply(dataPayload)
    );
  });
});
