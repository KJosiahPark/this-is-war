import React from 'react';
import ReactDOM from 'react-dom';

import Container from 'react-bootstrap/Container'

const App = () => {
  return (
    <Container>
      <h1>This is War</h1>
    </Container>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));