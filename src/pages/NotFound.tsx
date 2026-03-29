import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] glow-blob glow-primary opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 glow-blob glow-emerald pointer-events-none" />

      <div className="text-center relative z-10 max-w-md">
        {/* Big 404 */}
        <div className="relative mb-6">
          <p className="font-heading text-[10rem] font-bold leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, hsl(255 60% 68% / 0.2), hsl(255 60% 68% / 0.05))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-primary">
                <path d="M12 2L4 8V16L12 22L20 16V8L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M12 8L8 11V15L12 18L16 15V11L12 8Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="font-heading text-2xl font-semibold text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
