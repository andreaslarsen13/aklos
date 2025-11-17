import { OsTheme } from "./types";

export const timeless: OsTheme = {
  id: "timeless",
  name: "Timeless",
  fonts: {
    ui: "Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
    mono: "'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
  },
  colors: {
    // Translucent glass backgrounds
    windowBg: "rgba(255, 255, 255, 0.7)",
    menubarBg: "linear-gradient(to bottom, rgba(248, 248, 248, 0.85), rgba(240, 240, 240, 0.85))",
    menubarBorder: "rgba(255, 255, 255, 0.2)",
    
    // Soft borders with transparency
    windowBorder: "rgba(255, 255, 255, 0.3)",
    windowBorderInactive: "rgba(200, 200, 200, 0.2)",
    
    titleBar: {
      // Subtle gradient with transparency for glass effect
      activeBg: "linear-gradient(to bottom, rgba(250, 250, 250, 0.8) 0%, rgba(235, 235, 235, 0.75) 100%)",
      inactiveBg: "rgba(245, 245, 245, 0.6)",
      
      // Dark text for contrast on glass
      text: "rgba(0, 0, 0, 0.9)",
      inactiveText: "rgba(0, 0, 0, 0.45)",
      
      // Soft borders
      border: "rgba(255, 255, 255, 0.4)",
      borderInactive: "rgba(255, 255, 255, 0.2)",
      borderBottom: "rgba(0, 0, 0, 0.08)",
    },
    
    button: {
      // Glass button effect
      face: "rgba(255, 255, 255, 0.6)",
      highlight: "rgba(255, 255, 255, 0.9)",
      shadow: "rgba(0, 0, 0, 0.15)",
      activeFace: "rgba(240, 240, 240, 0.8)",
    },
    
    // Softer, more muted traffic lights with subtle glow
    trafficLights: {
      close: "#FF6B6B",
      closeHover: "#FF5252",
      minimize: "#FFD93D",
      minimizeHover: "#FFC107",
      maximize: "#6BCF7F",
      maximizeHover: "#4CAF50",
    },
    
    // Vibrant but translucent selection
    selection: {
      bg: "rgba(100, 150, 255, 0.6)",
      text: "#FFFFFF",
    },
    
    // Text hierarchy for clarity
    text: {
      primary: "rgba(0, 0, 0, 0.9)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.35)",
    },
  },
  
  metrics: {
    // Thinner borders for modern look
    borderWidth: "0.5px",
    
    // More rounded corners (16px vs Aqua's 8px)
    radius: "1rem", // 16px
    
    // Slightly taller title bar for breathing room
    titleBarHeight: "2.5rem", // 40px vs Aqua's 22px
    
    // Rounded top corners matching overall radius
    titleBarRadius: "16px 16px 0px 0px",
    
    // Soft, layered shadows for depth
    windowShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
  },
  
  wallpaperDefaults: {
    photo: "/wallpapers/photos/aqua/abstract-7.jpg", // Will use existing wallpapers for now
    video: "/wallpapers/photos/aqua/water.jpg",
  },
};

