import AttitudeIndicator from './components/AttitudeIndicator'
import Altimeter from './components/Altimeter'
import { Stage, Container, Sprite, Graphics } from '@pixi/react';
import './App.css';

function App() {
  return (
    <Stage width={1000} height={1000} options={{ backgroundColor: 0x000 }}>
      <AttitudeIndicator x={500} y={500} pitch={10} bank={20} slip={-5} />
      <Altimeter x={700} y={500} altitude={2000} qnh={29.92} selectedAltitude={2200} />
    </Stage>
  );
}

export default App;
