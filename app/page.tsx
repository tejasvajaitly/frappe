'use client'

import { SearchResults } from '@spotify/web-api-ts-sdk'
import sdk from '@/lib/spotify-sdk/ClientInstance'
import { useSession, signOut, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { WebLogo } from './assets/webLogo'
import { MobileLogo } from './assets/mobileLogo'
import { RiseLoader } from 'react-spinners'
import useDebounce from '@/app/hooks/useDebounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SpotifyMini } from './assets/spotifyMini'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const images = [
    'drake1.webp',
    'tw2.jpeg',
    'cs3.webp',
    'coldplay2.jpeg',
    'tw3.jpeg',
    'cs4.webp',
    'coldplay3.jpeg',
    'tw1.jpeg',
]

export default function Home() {
    const session = useSession()

    if (!session || session.status !== 'authenticated') return <LandingPgae />

    return (
        <div>
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
            <div className="h-full flex flex-col justify-start items-center gap-6 pt-36">
                <div className="">
                    <div className="hidden lg:block">
                        <WebLogo />
                    </div>

                    <div className="lg:hidden">
                        <MobileLogo />
                    </div>
                </div>

                <SpotifySearch />
            </div>
        </div>
    )
}

function SpotifySearch() {
    const [searchField, setSearchField] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<SearchResults<['track']> | null>(
        {} as SearchResults<['track']>
    )

    const debounceSearch = useDebounce(searchField, 500)

    useEffect(() => {
        console.log(searchField)
        if (debounceSearch) {
            searchGo()
        } else {
            setResults(null)
            setLoading(false)
        }
    }, [debounceSearch])

    const searchGo = async () => {
        console.log('hit search func', searchField)
        const tracks = await sdk.search(debounceSearch, ['track'], undefined, 6)
        console.log('tracks', tracks)
        setResults(tracks)
        setLoading(false)
    }

    const handleInput = (str: string) => {
        setLoading(true)
        setSearchField(str)
    }

    return (
        <div className="w-max  lg:w-full max-w-xl flex flex-col gap-2">
            <p className="text-primary text-center text-xl">
                Choose a song, get recommendations with similar vibes.
            </p>

            <div className="relative h-10 w-full">
                <RiseLoader
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    color="#B4B4B8"
                    size={5}
                    loading={loading}
                />
                <Input
                    type="text"
                    placeholder="Search for a song..."
                    value={searchField}
                    onChange={(e) => handleInput(e.target.value)}
                />
            </div>

            {results && results.tracks && results.tracks.items ? (
                <div className="border-input py-2 rounded-md shadow-xl border-2  overflow-auto h-64 ">
                    <ul>
                        {results.tracks.items.map((item) => {
                            return (
                                <li className="cursor-pointer hover:bg-gray-800 px-4 py-2">
                                    <p className="text-sm ">{item.name}</p>
                                    <p className=" text-xs">
                                        {item?.album?.name} .{' '}
                                        {item?.artists
                                            ?.map((artist) => artist.name)
                                            .join(',')}
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

function LandingPgae() {
    const [currentIndex, setCurrentIndex] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [images.length])
    const session = useSession()
    return (
        <div className="w-full lg:grid  lg:grid-cols-2 h-screen">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Hi, Welcome!</h1>
                        <p className="text-balance text-muted-foreground">
                            connect your spotify account to continue!
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => signIn('spotify')}
                    >
                        <div className="mr-2 h-4 w-4">
                            <SpotifyMini />
                        </div>
                        connect with Spotify
                    </Button>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={`/images/${image}`}
                        alt={`Image ${index + 1}`}
                        className={` h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale ${
                            index === currentIndex ? 'block' : 'hidden'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}
