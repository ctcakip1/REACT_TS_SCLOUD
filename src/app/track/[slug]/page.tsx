'use client'
import { useSearchParams } from 'next/navigation'
const DetailTrackPage = (props: any) => {
    const searchParams = useSearchParams()
    const search = searchParams.get('audio')
    return (
        <div>
            detail track page
        </div>
    )
}
export default DetailTrackPage;