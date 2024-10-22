'use client'
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { Box, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from "next/navigation";
import WaveSurfer from "wavesurfer.js";
import { useHasMounted } from "@/utils/customHook";
dayjs.extend(relativeTime)
interface IProps {
    comments: ITrackComment[]
    track: ITrackTop | null
    wavesurfer: WaveSurfer | null
}
const CommentTrack = (props: IProps) => {
    const router = useRouter()
    const hasMounted = useHasMounted()
    const { data: session } = useSession();
    const { comments, track, wavesurfer } = props;
    const [yourComment, setYourComment] = useState("")

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: "http://localhost:8000/api/v1/comments",
            method: "POST",
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
                track: track?._id
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })
        if (res.data) {
            setYourComment("")
            router.refresh()
        }
    }

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play()
        }
    }
    return (
        <div>
            <div style={{ marginTop: "50px", marginBottom: "25px" }}>
                {session?.user &&
                    <TextField
                        fullWidth label="Comments" variant="standard"
                        value={yourComment}
                        onChange={(e) => setYourComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit()
                            }
                        }}
                    />
                }
            </div>
            <div style={{ display: "flex", gap: "40px" }}>
                <div className="left" style={{ display: "flex" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {
                            track?.imgUrl ?
                                <img style={{ width: 150, height: 150 }} src={fetchDefaultImages(track.uploader.type)}
                                />
                                :
                                <div style={{
                                    background: "#ccc",
                                    width: 250,
                                    height: 250
                                }}>
                                </div>
                        }
                        <div>{track?.uploader.email}</div>
                    </div>
                </div>
                <div className="right" style={{ width: "calc(100% - 200px)" }} >
                    {
                        comments?.map((comment) => {
                            return (
                                <Box key={comment._id} sx={{ display: "flex", gap: 20, justifyContent: "space-between" }}>
                                    <Box sx={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                                        <img style={{ heigh: 45, width: 45 }}
                                            src={fetchDefaultImages(comment.user.type)}
                                        />
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ fontSize: "12px" }}>{comment.user.name ?? comment.user.email} at
                                                <span style={{ cursor: "pointer" }} onClick={() => handleJumpTrack(comment.moment)}>
                                                    &nbsp; {formatTime(comment.moment)}
                                                </span>

                                            </div>
                                            <div>{comment.content}</div>
                                        </div>
                                    </Box>
                                    <div style={{ fontSize: "12px", color: "#999", marginTop: "25px" }}>
                                        {hasMounted && dayjs(comment.createdAt).fromNow()}
                                    </div>
                                </Box>
                            )
                        })
                    }
                </div>
            </div>
        </div >
    )
}
export default CommentTrack;