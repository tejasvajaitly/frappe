'use client'

import { SearchResults } from '@spotify/web-api-ts-sdk'
import sdk from '@/lib/spotify-sdk/ClientInstance'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { WebLogo } from './assets/webLogo'
import { MobileLogo } from './assets/mobileLogo'
import { RiseLoader } from 'react-spinners'
import useDebounce from '@/app/hooks/useDebounce'
import { Input } from '@/components/ui/input'

export default function Home() {
    const session = useSession()

    if (!session || session.status !== 'authenticated') return null

    return (
        <div className="bg-secondary h-full flex flex-col justify-start items-center gap-6 pt-36">
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
                <div className="bg-white py-2 rounded-md shadow-xl border-gray-500 overflow-auto h-64 ">
                    <ul>
                        {results.tracks.items.map((item) => {
                            return (
                                <li className="cursor-pointer hover:bg-[#dbeaff] px-4 py-2">
                                    <p className="text-sm">{item.name}</p>
                                    <p className="text-gray-400 text-xs">
                                        {item?.album?.name} .
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
