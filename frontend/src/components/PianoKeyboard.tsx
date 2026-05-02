import { useEffect, useRef } from "react";
import type { Note } from "../types";

interface PianoKeyboardProps {
  activeNotes: Note[];
}

const MIN_PITCH = 21;  // A0
const MAX_PITCH = 108; // C8

// Returns true if a MIDI pitch is a black key
function isBlackKey(pitch: number): boolean {
  return [1, 3, 6, 8, 10].includes(pitch % 12);
}

// Returns the index of a white key (0-51) for a given pitch
// Returns -1 if the pitch is a black key

const WHITE_KEY_COUNT = 52;

export default function PianoKeyboard({ activeNotes }: PianoKeyboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const whiteKeyWidth = W / WHITE_KEY_COUNT;
    const blackKeyWidth = whiteKeyWidth * 0.6;
    const blackKeyHeight = H * 0.62;

    const activePitches = new Set(activeNotes.map((n) => n.pitch));

    ctx.clearRect(0, 0, W, H);

    // Draw white keys first
    let whiteIndex = 0;
    for (let pitch = MIN_PITCH; pitch <= MAX_PITCH; pitch++) {
      if (isBlackKey(pitch)) continue;

      const x = whiteIndex * whiteKeyWidth;
      const isActive = activePitches.has(pitch);

      // Key fill
      ctx.fillStyle = isActive ? "#c4b5fd" : "#f5f5f5";
      ctx.fillRect(x + 1, 0, whiteKeyWidth - 2, H);

      // Key border
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, 0, whiteKeyWidth - 2, H);

      // Glow effect on active keys
      if (isActive) {
        ctx.fillStyle = "rgba(167, 139, 250, 0.3)";
        ctx.fillRect(x + 1, 0, whiteKeyWidth - 2, H);
      }

      whiteIndex++;
    }

    // Draw black keys on top
    for (let pitch = MIN_PITCH; pitch <= MAX_PITCH; pitch++) {
      if (!isBlackKey(pitch)) continue;

      // Find the white key to the left of this black key
      let leftWhiteIndex = 0;
      for (let p = MIN_PITCH; p < pitch; p++) {
        if (!isBlackKey(p)) leftWhiteIndex++;
      }

      const x = leftWhiteIndex * whiteKeyWidth - blackKeyWidth / 2;
      const isActive = activePitches.has(pitch);

      ctx.fillStyle = isActive ? "#7c3aed" : "#1a1a1a";
      ctx.fillRect(x, 0, blackKeyWidth, blackKeyHeight);

      // Subtle highlight on active black keys
      if (isActive) {
        ctx.fillStyle = "rgba(167, 139, 250, 0.4)";
        ctx.fillRect(x, 0, blackKeyWidth, blackKeyHeight);
      }
    }
  }, [activeNotes]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={120}
      style={{ display: "block", width: "100%", background: "#111" }}
    />
  );
}
