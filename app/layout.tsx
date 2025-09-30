export const metadata = {
  title: 'Regatas Welcome Screens',
  description: 'Hotel-grade welcome screens for bungalows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
