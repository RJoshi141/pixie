import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

function App() {
  const [color, setColor] = useState('#fff');
  const [pixels, setPixels] = useState(Array(100).fill('#fff'));

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handlePixelClick = (index) => {
    const newPixels = [...pixels];
    newPixels[index] = color;
    setPixels(newPixels);
  };

  return (
    <div className="App">
      <h1>Pixie</h1>
      <SketchPicker color={color} onChangeComplete={handleColorChange} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 30px)' }}>
        {pixels.map((pixel, index) => (
          <div
            key={index}
            onClick={() => handlePixelClick(index)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: pixel,
              border: '1px solid #ccc',
              boxSizing: 'border-box'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
