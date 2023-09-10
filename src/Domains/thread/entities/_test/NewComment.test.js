const NewComment = require('../NewComment');

describe('NewComment Entities', () => {
  it('should throw error property', () => {
    const dataPayload = {
      content: 'Isi Komentar',
    };

    expect(() => new NewComment(dataPayload)).toThrowError(
      'NEW_COMMENT.PROPERTY_NOT_FOUND'
    );
  });

  it('should throw error type data', () => {
    const dataPayload = {
      content: 1,
      threadId: 'thread-1',
      owner: 'user-1',
    };

    expect(() => new NewComment(dataPayload)).toThrowError(
      'NEW_COMMENT.INCCORECT_TYPE_DATA'
    );
  });

  it('should create NewComment correctly', () => {
    const dataPayload = {
      content: 'Isi Komentar',
      threadId: 'thread-2',
      owner: 'user-2',
    };

    const { content, threadId, owner } = new NewComment(dataPayload);

    expect(content).toEqual(dataPayload.content);
    expect(threadId).toEqual(dataPayload.threadId);
    expect(owner).toEqual(dataPayload.owner);
  });
});
