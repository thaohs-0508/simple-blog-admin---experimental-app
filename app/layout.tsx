import './globals.css';

export default function RenderRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Blog Admin</title>
        <meta
          name="description"
          content="Admin dashboard for managing blog posts"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
