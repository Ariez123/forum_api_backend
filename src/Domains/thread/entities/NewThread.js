class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { title, body, owner } = payload;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { title, body, owner } = payload;
    if (!title || !body || !owner) {
      throw new Error('NEW_THREAD.PROPERTY_NOT_FOUND');
    }
    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_THREAD.INCCORECT_TYPE_DATA');
    }
  }
}

module.exports = NewThread;
