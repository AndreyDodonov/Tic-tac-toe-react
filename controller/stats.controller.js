const errorHandler = require('../utils/errorHandler');
const Stats = require('../Models/Stats');
const config = require('config');

module.exports.getAll = async (req, res) => {
    try {
        const stats = await Stats.find({owner: req.user.userId});
        await res.json(stats);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.create = async (req, res) => {
    try {
        const stats = await new Stats({
            gameCount: req.body.gameCount,
            winCount: req.body.winCount,
            loseCount: req.body.loseCount,
            user: req.user.id
        }).save();
        res.status(200).json(stats);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.update = async(req, res) => {
  try {

  }  catch (e) {
      errorHandler(res, e)
  }
};
