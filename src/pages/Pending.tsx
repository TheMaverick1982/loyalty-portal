import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Pending() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-8 text-center">
        <div className="flex justify-center mb-8">
          <img 
            src="https://d1w7312wesee68.cloudfront.net/JKPqHUL7GdKSyi-G6LR9EhlfohDfs3qh65AEqsiceP4/ext:webp/quality:85/preset:xxl/plain/s3://toast-sites-resources-prod/restaurantImages/c5d6157e-2088-4c91-8e49-f281d8b5d3b9/c7eea070-b357-474e-8905-fd3199ca6ce6-0" 
            alt="Logo" 
            className="h-12 object-contain"
          />
        </div>
        
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Pending Approval</h1>
        <p className="text-muted-foreground mb-8">
          Your account has been created and is waiting for administrator approval. You'll have access once approved.
        </p>

        <button
          onClick={() => logout()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
