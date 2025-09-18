import React, { useState, useMemo } from 'react';
import messagesData from './Datos/messages.json';
import { ChatMessage } from './Components/ChatMessage';
import './BooChat.css';
import { Navbar } from 'components/NavBar/NavBar';

const formatDateLabel = (dateString) => {
  const messageDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  messageDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) return 'Hoy';
  if (messageDate.getTime() === yesterday.getTime()) return 'Ayer';
  
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};

const addDateSeparators = (messages) => {
  const processedItems = [];
  let lastDate = null;
  messages.forEach(message => {
    const messageDate = new Date(message.createdAt).toDateString();
    if (messageDate !== lastDate) {
      processedItems.push({
        type: 'date_separator',
        id: `date-${messageDate}`,
        date: message.createdAt,
      });
      lastDate = messageDate;
    }
    processedItems.push({ ...message, type: message.type || 'text' });
  });
  return processedItems;
};


export default function BooChatConversation() {
  // 1. NUEVO ESTADO para controlar el punto de vista. Por defecto, es 'ivan'.
  const [puntoDeVista, setPuntoDeVista] = useState('ivan');

  const chatItems = useMemo(() => addDateSeparators(messagesData), []);

  return (

    <>
    
        <Navbar/>
    
        <div className="chat-container">
        <div className="chat-header">
            <span>Nuestra Conversación en Boo 💖</span>
            
            {/* 2. BOTONES PARA CAMBIAR EL PUNTO DE VISTA */}
            <div className="view-switcher">
            <button 
                className={puntoDeVista === 'ivan' ? 'active' : ''}
                onClick={() => setPuntoDeVista('ivan')}
            >
                Vista de Iván
            </button>
            <button
                className={puntoDeVista === 'antonella' ? 'active' : ''}
                onClick={() => setPuntoDeVista('antonella')}
            >
                Vista de Antonella
            </button>
            </div>
        </div>
        <div className="message-list">
            {chatItems.map((item, index) => {
            if (item.type === 'date_separator') {
                return (
                <div key={item.id} className="date-separator">
                    <span>{formatDateLabel(item.date)}</span>
                </div>
                );
            }
            // 3. PASAMOS EL ESTADO 'puntoDeVista' COMO PROP
            return <ChatMessage key={item.id || `msg-${index}`} message={item} puntoDeVista={puntoDeVista} />;
            })}
        </div>
        </div>
    </>
  );
}