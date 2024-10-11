'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Container } from '@mui/material';
import { useHasMounted } from '@/utils/customHook';
import { TrackContext, useTrackContext } from '@/lib/track.wrapper';
const AppFooter = () => {
    const playerRef = React.useRef(null);
    const hasMounted = useHasMounted();
    if (!hasMounted) return (<></>)
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext
    console.log("check track: ", currentTrack)
    //@ts-ignore
    if (currentTrack.isPlaying) {
        //@ts-ignore
        playerRef?.current?.audio?.current?.play()
    } else {
        //@ts-ignore
        playerRef?.current?.audio?.current?.pause()
    }

    return (
        <div style={{ marginTop: 50 }}>
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, background: "#f2f2f2" }}>
                <Container sx={{
                    display: "flex", gap: 10,
                    ".rhap_main": {
                        gap: "30px"
                    }
                }}>
                    <AudioPlayer
                        ref={playerRef}
                        layout='horizontal-reverse'
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                        volume={0.5}
                        style={{
                            boxShadow: "unset",
                            background: "#f2f2f2"
                        }}
                        onPlay={() => {
                            setCurrentTrack({ ...currentTrack, isPlaying: true })
                        }}
                        onPause={() => {
                            setCurrentTrack({ ...currentTrack, isPlaying: false })
                        }}
                    />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItem: "start",
                        justifyContent: "center",
                        minWidth: 100
                    }}>
                        <div style={{ color: "#ccc" }}>Tuan Anh</div>
                        <div style={{ color: "black" }}>Who am I ?</div>
                    </div>
                </Container>
            </AppBar>

        </div>
    );
}
export default AppFooter;