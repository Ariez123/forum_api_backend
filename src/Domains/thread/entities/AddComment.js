const Joi = require('joi');

class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }
  _verifyPayload(dataPayload) {
    const dataMessage = {
      'string.base': `ADD_COMMENT.INCCORECT_TYPE_DATA`,
      'string.empty': `ADD_COMMENT.PROPERTY_NOT_FOUND`,
      'any.required': `ADD_COMMENT.PROPERTY_NOT_FOUND`,
    };
    const schema = Joi.object({
      id: Joi.string().required().messages(dataMessage),
      content: Joi.string().required().messages(dataMessage),
      owner: Joi.string().required().messages(dataMessage),
    });
    // run validator
    const validationResult = schema.validate(dataPayload);

    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  }
}

module.exports = AddComment;
