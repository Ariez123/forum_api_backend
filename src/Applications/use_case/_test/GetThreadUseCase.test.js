const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('GetThreadUseCase', () => {
  it('should get thread correctly', async () => {
    // Arrange
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

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(dataGetThread));

    const mockGetThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const theThread = await mockGetThreadUseCase.execute(dataPayload.threadId);

    expect(theThread).toStrictEqual(dataGetThread);
    expect(mockThreadRepository.getThread).toBeCalledWith(dataPayload.threadId);
  });
});
