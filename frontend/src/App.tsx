import { useState } from "react"
import FileUploader from "./components/FileUploader"
import PianoRoll from "./components/PianoRoll"

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [midiBlob, setMidiBlob] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    setIsLoading(true)
    formData.append("file", file)
    const response = await fetch(`http://localhost:8000/transcribe`, {
      method: "POST",
      body: formData
    })

    const responseBlob = await response.blob()
    setMidiBlob(responseBlob)
    console.log(responseBlob)
    setIsLoading(false)
  }

  const handleTimeUpdate = (elapsed: number) => {
    setCurrentTime(elapsed)
  }

  return(
    <div>
      <h1>Audio Translator</h1>
      <FileUploader onFileSelect={uploadFile}/>
      <PianoRoll midiBlob={midiBlob} isPlaying={isPlaying} currentTime={currentTime} onTimeUpdate={handleTimeUpdate}/>
    </div>
  )
}

export default App