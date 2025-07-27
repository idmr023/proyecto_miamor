import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeartLoader.css";

export default function HeartLoader() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/heart-animation.js";
    script.async = true;
    document.body.appendChild(script);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 6500); // 6.5s antes de irse

    const navTimer = setTimeout(() => {
      navigate("/home");
    }, 7000); // redirige a los 7s

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
      document.body.removeChild(script);
    };
  }, [navigate]);

  return (
    <canvas
      id="heart"
      ref={canvasRef}
      className={fadeOut ? "fade-out" : ""}
    />
  );
}