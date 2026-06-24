import { Navbar } from '@/components/Navbar';
import { LoyaltyWidget } from '@/components/LoyaltyWidget';

export default function Index() {
  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 flex flex-col overflow-hidden">
        <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col h-full min-h-0">
          <div className="mb-4 flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight">Guest Loyalty Lookup</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Search and manage guest loyalty profiles
            </p>
          </div>
          
          <div className="flex-1 min-h-0 w-full rounded-xl overflow-hidden shadow-sm border border-border bg-white flex flex-col">
            <LoyaltyWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
