'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useWavesurfer } from '@/utils/customHook'
import { WaveSurferOptions } from "wavesurfer.js";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import './wave.scss';
import { width } from '@mui/system';
import zIndex from '@mui/material/styles/zIndex';
import { Tooltip } from '@mui/material';
import { fetchDefaultImages, sendRequest } from '@/utils/api';
import { useTrackContext } from '@/lib/track.wrapper';
import CommentTrack from './comment.track';
// WaveSurfer hook

interface IProps {
    track: ITrackTop | null
    comments: ITrackComment[]
}
const WaveTrack = (props: IProps) => {
    const { track, comments } = props
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<string>("0:00");
    const [duration, setDuration] = useState<string>("0:00");
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext

    const optionMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
        let gradient, progressGradient;
        if (typeof window != "undefined") {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color
            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }
        return {
            waveColor: gradient,
            progressColor: progressGradient,
            barWidth: 3,
            height: 100,
            url: `/api?audio=${fileName}`,
        }
    }, [])

    const wavesurfer = useWavesurfer(containerRef, optionMemo);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    useEffect(() => {
        if (!wavesurfer) return
        setIsPlaying(false)
        const hover = hoverRef.current;
        const waveform = containerRef.current!;
        //@ts-ignore
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))
        const subscription = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setDuration(formatTime(duration));

            }),
            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime));
            }),
            wavesurfer.on('click', () => {
                wavesurfer.play()
            })
        ]
        return () => {
            subscription.forEach((unsub) => unsub())
        }
    }, [wavesurfer])


    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    const onPlayPause = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
        }

    }, [wavesurfer])


    const calLeft = (moment: number) => {
        const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`
    }

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause()
        }
    }, [currentTrack])

    useEffect(() => {
        if (track?._id && !currentTrack._id) {
            setCurrentTrack({ ...track, isPlaying: false })
        }
    }, [track])

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{
                display: "flex",
                gap: 15,
                padding: 20,
                height: 400,
                background: "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)"
            }}>
                <div className='left' style={{
                    width: "75%",
                    display: "flex",
                    height: "calc(100% - 10px)",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>
                    <div className="info" style={{ display: "flex" }}>
                        <div>
                            <div
                                onClick={() => {
                                    onPlayPause()
                                    if (track && wavesurfer)
                                        setCurrentTrack({ ...currentTrack, isPlaying: false })
                                }
                                }
                                style={{
                                    borderRadius: "50%",
                                    background: "#f50",
                                    height: "50px",
                                    width: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                            >
                                {isPlaying === true ?
                                    <PauseIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                    :
                                    <PlayArrowIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                }
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div style={{
                                padding: "0 5px",
                                background: "#333",
                                fontSize: 30,
                                width: "fit-content",
                                color: "white"
                            }}>
                                {track?.title}
                            </div>
                            <div style={{
                                padding: "0 5px",
                                marginTop: 10,
                                background: "#333",
                                fontSize: 20,
                                width: "fit-content",
                                color: "white"
                            }}
                            >
                                {track?.description}
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="wave-form-container">
                        <div className="time" >{time}</div>
                        <div className="duration" >{duration}</div>
                        <div ref={hoverRef} className="hover-wave"></div>
                        <div className="overlay"
                            style={{
                                position: "absolute",
                                height: "30px",
                                width: "100%",
                                bottom: "0",
                                // background: "#ccc"
                                backdropFilter: "brightness(0.5)"
                            }}
                        >
                        </div>
                        <div className='comment'
                            style={{ position: "relative" }}>
                            {comments.map((item) => {
                                return (
                                    <Tooltip title={item.content} arrow key={item._id}>
                                        <img
                                            onPointerMove={(e) => {
                                                const hover = hoverRef.current!;
                                                hover.style.width = calLeft(item.moment + 3);
                                            }}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                position: "absolute",
                                                top: 71,
                                                zIndex: 20,
                                                left: calLeft(item.moment)
                                            }}
                                            src={fetchDefaultImages(item.user.type)}
                                        />
                                    </Tooltip>

                                )
                            })}

                        </div>
                    </div>
                </div>
                <div className="right"
                    style={{
                        width: "25%",
                        padding: 15,
                        display: "flex",
                        alignItems: "center"
                    }}
                >

                    {
                        track?.imgUrl ?
                            <img style={{ width: 250, height: 250 }} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                            />
                            :
                            <div style={{
                                background: "#ccc",
                                width: 250,
                                height: 250
                            }}>
                            </div>
                    }

                </div>
            </div>
            <div>
                <CommentTrack
                    comments={comments}
                    track={track}
                    wavesurfer={wavesurfer}
                />
            </div>
        </div>


    )
}
export default WaveTrack;