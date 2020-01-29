import React from 'react';

const WinnerAlert = props => props.winner ?
    (<p className="banner">Победитель - {props.winner}. Нажми PLAY для продолжения
        </p>) :
    null;

export default WinnerAlert;
