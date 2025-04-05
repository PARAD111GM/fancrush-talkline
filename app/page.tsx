import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Talk to Your Favorite Influencers
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Experience AI-powered phone conversations with digital twins of online creators and influencers.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="w-full min-[400px]:w-auto">Get Started</Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">Try Demo Call</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[400px] items-center justify-center lg:max-w-none">
              <div className="w-full h-[300px] rounded-lg bg-muted p-4 flex items-center justify-center text-muted-foreground">
                Phone Mockup Image
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Influencers */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Influencers
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect with these popular creators through our AI-powered voice technology.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8">
            <Card>
              <CardHeader>
                <div className="w-full h-[200px] rounded-md bg-muted mb-4"></div>
                <CardTitle>Emma Johnson</CardTitle>
                <CardDescription>Travel & Lifestyle Vlogger</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shares travel tips, lifestyle advice, and personal stories from around the world.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/influencers/emma-johnson">
                  <Button variant="outline">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-full h-[200px] rounded-md bg-muted mb-4"></div>
                <CardTitle>Jake Smith</CardTitle>
                <CardDescription>Tech Reviewer & Gaming Streamer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reviews the latest tech products and streams popular games with his audience.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/influencers/jake-smith">
                  <Button variant="outline">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-full h-[200px] rounded-md bg-muted mb-4"></div>
                <CardTitle>Sophia Chen</CardTitle>
                <CardDescription>Fitness Coach & Nutritionist</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shares workout routines, nutrition advice, and motivational content for a healthy lifestyle.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/influencers/sophia-chen">
                  <Button variant="outline">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/influencers">
              <Button>Explore All Influencers</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                It's easy to start talking with your favorite influencers. Just follow these steps.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 pt-8">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up and verify your phone number to get started.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">Purchase Minutes</h3>
              <p className="text-muted-foreground">
                Choose a minute pack that suits your needs.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Start Talking</h3>
              <p className="text-muted-foreground">
                Call through the app or receive a call on your phone.
              </p>
            </div>
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
    </div>
  );
} 