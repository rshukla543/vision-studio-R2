import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function AdminBackground() {
  // Cursor tracking for interactive glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* BASE */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* CURSOR INTERACTIVE GOLD GLOW */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          left: smoothX,
          top: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* LUXURY MANDALA TEXTURE (VERY SUBTLE) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(212,175,55,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* BOKEH LIGHTS (WEDDING FEEL) */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`bokeh-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${40 + i * 10}px`,
            height: `${40 + i * 10}px`,
            background:
              "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)",
            filter: "blur(20px)",
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: "110%", opacity: 0 }}
          animate={{
            y: ["100%", "-20%"],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* SPARKLE TRAILS */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute w-[2px] h-[2px] bg-[#FFD700]"
          style={{
            left: `${Math.random() * 100}%`,
            boxShadow: "0 0 6px rgba(255,215,0,0.8)",
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: ["-10%", "110%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear",
          }}
        />
      ))}

      {/* LEFT GOLD FLOW */}
      <div className="absolute left-0 top-0 w-[12%] h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-transparent" />
      </div>

      {/* RIGHT GOLD FLOW */}
      <div className="absolute right-0 top-0 w-[12%] h-full">
        <div className="absolute inset-0 bg-gradient-to-l from-[#d4af37]/10 to-transparent" />
      </div>

      {/* TOP LINE */}
      <motion.div
        className="absolute top-0 left-[10%] right-[10%] h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
        }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* CORNER ORNAMENTS */}
      {["top-8 left-8", "top-8 right-8", "bottom-8 left-8", "bottom-8 right-8"].map(
        (pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-16 h-16 opacity-20`}
          >
            <svg viewBox="0 0 64 64" fill="none">
              <path
                d="M0 64V20C0 8.954 8.954 0 20 0H64"
                stroke="rgba(212,175,55,0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
        )
      )}

      {/* CENTER AMBIENT */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[50vw] h-[40vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(212,175,55,0.05), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </div>
  );
}