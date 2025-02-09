import './App.css';
import React, { useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import { pipeline, env } from "@xenova/transformers"

env.allowLocalModels = false;
env.useBrowserCache = false;

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const detectModel = async () => {
      // Load the model
      const pipe = await pipeline("image-classification", 'Xenova/facial_emotions_image_detection');

      // Process video frames every 500ms
      setInterval(() => {
        detect(pipe);
      }, 500);
    };
    detectModel();
  }, []);

  const detect = async (pipe) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA
    ) {
      // Get Video Properties
      const videoElement = webcamRef.current.video;
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      // Set canvas dimensions
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Draw the video frame onto the canvas
      ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

      // Convert canvas to a Blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Create an object URL from the Blob
        const blobURL = URL.createObjectURL(blob);

        try {
          // Run the classifier on the extracted frame
          const out = await pipe(blobURL);
          console.log(out); // Log classification results
        } catch (error) {
          console.error("Error processing image:", error);
        }

        // Clean up Blob URL to free memory
        URL.revokeObjectURL(blobURL);
      }, "image/png");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Webcam Video */}
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        {/* Canvas Overlay for Processing */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
