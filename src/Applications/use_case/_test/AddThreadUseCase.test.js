const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const NewThread = require('../../../Domains/thread/entities/NewThread');
const AddThread = require('../../../Domains/thread/entities/AddThread');

describe('AddThreadUseCase', () => {
  it('should add thread correctly', async () => {
    const dataPayload = {
      title: 'Coba Thread',
      body: 'Isi Thread',
      owner: 'user-1',
    };

    const dataAddThread = new AddThread({
      id: 'thread-1',
      title: dataPayload.title,
      body: dataPayload.body,
      date: '2023',
      owner: dataPayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddThread({
          id: 'thread-1',
          title: dataPayload.title,
          date: '2023-09-09T03:14:51.495Z',
          owner: dataPayload.owner,
        })
      )
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addThread = await addThreadUseCase.execute(dataPayload);

    expect(addThread).toStrictEqual(dataAddThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: dataPayload.title,
        body: dataPayload.body,
        owner: dataPayload.owner,
      })
    );
  });
});
