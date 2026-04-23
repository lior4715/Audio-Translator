import librosa
import os
import noisereduce as nr
import soundfile as sf

def preprocess_audio(input_path: str, prop_decrease: float = 0.75):
    y, sr = librosa.load(input_path, sr=22050)
    reduced_noise = nr.reduce_noise(y=y, sr=22050, stationary=True, prop_decrease= prop_decrease)
    output_filename = "temp/" + os.path.splitext(os.path.basename(input_path))[0] + "_cleaned.wav"
    sf.write(output_filename, reduced_noise, 22050)

    return output_filename