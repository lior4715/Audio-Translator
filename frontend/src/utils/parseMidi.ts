import { Midi } from "@tonejs/midi";
import type { Note } from "../types"


// Parse the MIDI blob whenever it changes.
export default async function parseMidi(midiBlob: Blob): Promise<Note[]> {
    if (!midiBlob) return [];

    const arrayBuffer = await midiBlob.arrayBuffer();
    const midi = new Midi(arrayBuffer);

    // Push all tracks into a single array of notes.
    const parsedNotes: Note[] = [];


    // Convert blob to ArrayBuffer so @tonejs/midi can read it
        
        midi.tracks.forEach((track) => {
        track.notes.forEach((note) => {
            parsedNotes.push({
            startTime: note.time,
            endTime: note.time + note.duration,
            pitch: note.midi,
            });
        });
        })

    return parsedNotes
}
