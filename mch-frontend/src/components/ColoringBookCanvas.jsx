import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";

const ColoringBookCanvas = () => {
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState("#ff0000");
  const [brushRadius, setBrushRadius] = useState(4);
  const [selectedImage, setSelectedImage] = useState("");

  const colors = [
    "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
    "#ffa500", "#800080", "#ffc0cb", "#a52a2a", "#808080", "#000000"
  ];

  const images = [
    { name: "Flower", src: "/coloring/flower.png" },
    { name: "Butterfly", src: "/coloring/butterfly.png" },
    { name: "Animal", src: "/coloring/animal.png" },
    { name: "Mandala", src: "/coloring/mandala.png" },
  ];

  const handleClear = () => {
    canvasRef.current.clear();
  };

  const handleUndo = () => {
    canvasRef.current.undo();
  };

  const handleExport = () => {
    const dataURL = canvasRef.current.getDataURL();
    const link = document.createElement('a');
    link.download = 'my-coloring.png';
    link.href = dataURL;
    link.click();
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.value);
    canvasRef.current.clear();
  };

  return (
    <div style={{
      textAlign: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #FFECB3 0%, #FFF9C4 100%)",
      borderRadius: "20px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{
        fontFamily: "Comic Neue, cursive",
        color: "#2d3436",
        textShadow: "2px 2px #ffeaa7"
      }}>
        Kiddies Coloring Book 🎨🖍️
      </h2>
      <p style={{ fontFamily: "Baloo, sans-serif", color: "#636e72" }}>
        Pick a picture, choose colors, and let your creativity shine!
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>Choose a Picture:</label>
        <select onChange={handleImageChange} value={selectedImage} style={{
          padding: "8px",
          borderRadius: "8px",
          border: "2px solid #0984e3",
          background: "#fff"
        }}>
          <option value="">Select an image</option>
          {images.map((img, index) => (
            <option key={index} value={img.src}>{img.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>Pick a Color:</label>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setBrushColor(color)}
            style={{
              backgroundColor: color,
              border: brushColor === color ? "3px solid #000" : "1px solid #ddd",
              width: "30px",
              height: "30px",
              margin: "5px",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          />
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>Brush Size:</label>
        <input
          type="range"
          min="1"
          max="20"
          value={brushRadius}
          onChange={(e) => setBrushRadius(parseInt(e.target.value))}
          style={{ width: "200px" }}
        />
        <span style={{ marginLeft: "10px" }}>{brushRadius}px</span>
      </div>

      <CanvasDraw
        className="mx-auto"
        ref={canvasRef}
        brushColor={brushColor}
        brushRadius={brushRadius}
        lazyRadius={0}
        canvasWidth={600}
        canvasHeight={400}
        imgSrc={selectedImage}
        style={{
          border: "4px solid #0984e3",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
        }}
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleClear} style={{
          padding: "10px 20px",
          margin: "0 10px",
          background: "#ff7675",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
        }}>
          🗑️ Clear
        </button>
        <button onClick={handleUndo} style={{
          padding: "10px 20px",
          margin: "0 10px",
          background: "#fdcb6e",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
        }}>
          ↶ Undo
        </button>
        <button onClick={handleExport} style={{
          padding: "10px 20px",
          margin: "0 10px",
          background: "#00b894",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
        }}>
          💾 Save Art
        </button>
      </div>
    </div>
  );
};

export default ColoringBookCanvas;

