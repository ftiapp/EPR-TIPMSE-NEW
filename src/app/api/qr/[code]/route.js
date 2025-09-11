import QRCode from 'qrcode';

export async function GET(request, { params }) {
  try {
    const { code } = params;
    if (!code) {
      return new Response('Missing code', { status: 400 });
    }

    // Generate QR as PNG buffer
    const pngBuffer = await QRCode.toBuffer(code, {
      type: 'png',
      width: 256,
      margin: 2,
      color: {
        dark: '#059669',
        light: '#FFFFFF',
      },
    });

    return new Response(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err) {
    console.error('QR API error:', err);
    return new Response('QR generation failed', { status: 500 });
  }
}
