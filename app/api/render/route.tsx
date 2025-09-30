import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import QRCode from 'qrcode';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Truncate name
    let displayName = body.preferredName;
    if (displayName.length > 24) {
      if (body.guestType === 'Family' || body.guestType === 'Friends') {
        const words = displayName.split(' ');
        displayName = words[0] + (words.length > 1 ? ' ' + words[1][0] + '.' : '');
      } else {
        displayName = displayName.substring(0, 24) + '...';
      }
    }

    // Generate QR codes
    const wifiQRData = `WIFI:T:WPA;S:${body.ssid};P:RegatasWelcome2024;H:false;;`;
    const whatsappQRData = body.venueWhatsApp.replace('{ROOM}', body.roomNumber);

    const wifiQR = await QRCode.toDataURL(wifiQRData, {
      errorCorrectionLevel: 'Q',
      margin: 4,
      width: 480,
    });

    const whatsappQR = await QRCode.toDataURL(whatsappQRData, {
      errorCorrectionLevel: 'Q',
      margin: 4,
      width: 480,
    });

    // Fetch background image
    const bgUrl = `${request.nextUrl.origin}/backgrounds/default-beach.jpg`;

    return new ImageResponse(
      (
        <div
          style={{
            width: '3840px',
            height: '2160px',
            display: 'flex',
            position: 'relative',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Background with blur */}
          <img
            src={bgUrl}
            style={{
              position: 'absolute',
              width: '3840px',
              height: '2160px',
              objectFit: 'cover',
              filter: 'blur(2.5px)',
            }}
          />
          
          {/* Overlays */}
          <div
            style={{
              position: 'absolute',
              width: '3840px',
              height: '2160px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 11%, transparent 89%, rgba(0,0,0,0.12) 100%)',
            }}
          />
          
          <div
            style={{
              position: 'absolute',
              width: '3840px',
              height: '2160px',
              background: 'linear-gradient(to right, rgba(10,26,52,0.75) 0%, rgba(10,26,52,0.55) 45%, rgba(10,26,52,0.12) 100%)',
            }}
          />
          
          <div
            style={{
              position: 'absolute',
              width: '3840px',
              height: '2160px',
              background: 'linear-gradient(to right, transparent 60%, rgba(10,26,52,0.15) 80%, rgba(10,26,52,0.45) 100%)',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              width: '3840px',
              height: '2160px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Title */}
            <div
              style={{
                position: 'absolute',
                top: '460px',
                fontSize: '164px',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '3.28px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.22)',
              }}
            >
              BIENVENIDOS
            </div>

            {/* Guest Name */}
            <div
              style={{
                position: 'absolute',
                top: '620px',
                fontSize: '118px',
                fontWeight: 700,
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.22)',
              }}
            >
              {displayName}
            </div>

            {/* Cards Container */}
            <div
              style={{
                position: 'absolute',
                top: '980px',
                display: 'flex',
                gap: '120px',
              }}
            >
              {/* Wi-Fi Card */}
              <div
                style={{
                  width: '900px',
                  height: '720px',
                  borderRadius: '40px',
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '3px solid rgba(255,255,255,0.75)',
                  boxShadow: '0 22px 60px rgba(0,0,0,0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '60px',
                }}
              >
                <div style={{ fontSize: '56px', fontWeight: 500, color: '#1F2937', marginBottom: '50px' }}>
                  Wi-Fi
                </div>
                <img src={wifiQR} width="480" height="480" style={{ marginBottom: 'auto' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '42px', fontWeight: 500, color: '#374151' }}>
                    Escanea a para conectarte
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 500, color: '#4B5563' }}>
                    {body.ssid.replace('_', '-')}
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div
                style={{
                  width: '900px',
                  height: '720px',
                  borderRadius: '40px',
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '3px solid rgba(255,255,255,0.75)',
                  boxShadow: '0 22px 60px rgba(0,0,0,0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '60px',
                }}
              >
                <div style={{ fontSize: '56px', fontWeight: 500, color: '#1F2937', marginBottom: '50px' }}>
                  Ordena por WhatsApp
                </div>
                <img src={whatsappQR} width="480" height="480" style={{ marginBottom: 'auto' }} />
                <div style={{ fontSize: '36px', fontWeight: 500, color: '#4B5563' }}>
                  {body.venueName}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                position: 'absolute',
                bottom: '160px',
                fontSize: '48px',
                fontWeight: 500,
                color: 'white',
              }}
            >
              regatas.tv/r/{body.roomNumber}
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '120px',
                right: '240px',
                fontSize: '72px',
                fontWeight: 700,
                color: 'white',
                opacity: 0.92,
              }}
            >
              regatas
            </div>
          </div>
        </div>
      ),
      {
        width: 3840,
        height: 2160,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
