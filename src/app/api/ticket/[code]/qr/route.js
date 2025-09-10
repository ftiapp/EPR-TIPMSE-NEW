import QRCode from 'qrcode';

export async function GET(_req, context) {
  try {
    const { code } = await context.params || {};

    if (!code) {
      return new Response('Code is required', { status: 400 });
    }

    // Generate QR code PNG buffer from the UUID/code
    const pngBuffer = await QRCode.toBuffer(code, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 512, // pixels
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return new Response(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        // Cache aggressively since QR for a given UUID is immutable
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('QR generation error:', err);
    return new Response('Server error', { status: 500 });
  }
}
