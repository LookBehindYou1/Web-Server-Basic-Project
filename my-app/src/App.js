import React from 'react';
import './App.css';

function gaussianRandom(mean=0, stdev=1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}

function App() {
  // Variables are created.
  const [x, setX] = React.useState(10);
  const [y, setY] = React.useState(210);
  const [xDirection, setXDirection] = React.useState(1);
  const [yDirection, setYDirection] = React.useState(1);
  const [stepSize, setStepSize] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [imageSize,setImageSize] = React.useState(50);
  // Refs for x and y are created.
  const xRef = React.useRef(x);
  const yRef = React.useRef(y);
  const xDirectionRef = React.useRef(xDirection);
  const yDirectionRef = React.useRef(yDirection);
  // Updates variables when changed.
  React.useEffect(() => {
    xRef.current = x;
    yRef.current = y;
    xDirectionRef.current = xDirection;
    yDirectionRef.current = yDirection;
  }, [x, y, xDirection, yDirection]);
  // Every few milliseconds moves position.
  React.useEffect(() => {
    const id = setInterval(() => {
      if (xRef.current <= 0) setXDirection(1);
      if (xRef.current >= 600 - 50) setXDirection(-1);
      if (yRef.current <= 0) setYDirection(1);
      if (yRef.current >= 600 - 50) setYDirection(-1);
      setX(prevX => prevX + xDirectionRef.current * stepSize + gaussianRandom() * stepSize);
      setY(prevY => prevY + yDirectionRef.current * stepSize + gaussianRandom() * stepSize);
    }, 50);
    return () => clearInterval(id);
  }, [stepSize, imageSize]);

  // What happens when you click.
  const determineScore = (container) => {
    if (container === 0) {
      // Score decreases by 1 point.
      setScore(s => (s - 1 <= -1 ? 0 : s - 1));
      // Speed is decreased.
      setStepSize(s => (s - 1 <= 0 ? 0 : s - 1));
      // Size gets larger.
      setImageSize(size => (size + 2 >= 0 ? size + 2 : size));
    } else if (container === 1) {
      // Score increases by 10 points.
      setScore(s => s + 10);
      // Speed is increased.
      setStepSize(s => s + 5);
      // Size gets smaller.
      setImageSize(size => (size - 5 >= 0 ? size - 5 : size));
      // Image is sent to random position.
      setX(randomPosition(0, 600 - imageSize));
      setY(randomPosition(0, 600 - imageSize));
    }
  };

  // Determines what the website looks like.
  return (
    <div className="Game-Container" onClick={() => determineScore(0)}>
      <div className="game-score">{score}</div>
      <img
        alt= "Trash"
        src="Trash.png"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: `${imageSize}px`,
          height: `${imageSize}px`,
        }}
        onClick={() => determineScore(1)}
      />
    </div>
  );
}

export default App;
