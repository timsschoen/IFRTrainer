import { Stage, Container, Graphics, Text } from '@pixi/react';
import React, { useCallback, useState, useRef, Component } from 'react'
import * as PIXI from 'pixi.js'

function Altimeter({x, y, altitude, qnh, selectedAltitude}) {
  
  const drawHeight = 350; 

  const pixelPer20Feet = drawHeight/(600/20);

  const drawAltimeter = useCallback((g) => {

    g.clear();
    g.removeChildren();

    g.lineStyle(1, 0xffffff);

    var lowestAltitude = Math.ceil((altitude-300)/20)*20;
    
    for(var currAltitude = lowestAltitude; 
      currAltitude <= lowestAltitude+600; 
      currAltitude +=20)
    {
      var currY = -(currAltitude-altitude)*(1/20)*pixelPer20Feet;

      if(currAltitude % 100 === 0)
      {
        g.moveTo(10, currY);
        g.lineTo(+30, currY);

        if (Math.abs(currAltitude-altitude) >= 100) 
        {
            var text = new PIXI.Text(currAltitude.toString(), {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xffffff,
            align: 'center',
            });
            text.x = +35;
            text.y = currY;
            text.anchor.set(0, 0.5);
            g.addChild(text);
        }
      }
      else if(currAltitude % 20 === 0)
      {
        g.moveTo(10,  currY);
        g.lineTo( + 20,  currY);
      }

      if (currAltitude === selectedAltitude)
      {
            // draw altitude bug
            g.lineStyle(0, 0xffffff);
            g.beginFill(0x00ffff, 1);
            g.drawPolygon([
              new PIXI.Point(0,currY - 7), 
              new PIXI.Point(0,currY + 7),
              new PIXI.Point(10,currY + 7),
              new PIXI.Point(5,currY),
              new PIXI.Point(10,currY - 7)
            ]);
            g.endFill();            
            g.lineStyle(1, 0xffffff);
      }

    }    

  }, [altitude]);
  
  const drawFixedSymbols = useCallback((g) => {

    g.clear();
    g.lineStyle(1, 0x000000);

    // draw background
    g.beginFill(0x000000, 0.3);
    g.drawRect(0, -drawHeight/2 - 10, 100, drawHeight + 20);
    g.endFill();

    // draw background for selected altitude
    g.beginFill(0x000000, 0.6);
    g.drawRect(0, -drawHeight/2 - 40, 100, 30);
    g.endFill();

    // draw background for current altitude
    
    g.lineStyle(1, 0xaaaaaa);
    g.beginFill(0x000000, 0.7);
    g.drawPolygon([
      new PIXI.Point(20,0),
      new PIXI.Point(30,-5),
      new PIXI.Point(30, -20), 
      new PIXI.Point(65, -20),
      new PIXI.Point(65, -40), 
      new PIXI.Point(100, -40),
      new PIXI.Point(100, 40), 
      new PIXI.Point(65, 40),  
      new PIXI.Point(65, 20),     
      new PIXI.Point(30, 20),
      new PIXI.Point(30, 5)
    ]);
    g.endFill();

    // draw altitude bug
    g.beginFill(0x00ffff, 1);
    g.drawPolygon([
      new PIXI.Point(10,-drawHeight/2 - 32), 
      new PIXI.Point(10,-drawHeight/2 - 18),
      new PIXI.Point(20,-drawHeight/2 - 18),
      new PIXI.Point(15,-drawHeight/2 - 25),
      new PIXI.Point(20,-drawHeight/2 - 32)
    ]);
    g.endFill();


  }, []);

  

  return (
      <Container x={x} y={y}>         
        <Graphics draw={drawFixedSymbols} />
        <Text x={50} y={-drawHeight/2 - 25} anchor={(0, 0.5)} text={selectedAltitude.toString()} 
          style={{
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0x00ffff,
            align: 'center',
            }} />  
          <Text x={65} y={0} anchor={(0, 0.5)} text={altitude.toString()} 
          style={{
            fontFamily: 'Arial',
            fontSize: 28,
            fill: 0xffffff,
            align: 'center',
            }} />          
        <Graphics draw={drawAltimeter} />   
      </Container>    
  );
}

export default Altimeter;