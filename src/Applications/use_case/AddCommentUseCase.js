const AddComment = require('../../Domains/thread/entities/AddComment');
const NewComment = require('../../Domains/thread/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(dataPayload) {
    const newComment = new NewComment(dataPayload);
    await this._threadRepository.verifyThread(newComment.threadId);
    const dataResult = await this._threadRepository.addComment(newComment);
    return new AddComment(dataResult);
  }
}

module.exports = AddCommentUseCase;
