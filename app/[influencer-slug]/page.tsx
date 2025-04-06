import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/auth';
import InfluencerClientPage from './InfluencerClientPage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

interface PageProps {
  params: {
    'influencer-slug': string;
  };
}

// Define an extended influencer type with our additional fields
interface Influencer {
  id: string;
  created_at: string;
  name: string;
  bio: string | null;
  voice_id: string | null;
  photo_url: string | null;
  prompt: string | null;
  cost_per_min: number;
  slug: string;
  profile_image_url: string | null;
  landing_page_image_urls: string[] | null;
  greeting_copy: string | null;
  vapi_assistant_id: string | null;
  categories?: string;
  gallery_urls?: string[];
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params['influencer-slug'];
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: influencer } = await supabase
      .from('influencers')
      .select('name, bio')
      .eq('slug', slug)
      .single();
    
    if (!influencer) {
      return {
        title: 'Influencer Not Found',
        description: 'The requested influencer could not be found',
      };
    }
    
    return {
      title: `Talk to ${influencer.name} | Fancrush Talkline`,
      description: influencer.bio || `Have a conversation with ${influencer.name} on Fancrush Talkline.`,
      openGraph: {
        title: `Talk to ${influencer.name}`,
        description: influencer.bio || `Have a conversation with ${influencer.name} on Fancrush Talkline.`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Influencer | Fancrush Talkline',
      description: 'Talk to your favorite influencers',
    };
  }
}

// Server Component to fetch influencer data
export default async function InfluencerPage({ params }: PageProps) {
  const slug = params['influencer-slug'];
  const supabase = createServerSupabaseClient();
  
  // Fetch influencer data from Supabase
  const { data: influencer, error } = await supabase
    .from('influencers')
    .select('*')
    .eq('slug', slug)
    .single();
  
  // Handle 404 if influencer not found
  if (error || !influencer) {
    notFound();
  }
  
  // Cast to our extended type
  const influencerData = influencer as Influencer;
  
  // Fetch related influencers based on categories
  const categories = influencerData.categories ? influencerData.categories.split(',').map((c: string) => c.trim()) : [];
  let relatedInfluencers: any[] = [];
  
  if (categories.length > 0) {
    const query = categories.map(category => `categories.ilike.%${category}%`).join(',');
    const { data: related } = await supabase
      .from('influencers')
      .select('id, name, slug, photo_url, categories')
      .or(query)
      .neq('id', influencerData.id)
      .limit(4);
    
    relatedInfluencers = related || [];
  }
  
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Influencer Image Section */}
          <div className="rounded-lg overflow-hidden relative aspect-square">
            {influencerData.photo_url ? (
              <Image 
                src={influencerData.photo_url} 
                alt={influencerData.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Image not available</p>
              </div>
            )}
          </div>
          
          {/* Influencer Info and Demo Call Section */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{influencerData.name}</h1>
              
              {/* Categories */}
              {influencerData.categories && (
                <div className="flex flex-wrap gap-2 my-3">
                  {influencerData.categories.split(',').map((category: string) => (
                    <Badge key={category.trim()} variant="secondary">
                      {category.trim()}
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-muted-foreground mt-2 text-lg">{influencerData.bio}</p>
            </div>
            
            {/* Client Component for Call Functionality */}
            <InfluencerClientPage 
              influencerId={influencerData.id} 
              influencerName={influencerData.name}
              voiceId={influencerData.voice_id || ''}
            />
            
            <div className="mt-auto pt-4">
              <p className="text-sm text-muted-foreground">
                *This is an AI-simulated experience and not actually {influencerData.name}. 
                <br />The responses are generated by artificial intelligence trained on public data.
              </p>
            </div>
          </div>
        </div>
        
        {/* Gallery Section - Optional */}
        {influencerData.gallery_urls && influencerData.gallery_urls.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {influencerData.gallery_urls.map((url: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                  <Image 
                    src={url} 
                    alt={`${influencerData.name} photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Related Influencers */}
        {relatedInfluencers.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedInfluencers.map((related) => (
                <Link href={`/${related.slug}`} key={related.id} className="group">
                  <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                    {related.photo_url ? (
                      <Image 
                        src={related.photo_url} 
                        alt={related.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">No image</p>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium">{related.name}</h3>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/influencers">
                  View all influencers
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 