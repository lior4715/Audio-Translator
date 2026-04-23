import { useState } from "react"

interface FileUploaderProps {
    onFileSelect: (file: file) => void
}

function FileUploader({onFileSelect}:){
    const [modalVisibility, setModalVisibility] = useState(false)
    const handleFileUpload = () => {
        setModalVisibility(!modalVisibility)

    }
    const button = (<button onClick={handleFileUpload}>Upload</button>)
    return (
        <div>

        </div>
    )
}

export default FileUploader