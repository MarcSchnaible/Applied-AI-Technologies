/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
 import * as posenet from '@tensorflow-models/posenet';
 import * as tf from '@tensorflow/tfjs-core';
 
 var color = 'red'; //aqua
 const boundingBoxColor = 'red';
 const lineWidth = 4;
 
 export const tryResNetButtonName = 'tryResNetButton';
 export const tryResNetButtonText = '[New] Try ResNet50';
 const tryResNetButtonTextCss = 'width:100%;text-decoration:underline;';
 const tryResNetButtonBackgroundCss = 'background:#e61d5f;';
 
 function isAndroid() {
   return /Android/i.test(navigator.userAgent);
 }
 
 function isiOS() {
   return /iPhone|iPad|iPod/i.test(navigator.userAgent);
 }
 
 export function isMobile() {
   return isAndroid() || isiOS();
 }
 
 export function setColorFalse() {
   color = 'red'
 }

 export function setColorTrue() {
  color = 'aqua'
}
 
 function setDatGuiPropertyCss(propertyText, liCssString, spanCssString = '') {
   var spans = document.getElementsByClassName('property-name');
   for (var i = 0; i < spans.length; i++) {
     var text = spans[i].textContent || spans[i].innerText;
     if (text == propertyText) {
       spans[i].parentNode.parentNode.style = liCssString;
       if (spanCssString !== '') {
         spans[i].style = spanCssString;
       }
     }
   }
 }


 
 export function updateTryResNetButtonDatGuiCss() {
   setDatGuiPropertyCss(
       tryResNetButtonText, tryResNetButtonBackgroundCss,
       tryResNetButtonTextCss);
 }
 
 /**
  * Toggles between the loading UI and the main canvas UI.
  */
 export function toggleLoadingUI(
     showLoadingUI, loadingDivId = 'loading', mainDivId = 'main') {
   if (showLoadingUI) {
     document.getElementById(loadingDivId).style.display = 'block';
     document.getElementById(mainDivId).style.display = 'none';
   } else {
     document.getElementById(loadingDivId).style.display = 'none';
     document.getElementById(mainDivId).style.display = 'block';
   }
 }
 
 function toTuple({y, x}) {
   return [y, x];
 }
 
 export function drawPoint(ctx, y, x, r, color) {
   ctx.beginPath();
   ctx.arc(x, y, r, 0, 4 * Math.PI);
   ctx.fillStyle = color;
   ctx.fill();
 }
 
 /**
  * Draws a line on a canvas, i.e. a joint
  */
 export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
   ctx.beginPath();
   ctx.moveTo(ax * scale, ay * scale);
   ctx.lineTo(bx * scale, by * scale);
   ctx.lineWidth = lineWidth;
   ctx.strokeStyle = color;
   ctx.stroke();
 }
 
 /**
  * Draws a pose skeleton by looking up all adjacent keypoints/joints
  */
 export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
   const adjacentKeyPoints =
       posenet.getAdjacentKeyPoints(keypoints, minConfidence);
 
   adjacentKeyPoints.forEach((keypoints) => {
     drawSegment(
         toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
         scale, ctx);
   });
 }

 export function drawRightArm(pose, ctx, color) {
  const rightShoulderX = pose["keypoints"][5]["position"]["x"];
  const rightShoulderY = pose["keypoints"][5]["position"]["y"];
  const rightEllbowX = pose["keypoints"][7]["position"]["x"];
  const rightEllbowY = pose["keypoints"][7]["position"]["y"];
  const rightHandX = pose["keypoints"][9]["position"]["x"];
  const rightHandY = pose["keypoints"][9]["position"]["y"];

  const leftEyeX = pose["keypoints"][2]["position"]["x"];
  const leftEyeY = pose["keypoints"][2]["position"]["y"];
  const rightEyeX = pose["keypoints"][1]["position"]["x"];
  const rightEyeY = pose["keypoints"][1]["position"]["y"];

  const augenAbstandX = rightEyeX - leftEyeX;
  const augenAbstandY = rightEyeY - leftEyeY;
  const linienStaerke = Math.sqrt( augenAbstandX * augenAbstandX + augenAbstandY * augenAbstandY)

  const accuracy = 0.75;

  //right arm
  if(pose["keypoints"][5]["score"] >= accuracy && pose["keypoints"][7]["score"] >= accuracy) {
    ctx.beginPath();
    ctx.arc(rightShoulderX, rightShoulderY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rightShoulderX, rightShoulderY);
    ctx.lineTo(rightEllbowX, rightEllbowY);
    ctx.lineWidth = linienStaerke;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rightEllbowX, rightEllbowY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  if(pose["keypoints"][9]["score"] >= accuracy && pose["keypoints"][7]["score"] >= accuracy) {
    ctx.beginPath();
    ctx.moveTo(rightEllbowX, rightEllbowY);
    ctx.lineTo(rightHandX, rightHandY);
    ctx.lineWidth = linienStaerke;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rightHandX, rightHandY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
 }

 export function drawLeftArm(pose, ctx, color) {
  const leftShoulderX = pose["keypoints"][6]["position"]["x"];
  const leftShoulderY = pose["keypoints"][6]["position"]["y"];
  const leftEllbowX = pose["keypoints"][8]["position"]["x"];
  const leftEllbowY = pose["keypoints"][8]["position"]["y"];
  const leftHandX = pose["keypoints"][10]["position"]["x"];
  const leftHandY = pose["keypoints"][10]["position"]["y"];

  const leftEyeX = pose["keypoints"][2]["position"]["x"];
  const leftEyeY = pose["keypoints"][2]["position"]["y"];
  const rightEyeX = pose["keypoints"][1]["position"]["x"];
  const rightEyeY = pose["keypoints"][1]["position"]["y"];

  const augenAbstandX = rightEyeX - leftEyeX;
  const augenAbstandY = rightEyeY - leftEyeY;
  const linienStaerke = Math.sqrt( augenAbstandX * augenAbstandX + augenAbstandY * augenAbstandY)

  const accuracy = 0.75;

  //left arm
  if (pose["keypoints"][6]["score"] >= accuracy && pose["keypoints"][8]["score"] >= accuracy) {
    ctx.beginPath();
    ctx.arc(leftShoulderX, leftShoulderY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(leftShoulderX, leftShoulderY);
    ctx.lineTo(leftEllbowX, leftEllbowY);
    ctx.lineWidth = linienStaerke;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(leftEllbowX, leftEllbowY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  if(pose["keypoints"][10]["score"] >= accuracy && pose["keypoints"][8]["score"] >= accuracy) {
    ctx.beginPath();
    ctx.moveTo(leftEllbowX, leftEllbowY);
    ctx.lineTo(leftHandX, leftHandY);
    ctx.lineWidth = linienStaerke;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(leftHandX, leftHandY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
 }

 export function drawLeftLeg(pose, ctx, color) {
  const leftHuefteX = pose["keypoints"][12]["position"]["x"];
  const leftHuefteY = pose["keypoints"][12]["position"]["y"];
  const leftKneeX = pose["keypoints"][14]["position"]["x"];
  const leftKneeY = pose["keypoints"][14]["position"]["y"];
  const leftFootX = pose["keypoints"][16]["position"]["x"];
  const leftFootY = pose["keypoints"][16]["position"]["y"];

  const leftEyeX = pose["keypoints"][2]["position"]["x"];
  const leftEyeY = pose["keypoints"][2]["position"]["y"];
  const rightEyeX = pose["keypoints"][1]["position"]["x"];
  const rightEyeY = pose["keypoints"][1]["position"]["y"];

  const augenAbstandX = rightEyeX - leftEyeX;
  const augenAbstandY = rightEyeY - leftEyeY;
  const linienStaerke = Math.sqrt( augenAbstandX * augenAbstandX + augenAbstandY * augenAbstandY)

  const accuracy = 0.75;

  //leftLeg
  if(pose["keypoints"][12]["score"] >= accuracy && pose["keypoints"][14]["score"] >= accuracy) {
    ctx.beginPath();
    ctx.arc(leftHuefteX, leftHuefteY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(leftHuefteX, leftHuefteY);
    ctx.lineTo(leftKneeX, leftKneeY);
    ctx.lineWidth = linienStaerke;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(leftKneeX, leftKneeY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  if(pose["keypoints"][14]["score"] >= accuracy && pose["keypoints"][16]["score"] >= accuracy) {
    ctx.beginPath();
    ctx.moveTo(leftKneeX, leftKneeY);
    ctx.lineTo(leftFootX, leftFootY);
    ctx.lineWidth = linienStaerke;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(leftFootX, leftFootY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
 }

 export function drawRightLeg(pose,ctx, color) {
  const rightHuefteX = pose["keypoints"][11]["position"]["x"];
  const rightHuefteY = pose["keypoints"][11]["position"]["y"];
  const rightKneeX = pose["keypoints"][13]["position"]["x"];
  const rightKneeY = pose["keypoints"][13]["position"]["y"];
  const rightFootX = pose["keypoints"][15]["position"]["x"];
  const rightFootY = pose["keypoints"][15]["position"]["y"];

  const leftEyeX = pose["keypoints"][2]["position"]["x"];
  const leftEyeY = pose["keypoints"][2]["position"]["y"];
  const rightEyeX = pose["keypoints"][1]["position"]["x"];
  const rightEyeY = pose["keypoints"][1]["position"]["y"];

  const augenAbstandX = rightEyeX - leftEyeX;
  const augenAbstandY = rightEyeY - leftEyeY;
  const linienStaerke = Math.sqrt( augenAbstandX * augenAbstandX + augenAbstandY * augenAbstandY)

  const accuracy = 0.75;

  //right leg
  if(pose["keypoints"][11]["score"] >= accuracy && pose["keypoints"][13]["score"] >= accuracy) {
    ctx.beginPath();
    ctx.arc(rightHuefteX, rightHuefteY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(rightHuefteX, rightHuefteY);
    ctx.lineTo(rightKneeX, rightKneeY);
    ctx.lineWidth = linienStaerke;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rightKneeX, rightKneeY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  if (pose["keypoints"][13]["score"] >= accuracy && pose["keypoints"][15]["score"] >= accuracy) {
    ctx.beginPath();
    ctx.moveTo(rightKneeX, rightKneeY);
    ctx.lineTo(rightFootX, rightFootY);
    ctx.lineWidth = linienStaerke;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rightFootX, rightFootY, (linienStaerke)/2, 0, 4 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
 }

 export function drawbody(pose, ctx) {
  const leftShoulderX = pose["keypoints"][6]["position"]["x"];
  const leftShoulderY = pose["keypoints"][6]["position"]["y"];
  const rightShoulderX = pose["keypoints"][5]["position"]["x"];
  const rightShoulderY = pose["keypoints"][5]["position"]["y"];
  const leftEarX = pose["keypoints"][4]["position"]["x"];
  const leftEarY = pose["keypoints"][4]["position"]["y"];
  const rightEarX = pose["keypoints"][3]["position"]["x"];
  const rightEarY = pose["keypoints"][3]["position"]["y"];
  const noseX = pose["keypoints"][0]["position"]["x"];
  const noseY = pose["keypoints"][0]["position"]["y"];
  const rightHuefteX = pose["keypoints"][11]["position"]["x"];
  const rightHuefteY = pose["keypoints"][11]["position"]["y"];
  const leftHuefteX = pose["keypoints"][12]["position"]["x"];
  const leftHuefteY = pose["keypoints"][12]["position"]["y"];

  const accuracy = 0.75;
  const accuracyHead = 0.60;

  //head
  if(pose["keypoints"][5]["score"] >= accuracyHead && pose["keypoints"][6]["score"] >= accuracyHead && pose["keypoints"][3]["score"] >= accuracyHead && pose["keypoints"][4]["score"] >= accuracyHead && pose["keypoints"][1]["score"] >= accuracyHead && pose["keypoints"][2]["score"] >= accuracyHead && pose["keypoints"][0]["score"] >= accuracyHead) {
    const startY = (((leftShoulderY+rightShoulderY)/2) + ((((leftEarY+rightEarY)/2) + ((leftShoulderY+rightShoulderY)/2))/2))/2;
    const startX = (leftEarX+rightEarX)/2;
    ctx.fillStyle = "rgba(185, 219, 154, 0.603)";

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(leftEarX, startY, leftEarX, leftEarY);
    ctx.arc(noseX,noseY,(noseX-leftEarX),Math.PI,0,false);
    ctx.quadraticCurveTo(rightEarX, startY, startX, startY);
    ctx.closePath();
    ctx.fill();
  }

  //body
  if(pose["keypoints"][6]["score"] >= accuracy && pose["keypoints"][5]["score"] >= accuracy && pose["keypoints"][11]["score"] >= accuracy && pose["keypoints"][12]["score"] >= accuracy) {
    ctx.fillStyle = "rgba(185, 219, 154, 0.603)";
    ctx.beginPath();
    ctx.moveTo(leftShoulderX, leftShoulderY - 5);
    ctx.lineTo(rightShoulderX, rightShoulderY - 5);
    ctx.quadraticCurveTo(rightShoulderX + 5, rightShoulderY - 5, rightShoulderX + 5, rightShoulderY);
    ctx.lineTo(rightHuefteX + 5, rightHuefteY);
    ctx.quadraticCurveTo(rightHuefteX + 5, rightHuefteY + 25, rightHuefteX, rightHuefteY + 5);
    ctx.lineTo(leftHuefteX, leftHuefteY - 5);
    ctx.quadraticCurveTo(leftHuefteX - 5, leftHuefteY + 5, leftHuefteX - 5, leftHuefteY);
    ctx.lineTo(leftShoulderX - 5, leftShoulderY);
    ctx.quadraticCurveTo(leftShoulderX - 5, leftShoulderY - 5, leftShoulderX, leftShoulderY - 5)
    ctx.closePath();
    ctx.fill();
  }
}
 
 /**
  * Draw pose keypoints onto a canvas
  */
 export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
   for (let i = 0; i < keypoints.length; i++) {
     const keypoint = keypoints[i];
 
     if (keypoint.score < minConfidence) {
       continue;
     }
 
     const {y, x} = keypoint.position;
     drawPoint(ctx, y * scale, x * scale, 3, color);
   }
 }
 
 /**
  * Draw the bounding box of a pose. For example, for a whole person standing
  * in an image, the bounding box will begin at the nose and extend to one of
  * ankles
  */
 export function drawBoundingBox(keypoints, ctx) {
   const boundingBox = posenet.getBoundingBox(keypoints);
 
   ctx.rect(
       boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
       boundingBox.maxY - boundingBox.minY);
 
   ctx.strokeStyle = boundingBoxColor;
   ctx.stroke();
 }
 
 /**
  * Converts an arary of pixel data into an ImageData object
  */
 export async function renderToCanvas(a, ctx) {
   const [height, width] = a.shape;
   const imageData = new ImageData(width, height);
 
   const data = await a.data();
 
   for (let i = 0; i < height * width; ++i) {
     const j = i * 4;
     const k = i * 3;
 
     imageData.data[j + 0] = data[k + 0];
     imageData.data[j + 1] = data[k + 1];
     imageData.data[j + 2] = data[k + 2];
     imageData.data[j + 3] = 255;
   }
 
   ctx.putImageData(imageData, 0, 0);
 }
 
 /**
  * Draw an image on a canvas
  */
 export function renderImageToCanvas(image, size, canvas) {
   canvas.width = size[0];
   canvas.height = size[1];
   const ctx = canvas.getContext('2d');
 
   ctx.drawImage(image, 0, 0);
 }
 
 /**
  * Draw heatmap values, one of the model outputs, on to the canvas
  * Read our blog post for a description of PoseNet's heatmap outputs
  * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
  */
 export function drawHeatMapValues(heatMapValues, outputStride, canvas) {
   const ctx = canvas.getContext('2d');
   const radius = 5;
   const scaledValues = heatMapValues.mul(tf.scalar(outputStride, 'int32'));
 
   drawPoints(ctx, scaledValues, radius, color);
 }
 
 /**
  * Used by the drawHeatMapValues method to draw heatmap points on to
  * the canvas
  */
 function drawPoints(ctx, points, radius, color) {
   const data = points.buffer().values;
 
   for (let i = 0; i < data.length; i += 2) {
     const pointY = data[i];
     const pointX = data[i + 1];
 
     if (pointX !== 0 && pointY !== 0) {
       ctx.beginPath();
       ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
       ctx.fillStyle = color;
       ctx.fill();
     }
   }
 }
 
 /**
  * Draw offset vector values, one of the model outputs, on to the canvas
  * Read our blog post for a description of PoseNet's offset vector outputs
  * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
  */
 /*
 export function drawOffsetVectors(
     heatMapValues, offsets, outputStride, scale = 1, ctx) {
   const offsetPoints =
       posenet.singlePose.getOffsetPoints(heatMapValues, outputStride, offsets);
 
   const heatmapData = heatMapValues.buffer().values;
   const offsetPointsData = offsetPoints.buffer().values;
 
   for (let i = 0; i < heatmapData.length; i += 2) {
     const heatmapY = heatmapData[i] * outputStride;
     const heatmapX = heatmapData[i + 1] * outputStride;
     const offsetPointY = offsetPointsData[i];
     const offsetPointX = offsetPointsData[i + 1];
 
     drawSegment(
         [heatmapY, heatmapX], [offsetPointY, offsetPointX], color, scale, ctx);
   }
 }
 */