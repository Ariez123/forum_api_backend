const Joi = require('joi');

class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { title, body, owner } = payload;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    const dataMessage = {
      'string.base': `NEW_THREAD.INCCORECT_TYPE_DATA`,
      'string.empty': `NEW_THREAD.PROPERTY_NOT_FOUND`,
      'any.required': `NEW_THREAD.PROPERTY_NOT_FOUND`,
    };
    const schema = Joi.object({
      title: Joi.string().required().messages(dataMessage),
      body: Joi.string().required().messages(dataMessage),
      owner: Joi.string().required().messages(dataMessage),
    });
    // run validator
    const validationResult = schema.validate({ title, body, owner });

    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  }
}

module.exports = NewThread;
