'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface CompositorProps {
  preferredName: string;
  guestType: string;
  roomNumber: string;
  ssid: string;
  venueName: string;
  venueWhatsApp: string;
}

export default function ImageCompositor(props: CompositorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateComposite();
  }, [props.preferredName, props.guestType, props.roomNumber, props.venueName]);

  const generateComposite = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const WIDTH = 3840;
    const HEIGHT = 2160;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    try {
      const templateImg = new Image();
      await new Promise((resolve, reject) => {
        templateImg.onload = resolve;
        templateImg.onerror = reject;
        templateImg.src = '/backgrounds/default-beach.jpg';
      });

      ctx.drawImage(templateImg, 0, 0, WIDTH, HEIGHT);

      let displayName = props.preferredName;
      if (displayName.length > 24) {
        if (props.guestType === 'Family' || props.guestType === 'Friends') {
          const words = displayName.split(' ');
          displayName = words[0] + (words.length > 1 ? ' ' + words[1][0] + '.' : '');
        } else {
          displayName = displayName.substring(0, 24) + '...';
        }
      }

      // Title
      ctx.save();
      ctx.font = 'bold 164px Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText('BIENVENIDOS', WIDTH / 2, 460);
      ctx.restore();

      // Guest name
      ctx.save();
      ctx.font = 'bold 118px Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(displayName, WIDTH / 2, 620);
      ctx.restore();

      // Generate QR codes
      const wifiQR = await QRCode.toDataURL(
        `WIFI:T:WPA;S:${props.ssid};P:RegatasWelcome2024;H:false;;`,
        { errorCorrectionLevel: 'Q', margin: 4, width: 480, color: { dark: '#000000', light: '#FFFFFF' } }
      );
      const whatsappQR = await QRCode.toDataURL(
        props.venueWhatsApp.replace('{ROOM}', props.roomNumber),
        { errorCorrectionLevel: 'Q', margin: 4, width: 480, color: { dark: '#000000', light: '#FFFFFF' } }
      );

      const wifiQRImg = new Image();
      const whatsappQRImg = new Image();

      await Promise.all([
        new Promise(r => { wifiQRImg.onload = r; wifiQRImg.src = wifiQR; }),
        new Promise(r => { whatsappQRImg.onload = r; whatsappQRImg.src = whatsappQR; })
      ]);

      const CARD_WIDTH = 900;
      const CARD_HEIGHT = 720;
      const CARD_Y = 980;
      const LEFT_CARD_X = 960;
      const RIGHT_CARD_X = 1980;

      // Left card (Wi-Fi)
      ctx.save();
      ctx.shadowColor = 'transparent';
      
      // Label
      ctx.font = '500 56px Arial, sans-serif';
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Wi-Fi', LEFT_CARD_X + CARD_WIDTH / 2, CARD_Y + 90);
      
      // QR code
      const qrX = LEFT_CARD_X + (CARD_WIDTH - 480) / 2;
      ctx.drawImage(wifiQRImg, qrX, CARD_Y + 140, 480, 480);
      
      // Caption line 1 - 75px + line spacing from bottom
      ctx.font = '500 42px Arial, sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText('Escanea a para conectarte', LEFT_CARD_X + CARD_WIDTH / 2, CARD_Y + CARD_HEIGHT - 119);
      
      // Caption line 2 - 75px from bottom
      ctx.font = '500 36px Arial, sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.fillText(props.ssid.replace('_', '-'), LEFT_CARD_X + CARD_WIDTH / 2, CARD_Y + CARD_HEIGHT - 75);
      ctx.restore();

      // Right card (WhatsApp)
      ctx.save();
      ctx.shadowColor = 'transparent';
      
      // Label
      ctx.font = '500 56px Arial, sans-serif';
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Ordena por WhatsApp', RIGHT_CARD_X + CARD_WIDTH / 2, CARD_Y + 90);
      
      // QR code
      const whatsappQrX = RIGHT_CARD_X + (CARD_WIDTH - 480) / 2;
      ctx.drawImage(whatsappQRImg, whatsappQrX, CARD_Y + 140, 480, 480);
      
      // Caption - 75px from bottom
      ctx.font = '500 36px Arial, sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.fillText(props.venueName, RIGHT_CARD_X + CARD_WIDTH / 2, CARD_Y + CARD_HEIGHT - 75);
      ctx.restore();

      // Footer
      ctx.save();
      ctx.shadowColor = 'transparent';
      ctx.font = '500 48px Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`regatas.tv/r/${props.roomNumber}`, WIDTH / 2, 2000);
      
      ctx.font = 'bold 72px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.globalAlpha = 0.92;
      ctx.fillText('regatas', WIDTH - 240, 2040);
      ctx.restore();

      setIsGenerating(false);
    } catch (error) {
      console.error('Compositor error:', error);
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `regatas-welcome-room-${props.roomNumber}-4K.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-gray-200 shadow-lg"
        style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: '#000' }}
      />
      {isGenerating ? (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-pacific border-t-transparent rounded-full animate-spin"></div>
          Compositing image...
        </div>
      ) : (
        <button
          onClick={downloadImage}
          className="w-full px-6 py-4 bg-gradient-to-r from-pacific to-navy text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download 4K Image (3840×2160)
        </button>
      )}
    </div>
  );
}
