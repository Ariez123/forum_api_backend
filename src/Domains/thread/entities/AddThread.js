const Joi = require('joi');

class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, owner } = payload;
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload({ id, title, owner }) {
    const dataMessage = {
      'string.base': `ADD_THREAD.INCCORECT_TYPE_DATA`,
      'string.empty': `ADD_THREAD.PROPERTY_NOT_FOUND`,
      'any.required': `ADD_THREAD.PROPERTY_NOT_FOUND`,
    };
    const schema = Joi.object({
      id: Joi.string().required().messages(dataMessage),
      title: Joi.string().required().messages(dataMessage),
      owner: Joi.string().required().messages(dataMessage),
    });
    // run validator
    const validationResult = schema.validate({ id, title, owner });

    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  }
}

module.exports = AddThread;
