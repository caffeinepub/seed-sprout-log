import { Sprout } from 'lucide-react';
import PlantEntryList from './components/plant-entries/PlantEntryList';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/seed-pattern-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/seedling-logo.dim_512x512.png" 
                alt="Seed Sprout Log"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  Seed Sprout Log
                </h1>
                <p className="text-sm text-muted-foreground">Track your seeds from planting to germination</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="container mx-auto px-4 py-8">
          <PlantEntryList />
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-16 py-6 bg-card/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              © {new Date().getFullYear()} Built with <Sprout className="w-4 h-4 text-accent" /> using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}

export default App;

