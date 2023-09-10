const AddThread = require('../AddThread');

describe('AddThread Entities', () => {
  it('should throw error property', () => {
    const dataPayload = {
      id: 'thread-1',
      title: 'Coba Thread',
    };

    expect(() => new AddThread(dataPayload)).toThrowError(
      'ADD_THREAD.PROPERTY_NOT_FOUND'
    );
  });

  it('should throw error type data', () => {
    const dataPayload = {
      id: 'thread-2',
      title: 'Coba Thread',
      owner: { id: 'user-1' },
    };

    expect(() => new AddThread(dataPayload)).toThrowError(
      'ADD_THREAD.INCCORECT_TYPE_DATA'
    );
  });

  it('should create AddThread correctly', () => {
    const dataPayload = {
      id: 'thread-3',
      title: 'Coba Thread',
      owner: 'user-1',
    };

    const addThread = new AddThread(dataPayload);

    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.id).toEqual(dataPayload.id);
    expect(addThread.title).toEqual(dataPayload.title);
    expect(addThread.owner).toEqual(dataPayload.owner);
  });
});
