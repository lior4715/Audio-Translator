import { useState } from "react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setModalVisibility(false);
    }
  };

  const handleOpenModal = () => setModalVisibility(true);

  return (
    <div>
      <button onClick={handleOpenModal}>Upload</button>
      {modalVisibility && (
        <div>
          <h2>Upload file here</h2>
          <input type="file" onChange={handleFileUpload} />
        </div>
      )}
    </div>
  );
}

export default FileUploader;
