import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import QRCode from 'qrcode';
import * as fs from 'fs/promises';
import * as path from 'path';

interface WelcomeImageData {
  preferredName: string;
  guestType: string;
  roomNumber: string;
  ssid: string;
  venueName: string;
  venueWhatsApp: string;
  backgroundImageUrl: string;
}

export async function generateWelcomeImage(data: WelcomeImageData): Promise<Buffer> {
  // Truncate name
  let displayName = data.preferredName;
  if (displayName.length > 24) {
    if (data.guestType === 'Family' || data.guestType === 'Friends') {
      const words = displayName.split(' ');
      displayName = words[0] + (words.length > 1 ? ' ' + words[1][0] + '.' : '');
    } else {
      displayName = displayName.substring(0, 24) + '...';
    }
  }

  // Generate QR codes
  const wifiQRData = `WIFI:T:WPA;S:${data.ssid};P:RegatasWelcome2024;H:false;;`;
  const whatsappQRData = data.venueWhatsApp.replace('{ROOM}', data.roomNumber);

  const wifiQR = await QRCode.toDataURL(wifiQRData, {
    errorCorrectionLevel: 'Q',
    margin: 4,
    width: 960,
  });

  const whatsappQR = await QRCode.toDataURL(whatsappQRData, {
    errorCorrectionLevel: 'Q',
    margin: 4,
    width: 960,
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 3840px;
      height: 2160px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    .canvas {
      width: 3840px;
      height: 2160px;
      position: relative;
      overflow: hidden;
    }
    .background {
      position: absolute;
      inset: 0;
      background-image: url('${data.backgroundImageUrl}');
      background-size: cover;
      background-position: center;
      filter: blur(2.5px);
    }
    .vignette-vertical {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 11%, transparent 89%, rgba(0,0,0,0.12) 100%);
    }
    .overlay-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, rgba(10,26,52,0.75) 0%, rgba(10,26,52,0.55) 45%, rgba(10,26,52,0.12) 100%);
    }
    .vignette-right {
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, transparent 60%, rgba(10,26,52,0.15) 80%, rgba(10,26,52,0.45) 100%);
    }
    .content { position: absolute; inset: 0; }
    .title {
      position: absolute;
      top: 460px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 164px;
      font-weight: 700;
      color: white;
      letter-spacing: 3.28px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.22);
    }
    .guest-name {
      position: absolute;
      top: 620px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 118px;
      font-weight: 700;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.22);
    }
    .cards {
      position: absolute;
      top: 980px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 120px;
    }
    .card {
      width: 900px;
      height: 720px;
      border-radius: 40px;
      background: rgba(255,255,255,0.25);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 3px solid rgba(255,255,255,0.75);
      box-shadow: 0 22px 60px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
    }
    .card-label {
      font-size: 56px;
      font-weight: 500;
      color: #1F2937;
      margin-bottom: 50px;
    }
    .card-qr {
      width: 480px;
      height: 480px;
      margin-bottom: auto;
    }
    .card-caption {
      text-align: center;
      margin-top: 20px;
    }
    .card-caption-line1 {
      font-size: 42px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }
    .card-caption-line2 {
      font-size: 36px;
      font-weight: 500;
      color: #4B5563;
    }
    .footer-url {
      position: absolute;
      bottom: 160px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 48px;
      font-weight: 500;
      color: white;
    }
    .footer-logo {
      position: absolute;
      bottom: 120px;
      right: 240px;
      font-size: 72px;
      font-weight: 700;
      color: white;
      opacity: 0.92;
    }
  </style>
</head>
<body>
  <div class="canvas">
    <div class="background"></div>
    <div class="vignette-vertical"></div>
    <div class="overlay-gradient"></div>
    <div class="vignette-right"></div>
    <div class="content">
      <div class="title">BIENVENIDOS</div>
      <div class="guest-name">${displayName}</div>
      <div class="cards">
        <div class="card">
          <div class="card-label">Wi-Fi</div>
          <img src="${wifiQR}" class="card-qr" />
          <div class="card-caption">
            <div class="card-caption-line1">Escanea a para conectarte</div>
            <div class="card-caption-line2">${data.ssid.replace('_', '-')}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-label">Ordena por WhatsApp</div>
          <img src="${whatsappQR}" class="card-qr" />
          <div class="card-caption">
            <div class="card-caption-line2">${data.venueName}</div>
          </div>
        </div>
      </div>
      <div class="footer-url">regatas.tv/r/${data.roomNumber}</div>
      <div class="footer-logo">regatas</div>
    </div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const screenshot = await page.screenshot({ type: 'png', fullPage: false });
  await browser.close();

  return screenshot as Buffer;
}
