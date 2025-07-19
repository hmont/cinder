export const metadata = {
  title: "create a chatroom | cinder",
  description: "because not everything needs to last forever.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
