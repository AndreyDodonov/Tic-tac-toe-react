import React from 'react';
import './game.css';

const PlayersList = props => props.order.map((e, i) => i === props.next ?
    (<span className="red">{e}{' '}</span>) : (<span>{e}{' '}</span>));

export default PlayersList;
