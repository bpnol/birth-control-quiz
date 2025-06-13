export function Card({ children, className = "" }) {
    return (
      <div className={`shadow-lg rounded-lg ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
  }
  