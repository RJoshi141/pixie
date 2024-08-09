import React, { useState, useRef } from 'react';
import { SketchPicker } from 'react-color';
import './App.css';

function App() {
  const [color, setColor] = useState('#fff');
  const [gridSize, setGridSize] = useState(10); // Default grid size
  const [pixels, setPixels] = useState(Array(100).fill('#fff')); // Initial size 10x10
  const canvasRef = useRef(null);

  // Handle grid size change
  const handleGridSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    setGridSize(size);
    setPixels(Array(size * size).fill('#fff')); // Reset pixels array for new grid size
  };

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
    const pixelSize = 300 / gridSize; // Adjust size based on grid size
    
    canvas.width = 300; // Fixed width
    canvas.height = 300; // Fixed height

    pixels.forEach((pixel, index) => {
      const x = (index % gridSize) * pixelSize;
      const y = Math.floor(index / gridSize) * pixelSize;
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
      <div className="controls">
        <label htmlFor="grid-size">Select Grid Size: </label>
        <select
          id="grid-size"
          value={gridSize}
          onChange={handleGridSizeChange}
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>{size}x{size}</option>
          ))}
        </select>
        <button onClick={saveImage}>Save as PNG</button>
      </div>
      <div className="grid-container">
        <div className="grid" style={{
          gridTemplateColumns: `repeat(${gridSize}, ${300 / gridSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${300 / gridSize}px)`
        }}>
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
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
