const NewComment = require('../../../Domains/thread/entities/NewComment');
const AddComment = require('../../../Domains/thread/entities/AddComment');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should add comment correctly', async () => {
    const dataPayload = {
      content: 'Isi Comment',
      threadId: 'thread-1',
      owner: 'user-1',
    };

    const dataComment = new AddComment({
      id: 'comment-1',
      content: dataPayload.content,
      threadId: dataPayload.threadId,
      date: '2023-09-09T03:14:51.495Z',
      owner: dataPayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new AddComment(dataComment)));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    const addComment = await addCommentUseCase.execute(dataPayload);

    expect(addComment).toStrictEqual(dataComment);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(
      dataPayload.threadId
    );
    expect(mockThreadRepository.addComment).toBeCalledWith(
      new NewComment({
        content: dataPayload.content,
        threadId: dataPayload.threadId,
        owner: dataPayload.owner,
      })
    );
  });
});
