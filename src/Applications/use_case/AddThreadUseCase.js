const NewThread = require('../../Domains/thread/entities/NewThread');
const AddThread = require('../../Domains/thread/entities/AddThread');


class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(dataPayload) {
    const newThread = new NewThread(dataPayload);
    const resultData = await this._threadRepository.addThread(newThread);
    return new AddThread(resultData);
  }
}

module.exports = AddThreadUseCase;
