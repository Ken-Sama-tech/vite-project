import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SecondaryLayout({ className = '', children, heading = 'default' }) {
  const navigate = useNavigate();

  return (
    <div className={`flex bg-(--dark) h-auto w-full flex-col ${className}`}>
      <div className="p-4">
        <button onClick={() => navigate(-1)} className="size-10 cursor-pointer">
          <MoveLeft className="w-full h-full text-(--blue)" />
        </button>
        <h1 className="text-white text-3xl font-bold ms-5">{heading}</h1>
      </div>

      {children}
    </div>
  );
}

export default SecondaryLayout;
