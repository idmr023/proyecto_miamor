# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import ffmpeg
import librosa
import numpy as np
from verificador import verifier

# Imports para la reducción de ruido
import noisereduce as nr
import soundfile as sf

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)

MIN_DURATION_SECONDS = 2
# Puedes empezar con un umbral más bajo para ser más tolerante
DEFAULT_THRESHOLD = 0.50 

@app.route('/verify', methods=['POST'])
def verify():
    if 'audio' not in request.files:
        return jsonify({"error": "No se encontró el archivo de audio ('audio')"}), 400

    audio_file = request.files['audio']
    
    # --- PASO 1: Guardar el archivo original (.webm) ---
    original_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}.webm")
    audio_file.save(original_path)

    # Rutas para los archivos temporales
    converted_path = original_path.replace(".webm", ".wav")
    
    # --- PASO 2: Convertir de WebM a WAV ---
    try:
        (
            ffmpeg
            .input(original_path)
            .output(converted_path, format='wav', ac=1, ar='16000') # Mono, 16kHz
            .run(capture_stdout=True, capture_stderr=True, overwrite_output=True)
        )
    except ffmpeg.Error as e:
        print("Error de ffmpeg:", e.stderr.decode())
        if os.path.exists(original_path):
            os.remove(original_path)
        return jsonify({"error": "La conversión del audio falló."}), 500

    # --- PASO 3: Reducción de Ruido del archivo WAV ---
    try:
        # Cargar el archivo WAV recién convertido
        rate, data = sf.read(converted_path)
        # Realizar la reducción de ruido
        reduced_noise_data = nr.reduce_noise(y=data, sr=rate)
        # Sobrescribir el archivo con la versión limpia
        sf.write(converted_path, reduced_noise_data, rate)
        print("Reducción de ruido aplicada exitosamente.")
    except Exception as e:
        # Si la reducción de ruido falla, no es un error fatal.
        # Podemos continuar con el archivo original convertido. Solo lo notificamos.
        print(f"Advertencia: No se pudo aplicar la reducción de ruido: {e}")

    # --- PASO 4: Verificar la duración del archivo final ---
    try:
        # Usamos 'path' que es el nombre de argumento más reciente en librosa
        duration = librosa.get_duration(path=converted_path)
        print(f"Duración del audio final (limpio): {duration:.2f} segundos.")
        
        if duration < MIN_DURATION_SECONDS:
            os.remove(original_path)
            os.remove(converted_path)
            return jsonify({"error": f"Audio demasiado corto. Se requieren {MIN_DURATION_SECONDS}s, se recibieron {duration:.2f}s."}), 400
            
    except Exception as e:
        print("Error al leer la duración del audio:", e)
        os.remove(original_path)
        os.remove(converted_path)
        return jsonify({"error": "Error al procesar el archivo de audio."}), 500

    # --- PASO 5: Verificación de la voz con el modelo ---
    score_value = 0.0 # Valor por defecto
    try:
        score, prediction = verifier.verify_files("registered/voz_registrada.wav", converted_path)
        score_value = score.item()
    except Exception as e:
         print("Error durante la verificación de SpeechBrain:", e)
         # Limpiamos antes de salir
         os.remove(original_path)
         os.remove(converted_path)
         return jsonify({"error": "Ocurrió un error en el modelo de verificación."}), 500
    finally:
        # --- PASO 6: Limpieza de archivos ---
        if os.path.exists(original_path):
            os.remove(original_path)
        if os.path.exists(converted_path):
            os.remove(converted_path)

    print(f"Puntuación de similitud: {score_value:.4f}")

    if score_value > DEFAULT_THRESHOLD:
        return jsonify({"access": True, "score": score_value})
    else:
        return jsonify({"access": False, "score": score_value})


if __name__ == '__main__':
    app.run(debug=True)