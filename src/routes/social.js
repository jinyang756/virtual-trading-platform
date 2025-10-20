/**
 * 社交交易功能路由
 */

const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');

// 用户关注相关路由
router.post('/follow', socialController.followUser);
router.post('/unfollow', socialController.unfollowUser);
router.get('/following/:userId', socialController.getFollowing);
router.get('/followers/:userId', socialController.getFollowers);
router.get('/following/check', socialController.checkFollowing);

// 交易分享相关路由
router.post('/share', socialController.shareTrade);
router.get('/shares/:userId', socialController.getUserShares);
router.get('/timeline/:userId', socialController.getTimeline);

// 点赞相关路由
router.post('/like', socialController.likeShare);
router.post('/unlike', socialController.unlikeShare);

// 评论相关路由
router.post('/comment', socialController.commentShare);
router.get('/comments/:shareId', socialController.getShareComments);

module.exports = router;