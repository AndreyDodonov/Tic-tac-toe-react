import React, {Component} from 'react';
import Grid from './Grid.js';
import Score from './Score.js';
import randGen from './RandGen.js';
import WinnerAlert from './WinnerAlert.js';
import StartGame from './StartGame.js';
import PlayersList from './PlayersList.js';
import './game.css';

/**
 * @author Andrey Dodonov
 * @description игра крестики-нолики (5 в ряд) с изменяемым размером поля
 */

class Game extends Component {
    constructor(props) {
        super(props);
        this.changePlayer = this.changePlayer.bind(this);
        this.checkWinner = this.checkWinner.bind(this);
        this.reset = this.reset.bind(this);
        this.state = {
            next: 0,
            order: [],
            score: {},
            winner: "",
            size: 12,
            numOfPlayers: 2,
            update: false,
            alert: true,
            before: true
        };
    }

    componentDidMount() {
        const players = randGen(this.state.numOfPlayers);
        this.setState({
            order: players,
            score: (obj => {
                players.forEach(e => obj[e] = 0);
                return obj
            })({})
        });
    }
    // очерёдность хода
    changePlayer = () => {
        this.setState(prevState => ({next: (prevState.next + 1) % prevState.order.length}))
    };
    // стартовое сообщение
    raiseAlert = () => this.setState({alert: true});

    // проверяем на выигравшего
    checkWinner(a, x, v) {
        const mapper = indices => indices.map(e => a[e] ? a[e][2] ? a[e][2] : "D" : "");
        let one = a.slice(x - 4, x).map(e => e[2] ? e[2] : "D").concat(v, a.slice(x + 1, x + 5).map(e => e[2] ? e[2] : "D")).join("");
        let b2 = [], e2 = [], b3 = [], e3 = [], b4 = [], e4 = [];
        for (let i = 1; i < 5; i++) b2.unshift(x - i * 9);
        for (let i = 1; i < 5; i++) e2.push(x + i * 9);
        let two = mapper(b2).concat(v, mapper(e2)).join("");
        for (let i = 1; i < 5; i++) b3.unshift(x - i * 11);
        for (let i = 1; i < 5; i++) e3.push(x + i * 11);
        let three = mapper(e3).concat(v, mapper(b3)).join("");
        for (let i = 1; i < 5; i++) b4.unshift(x - 10 * i);
        for (let i = 1; i < 5; i++) e4.push(x + 10 * i);
        let four = mapper(b4).concat(v, mapper(e4)).join("");
        let reg = RegExp(`${v}{5}`);
        let winner = reg.test(one) || reg.test(two) || reg.test(three) || reg.test(four);
        if (winner) {
            this.setState(prevState => {
                let x = prevState.score;
                x[v] += 1;
                return {
                    next: "", winner: v, score: x
                }
            });
            // всплывающее сообщение
            window.M.toast({html: 'game over'})
        }
    };
    // обнуляем победителя, очерёдность хода, убираем стартовое сообщение
    play = () => {
        this.setState({winner: "", update: true, next: 0, alert: false, before: false});
    };

    // обнуляем стейты, обнуляем очки, новая игра
    reset() {
        let players = randGen(this.refs.players.value || this.state.numOfPlayers);
        let s = document.getElementById("resetScore");

        this.setState({
            numOfPlayers: this.refs.players.value || this.state.numOfPlayers,
            winner: "",
            next: 0,
            order: players,
            score: (obj => {
                players.forEach(
                    e => obj[e] = ((s.checked || !this.state.score[e]) ? 0 : this.state.score[e]));
                return obj
            })({}),

            size: this.refs.size.value || this.state.size,
            update: true,
            before: false,
            alert: false
        });
        s.checked = false;
    };

    // скрываем меню
    toggleVisibility = el => {
        /hidden/.test(el.className) ?
            el.className = el.className.replace(/hidden/, "") :
            (el.className += " hidden");
        el === this.refs.optionsOuter &&
        this.hideIfNotHidden(this.refs.optionsInner) &&
        this.hideIfNotHidden(this.refs.infoContainer)
    };
    hideIfNotHidden = el => {
        !(/hidden/.test(el.className)) &&
        (el.className += " hidden");
        return true
    };

    updateToFalse = () => this.setState({update: false});

    render() {
        return (
            <div className="wrapper">
                <div className="winner-alert-wrapper">
                    <StartGame alert={this.state.alert}/>
                </div>

                <div className="main">
                    <div className="bar">
                        <div className="menu"
                             onClick={() => this.toggleVisibility(this.refs.optionsOuter)}
                             >MENU
                        </div>
                        <div className="options " ref="optionsOuter">
                            <div ref="playButton" className="play underline"
                                 onClick={this.play}
                            >PLAY
                            </div>
                            <div ref="infoButton" className="info underline"
                                 onClick={() => this.toggleVisibility(this.refs.infoContainer)}
                            >INFO
                            </div>
                            <div className="optionsContainer hidden" ref="infoContainer">
                                <div className="infoOuter"
                                >ИГРОКИ: <PlayersList order={this.state.order}
                                         next={this.state.next}
                                />
                                </div>
                                <div className="outerScore">
                                    <div className="infoOuter">СЧЁТ:</div>
                                    <Score className="infoInner"
                                           players={this.state.order}
                                           score={this.state.score}
                                    />
                                </div>
                            </div>
                            <div onClick={() => this.toggleVisibility(this.refs.optionsInner)}
                                 className="reset underline">НАСТРОЙКИ
                            </div>
                            <div className="optionsContainer hidden" ref="optionsInner">
                                <div className="wrapper1">
                                    <div className="label1">КОЛ-ВО ИГРОКОВ<br/>
                                        (от 2 до 5 игроков)
                                    </div>
                                    <div className="input">
                                        <input type="number"
                                               ref="players"
                                               placeholder={this.state.numOfPlayers}
                                               min="2" max="5"
                                        />
                                    </div>
                                </div>
                                <div className="wrapper2">
                                    <div className="label2"
                                    >РАЗМЕР ПОЛЯ<br/>(от 5 до 20 клеток на сторону)
                                    </div>
                                    <div className="input">
                                        <input type="number"
                                               className="input2"
                                               min="5" max="20"
                                               ref="size" placeholder={this.state.size}
                                        />
                                    </div>
                                </div>
                                <div className="wrapper3">
                                    <div className="label3">Очистить счёт</div>
                                    <div className="input"><input type="checkbox" id="resetScore"/></div>
                                </div>
                                <div id="resetButton"
                                     className="label3 underline"
                                     onClick={this.reset}
                                >Принять
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid">
                        <Grid
                            nextMove={this.state.order[this.state.next]} onClick={this.changePlayer}
                            check={this.checkWinner} winner={this.state.winner}
                            size={this.state.size}
                            update={this.state.update} updateToFalse={this.updateToFalse}
                            before={this.state.before}
                            alert={() => this.raiseAlert()}/>
                    </div>
                </div>
                <div className="winner-alert-wrapper">
                    <WinnerAlert winner={this.state.winner}/>
                </div>
            </div>
        )
    }
}

export default Game;

