'use client'
import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
interface IProps {
    track: ITrackTop | null
}
export default function ClickableChips(props: IProps) {
    const { track } = props;
    const [trackLikes, setTrackLikes] = React.useState<ITrackLike[] | null>(null)
    const { data: session } = useSession();
    const router = useRouter();

    const fetchData = async () => {
        if (session?.access_token) {
            const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `http://localhost:8000/api/v1/likes?current=1&pageSize=10`,
                method: "GET",
                queryParams: {
                    current: 1,
                    pageSize: 100,
                    sort: "-createdAt"
                },
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            })
            if (res2.data?.result) {
                setTrackLikes(res2?.data?.result)
            }
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [session])

    const handleLikeTrack = async () => {
        await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `http://localhost:8000/api/v1/likes`,
            method: "POST",
            body: {
                track: track?._id,
                quantity: trackLikes?.some(t => t._id === track?._id) ? -1 : 1,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })
        fetchData()
        router.refresh()
    }

    return (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <div>
                <Stack direction="row" spacing={1}>
                    <Chip
                        sx={{ borderRadius: 1 }}
                        icon={<FavoriteIcon />}
                        label="Like"
                        onClick={() => handleLikeTrack()}
                        color={trackLikes?.some(t => t._id === track?._id) ? "error" : "default"}
                        clickable
                        variant="outlined"
                    />
                </Stack>
            </div>
            <div>
                <Stack direction="row" spacing={1}>
                    <Chip
                        sx={{ border: 0 }}
                        icon={<PlayArrowIcon />}
                        label={track?.countPlay}
                        variant="outlined"
                    />
                    <Chip
                        sx={{ border: 0 }}
                        icon={<FavoriteIcon />}
                        label={track?.countLike}
                        variant="outlined"
                    />
                </Stack>
            </div>
        </div>

    );
}