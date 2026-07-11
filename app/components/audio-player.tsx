"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Headphones } from "lucide-react";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    const onError = () => setError(true);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
    };
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setError(true));
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const val = Number(e.target.value);
    audio.currentTime = val;
    setCurrent(val);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="rounded-app border border-border bg-card p-4 shadow-sm">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Headphones size={24} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{title}</p>
          {error ? (
            <p className="text-xs text-danger">خطا در بارگذاری فایل صوتی</p>
          ) : (
            <p className="text-xs text-muted">
              {formatTime(current)} / {formatTime(duration)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={error}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md disabled:opacity-50"
          aria-label={playing ? "توقف" : "پخش"}
        >
          {playing ? <Pause size={22} /> : <Play size={22} className="mr-[-2px]" />}
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={duration || 100}
        value={current}
        onChange={seek}
        disabled={error || duration === 0}
        className="h-1.5 w-full cursor-pointer accent-primary"
        style={{
          background: `linear-gradient(to left, var(--primary) ${progress}%, var(--border) ${progress}%)`,
        }}
      />
    </div>
  );
}
