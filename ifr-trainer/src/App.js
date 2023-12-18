import AttitudeIndicator from './components/AttitudeIndicator'
import { Stage, Container, Sprite, Graphics } from '@pixi/react';
import './App.css';

function App() {
  return (
    <Stage width={1000} height={1000} options={{ backgroundColor: 0x000 }}>
      <AttitudeIndicator />
    </Stage>
  );
}

export default App;
