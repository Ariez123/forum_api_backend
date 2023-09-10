const NewReply = require('../../Domains/thread/entities/NewReply');
const AddReply = require('../../Domains/thread/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(dataPayload) {
    const newReply = new NewReply(dataPayload);
    await this._threadRepository.verifyThread(dataPayload.threadId);
    await this._threadRepository.verifyCommentThread(
      dataPayload.commentId,
      dataPayload.threadId
    );
    const addedReply = await this._threadRepository.addReply(newReply);
    return new AddReply(addedReply);
  }
}

module.exports = AddReplyUseCase;
