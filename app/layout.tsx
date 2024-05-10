import type { Metadata } from 'next'
import authOptions from '@/app/api/auth/[...nextauth]/authOptions'
import '@/app/globals.css'
import AuthSessionProvider from '@/components/AuthSessionProvider'
import { getServerSession } from 'next-auth'
import { Inter } from 'next/font/google'
import NavBar from './components/nav-bar'

const inter = Inter({
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'frappé',
    description: 'ai generated spotify recommendations',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <html lang="en" className={inter.className}>
            <AuthSessionProvider session={session}>
                <body className="dark">
                    {/* <NavBar /> */}
                    {children}
                </body>
            </AuthSessionProvider>
        </html>
    )
}
