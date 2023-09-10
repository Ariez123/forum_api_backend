class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { commentId, content, owner } = payload;
    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ commentId, content, owner }) {
    if (!commentId || !content || !owner) {
      throw new Error('NEW_REPLY.PROPERTY_NOT_FOUND');
    }

    if (
      typeof commentId !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_REPLY.INCCORECT_TYPE_DATA');
    }
  }
}

module.exports = NewReply;
