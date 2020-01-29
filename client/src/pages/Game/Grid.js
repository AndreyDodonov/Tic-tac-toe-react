import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import './game.css';

class Grid extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.reset = this.reset.bind(this);
        this.state = {
            squares: (() => {
                let s = [];
                for (let i = 0; i < this.props.size; i++) {
                    for (let j = 0; j < this.props.size; j++) s.push([i * 40, j * 40, ''])
                }
                return s
            })()
        }
    }

    componentDidMount() {
        let canvas = this.refs.canvas,
            ctx = canvas.getContext("2d");
        this.state.squares.forEach(square => {
            ctx.beginPath();
            ctx.strokeRect(square[0], square[1], 40, 40)
        });
        this.makeGame();
    }

    componentDidUpdate() {
        if (this.props.update) {
            this.reset();
            this.props.updateToFalse();
        }
    }

    // стартовая заставка
    makeGame = () => {
        let ctx = this.refs.canvas.getContext("2d");
        ctx.font = "20px Arial Bold";

        [40, 47, 54, 58, 64, 69, 75, 80, 89, 91].forEach(e =>
            ctx.fillText(
                "O", e % 12 * 40 + 13, ~~(e / 12) * 40 + 26));


        [76, 77, 78, 79, 42, 43, 44, 63, 61].forEach(e => {
            ctx.fillText(
                "X", e % 12 * 40 + 13, ~~(e / 12) * 40 + 26)
        });
        let a = [91 % 12 * 40 + 13, ~~(91 / 12) * 40 + 26],
            b = [47 % 12 * 40 + 22, ~~(47 / 12) * 40 + 13];
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 4.0;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
    };

    /**
     * @description Обработчик клика по canvas.
     * a и b позиция куда кликнули
     * @param event
     */
    handleClick(event) {
        let c = this.refs.canvas;
        let ctx = c.getContext("2d");
        let a = ~~((event.clientY - c.getBoundingClientRect().top) / 40);
        let b = ~~((event.clientX - c.getBoundingClientRect().left) / 40);
        let d = 10 * a + b;
        console.log('a: ', a, ' b: ', b, ' d: ', d);
        if (!(this.state.squares[d][2] || this.props.winner || this.props.before)) {
            this.setState(prevState => {
                prevState.squares[d][2] = this.props.nextMove;
                return {squares: prevState.squares}
            });
            ctx.font = "20px Arial";
            ctx.fillText(this.props.nextMove, b * 40 + 17, a * 40 + 25);
            this.props.onClick();
            this.props.check(this.state.squares, d, this.props.nextMove);
        } else if (this.props.before) {
            this.props.alert();
        }
    }

    // очистка поля, новая игра
    reset() {
        let a = this.props.size;
        let c = findDOMNode(this.refs.canvas);
        let ct = c.getContext("2d");
        c.height = a * 40;
        c.width = a * 40;
        let newSquares = (() => {
            let s = [];
            for (let i = 0; i < a; i++) {
                for (let j = 0; j < a; j++) s.push([i * 40, j * 40, ""])
            }
            return s
        })();
        this.setState({squares: newSquares});
        newSquares.forEach(square => {
            ct.beginPath();
            ct.strokeRect(square[0], square[1], 40, 40)
        });
    }

    render() {
        return (
            <div>
                <canvas id="canvas" className="canvas" ref="canvas" width={this.props.size * 40 + ""}
                        height={this.props.size * 40 + ""}
                        onClick={this.handleClick}/>
            </div>
        )
    }
}

export default Grid;
