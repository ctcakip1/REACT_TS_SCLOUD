'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useWavesurfer } from '@/utils/customHook'
import { WaveSurferOptions } from "wavesurfer.js";
import './wave.scss';
// WaveSurfer hook


const WaveTrack = () => {
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<string>("0:00");
    const [duration, setDuration] = useState<string>("0:00");
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
    return (
        <div style={{ marginTop: 100 }}>
            <div ref={containerRef} className='wave-form-container'>
                <div className='time' >{time}</div>
                <div className='duration'>{duration}</div>
                <div ref={hoverRef} className="hover-wave"></div>
            </div>
            <button onClick={() => onPlayPause()}>
                {isPlaying === true ? "Pause" : "Play"}
            </button>
        </div>


    )
}
export default WaveTrack;