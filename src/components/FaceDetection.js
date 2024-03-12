/* eslint-disable react-hooks/exhaustive-deps */
import * as faceapi from "face-api.js";
import React, { useEffect, useRef, useState } from "react";

const FaceDetectionComponent = () => {
  const videoRef = useRef();
  const [detectedFaces, setDetectedFaces] = useState(0);
  const [faceTilt, setFaceTilt] = useState("");
  const [faceOrientation, setFaceOrientation] = useState("");
  const [mouthStatus, setMouthStatus] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      console.log("Models loaded");
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the webcam", error);
      }
    };

    loadModels().then(startVideo);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const detectFaces = async () => {
      if (!videoRef.current) return;

      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      const displaySize = {
        width: videoRef.current.width,
        height: videoRef.current.height,
      };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        analyzeFaceFeatures(resizedDetections);
      }, 100);
    };

    videoRef.current && videoRef.current.addEventListener("play", detectFaces);
  }, []);

  const analyzeFaceFeatures = (detections) => {
    if (detections.length > 1) {
      alert("2 or more faces detected. Focusing on the nearest.");
    }

    const sortedDetections = detections.sort((a, b) => {
      const aArea = a.detection.box.width * a.detection.box.height;
      const bArea = b.detection.box.width * b.detection.box.height;
      return bArea - aArea;
    });

    const detection = sortedDetections[0];
    if (detection) {
      const landmarks = detection.landmarks;
      const jawOutline = landmarks.getJawOutline();
      const nose = landmarks.getNose();

      const faceTilt = detectFaceTilt(jawOutline);
      const faceOrientation = detectFaceOrientation(jawOutline, nose);
      const mouthStatus = detectMouthStatus(landmarks.getMouth());

      setDetectedFaces(detections.length);
      setFaceOrientation(faceOrientation);
      setFaceTilt(faceTilt);
      setMouthStatus(mouthStatus);

      console.log(
        `Nearest Face: Tilt - ${faceTilt}, Orientation - ${faceOrientation}, Mouth - ${mouthStatus}`
      );
    }
  };

  function detectFaceTilt(jawOutline) {
    const leftSide = jawOutline.slice(0, 8);
    const rightSide = jawOutline.slice(8, 17);
    const leftY = leftSide.reduce((acc, p) => acc + p.y, 0) / leftSide.length;
    const rightY =
      rightSide.reduce((acc, p) => acc + p.y, 0) / rightSide.length;

    if (Math.abs(leftY - rightY) < 30) {
      return "Forward";
    }
    return leftY > rightY ? "Right Tilt" : "Left Tilt";
  }

  function detectFaceOrientation(jawOutline, nose) {
    const jawLeftPoint = jawOutline[0];
    const jawRightPoint = jawOutline[jawOutline.length - 1];
    const nosePoint = nose[3];

    const noseToLeftJawDistance = Math.abs(nosePoint.x - jawLeftPoint.x);
    const noseToRightJawDistance = Math.abs(nosePoint.x - jawRightPoint.x);
    const totalJawWidth = Math.abs(jawLeftPoint.x - jawRightPoint.x);

    const turnRatioThreshold = 0.7;
    const leftRatio = noseToLeftJawDistance / totalJawWidth;
    const rightRatio = noseToRightJawDistance / totalJawWidth;

    if (leftRatio > turnRatioThreshold) {
      return "Facing Left";
    } else if (rightRatio > turnRatioThreshold) {
      return "Facing Right";
    } else {
      return "Facing Forward";
    }
  }

  function detectMouthStatus(mouth) {
    const topLip = mouth[13].y;
    const bottomLip = mouth[19].y;
    const mouthOpenThreshold = 7;
    return bottomLip - topLip > mouthOpenThreshold ? "Open" : "Closed";
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          width: "720px",
        }}
      >
        <span>Detected Faces: {detectedFaces}</span>
        <span>Face-Tilt: {faceTilt}</span>
        <span>Face-Orientation: {faceOrientation}</span>
        <span>Mouth: {mouthStatus}</span>
      </div>
      <video
        ref={videoRef}
        width="720"
        height="560"
        autoPlay
        muted
        style={{ display: "block" }}
      ></video>
    </div>
  );
};
export default FaceDetectionComponent;