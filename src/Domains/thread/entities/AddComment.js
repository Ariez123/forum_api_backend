class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }
  _verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('ADD_COMMENT.PROPERTY_NOT_FOUND');
    }
    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADD_COMMENT.INCCORECT_TYPE_DATA');
    }
  }
}

module.exports = AddComment;
