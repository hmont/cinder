export const metadata = {
  title: "cinder",
  description: "because not everything needs to last forever.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
