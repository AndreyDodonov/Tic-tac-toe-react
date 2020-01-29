import React from 'react';
import './game.css';


export const Name = props => <p>player {props.player}</p>;
export const Points = props => <p className={props.player}>:{' '}{props.score}</p>;
const Score = props => <div className="score">{[...props.players].map(e => (<div
    className="innerScore">
    <Name player={e}/><Points player={e} score={props.score[e]}/></div>))}</div>;
export default Score;
