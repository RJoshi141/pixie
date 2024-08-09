import React, { useState, useRef } from 'react';
import { SketchPicker } from 'react-color';
import './App.css';

function App() {
  const [color, setColor] = useState('#fff');
  const [pixels, setPixels] = useState(Array(100).fill('#fff'));
  const canvasRef = useRef(null);

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handlePixelClick = (index) => {
    const newPixels = [...pixels];
    newPixels[index] = color;
    setPixels(newPixels);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixelSize = 30;
    
    canvas.width = 300; // 10 * 30px
    canvas.height = 300; // 10 * 30px

    pixels.forEach((pixel, index) => {
      const x = (index % 10) * pixelSize;
      const y = Math.floor(index / 10) * pixelSize;
      ctx.fillStyle = pixel;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    });

    const link = document.createElement('a');
    link.download = 'pixie-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Welcome to Pixie!</h1>
      </div>
      <div className="description">
        <p>
          Pixie is a fun and creative online game where you can pick colors from a palette and paint in a grid of pixels.
          Create your pixel art and save it as a PNG image to share with friends or use it as your new profile picture!
        </p>
      </div>
      <div className="grid-container">
        <div className="grid">
          {pixels.map((pixel, index) => (
            <div
              key={index}
              onClick={() => handlePixelClick(index)}
              className="pixel"
              style={{ backgroundColor: pixel }}
            />
          ))}
        </div>
        <div className="palette">
          <SketchPicker color={color} onChangeComplete={handleColorChange} />
          <button onClick={saveImage}>Save as PNG</button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
