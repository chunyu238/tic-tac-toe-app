import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square key={'square_'+i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        let board =[];
        let squares=[];
        let squareCount = 0;
        
        for(let row =0;row<3;row++){
            for(let col=0;col<3;col++){
                squares.push(this.renderSquare((squareCount)));
                squareCount++;
            }
            board.push(<div key={'board_'+row} className="board-row">{squares}</div>);
            squares = [];
        }

        return (

            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]){
            return;
        }
        if(this.state.xIsNext){
            squares[i] = 'X';
        }else{
            squares[i] = 'O';
        }
        this.setState({ 
            history: history.concat([{squares:squares}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerSquares = calculateWinner(current.squares);
        let winner;

        if(winnerSquares){
            winner = winnerSquares[0];
        }else{
            winner = null;
        }

        const moves = history.map((step,move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            let changedIndex = -1;
            let colRowText;
            
            if(move > 0){
                for(let i=0;i<9;i++){
                    if(step.squares[i] !== history[move-1].squares[i]){
                        changedIndex = i;
                    }
                }
            }

            if(changedIndex > -1){
                colRowText = '(' + Math.floor(changedIndex/3) + ',' + changedIndex%3 + ')';
            }

            return(
                <li key={move}>
                    <button style={this.state.stepNumber === move ? {fontWeight: 'bold'}: {fontWeight: 'normal'}} onClick={() => this.jumpTo(move)}>{desc} {colRowText}</button>
                </li>
            ) 
        })

        let status;
        if(winner){
            status = 'Winner: ' + current.squares[winner];
        }else if(this.state.stepNumber === 9){
            status = 'Draw: Its a Tie!!';
        }else{
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    for(let i = 0;i<lines.length;i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return lines[i];
        }
    }
    return false;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
