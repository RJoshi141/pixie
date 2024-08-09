import React, { useState, useRef, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import './App.css';

function App() {
  const [color, setColor] = useState('transparent');
  const [gridSize, setGridSize] = useState(10);
  const [pixels, setPixels] = useState(Array(100).fill('transparent'));
  const [history, setHistory] = useState([Array(100).fill('transparent')]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showPalette, setShowPalette] = useState(true);
  const canvasRef = useRef(null);
  const gridRef = useRef(null);

  const handlePixelFill = useCallback((index) => {
    const newPixels = [...pixels];
    newPixels[index] = color;
    setPixels(newPixels);
    setHistory(prevHistory => [
      ...prevHistory.slice(0, historyIndex + 1),
      newPixels
    ]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  }, [color, pixels, historyIndex]);

  const handleGridSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    setGridSize(size);
    setPixels(Array(size * size).fill('transparent'));
    setHistory([Array(size * size).fill('transparent')]);
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
    const pixelSize = 300 / gridSize;

    canvas.width = 300;
    canvas.height = 300;

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
          {[5, 10, 15, 20, 25, 30, 40].map(size => (
            <option key={size} value={size}>{size}x{size}</option>
          ))}
        </select>
        <button onClick={undo} disabled={historyIndex === 0}>Undo</button>
        <button onClick={redo} disabled={historyIndex === history.length - 1}>Redo</button>
        <div className="toggle-container">
          <div 
            className={`toggle-palette ${showPalette ? 'on' : ''}`}
            onClick={togglePalette}
          >
            <div className={`toggle-slider ${showPalette ? 'on' : ''}`}></div>
          </div>
          <span className={`toggle-palette-text ${showPalette ? 'show' : 'hide'}`}>
            {showPalette ? 'Hide Palette' : 'Show Palette'}
          </span>
        </div>
      </div>
      <div className={`main-content ${!showPalette ? 'grid-only' : 'grid-container'}`}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${300 / gridSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${300 / gridSize}px)`,
            width: '300px',
            height: '300px'
          }}
          ref={gridRef}
        >
          {pixels.map((pixel, index) => (
            <div
              key={index}
              className="pixel"
              style={{ backgroundColor: pixel }}
              onMouseDown={() => handlePixelFill(index)}
            />
          ))}
        </div>
        {showPalette && (
          <div className="palette">
            <SketchPicker color={color} onChangeComplete={handleColorChange} />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
