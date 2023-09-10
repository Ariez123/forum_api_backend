class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, owner } = payload;
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { id, title, owner } = payload;
    if (!id || !title || !owner) {
      throw new Error('ADD_THREAD.PROPERTY_NOT_FOUND');
    }
    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADD_THREAD.INCCORECT_TYPE_DATA');
    }
  }
}

module.exports = AddThread;
