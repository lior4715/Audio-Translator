// Representing a note parsed from the MIDI.
export interface Note {
  startTime: number;  // in seconds
  endTime: number;    // in seconds
  pitch: number;      // MIDI number (21-108 for piano)
}