import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Mutasim Fuad Rimu (Rimu Bhai) - Full Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ background: 'white', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: 64, fontWeight: 'bold', color: 'black', margin: 0, paddingBottom: 20 }}>Mutasim Fuad Rimu</h1>
        <p style={{ fontSize: 32, color: '#666', margin: 0 }}>Full Stack Developer & Technical Architect</p>
      </div>
    ),
    { ...size }
  );
}
