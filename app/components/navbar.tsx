'use client'
import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
export default function NavBar() {
    const session = useSession()

    if (!session || session.status !== 'authenticated') return null
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
