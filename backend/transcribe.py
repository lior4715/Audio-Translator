import preprocess
import basic_pitch.inference as bp
import os
from basic_pitch import ICASSP_2022_MODEL_PATH



def transcribe_to_audio(input_path: str, prop_decrease: float = 0.75):
    output_filename = "temp/" + os.path.splitext(os.path.basename(input_path))[0] + "_finished.mid"
    processed_file = preprocess.preprocess_audio(input_path, prop_decrease)
    model_output, midi_data, note_events = bp.predict(processed_file, ICASSP_2022_MODEL_PATH)
    midi_data.write(output_filename)

    return output_filename