import Navbar from '../components/Navbar';

function MainLayout({ children, className = '' }) {
  return (
    <>
      <Navbar />
      <main className={`bg-(--dark) w-full h-auto ${className}`}>
        {children}
      </main>
    </>
  );
}

export default MainLayout;
