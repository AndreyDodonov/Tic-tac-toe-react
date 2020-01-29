const {Schema, model, Types} = require('mongoose');

/**
 * @description
 *  gameCount - количество игр,
 *  winCount - количество выигрышей,
 *  loseCount - количество проигрышей
 *  owner - привязка к юзеру
 * @type {module:mongoose.Schema<any>}
 */
const schema = new Schema ({
    gameCount: {type: Number, default: 0},
    winCount: {type: Number, default: 0},
    loseCount: {type: Number, default: 0},
    owner: {type: Types.ObjectId, ref: 'User'}
});

module.exports = model('Stats', schema);
