import React from 'react';

const MessageContent = ({ message }) => {
  switch (message.type) {
    case 'image':
      return (
        <div className="media-content">
          <img src={message.content} alt="Imagen del chat" className="chat-image" />
          {message.caption && <p className="caption">{message.caption}</p>}
        </div>
      );
    case 'audio':
      return (
        <div className="media-content">
          <audio controls src={message.content} className="chat-audio">
            Tu navegador no soporta el audio.
          </audio>
        </div>
      );
    case 'video':
       return (
        <div className="media-content">
          <video controls src={message.content} className="chat-video">
            Tu navegador no soporta el video.
          </video>
        </div>
      );
    case 'text':
    default:
      return <p className="message-text" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>;
  }
};

export function ChatMessage({ message, puntoDeVista }) {
  const isMyMessage = message.sender.toLowerCase() === puntoDeVista;
  let avatarSrc = null;
  if (!isMyMessage) {
    avatarSrc = message.sender.toLowerCase() === 'ivan' 
      ? '/avatar_ivan.png'
      : '/avatar_antok.png';
  }

  return (
    <div className={`message-row ${isMyMessage ? 'my-message' : 'their-message'}`}>
      {avatarSrc && (
        <img src={avatarSrc} alt="Avatar" className="avatar" />
      )}
      
      <div className={`message-bubble type-${message.type || 'text'}`}>
        <MessageContent message={message} />
        <span className="message-timestamp">
          {new Date(message.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}