import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);