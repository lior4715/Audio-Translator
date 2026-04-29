import { useState } from "react"
import FileUploader from "./components/FileUploader"

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [midiBlob, setMidiBlob] = useState(null)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    setIsLoading(true)
    formData.append("file", file)
    const response = await fetch(`http://localhost:8000/transcribe`, {
      method: "POST",
      body: formData
    })

    const midiBlob = await response.blob()
    setMidiBlob(midiBlob)
    console.log(midiBlob)
    setIsLoading(false)
  }

  return(
    <div>
      <h1>Audio Translator</h1>
      <FileUploader onFileSelect={uploadFile}/>
    </div>
  )
}

export default App