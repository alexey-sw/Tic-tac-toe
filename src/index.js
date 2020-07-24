import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// class Square extends React.Component {

//     render() {
//       return (
//         <button className="square" onClick={()=>{this.props.onClick()}}>
//           {this.props.value}
//         </button>
//       );
//     }

// }
//* we don't need square component any more because it doesn't have its state
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
        //console.log(this.state.color); doesn't work
        let className = this.state.class
        // this.setState({color:this.props.color});
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
//this is what it returns for render into the board

class Board extends React.Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     }
    //     console.log(this.state)
    // } all management of the squares goes to game component
    // handleClick(i) {
    //     const squares = this.props.squares.slice();
    //     if (calculateWinner(squares)|| squares[i]){
    //         return ;
    //     }
    //     squares[i] = this.state.xIsNext ? "X" : "O";
    //     console.log(squares)
    //     this.setState({ squares: squares,xIsNext:!this.state.xIsNext });
    // }
    renderSquare(i) {
        if (i === this.props.colorindex) {
            //* console.log(this.props.colorindex); works
            //*console.log("here"); 1 here and many there
            // console.log(this.props.color);
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
        //* we don't need it anymore as long as game manages information about the game
        // const winner = calculateWinner(this.state.squares);
        // let status ;
        // if (winner){
        //     status = "Winner:" + winner + " (Refresh the page to continue)";
        // }
        // else{
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }
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
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        if (winner) {
            if (winner==="DRAW"){
                status = "DRAW";
            }else{
                status = 'Winner: ' + winner
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
                    <div>{status}</div>
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
