import { useState, useRef } from "react";
import FileUploader from "./components/FileUploader";
import PianoRoll from "./components/PianoRoll";
import PlaybackControls from "./components/PlaybackControls";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [midiBlob, setMidiBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [seekTime, setSeekTime] = useState(0);
  const [seekTrigger, setSeekTrigger] = useState(0)

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
        midiBlob={midiBlob}
        isPlaying={isPlaying}
        currentTime={currentTime}
        onTimeUpdate={handleTimeUpdate}
        seekTime={seekTime}
        seekTrigger={seekTrigger}
      />
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
