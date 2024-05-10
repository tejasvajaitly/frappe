'use client'
import { useSession, signOut, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SpotifyMini } from '../assets/spotifyMini'

export default function NavBar() {
    const session = useSession()
    return (
        <nav className="flex justify-end">
            {!session || session.status !== 'authenticated' ? (
                <Button onClick={() => signIn('spotify')}>
                    <div className="mr-2 h-4 w-4">
                        <SpotifyMini />
                    </div>
                    Login
                </Button>
            ) : (
                <div className="flex flex-row gap-2">
                    <Avatar>
                        <AvatarImage
                            className="object-cover"
                            src={session.data.user?.image || ''}
                            alt="@user"
                        />
                        <AvatarFallback>
                            {session.data.user?.name?.split('')[0]}
                        </AvatarFallback>
                    </Avatar>
                    <Button onClick={() => signOut()}>logout</Button>
                </div>
            )}
        </nav>
    )
}
