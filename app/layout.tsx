import type { Metadata } from 'next'
import authOptions from '@/app/api/auth/[...nextauth]/authOptions'
import '@/app/globals.css'
import AuthSessionProvider from '@/components/AuthSessionProvider'
import { getServerSession } from 'next-auth'

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
        <html lang="en">
            <AuthSessionProvider session={session}>
                <body>{children}</body>
            </AuthSessionProvider>
        </html>
    )
}
