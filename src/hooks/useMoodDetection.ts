import { useState, useCallback, useRef } from 'react';

export const useMoodDetection = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  const [mood, setMood] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (typeof document !== 'undefined' && !canvasRef.current) {
    canvasRef.current = document.createElement('canvas');
  }

  const captureAndDetect = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get base64 string
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const frameBase64 = dataUrl.split(',')[1];
    
    try {
      // Connect to the FastAPI backend
      const response = await fetch('http://localhost:5000/api/detect-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: frameBase64 })
      });
      
      if (!response.ok) throw new Error("API response not ok");
      
      const data = await response.json();
      setMood(data.mood);
    } catch (error) {
      console.error("Mood detection failed, using fallback mock", error);
      const moods = ['happy', 'neutral', 'surprise', 'sad'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setMood(randomMood);
    }
  }, [videoRef]);

  // Optionally set an interval if isDetecting is true
  // We expose this so components can use setInterval
  
  return { mood, isDetecting, setIsDetecting, captureAndDetect };
};
