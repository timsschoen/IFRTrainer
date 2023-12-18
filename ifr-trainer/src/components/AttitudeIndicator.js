import { Stage, Container, Graphics, Text } from '@pixi/react';
import React, { useCallback, useState, useRef, Component } from 'react'
import * as PIXI from 'pixi.js'

function AttitudeIndicator({x, y, pitch, bank, slip}) {
  
  const drawWidth = 800;
  const drawHeight = 800; 

  const rollScaleDist = 170;
  const pixelPerDegreePitch = 7;

  const getAttitudeIndicatorPosition = () => {
    return new PIXI.Point(
      Math.sin(bank*Math.PI/180)*pixelPerDegreePitch*pitch,
      Math.cos(bank*Math.PI/180)*pixelPerDegreePitch*pitch);
  };

  const drawPitchLines = useCallback((g) => {

    g.clear();
    g.removeChildren();

    g.lineStyle(1, 0xffffff);

    var centerPitch = Math.round(pitch/2.5)*2.5; 
    for(var i = -10; i <= 10; i++)
    {
      var currPitch = centerPitch + i*2.5;
      var y = -currPitch*pixelPerDegreePitch;

      if(currPitch === 0)
        continue; 

      if (currPitch > 80 || currPitch < -80)
        continue;

      if(currPitch % 10 === 0)
      {
        g.moveTo( - 60,  + y);
        g.lineTo( + 60,  + y);

        var text = new PIXI.Text(currPitch.toString(), {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xffffff,
            align: 'center',
        });
        text.x = -65;
        text.y = y;
        text.anchor.set(1, 0.5);
        g.addChild(text);

        var text2 = new PIXI.Text(currPitch.toString(), {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: 0xffffff,
          align: 'center',
        });
        text2.x = 65;
        text2.y = y;
        text2.anchor.set(0, 0.5);
        g.addChild(text2);
      }
      else if(currPitch % 5 === 0 && currPitch <= 45 && currPitch >= -25)
      {
        g.moveTo( - 40,  + y);
        g.lineTo( + 40,  + y);
      }
      else if (currPitch <= 20 && currPitch >= -20 )
      {        
        g.moveTo( - 15,  + y);
        g.lineTo( + 15,  + y);
      }
    }    

  }, [pitch]);

  const drawHorizon = useCallback((g) => {

    g.clear();

    // draw blue and brown region
    g.lineStyle(1, 0xffffff);

    
    g.moveTo( - drawWidth, 0);
    g.lineTo( + drawWidth, 0);

    g.beginFill(0x0000ff, 1);
    g.drawRect(-drawWidth, -drawHeight, 2*drawWidth, drawHeight);
    g.endFill();
    g.beginFill(0x964B00, 1);
    g.drawRect(-drawWidth, 0, 2*drawWidth, drawHeight);
    g.endFill();

  }, []);
  
  const drawFixedSymbols = useCallback((g) => {

    g.clear();
    g.lineStyle(5, 0xffff00);

    // small yellow lines at aircraft pitch axis
    g.moveTo(-100, 0);
    g.lineTo(-70, 0);

    g.moveTo(100, 0);
    g.lineTo(70, 0);

    // triangles    
    g.lineStyle(1, 0x000);
    g.beginFill(0xffff00, 1);
    g.drawPolygon([new PIXI.Point(0,0), new PIXI.Point(-40,40), new PIXI.Point(-60,40)]);
    g.drawPolygon([new PIXI.Point(0,0), new PIXI.Point(40,40), new PIXI.Point(60,40)]);
    g.endFill();

    // roll triangle    
    g.lineStyle(1, 0xfff);
    g.beginFill(0xffffff, 1);    
    g.drawPolygon([new PIXI.Point(0,-rollScaleDist), new PIXI.Point(-10,-rollScaleDist+20), new PIXI.Point(10,-rollScaleDist+20)]);
    g.endFill();
    
    // slip indicator  
    g.lineStyle(1, 0xfff);
    g.beginFill(0xffffff, 1);    
    g.drawPolygon([
      new PIXI.Point(-11 + (rollScaleDist-22)*Math.sin(slip*Math.PI/180),
        -(rollScaleDist-22)*Math.cos(slip*Math.PI/180)), 
      new PIXI.Point(11 + (rollScaleDist-22)*Math.sin(slip*Math.PI/180),
        -(rollScaleDist-22)*Math.cos(slip*Math.PI/180)), 
      new PIXI.Point(13 + (rollScaleDist-27)*Math.sin(slip*Math.PI/180),
        -(rollScaleDist-27)*Math.cos(slip*Math.PI/180)), 
      new PIXI.Point(-13 + (rollScaleDist-27)*Math.sin(slip*Math.PI/180),
        -(rollScaleDist-27)*Math.cos(slip*Math.PI/180))
    ]);
    g.endFill();
    

  }, [slip]);

  
  const drawRollScale = useCallback((g) => {

    g.clear();
    g.lineStyle(1, 0xffffff);

    g.arc(0, 0, rollScaleDist, 210*Math.PI/180, 330*Math.PI/180);

    // roll triangle    
    g.lineStyle(1, 0xffffff);
    g.beginFill(0xffffff, 1);    
    g.drawPolygon([new PIXI.Point(0,-rollScaleDist), new PIXI.Point(-10,-rollScaleDist-20), new PIXI.Point(10,-rollScaleDist-20)]);
    g.endFill();

    // roll scale
    var minorTickMarks = [-45, -20, -10, 10, 20, 45];
    var majorTickMarks = [-60, -30, 30, 60];

    g.lineStyle(1, 0xffffff);
    minorTickMarks.forEach((angle) => {  
      var angleRad = angle*Math.PI/180;    
      g.moveTo(rollScaleDist*Math.sin(angleRad), -rollScaleDist*(Math.cos(angleRad)));
      g.lineTo((rollScaleDist+10)*Math.sin(angleRad), -(rollScaleDist+10)*(Math.cos(angleRad)));      
    });
    majorTickMarks.forEach((angle) => {  
      var angleRad = angle*Math.PI/180;    
      g.moveTo(rollScaleDist*Math.sin(angleRad), -rollScaleDist*(Math.cos(angleRad)));
      g.lineTo((rollScaleDist+25)*Math.sin(angleRad), -(rollScaleDist+25)*(Math.cos(angleRad)));      
    });

  }, []);

  return (
        <Container x={x} y={y}>          
            <Container position={getAttitudeIndicatorPosition()} angle={-bank}>           
              <Graphics draw={drawHorizon} />         
              <Graphics draw={drawPitchLines} />  
            </Container>            
            <Graphics draw={drawFixedSymbols} />
            <Graphics angle={-bank} draw={drawRollScale} />
        </Container>
  );
}

export default AttitudeIndicator;