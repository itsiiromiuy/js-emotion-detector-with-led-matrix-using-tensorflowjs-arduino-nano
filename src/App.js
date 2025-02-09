import './App.css';
import React, { useRef, useEffect } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utils"


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

 useEffect(() => {
    const runFaceMesh = async () => {
      if (!webcamRef.current || !webcamRef.current.video) return;

      await tf.setBackend('webgl');  


      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = { runtime: "tfjs" };
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

      setInterval(() => {
        detect(detector);
      }, 10);
    };

    runFaceMesh();
  }, []); // ✅ No dependencies needed
  
  // Face detection function
  const detect = async (detector) => {

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA
    ) {
      // Get Video Properties
      const videoElement = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections

      const estimationConfig = { flipHorizontal: false };
      const faces = await detector.estimateFaces(videoElement, estimationConfig);
      console.log(faces);

      // Get canvas context for drawing
      const ctx = canvasRef.current.getContext('2d')
      console.log(ctx)
      drawMesh(faces, ctx)
      
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

        {/* Canvas Overlay for Face Detection */}
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
