const NewReply = require('../NewReply');

describe('NewReply Entities', () => {
  it('should throw error property', () => {
    const dataPayload = {
      content: 'Isi Balasan Komentar',
    };

    expect(() => new NewReply(dataPayload)).toThrowError(
      'NEW_REPLY.PROPERTY_NOT_FOUND'
    );
  });

  it('should throw error type data', () => {
    const dataPayload = {
      commentId: true,
      content: ['Isi Balasan Komentar'],
      owner: 'user-123',
    };

    expect(() => new NewReply(dataPayload)).toThrowError(
      'NEW_REPLY.INCCORECT_TYPE_DATA'
    );
  });

  it('should create newReply correctly', () => {
    const dataPayload = {
      commentId: 'comment-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const { commentId, content, owner } = new NewReply(dataPayload);

    expect(commentId).toEqual(dataPayload.commentId);
    expect(content).toEqual(dataPayload.content);
    expect(owner).toEqual(dataPayload.owner);
  });
});
