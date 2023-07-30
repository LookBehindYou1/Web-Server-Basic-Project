import React from 'react';
import './App.css';
import { GameObject, AccelerationObject, PlatformerObject, TimeToLiveObject } from './Game/GameObject';

function App() {
  // Variables are created.
  const [trash, setTrash] = React.useState(new PlatformerObject(0,0.005,
    Math.random()*750, Math.random()*750, 0, 0, '/Trash.png', 50, 50, 600
    , 600));
  const [target, setTarget] = React.useState(new GameObject(Math.random()*750,
    Math.random()*750, 0, 0, '/Dot.png', 25, 25, 600, 600));
  const [fireballs, setFireballs] = React.useState([])
  const [stepSize, setStepSize] = React.useState(4)
  const [score, setScore] = React.useState(0);
  const [time,setTime] = React.useState(0);
  
  // Key Movement
  const keyDown = (e) => {
    switch (e.keyCode) {
      // Fireball
      case 32:
        setFireballs(oldFireballs => {
          if (oldFireballs.length > 0 && oldFireballs[oldFireballs.length-1].steps < 50)
            return oldFireballs
            let fDx = trash.dx;
            let fDy = trash.dy;
            if (fDx === 0 && fDy === 0) {
              fDy = -1;
            }
            const newFireball = new TimeToLiveObject(250, trash.x, trash.y,
              Math.sign(fDx)*1, Math.sign(fDy)*1, '/Dot.png', 20, 20, 600, 600);
              return oldFireballs.concat([newFireball])
        })
        break;
      // Left
      case 37:
        trash.dx = -1;
        break;
      // Right
      case 39:
        trash.dx = 1;
        break;
      // Jump
      case 38:
        trash.jump();
        break
      // Everything else
      default:
        break;
    }
  };

  // Stops movement.
  const keyUp = (e) => {
    switch (e.keyCode) {
      // Left
      case 37:
        trash.dx = 0;
        break;
      // Right
        case 39:
        trash.dx = 0;
        break;
      // Everything else.
      default:
        break;
    }
  }

 // When a fireball is shot.
  React.useEffect(() => {
    const id = setInterval(() => {
      trash.step(stepSize)
      setFireballs(oldFireballs => oldFireballs.filter((fireball) => {
        // Check to see if fireball hits target to gain points.
        if (fireball.hasCollision(target)) {
          setScore(oldScore => oldScore + 100);
          target.jumpToRandom()
          return null;
        }
        return fireball.step(stepSize);
      }))
      setTime(oldTime => oldTime + stepSize/1000)
    }, 10);

    return () => clearInterval(id);
  }, [stepSize, time]);

  // Checks over the keyDown and keyUp.
  React.useEffect(() => {
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);
    return () => {
      console.log("ayo")
      window.addEventListener('keydown', keyDown, false);
      window.addEventListener('keyup', keyUp, false);
      return () => {
        window.removeEventListener('keyDown', keyDown, false);
        window.removeEventListener('keyup', keyUp, false);
      }
    }
  }, []);

  // Determines what the website looks like.
  return (
    <div className="game-container">
      <div className="game-score">Time =
      {time.toFixed(4)}, Score = {score}, Gravity = {trash.ddy.toFixed(8)}</div>
      {trash.render()}
      {fireballs.map(f => f.render())}
      {target.render()}
    </div>
  );
  
}

export default App;
