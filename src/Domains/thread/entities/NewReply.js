const Joi = require('joi');

class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { commentId, content, owner } = payload;
    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ commentId, content, owner }) {
    const dataMessage = {
      'string.base': `NEW_REPLY.INCCORECT_TYPE_DATA`,
      'string.empty': `NEW_REPLY.PROPERTY_NOT_FOUND`,
      'any.required': `NEW_REPLY.PROPERTY_NOT_FOUND`,
    };
    const schema = Joi.object({
      commentId: Joi.string().required().messages(dataMessage),
      content: Joi.string().required().messages(dataMessage),
      owner: Joi.string().required().messages(dataMessage),
    });
    // run validator
    const validationResult = schema.validate({ commentId, content, owner });

    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  }
}

module.exports = NewReply;
