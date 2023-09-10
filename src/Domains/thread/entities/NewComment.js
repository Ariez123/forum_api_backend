class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, threadId, owner } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }
  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new Error('NEW_COMMENT.PROPERTY_NOT_FOUND');
    }
    if (
      typeof content !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_COMMENT.INCCORECT_TYPE_DATA');
    }
  }
}

module.exports = NewComment;
