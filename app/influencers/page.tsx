'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSupabase } from '@/components/supabase-provider';

// Define categories
const categories = [
  'All',
  'Travel',
  'Tech',
  'Fitness',
  'Fashion',
  'Gaming',
  'Business',
  'Lifestyle'
];

export default function InfluencersPage() {
  const { supabase } = useSupabase();
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true);
      try {
        let query = supabase.from('influencers').select('*').order('name');
        
        // Apply category filter if not 'All'
        if (selectedCategory !== 'All') {
          query = query.ilike('categories', `%${selectedCategory}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setInfluencers(data || []);
      } catch (err: any) {
        console.error('Error fetching influencers:', err);
        setError(err.message || 'Failed to load influencers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInfluencers();
  }, [supabase, selectedCategory]);
  
  // Filter influencers by search query
  const filteredInfluencers = influencers.filter(influencer => 
    influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (influencer.bio && influencer.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (error) {
    return (
      <div className="container py-8 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          {error}
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Influencers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of AI-powered influencer twins. Choose someone you'd like to talk to and try a free 2-minute demo call!
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <Input
            type="text"
            placeholder="Search by name or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-start md:justify-end">
          {categories.map(category => (
            <Badge 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading influencers...</p>
        </div>
      ) : filteredInfluencers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No influencers found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredInfluencers.map((influencer) => (
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
                {influencer.categories && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {influencer.categories.split(',').map((category: string) => (
                      <Badge key={category.trim()} variant="secondary" className="text-xs">
                        {category.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
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
} 