import "./Canvas.css";
import React, { useRef, useEffect, useState } from "react";

const Canvas = (props) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const contextRef = useRef(null);
  const canvasRef = useRef(null);

  //set up the canvas drawing board
  useEffect(() => {
    
    const canvas = canvasRef.current;
    if (offsetTop !== canvas.offsetTop) {
      setOffsetTop(canvas.offsetTop);
    }

    if (offsetLeft !== canvas.offsetLeft){
      setOffsetLeft(canvas.offsetLeft);
    }
    
    // where you can draw
    canvas.width = window.innerWidth - offsetLeft -10;
    canvas.height = window.innerHeight - offsetTop -10;

    // the are the canvas is visible on the screen
    canvas.style.width = `${window.innerWidth- offsetLeft-10}px`;
    canvas.style.height = `${window.innerHeight- offsetTop-10}px`;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, [canvasRef]);

  const startDrawing = (event) => {
    const nativeEvent = event.nativeEvent;
    event.stopPropagation();

    //identify wheter the user playing from mobile/desktop.
    let x = nativeEvent.touches
      ? nativeEvent.touches[0].clientX
      : nativeEvent.offsetX - offsetLeft;
    let y = nativeEvent.touches
      ? nativeEvent.touches[0].clientY - offsetTop
      : nativeEvent.offsetY;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    event.stopPropagation();

    if (!isDrawing) {
      return;
    }
    
    const nativeEvent = event.nativeEvent;
    let x = nativeEvent.touches
      ? nativeEvent.touches[0].clientX - offsetLeft
      : nativeEvent.offsetX;
    let y = nativeEvent.touches
      ? nativeEvent.touches[0].clientY - offsetTop
      : nativeEvent.offsetY;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  };

  const finishDrawing = (event) => {
    event.stopPropagation();

    contextRef.current.closePath();
    setIsDrawing(false);
    
    props.setimage(canvasRef.current.toDataURL());

  };

  return (
    <canvas className="canvas"
      onMouseDown={startDrawing}
      onTouchStart={startDrawing}
      onMouseUp={finishDrawing}
      onTouchEnd={finishDrawing}
      onMouseMove={draw}
      onTouchMove={draw}
      ref={canvasRef}
      {...props}
    />
  );
};

export default Canvas;
