import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";

// Representing a note parsed from the MIDI.
interface Note {
  startTime: number;  // in seconds
  endTime: number;    // in seconds
  pitch: number;      // MIDI number (21-108 for piano)
}

interface PianoRollProps {
  midiBlob: Blob | null;
  isPlaying: boolean;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

// Piano range constants
const MIN_PITCH = 21;   // A0 - lowest piano key
const MAX_PITCH = 108;  // C8 - highest piano key
const PITCH_COUNT = MAX_PITCH - MIN_PITCH + 1; // 88 keys

// How many seconds of notes are visible above the keyboard at once
// Controls when the notes start appearing at the top.
const VISIBLE_SECONDS = 4;

export default function PianoRoll({ midiBlob, isPlaying, currentTime, onTimeUpdate }: PianoRollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const startTimestampRef = useRef<number>(0);  // performance.now() when playback started
  const pausedAtRef = useRef<number>(0);         // currentTime value when paused

  const [notes, setNotes] = useState<Note[]>([]);

  // Parse the MIDI blob whenever it changes.
  useEffect(() => {
    if (!midiBlob) return;

    const parseMidi = async () => {
      // Convert blob to ArrayBuffer so @tonejs/midi can read it
      const arrayBuffer = await midiBlob.arrayBuffer();
      const midi = new Midi(arrayBuffer);

      // Push all tracks into a single array of notes.
      const parsedNotes: Note[] = [];
      midi.tracks.forEach((track) => {
        track.notes.forEach((note) => {
          parsedNotes.push({
            startTime: note.time,
            endTime: note.time + note.duration,
            pitch: note.midi,
          });
        });
      });

      setNotes(parsedNotes);
    };

    parseMidi();
  }, [midiBlob]);

  // Animation loop — starts/stops the animation based on isPlaying.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || notes.length === 0) return;

    // Drawing context that allows us to use drawing methods for 2D drawing.
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isPlaying) {
      // Record when we started playing, relative to time already passed until pause.
      startTimestampRef.current = performance.now() - pausedAtRef.current * 1000;

      const draw = (timestamp: number) => {
        // Calculate how many seconds have elapsed since playback started
        const elapsed = (timestamp - startTimestampRef.current) / 1000;
        onTimeUpdate(elapsed);
        pausedAtRef.current = elapsed;

        const W = canvas.width;
        const H = canvas.height;

        // Clear canvas each frame
        ctx.clearRect(0, 0, W, H);

        // Dark background
        ctx.fillStyle = "#0f0f0f";
        ctx.fillRect(0, 0, W, H);

        // Draw subtle vertical grid lines for each key
        const keyWidth = W / PITCH_COUNT;
        for (let i = 0; i < PITCH_COUNT; i++) {
          const pitch = MIN_PITCH + i;
          // Highlight black key columns slightly
          const isBlackKey = [1, 3, 6, 8, 10].includes(pitch % 12);
          ctx.fillStyle = isBlackKey ? "#161616" : "#111111";
          ctx.fillRect(i * keyWidth, 0, keyWidth, H);

          // Subtle column separator
          ctx.fillStyle = "#1a1a1a";
          ctx.fillRect(i * keyWidth, 0, 1, H);
        }

        // Draw notes as falling tiles
        notes.forEach((note) => {
          if (note.pitch < MIN_PITCH || note.pitch > MAX_PITCH) return;

          const keyIndex = note.pitch - MIN_PITCH;
          const x = keyIndex * keyWidth;
          const tileWidth = keyWidth - 1; // small gap between tiles

          // Vertical position: notes fall from top to bottom.
          // When elapsed is equal to note.startTime, the tile's bottom reaches the keyboard (y = H).
          // When elapsed is equal to note.startTime - VISIBLE_SECONDS, the tile's bottom is at y = 0.
          const secondsUntilStart = note.startTime - elapsed;
          const secondsUntilEnd = note.endTime - elapsed;

          const bottomY = H - (secondsUntilStart / VISIBLE_SECONDS) * H;
          const topY = H - (secondsUntilEnd / VISIBLE_SECONDS) * H;
          const tileHeight = bottomY - topY;

          // Skip tiles that are off screen
          if (bottomY < 0 || topY > H) return;

          // Color based on whether note is actively playing
          const isActive = elapsed >= note.startTime && elapsed <= note.endTime;
          const isBlackKey = [1, 3, 6, 8, 10].includes(note.pitch % 12);

          if (isActive) {
            ctx.fillStyle = isBlackKey ? "#a78bfa" : "#c4b5fd"; // bright purple when active
          } else {
            // Opacity based on velocity for visual depth
            const alpha = 0.8
            ctx.fillStyle = isBlackKey
              ? `rgba(124, 58, 237, ${alpha})`
              : `rgba(167, 139, 250, ${alpha})`;
          }

          // Rounded rectangles for tiles
          const radius = Math.min(3, tileWidth / 4);
          ctx.beginPath();
          ctx.roundRect(x + 1, topY, tileWidth, Math.max(tileHeight, 2), radius);
          ctx.fill();

          // Bright top edge on active notes (glow effect)
          if (isActive) {
            ctx.fillStyle = "#ede9fe";
            ctx.fillRect(x + 1, topY, tileWidth, 2);
          }
        });

        // Schedule next frame
        animationFrameId.current = requestAnimationFrame(draw);
      };

      animationFrameId.current = requestAnimationFrame(draw);
    } else {
      // Pause — cancel the animation loop
      cancelAnimationFrame(animationFrameId.current);
    }

    // Cleanup when component unmounts or dependencies change
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isPlaying, notes]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={600}
      style={{ display: "block", width: "100%", background: "#0f0f0f" }}
    />
  );
}
