import { useState } from 'react';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const apiMessages = [
        { role: 'system', content: 'You are a compassionate mental health assistant named MindCare. Be supportive, empathetic, and kind. Keep your responses relatively concise but helpful. Always encourage users to speak with the real counselors available on the platform if they are dealing with serious issues.' },
        ...messages.map(m => ({ 
          role: m.sender === 'user' ? 'user' : 'assistant', 
          content: m.text 
        })),
        { role: 'user', content: text }
      ];

      // TODO: Replace 'YOUR_GROQ_API_KEY' with your actual Groq API key, do NOT commit secrets to source control.
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_GROQ_API_KEY`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: apiMessages,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message === 'Failed to fetch' 
        ? "Network Error: Could not reach Groq API (check internet or CORS)." 
        : `Error: ${error.message}`;
      setMessages(prev => [...prev, { id: Date.now() + 1, text: errorMsg, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, setMessages, sendMessage, isLoading };
};
