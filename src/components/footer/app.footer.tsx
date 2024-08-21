'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Container } from '@mui/material';
import { useHasMounted } from '@/utils/customHook';
const AppFooter = () => {
    const hasMounted = useHasMounted();
    if (!hasMounted) return (<></>)
    return (
        <div>

            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, background: "#f2f2f2" }}>
                <Container sx={{ display: "flex", gap: 10 }}>
                    <AudioPlayer
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
                        volume={0.5}
                        style={{
                            boxShadow: "unset",
                            background: "#f2f2f2"
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