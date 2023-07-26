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

function App() {
  // Variables are created.
  const [trash, setTrash] = React.useState(new AccelerationObject(0, 0, Math.random()*750,
                            Math.random()*750, 0, 0, '/Trash.png', 50, 50, 600, 600));
  const [firedImage, setFiredImage] = React.useState(null);
  const [stepSize, setStepSize] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [time,setTime] = React.useState(0);
  // Key Movement
  const keyDown = (e) => {
    switch (e.keyCode) {
      // Left
      case 37:
        trash.dx = -1;
        break;
      // Up
      case 38:
        trash.dy = -1;
        break;
      // Right
      case 39:
        trash.dx = 1;
        break;
      // Down
      case 40:
        trash.dy = 1;
        break;
      // Random acceleration
      case 32:
        trash.ddy += gaussianRandom(0, 0.01)
        break;
      // Fire ball
      case 70:
        if (!firedImage) {
          const initialVelocity = 10;
          const firedObject = new GameObject(trash.x, trash.y, initialVelocity, 0,
                              '/Right Fireball.png', 30, 30, 600, 600);
          setFiredImage(firedObject);
        }
        break;
      // Nothing happens
      default:
        console.log("Other key pressed: ", e.keyCode);
        break;
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
  }, [stepSize, trash]);

  // IDK
  React.useEffect(() => {
    window.addEventListener('keydown', keyDown, false);
    return () => window.removeEventListener('keydown', keyDown, false);
  }, []);

  // Fired Image Movement
  // Inside the App component
  React.useEffect(() => {
    if (firedImage) {
      const id = setInterval(() => {
        firedImage.step(stepSize);
        setTime((oldTime) => oldTime + stepSize / 1000);
        // Check if the fired image hits the border
        if (firedImage.x > 600 || firedImage.x < 0) {
          // Remove the fired image from the screen and reset its state
          setFiredImage(null);
        }
      }, 50);
      return () => clearInterval(id);
    }
  }, [firedImage, stepSize]);


  // Determines what the website looks like.
  return (
    <div className="Game-Container" onClick={() => setScore((s) => s - 1)}>
      <div className="game-score">
        Time = {time.toFixed(4)}, Score = {score}, Gravity = {trash.ddy.toFixed(8)}
      </div>
      {trash.render({ onClick: () => {setScore((s) => s + 11); setStepSize((s) => s + 0.1)} })}
      {/* Display the fired image when it exists */}
      {firedImage && firedImage.render({})}
    </div>
  );
  
}

export default App;
