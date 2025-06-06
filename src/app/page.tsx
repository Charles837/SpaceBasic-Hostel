
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/layout/app-logo';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-6">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <AppLogo />
        <Button asChild variant="outline">
          <Link href="/login">Admin/Student Login</Link>
        </Button>
      </header>

      <main className="text-center space-y-8 mt-16">
        <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary">
          Welcome to SafoRoom
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
          Streamlining room allocation for educational institutions. Easy, efficient, and fair.
        </p>
        
        <div className="relative w-full max-w-2xl aspect-video mx-auto rounded-lg overflow-hidden shadow-2xl mt-12">
          <Image 
            src="https://placehold.co/800x450.png" 
            alt="Student housing illustration" 
            layout="fill"
            objectFit="cover"
            data-ai-hint="modern campus building"
            priority
          />
          <div className="absolute inset-0 bg-primary/30"></div>
        </div>

        <div className="space-x-4 mt-12">
          <Button size="lg" asChild>
            <Link href="/login">Apply for a Room</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/#features">Learn More</Link>
          </Button>
        </div>
      </main>

      <section id="features" className="py-20 w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline text-primary">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-lg shadow-lg border border-border">
            <h3 className="text-xl font-semibold mb-2 text-primary-foreground bg-primary -m-6 p-4 rounded-t-lg">Easy Application</h3>
            <p className="text-card-foreground/80 mt-8">Students can easily apply for rooms through a simple and intuitive interface.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg border border-border">
            <h3 className="text-xl font-semibold mb-2 text-primary-foreground bg-primary -m-6 p-4 rounded-t-lg">Admin Control</h3>
            <p className="text-card-foreground/80 mt-8">Comprehensive dashboard for administrators to manage rooms and allocations.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg border border-border">
            <h3 className="text-xl font-semibold mb-2 text-primary-foreground bg-primary -m-6 p-4 rounded-t-lg">Fair Allocation</h3>
            <p className="text-card-foreground/80 mt-8">Configure allocation rules to ensure a transparent and fair process for all.</p>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground">
        <p>&copy; {currentYear || '...'} SafoRoom. All rights reserved.</p>
      </footer>
    </div>
  );
}
