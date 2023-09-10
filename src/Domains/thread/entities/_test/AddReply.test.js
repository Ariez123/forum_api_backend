const AddReply = require('../AddReply');

describe('AddReply Entities', () => {
  it('should throw error property', () => {
    const dataPayload = {
      id: 'reply-1',
      content: 'Isi Balasan Komentar',
    };

    expect(() => new AddReply(dataPayload)).toThrowError(
      'ADD_REPLY.PROPERTY_NOT_FOUND'
    );
  });

  it('should throw error type data', () => {
    const dataPayload = {
      id: [1],
      content: 'Isi Balasan Komentar',
      owner: 'user-1',
    };

    expect(() => new AddReply(dataPayload)).toThrowError(
      'ADD_REPLY.INCCORECT_TYPE_DATA'
    );
  });

  it('should create addReply correctly', () => {
    const dataPayload = {
      id: 'reply-2',
      content: 'Isi Balasan Komentar',
      owner: 'user-2',
    };

    const { id, content, owner } = new AddReply(dataPayload);

    expect(id).toEqual(dataPayload.id);
    expect(content).toEqual(dataPayload.content);
    expect(owner).toEqual(dataPayload.owner);
  });
});
