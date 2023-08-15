import './App.css';
import React from 'react';

import GameContainer from './Game/GameContainer';
import StickminPlatformerGameLevel from './Game/StickminPlatformerGameLevel';

// Areas
const areas = [
  [0,1,2].map(i => `/Images/Backgrounds/cafe_0${i}.jpeg`),
  [0,1,2].map(i => `/Images/Backgrounds/gym_0${i}.jpeg`),
  [0,1,2].map(i => `/Images/Backgrounds/library_0${i}.jpeg`),
]

// Levels
const levels = [
  new StickminPlatformerGameLevel(0.1, areas[0], areas[0][1]),
  new StickminPlatformerGameLevel(0.3, areas[1], areas[1][1]),
  new StickminPlatformerGameLevel(1.0, areas[2], areas[2][1]),
]

function App() {
  // Variables are created.
  const [stepSize, setStepSize] = React.useState(1)
  const [time,setTime] = React.useState(0);
  const [game,setGame] = React.useState(new GameContainer(levels));

 // When a fireball is shot.
  React.useEffect(() => {
    const id = setInterval(() => {
      game.step(stepSize);
      setTime(oldTime => oldTime + stepSize/1000)
    }, 10);

      return () => {clearInterval(id);};
    }, [stepSize, time, game]);

  // Checks over the keyDown and keyUp.
  React.useEffect(() => {
    window.addEventListener('keydown', game.keyDown.bind(game), false);
    window.addEventListener('keyup', game.keyUp.bind(game), false);
    return () => {
      window.removeEventListener('keydown', game.keyDown.bind(game), false);
      window.removeEventListener('keyup', game.keyUp.bind(game), false);
    }
  }, [game]);

  // Determines what the website looks like.
  return (game.render());
}

export default App;