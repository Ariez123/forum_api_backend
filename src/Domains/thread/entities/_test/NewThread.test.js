const NewThread = require('../NewThread');

describe('NewThread Entities', () => {
  it('should throw error property', () => {
    const dataPayload = {
      title: 'Coba Thread',
    };

    expect(() => new NewThread(dataPayload)).toThrowError(
      'NEW_THREAD.PROPERTY_NOT_FOUND'
    );
  });

  it('should throw error type data', () => {
    const dataPayload = {
      title: 'Coba Thread',
      body: 'Isi Thread',
      owner: { data: 'user-1' },
    };

    expect(() => new NewThread(dataPayload)).toThrowError(
      'NEW_THREAD.INCCORECT_TYPE_DATA'
    );
  });

  it('should create NewThread correctly', () => {
    const dataPayload = {
      title: 'Coba Thread',
      body: 'Isi Thread',
      owner: 'user-2',
    };

    const newThread = new NewThread(dataPayload);

    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(dataPayload.title);
    expect(newThread.body).toEqual(dataPayload.body);
    expect(newThread.owner).toEqual(dataPayload.owner);
  });
});
