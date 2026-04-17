"use client";

import Webcam from "react-webcam";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type NormalizedLandmark = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
};

export type PoseStatus = "loading" | "detected" | "lost";

export interface ARMirrorHandle {
  capture: () => Promise<Blob | null>;
}

interface ARMirrorProps {
  garmentType: "top" | "bottom";
  wheelchairMode: boolean;
  brightness: number;
  highContrast: boolean;
  onPoseStatusChange: (status: PoseStatus) => void;
}

const WASM_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm";

function drawGarment(
  ctx: CanvasRenderingContext2D,
  lms: NormalizedLandmark[],
  W: number,
  H: number,
  garmentType: "top" | "bottom",
  wheelchairMode: boolean,
  highContrast: boolean,
  reduceMotion: boolean
): void {
  const lm = (i: number) => ({
    x: (lms[i]?.x ?? 0) * W,
    y: (lms[i]?.y ?? 0) * H,
  });

  const lShoulder = lm(11);
  const rShoulder = lm(12);
  const lHip = lm(23);
  const rHip = lm(24);
  const lAnkle = lm(27);
  const rAnkle = lm(28);

  const fill = highContrast
    ? "rgba(255,255,255,0.88)"
    : "rgba(194,158,95,0.70)";
  const stroke = highContrast ? "#FFFFFF" : "#C29E5F";
  const lineWidth = highContrast ? 4 : 2;

  ctx.save();
  if (!reduceMotion) {
    ctx.shadowColor = stroke;
    ctx.shadowBlur = highContrast ? 8 : 4;
  }
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;

  if (garmentType === "top") {
    const shoulderW = Math.abs(rShoulder.x - lShoulder.x);
    const neckR = shoulderW * 0.18;
    const midX = (lShoulder.x + rShoulder.x) / 2;
    const shoulderY = (lShoulder.y + rShoulder.y) / 2;
    const hipW = Math.abs(rHip.x - lHip.x);

    ctx.beginPath();
    ctx.moveTo(lShoulder.x - shoulderW * 0.12, shoulderY);
    ctx.lineTo(midX - neckR, shoulderY);
    ctx.arc(midX, shoulderY, neckR, Math.PI, 0, false);
    ctx.lineTo(rShoulder.x + shoulderW * 0.12, shoulderY);
    ctx.lineTo(rHip.x + hipW * 0.1, rHip.y);
    ctx.lineTo(lHip.x - hipW * 0.1, lHip.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    const hipY = (lHip.y + rHip.y) / 2;
    const hipCenterX = (lHip.x + rHip.x) / 2;
    const hipW = Math.abs(rHip.x - lHip.x);
    const legW = hipW * 0.44;
    const lHipX = hipCenterX - hipW / 2;
    const rHipX = hipCenterX + hipW / 2;
    const rawLegLen = (lAnkle.y + rAnkle.y) / 2 - hipY;
    const legLen = wheelchairMode ? rawLegLen * 1.15 : rawLegLen;

    // Left leg
    ctx.beginPath();
    ctx.moveTo(lHipX - legW * 0.05, hipY);
    ctx.lineTo(lHipX + legW, hipY);
    ctx.lineTo(lHipX + legW * 0.85, hipY + legLen);
    ctx.lineTo(lHipX - legW * 0.15, hipY + legLen);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(rHipX - legW, hipY);
    ctx.lineTo(rHipX + legW * 0.05, hipY);
    ctx.lineTo(rHipX + legW * 0.15, hipY + legLen);
    ctx.lineTo(rHipX - legW * 0.85, hipY + legLen);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Waistband
    ctx.fillStyle = highContrast
      ? "rgba(255,255,255,0.95)"
      : "rgba(194,158,95,0.88)";
    ctx.beginPath();
    ctx.rect(
      lHipX - legW * 0.05,
      hipY - H * 0.012,
      hipW + legW * 0.1,
      H * 0.034
    );
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

export const ARMirror = forwardRef<ARMirrorHandle, ARMirrorProps>(
  function ARMirror(
    { garmentType, wheelchairMode, brightness, highContrast, onPoseStatusChange },
    ref
  ) {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const landmarkerRef = useRef<PoseLandmarker | null>(null);
    const rafRef = useRef<number>(0);
    const lastFrameRef = useRef<number>(0);
    const reduceMotionRef = useRef(false);
    const [modelReady, setModelReady] = useState(false);
    const [modelError, setModelError] = useState<string | null>(null);

    useEffect(() => {
      reduceMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }, []);

    // Load MediaPipe Pose Landmarker
    useEffect(() => {
      let cancelled = false;
      onPoseStatusChange("loading");

      (async () => {
        try {
          const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
          if (cancelled) return;
          const landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "/models/pose_landmarker_lite.task",
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          if (cancelled) {
            landmarker.close();
            return;
          }
          landmarkerRef.current = landmarker;
          setModelReady(true);
        } catch (err) {
          if (!cancelled) {
            setModelError(
              err instanceof Error ? err.message : "Model failed to load"
            );
            onPoseStatusChange("lost");
          }
        }
      })();

      return () => {
        cancelled = true;
        landmarkerRef.current?.close();
        landmarkerRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Pose detection render loop at 15 FPS
    useEffect(() => {
      if (!modelReady) return;
      const FPS = 15;
      const interval = 1000 / FPS;

      function render(ts: number) {
        rafRef.current = requestAnimationFrame(render);
        if (ts - lastFrameRef.current < interval) return;
        lastFrameRef.current = ts;

        const video = webcamRef.current?.video;
        const canvas = canvasRef.current;
        const landmarker = landmarkerRef.current;
        if (!video || !canvas || !landmarker) return;
        if (video.readyState < 2) return;

        if (canvas.width !== video.videoWidth)
          canvas.width = video.videoWidth || 1280;
        if (canvas.height !== video.videoHeight)
          canvas.height = video.videoHeight || 720;

        let result: { landmarks: NormalizedLandmark[][] };
        try {
          result = landmarker.detectForVideo(video, performance.now()) as typeof result;
        } catch {
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!result.landmarks?.length) {
          onPoseStatusChange("lost");
          return;
        }

        onPoseStatusChange("detected");
        const firstPose = result.landmarks[0];
        if (!firstPose) return;
        drawGarment(
          ctx,
          firstPose,
          canvas.width,
          canvas.height,
          garmentType,
          wheelchairMode,
          highContrast,
          reduceMotionRef.current
        );
      }

      rafRef.current = requestAnimationFrame(render);
      return () => cancelAnimationFrame(rafRef.current);
    }, [modelReady, garmentType, wheelchairMode, highContrast, onPoseStatusChange]);

    // Expose capture via ref
    useImperativeHandle(ref, () => ({
      async capture(): Promise<Blob | null> {
        const video = webcamRef.current?.video;
        const overlay = canvasRef.current;
        if (!video || !overlay) return null;

        const out = document.createElement("canvas");
        out.width = video.videoWidth || 1280;
        out.height = video.videoHeight || 720;
        const ctx = out.getContext("2d");
        if (!ctx) return null;

        // Mirror + draw video frame
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -out.width, 0, out.width, out.height);
        ctx.restore();

        // Mirror + draw garment overlay
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(overlay, -out.width, 0, out.width, out.height);
        ctx.restore();

        return new Promise<Blob | null>((resolve) =>
          out.toBlob(resolve, "image/png")
        );
      },
    }));

    return (
      <div
        className="relative overflow-hidden rounded-xl bg-[#1A1A1A]"
        style={{ filter: `brightness(${brightness}%)` }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          }}
          style={{ transform: "scaleX(-1)", width: "100%", display: "block" }}
          className="rounded-xl"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none rounded-xl"
          style={{ transform: "scaleX(-1)" }}
          aria-hidden="true"
        />

        {!modelReady && !modelError && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-live="polite"
          >
            <p className="text-[#FAFAF7] text-sm bg-[#1A1A1A]/70 px-4 py-2 rounded-lg">
              Loading pose model...
            </p>
          </div>
        )}

        {modelError && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-[#FAFAF7] text-sm bg-[#C4725A]/80 px-4 py-3 rounded-lg text-center max-w-xs leading-relaxed">
              Pose model not found. Download{" "}
              <code className="font-mono text-xs">pose_landmarker_lite.task</code>{" "}
              from MediaPipe CDN and place it in{" "}
              <code className="font-mono text-xs">public/models/</code>.
            </p>
          </div>
        )}
      </div>
    );
  }
);
