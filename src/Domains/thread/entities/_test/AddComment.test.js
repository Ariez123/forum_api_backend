const AddComment = require('../AddComment');

describe('AddComment Entities', () => {
  it('should throw error property', () => {
    const dataPayload = {
      id: 'comment-1',
      content: 'Isi Komentar',
    };

    expect(() => new AddComment(dataPayload)).toThrowError(
      'ADD_COMMENT.PROPERTY_NOT_FOUND'
    );
  });

  it('should throw error type data', () => {
    const dataPayload = {
      id: 'comment-2',
      content: { data: 'Isi Komentar' },
      owner: 'user-2',
    };

    expect(() => new AddComment(dataPayload)).toThrowError(
      'ADD_COMMENT.INCCORECT_TYPE_DATA'
    );
  });

  it('should create AddedComment correctly', () => {
    const dataPayload = {
      id: 'comment-3',
      content: 'Isi Komentar',
      owner: 'user-3',
    };

    const { id, content, owner } = new AddComment(dataPayload);

    expect(id).toEqual(dataPayload.id);
    expect(content).toEqual(dataPayload.content);
    expect(owner).toEqual(dataPayload.owner);
  });
});
