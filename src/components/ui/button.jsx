export function Button({ children, onClick, className = "" }) {
    return (
      <button
        onClick={onClick}
        className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out ${className}`}
      >
        {children}
      </button>
    );
  }
  