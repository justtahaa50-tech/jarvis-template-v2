"use client";

import React, { useEffect, useState } from "react";

const Preloader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    let loadFired = false;
    let minTimerFinished = false;

    function tryTriggerExit() {
      if (loadFired && minTimerFinished) {
        setZoomed(true);
        setTimeout(() => {
          setVisible(false);
        }, 1000); // match transition duration of 1s
      }
    }

    // 1. Minimum 1-second timer (1000ms)
    const timer = setTimeout(() => {
      minTimerFinished = true;
      tryTriggerExit();
    }, 1000);

    // 2. Window load event listener
    const handleLoad = () => {
      loadFired = true;
      tryTriggerExit();
    };

    if (document.readyState === "complete") {
      loadFired = true;
      tryTriggerExit();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Fallback: clear preloader after 4.5 seconds in case resources block loading
    const fallbackTimer = setTimeout(() => {
      loadFired = true;
      tryTriggerExit();
    }, 4500);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="preloader"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0F1B2D",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        overflow: "hidden",
        opacity: zoomed ? 0 : 1,
        visibility: zoomed ? "hidden" : "visible",
        pointerEvents: zoomed ? "none" : "auto",
        transition: "opacity 1.0s cubic-bezier(0.25, 1, 0.5, 1), visibility 1.0s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes preloader-pulse {
            0% { transform: scale(0.1); filter: drop-shadow(0 0 0px rgba(194, 138, 92, 0)); }
            50% { transform: scale(0.108); filter: drop-shadow(0 0 20px rgba(194, 138, 92, 0.6)); }
            100% { transform: scale(0.1); filter: drop-shadow(0 0 0px rgba(194, 138, 92, 0)); }
          }
          .preloader-logo-pulse {
            animation: preloader-pulse 2.2s ease-in-out infinite;
          }
        `
      }} />
      <img
        src="/assets/header-icon.svg"
        alt="Jarvis Logo"
        className={zoomed ? "" : "preloader-logo-pulse"}
        style={{
          position: "absolute",
          width: "950px",
          height: "950px",
          objectFit: "contain",
          transform: zoomed ? "scale(12)" : "scale(0.1)",
          opacity: zoomed ? 0 : 1,
          transition: zoomed
            ? "transform 1.0s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.8s cubic-bezier(0.7, 0, 0.3, 1)"
            : "transform 0.3s ease-out",
        }}
      />
    </div>
  );
};

export default Preloader;
