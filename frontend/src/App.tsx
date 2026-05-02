import { useState, useEffect } from "react";

import FileUploader from "./components/FileUploader";
import PianoRoll from "./components/PianoRoll";
import PlaybackControls from "./components/PlaybackControls";

import parseMidi from "./utils/parseMidi"
import PianoKeyboard from "./components/PianoKeyboard";


function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [midiBlob, setMidiBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [seekTime, setSeekTime] = useState(0);
  const [seekTrigger, setSeekTrigger] = useState(0)

  const [notes, setNotes] = useState([])
  const [activeNotes, setActiveNotes] = useState([])

  // Handling the parsing at the top for convenient passing of the active notes.
  useEffect(() => {
    const parse = async () => {
      const parsedNotes = await parseMidi(midiBlob)
      setNotes(parsedNotes)
    }

    parse()
  }, [midiBlob])


  const uploadFile = async (file: File) => {
    const formData = new FormData();
    setIsLoading(true);
    formData.append("file", file);
    const response = await fetch(`http://localhost:8000/transcribe`, {
      method: "POST",
      body: formData,
    });

    const responseBlob = await response.blob();
    setMidiBlob(responseBlob);
    setIsLoading(false);
  };

  const handleTimeUpdate = (elapsed: number) => {
    setCurrentTime(elapsed);
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleRestart = () => {
    setSeekTime(0);
    setSeekTrigger((prev) => prev + 1)
  };

  const handleSkipForwards = () => {
    setSeekTime(currentTime + 5);
    setSeekTrigger((prev) => prev + 1)

  };

  const handleSkipBackwards = () => {
    setSeekTime(currentTime - 5);
    setSeekTrigger((prev) => prev + 1)
  };

  return (
    <div>
      <h1>Audio Translator</h1>
      <FileUploader onFileSelect={uploadFile} />
      <PianoRoll
        isPlaying={isPlaying}
        onTimeUpdate={handleTimeUpdate}
        seekTime={seekTime}
        seekTrigger={seekTrigger}
        notes={notes}
        onActiveNotesChange={(active) => setActiveNotes(active)}
      />

      <PianoKeyboard activeNotes={activeNotes}/>

      {!isLoading ? (
        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
          onSkipForwards={handleSkipForwards}
          onSkipBackwards={handleSkipBackwards}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default App;
