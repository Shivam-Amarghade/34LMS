import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function PlaceholderScreen() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const screenName = pathSegments[pathSegments.length - 1]
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Screen';

  return (
    <div className="space-y-8">
      <Link to="/employee/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {screenName}
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            This screen is ready to be built! Let us know what features you'd like
            here, and we'll implement them.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/employee/dashboard">Return to Dashboard</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Build This Screen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
