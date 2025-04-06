import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/auth';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function InfluencersPage() {
  const supabase = createServerSupabaseClient();
  
  try {
    // Fetch all active influencers
    const { data: influencers, error } = await supabase
      .from('influencers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching influencers:', error);
      return <div>Error loading influencers. Please try again later.</div>;
    }
    
    return (
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Influencers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of AI-powered influencer twins. Choose someone you'd like to talk to and try a free 2-minute demo call!
          </p>
        </div>
        
        {influencers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No influencers available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {influencers.map((influencer) => (
              <Card key={influencer.id} className="overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square">
                  {influencer.photo_url ? (
                    <Image 
                      src={influencer.photo_url} 
                      alt={influencer.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">No image</p>
                    </div>
                  )}
                </div>
                <CardContent className="py-4 flex-grow">
                  <h2 className="font-bold text-xl mb-1">{influencer.name}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {influencer.bio || 'No bio available'}
                  </p>
                </CardContent>
                <CardFooter className="pb-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/${influencer.slug}`}>
                      Visit Profile
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return <div>An unexpected error occurred. Please try again later.</div>;
  }
} 