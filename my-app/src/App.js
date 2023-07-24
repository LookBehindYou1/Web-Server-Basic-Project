import React from 'react';
import './App.css';
import { GameObject, AccelerationObject } from './Game/GameObject';

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
  const [trash, setTrash] = React.useState(newAccelerationObject(0, 0, Math.random()*750,
                            Math.random()*750, 0, 0, '/Trash.png', 50, 50, 800, 800));
  const [stepSize, setStepSize] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [time,setTime] = React.useState(0);
  const [imageSize,setImageSize] = React.useState(50);
  // Key Movement
  const keyDown = (e) => {
    switch (e.keyCode) {
      // Left
      case 37:
        trash.dx = -1;
        break
      // Up
      case 38:
        trash.dy = -1;
        break
      // Right
      case 39:
        trash.dx = 1;
        break
      // Down
      case 40:
        trash.dy = 1;
        break
      // Random acceleration
      case 32:
        trash.ddy += gaussianRandom(0.01)
        break
      // Nothing happens
      default:
        console.log("Other key pressed: ", e.keyCode);
        break
    }
    console.log(trash);
  };

  // Every few milliseconds moves position.
  React.useEffect(() => {
    const id = setInterval(() => {
      trash.step(stepSize)
      setTime(oldTime => oldTime + stepSize/1000)
    }, 50);
    return () => clearInterval(id);
  }, [stepSize, imageSize]);

  // IDK
  React.useEffect(() => {
    window.addEventListener('keydown', keyDown, false);
    return () => window.removeEventListener('keydown', keyDown, false);
  }, []);

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
      <div className="game-score">Time =
      {time.toFixed(4)}, Score = {score}, Gravity = {trash.ddy.toFixed(8)}</div>
        {trash.render({onClick: () => determineScore(1)})}
    </div>
  );
}

export default App;
