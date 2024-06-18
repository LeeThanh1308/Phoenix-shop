function Button({ className, text, onClick = () => null, children }) {
  return (
    <button
      onClick={onClick}
      className={`border font-bold py-1 px-2 rounded-sm hover:bg-black/10 hover:text-black ${className}`}
    >
      {children}
      {text}
    </button>
  );
}

export default Button;
