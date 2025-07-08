interface DoLaterButtonProps {
  action: () => void;
}

const DoLaterButton: React.FC<DoLaterButtonProps> = ({ action }) => {
  return (
    <button
      type="button"
      onClick={action}
      className="text-sm py-1 px-3 hover:cursor-pointer text-gray-400 hover:text-text transition-all duration-200"
    >
      I'll do this later
    </button>
  );
};

export default DoLaterButton;
