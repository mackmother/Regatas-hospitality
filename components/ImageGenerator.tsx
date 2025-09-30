'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface ImageGeneratorProps {
  preferredName: string;
  guestType: string;
  roomNumber: string;
  ssid: string;
  venueName: string;
  venueWhatsApp: string;
  backgroundImageUrl: string;
  onGenerated?: (dataUrl: string) => void;
}

export default function ImageGenerator({
  preferredName,
  guestType,
  roomNumber,
  ssid,
  venueName,
  venueWhatsApp,
  backgroundImageUrl,
  onGenerated
}: ImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateImage();
  }, [preferredName, guestType, roomNumber, venueName]);

  const generateImage = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 4K resolution
    const WIDTH = 3840;
    const HEIGHT = 2160;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    try {
      // Load background image
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = backgroundImageUrl;
      });

      // Draw background (cover fit)
      const bgRatio = bgImg.width / bgImg.height;
      const canvasRatio = WIDTH / HEIGHT;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (bgRatio > canvasRatio) {
        drawHeight = HEIGHT;
        drawWidth = bgImg.width * (HEIGHT / bgImg.height);
        offsetX = (WIDTH - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = WIDTH;
        drawHeight = bgImg.height * (WIDTH / bgImg.width);
        offsetX = 0;
        offsetY = (HEIGHT - drawHeight) / 2;
      }
      
      ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);

      // Apply blur effect
      ctx.filter = 'blur(2.5px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';

      // Vertical vignette (stronger)
      const vignetteGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0.12)');
      vignetteGradient.addColorStop(0.11, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(0.89, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Overlay gradient
      const overlayGradient = ctx.createLinearGradient(0, 0, WIDTH, 0);
      overlayGradient.addColorStop(0, 'rgba(10, 26, 52, 0.75)');
      overlayGradient.addColorStop(0.45, 'rgba(10, 26, 52, 0.55)');
      overlayGradient.addColorStop(1, 'rgba(10, 26, 52, 0.12)');
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Typography - BIENVENIDOS
      ctx.save();
      ctx.font = 'bold 164px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText('BIENVENIDOS', WIDTH / 2, 460);
      ctx.restore();

      // Guest name (with truncation)
      let displayName = preferredName;
      if (displayName.length > 24) {
        if (guestType === 'Family' || guestType === 'Friends') {
          const words = displayName.split(' ');
          displayName = words[0] + (words.length > 1 ? ' ' + words[1][0] + '.' : '');
        } else {
          displayName = displayName.substring(0, 24) + '...';
        }
      }

      ctx.save();
      ctx.font = 'bold 118px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(displayName, WIDTH / 2, 620);
      ctx.restore();

      // Glass cards
      const CARD_WIDTH = 900;
      const CARD_HEIGHT = 720;
      const CARD_RADIUS = 40;
      const CARD_GAP = 120;
      const CARD_Y = 980;

      const totalWidth = CARD_WIDTH * 2 + CARD_GAP;
      const leftCardX = (WIDTH - totalWidth) / 2;
      const rightCardX = leftCardX + CARD_WIDTH + CARD_GAP;

      const drawGlassCard = (x: number, y: number) => {
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(x + CARD_RADIUS, y);
        ctx.lineTo(x + CARD_WIDTH - CARD_RADIUS, y);
        ctx.quadraticCurveTo(x + CARD_WIDTH, y, x + CARD_WIDTH, y + CARD_RADIUS);
        ctx.lineTo(x + CARD_WIDTH, y + CARD_HEIGHT - CARD_RADIUS);
        ctx.quadraticCurveTo(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH - CARD_RADIUS, y + CARD_HEIGHT);
        ctx.lineTo(x + CARD_RADIUS, y + CARD_HEIGHT);
        ctx.quadraticCurveTo(x, y + CARD_HEIGHT, x, y + CARD_HEIGHT - CARD_RADIUS);
        ctx.lineTo(x, y + CARD_RADIUS);
        ctx.quadraticCurveTo(x, y, x + CARD_RADIUS, y);
        ctx.closePath();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
        ctx.shadowBlur = 48;
        ctx.shadowOffsetY = 18;
        ctx.stroke();

        ctx.restore();
      };

      drawGlassCard(leftCardX, CARD_Y);
      drawGlassCard(rightCardX, CARD_Y);

      // Generate QR codes
      const QR_SIZE = 480;
      const wifiQRData = `WIFI:T:WPA;S:${ssid};P:RegatasWelcome2024;H:false;;`;
      const whatsappQRData = venueWhatsApp.replace('{ROOM}', roomNumber);

      const wifiQR = await QRCode.toDataURL(wifiQRData, {
        errorCorrectionLevel: 'Q',
        margin: 4,
        width: QR_SIZE,
        color: { dark: '#000000', light: '#FFFFFF' }
      });

      const whatsappQR = await QRCode.toDataURL(whatsappQRData, {
        errorCorrectionLevel: 'Q',
        margin: 4,
        width: QR_SIZE,
        color: { dark: '#000000', light: '#FFFFFF' }
      });

      // Load and draw QR codes
      const wifiQRImg = new Image();
      const whatsappQRImg = new Image();

      await Promise.all([
        new Promise(resolve => {
          wifiQRImg.onload = resolve;
          wifiQRImg.src = wifiQR;
        }),
        new Promise(resolve => {
          whatsappQRImg.onload = resolve;
          whatsappQRImg.src = whatsappQR;
        })
      ]);

      // Left card - Wi-Fi
      ctx.save();
      ctx.shadowColor = 'transparent'; // Remove shadow from card text
      
      // Label at top - DARK TEXT
      ctx.font = '500 56px Inter, Arial, sans-serif';
      ctx.fillStyle = '#1F2937'; // Dark gray/charcoal
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Wi-Fi', leftCardX + CARD_WIDTH / 2, CARD_Y + 90);

      // QR Code - proper spacing from top
      const qrX = leftCardX + (CARD_WIDTH - QR_SIZE) / 2;
      const qrY = CARD_Y + 140;
      ctx.drawImage(wifiQRImg, qrX, qrY, QR_SIZE, QR_SIZE);

      // Caption lines BELOW QR code - DARK TEXT
      ctx.font = '500 42px Inter, Arial, sans-serif';
      ctx.fillStyle = '#374151'; // Medium dark gray
      ctx.fillText('Escanea para conectarte', leftCardX + CARD_WIDTH / 2, CARD_Y + 640);
      
      ctx.font = '500 36px Inter, Arial, sans-serif';
      ctx.fillStyle = '#4B5563'; // Slightly lighter gray
      ctx.fillText(ssid, leftCardX + CARD_WIDTH / 2, CARD_Y + 684);
      ctx.restore();

      // Right card - WhatsApp
      ctx.save();
      ctx.shadowColor = 'transparent';
      
      // Label at top - DARK TEXT
      ctx.font = '500 56px Inter, Arial, sans-serif';
      ctx.fillStyle = '#1F2937'; // Dark gray/charcoal
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Ordena por WhatsApp', rightCardX + CARD_WIDTH / 2, CARD_Y + 90);

      // QR Code
      const whatsappQrX = rightCardX + (CARD_WIDTH - QR_SIZE) / 2;
      ctx.drawImage(whatsappQRImg, whatsappQrX, qrY, QR_SIZE, QR_SIZE);

      // Venue name BELOW QR code - DARK TEXT
      ctx.font = '500 36px Inter, Arial, sans-serif';
      ctx.fillStyle = '#4B5563'; // Medium gray
      ctx.fillText(venueName, rightCardX + CARD_WIDTH / 2, CARD_Y + 684);
      ctx.restore();

      // Footer
      ctx.save();
      ctx.font = '500 48px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(`regatas.tv/r/${roomNumber}`, WIDTH / 2, 2000);
      
      // Logo text (bottom right)
      ctx.font = 'bold 72px Inter, Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.globalAlpha = 0.92;
      ctx.fillText('regatas', 3600, 2040);
      ctx.restore();

      // Notify parent component
      if (onGenerated) {
        onGenerated(canvas.toDataURL('image/png'));
      }

      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating image:', error);
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `welcome-room-${roomNumber}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full border border-gray-200 rounded-lg"
        style={{ maxHeight: '600px', objectFit: 'contain' }}
      />
      {isGenerating && (
        <p className="text-sm text-gray-500 text-center">Generating image...</p>
      )}
      <button
        onClick={downloadImage}
        className="w-full px-4 py-2 bg-pacific text-white rounded-lg hover:bg-navy transition-colors"
      >
        Download 4K Image (3840x2160)
      </button>
    </div>
  );
}
