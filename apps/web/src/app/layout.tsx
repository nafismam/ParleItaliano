import type { Metadata } from 'next';
import { headers } from 'next/headers';
import '@parle/ui/styles.css';
export const metadata: Metadata = {
  title: 'Parle Italiano — Make Italian second nature',
  description: 'A focused space for mastering Italian grammar.',
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await headers();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
