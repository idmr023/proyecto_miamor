import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VoiceLogin() {
  // const [message, setMessage] = useState('');
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  //   recognition.lang = 'es-ES';
  //   recognition.continuous = false;
  //   recognition.interimResults = false;

  //   recognition.onresult = async (event) => {
  //     const transcript = event.results[0][0].transcript;
  //     setMessage(`Dijiste: "${transcript}"`);

  //     const isFemale = true; // simulación, aquí iría tu lógica para detectar pitch
  //     const hasKeyword = transcript.toLowerCase().includes('eres un lindo');

  //     if (isFemale && hasKeyword) {
  //       navigate('/home');
  //     } else {
  //       setMessage('Acceso denegado. Voz no reconocida o palabra clave incorrecta.');
  //     }
  //   };

  //   recognition.onerror = () => setMessage('Error al reconocer voz');
  //   recognition.start();

  //   return () => recognition.stop();
  // }, []);

  // return (
  //   <div className="h-screen flex items-center justify-center bg-pink-100">
  //     <div className="text-center text-pink-600 text-xl font-semibold">
  //       {message || 'Por favor, diga la palabra clave con su voz...'}
  //     </div>
  //   </div>
  // );
}