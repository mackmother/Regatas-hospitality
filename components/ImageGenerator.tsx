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

    const WIDTH = 3840;
    const HEIGHT = 2160;
    
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    try {
      // === BACKGROUND IMAGE ===
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = backgroundImageUrl;
      });

      // Draw background with object-fit: cover
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

      // === BLUR EFFECT ===
      ctx.filter = 'blur(2.5px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';

      // === VERTICAL VIGNETTE (Top & Bottom) ===
      const vignetteGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0.12)');
      vignetteGradient.addColorStop(0.11, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(0.89, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // === OVERLAY GRADIENT (Left to Right) - Navy Blue ===
      const overlayGradient = ctx.createLinearGradient(0, 0, WIDTH, 0);
      overlayGradient.addColorStop(0, 'rgba(10, 26, 52, 0.75)'); // Left: Strong navy
      overlayGradient.addColorStop(0.45, 'rgba(10, 26, 52, 0.55)'); // Middle: Medium navy
      overlayGradient.addColorStop(1, 'rgba(10, 26, 52, 0.12)'); // Right: Light navy
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // === RIGHT-SIDE VIGNETTE (Dark Blue) ===
      const rightVignette = ctx.createLinearGradient(WIDTH * 0.6, 0, WIDTH, 0);
      rightVignette.addColorStop(0, 'rgba(10, 26, 52, 0)'); // Transparent
      rightVignette.addColorStop(0.5, 'rgba(10, 26, 52, 0.15)'); // Subtle
      rightVignette.addColorStop(1, 'rgba(10, 26, 52, 0.45)'); // Stronger at right edge
      ctx.fillStyle = rightVignette;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // === TYPOGRAPHY: BIENVENIDOS ===
      ctx.save();
      ctx.font = 'bold 164px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.letterSpacing = '3.28px';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText('BIENVENIDOS', WIDTH / 2, 460);
      ctx.restore();

      // === TYPOGRAPHY: GUEST NAME ===
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

      // === GLASS CARDS SETUP ===
      const CARD_WIDTH = 900;
      const CARD_HEIGHT = 720;
      const CARD_RADIUS = 40;
      const CARD_GAP = 120;
      const CARD_Y = 980;

      const totalWidth = CARD_WIDTH * 2 + CARD_GAP;
      const leftCardX = (WIDTH - totalWidth) / 2;
      const rightCardX = leftCardX + CARD_WIDTH + CARD_GAP;

      // === ENHANCED FROSTED GLASS CARD FUNCTION ===
      const drawFrostedGlassCard = (x: number, y: number) => {
        ctx.save();
        
        // Create rounded rectangle path
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

        // STRONGER frosted glass effect - more opaque white
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; // Increased from 0.16 to 0.25
        ctx.fill();

        // Add inner glow for extra frosted effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; // Inner highlight
        ctx.lineWidth = 2;
        ctx.stroke();

        // Border (outer)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'; // Increased from 0.65 to 0.75
        ctx.lineWidth = 3;
        
        // Shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'; // Stronger shadow
        ctx.shadowBlur = 60; // More blur
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 22; // More offset
        
        ctx.stroke();
        ctx.restore();
      };

      // Draw both cards with enhanced frosted effect
      drawFrostedGlassCard(leftCardX, CARD_Y);
      drawFrostedGlassCard(rightCardX, CARD_Y);

      // === GENERATE QR CODES ===
      const QR_SIZE = 480;
      const wifiQRData = `WIFI:T:WPA;S:${ssid};P:RegatasWelcome2024;H:false;;`;
      const whatsappQRData = venueWhatsApp.replace('{ROOM}', roomNumber);

      const [wifiQR, whatsappQR] = await Promise.all([
        QRCode.toDataURL(wifiQRData, {
          errorCorrectionLevel: 'Q',
          margin: 4,
          width: QR_SIZE,
          color: { dark: '#000000', light: '#FFFFFF' }
        }),
        QRCode.toDataURL(whatsappQRData, {
          errorCorrectionLevel: 'Q',
          margin: 4,
          width: QR_SIZE,
          color: { dark: '#000000', light: '#FFFFFF' }
        })
      ]);

      // Load QR images
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

      // === LEFT CARD: Wi-Fi ===
      ctx.save();
      ctx.shadowColor = 'transparent';
      
      // LABEL (top of card) - DARK TEXT
      ctx.font = '500 56px Inter, Arial, sans-serif';
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Wi-Fi', leftCardX + CARD_WIDTH / 2, CARD_Y + 90);

      // QR CODE
      const qrXLeft = leftCardX + (CARD_WIDTH - QR_SIZE) / 2;
      const qrY = CARD_Y + 140;
      ctx.drawImage(wifiQRImg, qrXLeft, qrY, QR_SIZE, QR_SIZE);

      // CAPTIONS (bottom)
      ctx.font = '500 42px Inter, Arial, sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText('Escanea a para conectarte', leftCardX + CARD_WIDTH / 2, CARD_Y + CARD_HEIGHT - 110);
      
      ctx.font = '500 36px Inter, Arial, sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.fillText(ssid.replace('_', '-'), leftCardX + CARD_WIDTH / 2, CARD_Y + CARD_HEIGHT - 70);
      ctx.restore();

      // === RIGHT CARD: WhatsApp ===
      ctx.save();
      ctx.shadowColor = 'transparent';
      
      // LABEL (top of card) - DARK TEXT
      ctx.font = '500 56px Inter, Arial, sans-serif';
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Ordena por WhatsApp', rightCardX + CARD_WIDTH / 2, CARD_Y + 90);

      // QR CODE
      const qrXRight = rightCardX + (CARD_WIDTH - QR_SIZE) / 2;
      ctx.drawImage(whatsappQRImg, qrXRight, qrY, QR_SIZE, QR_SIZE);

      // CAPTION (bottom)
      ctx.font = '500 36px Inter, Arial, sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.fillText(venueName, rightCardX + CARD_WIDTH / 2, CARD_Y + CARD_HEIGHT - 70);
      ctx.restore();

      // === FOOTER ===
      ctx.save();
      ctx.shadowColor = 'transparent';
      
      // URL (centered bottom)
      ctx.font = '500 48px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`regatas.tv/r/${roomNumber}`, WIDTH / 2, 2000);
      
      // Logo (bottom right)
      ctx.font = 'bold 72px Inter, Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'alphabetic';
      ctx.globalAlpha = 0.92;
      ctx.fillText('regatas', WIDTH - 240, 2040);
      ctx.restore();

      // === COMPLETE ===
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
    link.download = `welcome-room-${roomNumber}-4K.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full border border-gray-200 rounded-lg shadow-lg"
        style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: '#000' }}
      />
      {isGenerating && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-pacific border-t-transparent rounded-full animate-spin"></div>
          Generating pixel-perfect 4K image...
        </div>
      )}
      <button
        onClick={downloadImage}
        disabled={isGenerating}
        className="w-full px-4 py-3 bg-pacific text-white rounded-lg hover:bg-navy transition-colors font-medium disabled:opacity-50"
      >
        📥 Download 4K Image (3840×2160)
      </button>
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>✓ Enhanced frosted glass effect on cards</p>
        <p>✓ Right-side dark blue vignette</p>
        <p>✓ Perfect separation from background</p>
      </div>
    </div>
  );
}
