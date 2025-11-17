export function EmptyState() {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <div className="text-center px-8">
        <h2 
          style={{ 
            fontSize: "32px",
            fontWeight: "600", 
            fontFamily: "var(--os-font-ui)",
            color: "rgba(0, 0, 0, 0.8)",
            marginBottom: "12px"
          }}
        >
          Welcome to aklOS
        </h2>
        <p 
          style={{ 
            fontSize: "16px",
            fontFamily: "var(--os-font-ui)",
            color: "rgba(0, 0, 0, 0.5)",
            maxWidth: "400px",
            margin: "0 auto"
          }}
        >
          Search for any topic to get started
        </p>
      </div>
    </div>
  );
}

