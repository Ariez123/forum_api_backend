const LikeRepository = require('../LikeRepository');

describe('LikeRepository', () => {
  it('should erro', async () => {
    const likeRepository = new LikeRepository();

    await expect(likeRepository.checkLikeComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likeRepository.likeComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likeRepository.unlikeComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likeRepository.getLikeCountComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
