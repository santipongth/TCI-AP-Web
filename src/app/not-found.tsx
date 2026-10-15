import Link from 'next/link';
import { BrandMark } from '@/components/ui/BrandMark';

/*
 * Every unmatched URL lands here: the middleware sends /x to /th/x, and /th/x or /en/x
 * has no page. It renders outside the locale layout, so it speaks both languages.
 */
export default function NotFound() {
  return (
    <html lang="th">
      <body className="grid min-h-screen place-items-center bg-white px-5 text-ink">
        <title>ไม่พบหน้านี้ · Page not found | TCI AI</title>
        <main className="flex max-w-[440px] flex-col items-center gap-4 text-center">
          <BrandMark className="size-16" />
          <p className="mono m-0 text-[13px] tracking-[0.14em] text-muted">404</p>
          <h1 className="m-0 text-[26px] leading-tight font-semibold">
            ไม่พบหน้านี้
            <span lang="en" className="mt-1 block text-[17px] font-normal text-muted">
              Page not found
            </span>
          </h1>
          <p className="m-0 text-[15px] leading-[1.7] text-body">
            ลิงก์อาจไม่ถูกต้อง หรือหน้านี้ถูกย้ายแล้ว{' '}
            <span lang="en">The link may be wrong, or the page has moved.</span>
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/th"
              className="rounded-full bg-primary px-5 py-2.5 text-[14px] font-medium text-white hover:bg-primary-hover hover:no-underline"
            >
              กลับหน้าแรก
            </Link>
            <Link
              href="/en"
              lang="en"
              className="rounded-full border border-line px-5 py-2.5 text-[14px] font-medium text-strong hover:border-primary-line-hover hover:no-underline"
            >
              English homepage
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
