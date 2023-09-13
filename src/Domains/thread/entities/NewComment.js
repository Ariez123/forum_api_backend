const Joi = require('joi');

class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, threadId, owner } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }
  _verifyPayload({ content, threadId, owner }) {
    const dataMessage = {
      'string.base': `NEW_COMMENT.INCCORECT_TYPE_DATA`,
      'string.empty': `NEW_COMMENT.PROPERTY_NOT_FOUND`,
      'any.required': `NEW_COMMENT.PROPERTY_NOT_FOUND`,
    };
    const schema = Joi.object({
      threadId: Joi.string().required().messages(dataMessage),
      content: Joi.string().required().messages(dataMessage),
      owner: Joi.string().required().messages(dataMessage),
    });
    // run validator
    const validationResult = schema.validate({ content, threadId, owner });

    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  }
}

module.exports = NewComment;
