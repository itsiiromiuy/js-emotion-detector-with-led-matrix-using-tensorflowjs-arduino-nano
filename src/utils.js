import { TRIANGULATION } from "./triangulation";

// Triangle drawing method
const drawPath = (ctx, points, closePath) => {
  const region = new Path2D();
  region.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point.x, point.y);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.strokeStyle = "aqua";
  ctx.stroke(region);
};

// Drawing Mesh
export const drawMesh = (predictions, ctx) => {
  if (!predictions.length) return;
  
    predictions.forEach((prediction) => {
      const keypoints = prediction.keypoints;

      //  Draw Triangles
      for (let i = 0; i < TRIANGULATION.length / 3; i++) {
        // Get sets of three keypoints for the triangle

        const points = [
          TRIANGULATION[i * 3],
          TRIANGULATION[i * 3 + 1],
          TRIANGULATION[i * 3 + 2],
        ].map((index) => keypoints[index]);
        //  Draw triangle
        drawPath(ctx, points, true);
      }

      // Draw Dots
      for (let i = 0; i < keypoints.length; i++) {
        const x = keypoints[i][0];
        const y = keypoints[i][1];

        ctx.beginPath();
        ctx.arc(x, y, 1 /* radius */, 0, 3 * Math.PI);
        ctx.fillStyle = "pink";
        ctx.fill();
      }
    });
  };