const Joi = require('joi');

class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ id, content, owner }) {
    const dataMessage = {
      'string.base': `ADD_REPLY.INCCORECT_TYPE_DATA`,
      'string.empty': `ADD_REPLY.PROPERTY_NOT_FOUND`,
      'any.required': `ADD_REPLY.PROPERTY_NOT_FOUND`,
    };
    const schema = Joi.object({
      id: Joi.string().required().messages(dataMessage),
      content: Joi.string().required().messages(dataMessage),
      owner: Joi.string().required().messages(dataMessage),
    });
    // run validator
    const validationResult = schema.validate({ id, content, owner });

    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  }
}

module.exports = AddReply;
