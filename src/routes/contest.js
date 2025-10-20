/**
 * 实时交易竞赛功能路由
 */

const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');

// 交易竞赛管理路由
router.post('/', contestController.createContest);
router.get('/', contestController.getContests);
router.get('/:id', contestController.getContestById);
router.put('/:id', contestController.updateContest);
router.delete('/:id', contestController.deleteContest);
router.post('/:id/start', contestController.startContest);
router.post('/:id/end', contestController.endContest);

// 竞赛参与路由
router.post('/join', contestController.joinContest);
router.get('/:contestId/participants', contestController.getContestParticipants);
router.get('/:contestId/leaderboard', contestController.getContestLeaderboard);

// 竞赛交易路由
router.post('/trade', contestController.recordContestTrade);
router.get('/:contestId/trades', contestController.getContestTrades);

module.exports = router;