
import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (subtitleRef.current) {
      observer.observe(subtitleRef.current);
    }

    return () => {
      if (subtitleRef.current) {
        observer.unobserve(subtitleRef.current);
      }
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-transparent opacity-70 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-medium tracking-wider mb-4 animate-fade-in">SENIOR SOFTWARE ENGINEER</p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 animate-fade-in animate-delay-100">
            Hello, I'm <span className="text-primary">Animesh Pandey</span>
          </h1>
          
          <p ref={subtitleRef} className="text-lg md:text-xl text-muted-foreground mb-8 opacity-0">
            Specialized in PHP and backend development with 6 years of experience building scalable, high-performance applications.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-300">
            <a 
              href="#contact" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Get in touch
            </a>
            <a 
              href="#about" 
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all hover:bg-secondary/70 hover:shadow-md"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" aria-label="Scroll down">
          <ArrowDown className="text-foreground/70 hover:text-primary transition-colors" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
