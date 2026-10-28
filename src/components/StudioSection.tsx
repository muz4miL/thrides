"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Wordmark } from "@/components/site/Wordmark";

const VIMEO_URL =
  "https://player.vimeo.com/video/1217826823?api=1&background=0&byline=0&controls=0&dnt=1&player_id=studio-vimeo";

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sendCommand = useCallback((method: string, value?: boolean | number | string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method, ...(value === undefined ? {} : { value }) }),
      "https://player.vimeo.com",
    );
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      sendCommand("pause");
    } else {
      setIsPlaying(true);
      sendCommand("play");
    }
  }, [isPlaying, sendCommand]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;

      let message: { event?: string } | null = null;
      try {
        message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (message?.event === "play") setIsPlaying(true);
      if (message?.event === "pause") setIsPlaying(false);
      if (message?.event === "finish") {
        setIsPlaying(false);
        sendCommand("setCurrentTime", 0);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sendCommand]);

  const subscribeToPlayerEvents = () => {
    for (const eventName of ["play", "pause", "finish"]) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ method: "addEventListener", value: eventName }),
        "https://player.vimeo.com",
      );
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && !entry.isIntersecting && isPlaying) sendCommand("pause");
      },
      { threshold: 0.05 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isPlaying, sendCommand]);

  return (
    <section ref={sectionRef} id="studio" aria-label="Studio" className="studio-section">
      <div className="studio-card">
        <div className="studio-copy">
          <div className="studio-brand-row">
            <Wordmark className="studio-wordmark" />
            <span className="studio-label">Studio</span>
          </div>
          <h2 className="studio-heading">
            Where top
            <br />
            brands come to
            <br />
            <em>Create</em>
          </h2>
          <p className="studio-description">
            A state-of-the-art studio, production house, and creative engine for fast growing DTC
            brands.
          </p>
        </div>

        <div className="studio-media-column">
          <div className="studio-video-shell">
            <iframe
              ref={iframeRef}
              id="studio-vimeo"
              title="Brand It Studio"
              src={VIMEO_URL}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={subscribeToPlayerEvents}
              className="studio-video"
            />
            <button
              type="button"
              className={`studio-video-hit-area${isPlaying ? " is-playing" : ""}`}
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause studio video" : "Play studio video"}
            >
              <span className="studio-play-button" aria-hidden="true">
                <Play fill="currentColor" size={32} />
              </span>
            </button>
          </div>
          <img
            src="/PoweredbyStudio.png"
            alt="Powered by ARRI, ZEISS, Canon, Sony, and RØDE"
            className="studio-powered-by"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
