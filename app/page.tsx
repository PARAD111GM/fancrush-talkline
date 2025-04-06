import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-primary">
          Fancrush Talkline
        </h1>
        <p className="text-xl max-w-3xl mb-10">
          Experience AI-powered phone conversations with digital twins of online creators and influencers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/influencers">Try Demo Call</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Featured Influencers Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Influencers</h2>
        <p className="text-lg text-center mb-10">
          Connect with these popular creators through our AI-powered voice technology.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Influencer Card - Emma */}
          <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
            <div className="h-48 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Image Placeholder</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Emma Johnson</h3>
              <p className="text-sm text-muted-foreground mb-2">Travel & Lifestyle Vlogger</p>
              <p className="mb-6">Shares travel tips, lifestyle advice, and personal stories from around the world.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/emma-johnson">View Profile</Link>
              </Button>
            </div>
          </div>
          
          {/* Influencer Card - Jake */}
          <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
            <div className="h-48 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Image Placeholder</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Jake Smith</h3>
              <p className="text-sm text-muted-foreground mb-2">Tech Reviewer & Gaming Streamer</p>
              <p className="mb-6">Reviews the latest tech products and streams popular games with his audience.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/jake-smith">View Profile</Link>
              </Button>
            </div>
          </div>
          
          {/* Influencer Card - Sophia */}
          <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
            <div className="h-48 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Image Placeholder</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Sophia Chen</h3>
              <p className="text-sm text-muted-foreground mb-2">Fitness Coach & Nutritionist</p>
              <p className="mb-6">Shares workout routines, nutrition advice, and motivational content for a healthy lifestyle.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sophia-chen">View Profile</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/influencers">Explore All Influencers</Link>
          </Button>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <p className="text-lg text-center mb-10">
          It's easy to start talking with your favorite influencers. Just follow these steps:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
            <p>Sign up for Fancrush Talkline and verify your phone number to get started.</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-3">Purchase Minutes</h3>
            <p>Buy talk time minutes to use with any influencer on the platform.</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-3">Start Talking</h3>
            <p>Initiate a call to any influencer and enjoy a natural conversation powered by AI.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Users Say
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Don't just take our word for it. Hear what our users have to say.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 pt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div>
                    <p className="text-sm font-medium">Alex Davidson</p>
                    <p className="text-sm text-muted-foreground">Fancrush User</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "It feels so real! I had a 15-minute conversation with my favorite travel vlogger and got amazing travel tips for my upcoming trip."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div>
                    <p className="text-sm font-medium">Jordan Lee</p>
                    <p className="text-sm text-muted-foreground">Fancrush User</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "I can't believe how accurate the AI voice is. It's like I'm actually talking to the real person. This is revolutionary!"
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div>
                    <p className="text-sm font-medium">Taylor Wilson</p>
                    <p className="text-sm text-muted-foreground">Fancrush User</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "I got workout advice from my fitness idol without having to wait for her to respond to my comments. Worth every minute purchased!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Start Talking?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Try a free 2-minute demo call today and experience Fancrush Talkline.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full min-[400px]:w-auto">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Try Demo Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 