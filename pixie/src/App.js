import React, { useState, useRef, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import './App.css';

function App() {
  const [color, setColor] = useState('transparent'); // Default color to transparent
  const [gridSize, setGridSize] = useState(10); // Default grid size
  const [pixels, setPixels] = useState(Array(100).fill('transparent')); // Initial size 10x10, default transparent
  const [history, setHistory] = useState([Array(100).fill('transparent')]); // History for undo/redo
  const [historyIndex, setHistoryIndex] = useState(0); // Current index in history
  const [showPalette, setShowPalette] = useState(true); // State to toggle palette visibility
  const canvasRef = useRef(null);
  const gridRef = useRef(null);

  const handlePixelFill = useCallback((index) => {
    const newPixels = [...pixels];
    newPixels[index] = color;
    setPixels(newPixels);
    // Update history
    setHistory(prevHistory => [
      ...prevHistory.slice(0, historyIndex + 1),
      newPixels
    ]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  }, [color, pixels, historyIndex]);

  const handleGridSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    setGridSize(size);
    setPixels(Array(size * size).fill('transparent')); // Reset pixels array for new grid size
    setHistory([Array(size * size).fill('transparent')]); // Reset history for new grid size
    setHistoryIndex(0);
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setPixels(history[historyIndex - 1]);
      setHistoryIndex(prevIndex => prevIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setPixels(history[historyIndex + 1]);
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
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
      ctx.fillStyle = pixel === 'transparent' ? 'rgba(0,0,0,0)' : pixel;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    });

    const link = document.createElement('a');
    link.download = 'pixie-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const togglePalette = () => {
    setShowPalette(prev => !prev);
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
        <button onClick={saveImage}>Save as PNG</button>
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
        <button onClick={undo} disabled={historyIndex === 0}>Undo</button>
        <button onClick={redo} disabled={historyIndex === history.length - 1}>Redo</button>
        <button className="toggle-palette" onClick={togglePalette}>
          {showPalette ? 'Hide Palette' : 'Show Palette'}
        </button>
      </div>
      <div className="main-content">
        <div
          className="grid-container"
          ref={gridRef}
        >
          <div className="grid" style={{
            gridTemplateColumns: `repeat(${gridSize}, ${300 / gridSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${300 / gridSize}px)`,
            width: '300px', // Fixed width
            height: '300px' // Fixed height
          }}>
            {pixels.map((pixel, index) => (
              <div
                key={index}
                className="pixel"
                style={{ backgroundColor: pixel }}
                onMouseDown={() => handlePixelFill(index)} // Color fill on click only
              />
            ))}
          </div>
          {showPalette && (
            <div className="palette">
              <SketchPicker color={color} onChangeComplete={handleColorChange} />
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
