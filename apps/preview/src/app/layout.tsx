import type { Metadata } from 'next';
import '@parle/ui/styles.css';
export const metadata: Metadata = {
  title: 'Parle Italiano — Make Italian second nature',
  description:
    'A focused space for mastering Italian grammar. Learn with intention, one step at a time.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
