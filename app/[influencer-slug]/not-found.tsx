import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function InfluencerNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Influencer Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the influencer you're looking for. They might not be on our platform yet.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/">
            Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/influencers">
            Browse Influencers
          </Link>
        </Button>
      </div>
    </div>
  );
} 