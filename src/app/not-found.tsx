import Link from 'next/link';

// Requests outside /th and /en that the middleware does not redirect end up here.
export default function NotFound() {
  return (
    <html lang="th">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6b6b75' }}>404</p>
          <p>
            <Link href="/th" style={{ color: '#4a44d6' }}>
              TCI AI
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
