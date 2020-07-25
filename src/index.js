import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Square extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            class: 'square',
            color: this.props.color,
        }
        console.log(this.props.color);
    }
    
    
    render() {
        let className = this.state.class
        return (
            <button
                style={{ background: this.props.color }}
                className={className}
                onClick={this.props.onClick}
            >
                {this.props.value}
            </button>
        )
    }
}
class Board extends React.Component {
    renderSquare(i) {
        if (i === this.props.colorindex || this.props.colorindex ==="all") {
            return (
                <Square
                    color={this.props.color}
                    value={this.props.squares[i]}
                    onClick={() => {
                        this.props.onClick(i)
                        console.log("hello");
                    }}
                />
            )
        } else {
            
            return (
                <Square
                    value={this.props.squares[i]}
                    onClick={() => {
                        this.props.onClick(i)
                    }}
                />
            )
        }
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),

                    move: null,
                },
            ],
            xIsNext: true,
            stepNumber: 0,
            colorindex: null,
        }
        this.handlerefreshClick = this.handlerefreshClick.bind(this);
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1) //* this is to delete the future which will be incorrect
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        let color = this.state.xIsNext ? 'green' : 'red'//*works
        let value = squares[i]
        let coordinates = calculatePosition(i)
        
        
        this.setState({
            history: history.concat([
                { squares: squares, value: value, coordinates: coordinates },
            ]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            colorindex: i,
            color:color
        })
    }
    handlerefreshClick(){
        this.setState({history: [
            {
                squares: Array(9).fill(null),

                move: null,
            },
        ],stepNumber:0,color:"white"})
        this.state.xIsNext=true;
        this.render();
    }
    jumpTo(step) {
        this.setState({ stepNumber: step, xIsNext: step % 2 === 0 ,color:"white"});
        
    }
    render() {
        const history = this.state.history

        const current = history[this.state.stepNumber]
        
        const winner = calculateWinner(current.squares)
        let status
        const moves = history.map((step, move) => {
            const desc = move
                ? 'Go to move' +
                  ` ${step.value}:(${step.coordinates.col} col, ${step.coordinates.row} row)`
                : 'Go to game start'
            return (
                <li key={move}>
                    <button id = "movebutton" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        if (winner) {
            this.state.colorindex = "all"
            if (winner==="DRAW"){
                status = "DRAW";
                this.state.color = "gray";
            }else{
                status = 'Winner: ' + winner;
                this.state.color = winner==="X" ? "green" : "red";
                
            }
        } else {
            status = 'Next player ' + (this.state.xIsNext ? 'X' : 'O')
        }
        return (
            <div className="game">
                <div className="game-board"> 
                    <Board
                        colorindex = {this.state.colorindex}
                        squares={current.squares}
                        color = {this.state.color}
                        onClick={(i) => {
                            this.handleClick(i)
                        }}
                    />
                </div>

                <div className="game-info">
                    <div id = "status">{status}</div>
                    <button id = "status" onClick= {()=>{this.handlerefreshClick()}}>Refresh</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ] //* all possible combinations to win the game
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a]
        }
    }
    if(!squares.includes(null)){
        return "DRAW"
    }
    return null
}

function calculatePosition(i) {
    let row = Math.floor(i / 3) + 1
    let col = i - 3 * (row - 1) + 1
    return { col: col, row: row }
}
