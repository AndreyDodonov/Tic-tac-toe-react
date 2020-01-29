import React from 'react';

const StartGame = props => props.alert ?
    (<div className="banner">Нажми PLAY чтобы начать</div>) :
    null;

export default StartGame;
