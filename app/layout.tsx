import "../styles/globals.css"
import { ReactNode } from "react"

export const metadata = {
  title: "Voting Website",
  description: "Voting untuk bot Furina atau Multifungsi",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  )
}
