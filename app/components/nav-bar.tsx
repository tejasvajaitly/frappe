'use client'
import { useSession, signOut, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SpotifyMini } from '../assets/spotifyMini'

export default function NavBar() {
    const session = useSession()
    return (
        <nav className="flex justify-end my-6">
            <div className="flex flex-row gap-4">
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
                <Button variant="ghost" onClick={() => signOut()}>
                    logout
                </Button>
            </div>
        </nav>
    )
}
