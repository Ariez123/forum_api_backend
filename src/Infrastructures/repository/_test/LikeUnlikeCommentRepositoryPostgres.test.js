const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const LikeUnlikeCommentRepositoryPostgres = require('../LikeUnlikeCommetRepositoryPostgres');

describe('LikeUnlikeCommentRepositoryPostgres', () => {
  it('should be instance of LikeUnlikeRepository domain', () => {
    const likeUnlikeCommentRepositoryPostgres =
      new LikeUnlikeCommentRepositoryPostgres({}, {});

    expect(likeUnlikeCommentRepositoryPostgres).toBeInstanceOf(
      LikeUnlikeCommentRepositoryPostgres
    );
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      await UserTableTestHelper.addUser({
        id: 'user-1',
        username: 'SomeUser',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-1',
        owner: 'user-1',
      });
      await ThreadTableTestHelper.addComment({
        id: 'comment-1',
        owner: 'user-1',
      });
    });

    afterEach(async () => {
      await LikeTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await UserTableTestHelper.cleanTable();
      await ThreadTableTestHelper.cleanTable();
    });

    describe('checkLikeComment function', () => {
      it('should check if comment is liked', async () => {
        // arrange
        const payload = {
          commentId: 'comment-1',
          userId: 'user-1',
        };
        await LikeTableTestHelper.addLike({
          id: 'like-1',
          commentId: 'comment-1',
          userId: 'user-1',
        });
        const likeUnlikeCommentRepositoryPostgres = new LikeUnlikeCommentRepositoryPostgres(pool, {});

        // action
        const isLiked = await likeUnlikeCommentRepositoryPostgres.checkLikeComment(
          payload
        );

        // assert
        expect(isLiked).toBeTruthy();
      });

      it('should return false if comment is not liked', async () => {
        // arrange
        const likeUnlikeCommentRepositoryPostgres = new LikeUnlikeCommentRepositoryPostgres(pool, {});

        // action
        const isLiked = await likeUnlikeCommentRepositoryPostgres.checkLikeComment({
          commentId: 'comment-1',
          userId: 'user',
        });

        // assert
        expect(isLiked).toBeFalsy();
      });
    });

    describe('likeComment function', () => {
      it('should add like to comment', async () => {
        // arrange
        const payload = {
          commentId: 'comment-1',
          userId: 'user-1',
        };
        const fakeIdGenerator = () => '1';
        const likeUnlikeCommentRepositoryPostgres = new LikeUnlikeCommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

        // action
        const isLiked = await likeUnlikeCommentRepositoryPostgres.likeComment(payload);

        // assert
        expect(isLiked).toBeTruthy();
      });
    });

    describe('unlikeComment function', () => {
      it('should unlike comment', async () => {
        // arrange
        const payload = {
          commentId: 'comment-1',
          userId: 'user-1',
        };
        await LikeTableTestHelper.addLike({
          id: 'like-1',
          commentId: 'comment-1',
          userId: 'user-1',
        });
        const likeUnlikeCommentRepositoryPostgres = new LikeUnlikeCommentRepositoryPostgres(pool, {});

        // action
        const isLiked = await likeUnlikeCommentRepositoryPostgres.unlikeComment(
          payload
        );

        // assert
        expect(isLiked).toBeTruthy();
      });
    });

    describe('getLikeCountComment function', () => {
      it('should return like count of comment', async () => {
        // arrange
        const payload = {
          threadId: 'thread-1',
          commentId: 'comment-1',
          userId: 'user-1',
        };

        await UserTableTestHelper.addUser({
          id: 'user-3',
          username: 'jhon_doe',
        });
        await LikeTableTestHelper.addLike({
          id: 'like-1',
          commentId: 'comment-1',
          userId: 'user-1',
        });
        await LikeTableTestHelper.addLike({
          id: 'like-4',
          commentId: 'comment-1',
          userId: 'user-3',
        });
        const likeUnlikeCommentRepositoryPostgres = new LikeUnlikeCommentRepositoryPostgres(pool, {});

        // action
        const likeCount =
          await likeUnlikeCommentRepositoryPostgres.getLikeCountComment(
            payload.threadId
          );

        // assert
        expect(likeCount).toStrictEqual([
          {
            comment_id: 'comment-1',
          },
          {
            comment_id: 'comment-1',
          },
        ]);
      });
    });
  });
});
