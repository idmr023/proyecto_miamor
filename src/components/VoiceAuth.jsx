// components/VoiceAuth.jsx
import React, { useState, useRef } from 'react';

const VoiceAuth = () => {
  // El estado 'access' puede tener 3 valores:
  // null: estado inicial, no se ha intentado verificar.
  // true: verificado exitosamente.
  // false: verificación fallida o error.
  const [access, setAccess] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setAccess(null);
      audioChunksRef.current = [];

      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'grabacion.webm');

        try {
          const res = await fetch('http://localhost:5000/verify', {
            method: 'POST',
            body: formData,
          });

          // Leer la respuesta JSON del servidor
          const result = await res.json();

          // **AÑADIMOS UN CONSOLE.LOG PARA DEPURAR**
          // Revisa la consola de tu navegador (F12) para ver qué responde exactamente el servidor.
          console.log('Respuesta del servidor:', result);

          if (!res.ok) {
            console.error('Error desde el servidor:', result.error || 'Error desconocido');
            setAccess(false);
            return;
          }
          
          // Actualizamos el estado 'access' con el valor que nos da el backend
          setAccess(result.access);

        } catch (error) {
          console.error('Error al enviar el audio:', error);
          setAccess(false);
        } finally {
            stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.start();

      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 4000);

    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
      setIsRecording(false);
    }
  };

  // **NUEVA FUNCIÓN PARA EL BOTÓN**
  // Esta función se ejecutará cuando el usuario haga clic en "Entrar a la página".
  // Por ahora solo muestra un mensaje, pero aquí podrías poner la lógica para navegar a otra ruta.
  const handleEnter = () => {
    alert("¡Bienvenido! Navegando a la página principal...");
    // Ejemplo de cómo navegarías con React Router:
    // navigate('/dashboard');
  };

  return (
    <div>
      <h2>Autenticación por voz</h2>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Grabando...' : 'Grabar y Enviar (4 seg)'}
      </button>

      {/* --- RENDERIZADO CONDICIONAL --- */}
      
      {/* 1. Mensaje de acceso autorizado y el nuevo botón */}
      {access === true && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Acceso autorizado</p>
          <button onClick={handleEnter}>
            Entrar a la página
          </button>
        </div>
      )}

      {/* 2. Mensaje de acceso denegado */}
      {access === false && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: 'red', fontWeight: 'bold' }}>❌ Acceso denegado</p>
        </div>
      )}

      {/* No se muestra nada si 'access' es 'null' (el estado inicial) */}
    </div>
  );
};

export default VoiceAuth;