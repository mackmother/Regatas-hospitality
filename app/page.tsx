export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(to right, #0A1A34, #0E5AA7)',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🏖️ Regatas Welcome Screens
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          Hotel-grade personalized welcome screens for your bungalows
        </p>
        <a 
          href="/dashboard" 
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'white',
            color: '#0A1A34',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Open Dashboard →
        </a>
        <div style={{ marginTop: '3rem', fontSize: '0.9rem', opacity: 0.7 }}>
          <p>✅ Pixel-perfect 4K images</p>
          <p>✅ QR codes for Wi-Fi & WhatsApp</p>
          <p>✅ Automated scheduling</p>
          <p>✅ Google Photos integration</p>
        </div>
      </div>
    </div>
  );
}
