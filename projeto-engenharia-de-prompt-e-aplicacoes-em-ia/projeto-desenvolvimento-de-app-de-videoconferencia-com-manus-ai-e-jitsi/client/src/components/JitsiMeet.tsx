import { useEffect, useRef } from "react";

interface JitsiMeetProps {
  roomName: string;
  userName: string;
  onReady?: () => void;
  onConferenceJoined?: () => void;
  onConferenceLeft?: () => void;
}

export default function JitsiMeet({
  roomName,
  userName,
  onReady,
  onConferenceJoined,
  onConferenceLeft,
}: JitsiMeetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiAPIRef = useRef<any>(null);

  useEffect(() => {
    // Load Jitsi Meet script
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        initJitsiMeet();
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (jitsiAPIRef.current) {
        jitsiAPIRef.current.dispose();
      }
      document.head.removeChild(script);
    };
  }, []);

  const initJitsiMeet = () => {
    if (!containerRef.current || !window.JitsiMeetExternalAPI) {
      return;
    }

    const options = {
      roomName: roomName,
      width: "100%",
      height: "100%",
      parentNode: containerRef.current,
      userInfo: {
        displayName: userName,
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableSimulcast: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        MOBILE_APP_PROMO: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "desktop",
          "fullscreen",
          "fodeviceselection",
          "hangup",
          "chat",
          "recording",
          "livestreaming",
          "etherpad",
          "settings",
          "raisehand",
          "videoquality",
          "filmstrip",
          "feedback",
          "stats",
          "shortcuts",
          "tileview",
          "download-logs",
          "help",
          "mute-everyone",
          "e2ee",
        ],
      },
    };

    try {
      jitsiAPIRef.current = new window.JitsiMeetExternalAPI(
        "meet.jit.si",
        options
      );

      // Add event listeners
      jitsiAPIRef.current.addEventListener("ready", () => {
        onReady?.();
      });

      jitsiAPIRef.current.addEventListener("conferenceJoined", () => {
        onConferenceJoined?.();
      });

      jitsiAPIRef.current.addEventListener("conferenceLeft", () => {
        onConferenceLeft?.();
      });
    } catch (error) {
      console.error("Error initializing Jitsi Meet:", error);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    />
  );
}

// Extend window type to include JitsiMeetExternalAPI
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}
