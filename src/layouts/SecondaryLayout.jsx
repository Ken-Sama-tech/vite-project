import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SecondaryLayout({
  className = '',
  children,
  heading = null,
  goto = '#',
}) {
  const navigate = useNavigate();

  return (
    <div className={`flex bg-(--dark) h-auto w-full flex-col ${className}`}>
      <div className="p-1">
        <button
          onClick={() => navigate(goto)}
          className="size-10 cursor-pointer transition-all duration-200 ease-in hover:opacity-80"
          title="Go back"
        >
          <MoveLeft className="w-full h-full text-(--blue)" />
        </button>
        {heading && (
          <h1 className="text-white text-3xl font-bold ms-5">{heading}</h1>
        )}
      </div>

      {children}
    </div>
  );
}

export default SecondaryLayout;
