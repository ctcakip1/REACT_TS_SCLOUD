import WaveTrack from '@/components/track/wave.track'
import { useSearchParams } from 'next/navigation'
import { Container } from '@mui/material'
import { sendRequest } from '@/utils/api';
import type { Metadata, ResolvingMetadata } from 'next'
import slugify from 'slugify';
type Props = {
    params: { slug: string }
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const str = params?.slug;
    const temp = str?.split('.html') ?? [];
    const temp1 = temp[0]?.split('-');
    const id = temp1[temp1.length - 1]
    // fetch data
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${id}`,
        method: "GET",
    })

    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: 'Hỏi Dân IT',
            description: 'UPdate Beyond Your Coding Skills',
            type: 'website',
            images: [`https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`],
        },
    }
}

const DetailTrackPage = async (props: any) => {

    const { params } = props;
    const str = params?.slug;
    const temp = str?.split('.html') ?? [];
    const temp1 = (temp[0]?.split('-') ?? []) as string;
    const id = temp1[temp1.length - 1]

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${id}`,
        method: "GET",
        nextOption: { cache: "no-store" }
    })

    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId: params.slug,
            sort: "-createdAt"
        }
    })
    // const searchParams = useSearchParams()
    // const search = searchParams.get('audio')
    return (
        <Container>
            <div>
                <WaveTrack
                    track={res.data ?? null}
                    comments={res1.data?.result ?? []}
                />
            </div>
        </Container>

    )
}
export default DetailTrackPage;