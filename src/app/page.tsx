'use client';

import Layout from '@/layout/Layout';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import LatestWriting from '@/components/LatestWriting';
import Skills from '@/components/Skills';
import Education from '@/components/Education';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <LatestWriting />
      <Skills />
      <Education />
      <Contact />
    </Layout>
  );
}
