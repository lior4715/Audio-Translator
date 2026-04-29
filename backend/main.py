from transcribe import transcribe_to_audio
from fastapi import FastAPI, UploadFile 
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/transcribe")
async def initial_upload(file: UploadFile):
    content = await file.read()
    with open("temp/" + file.filename, "wb") as f:
        f.write(content)
    
    file_path = "temp/" + file.filename

    return FileResponse(transcribe_to_audio(file_path))






