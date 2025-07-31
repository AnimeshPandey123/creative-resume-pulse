
import React, { useEffect } from 'react';
import Layout from '@/layout/Layout';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import SEO from '@/components/SEO';

const Index: React.FC = () => {
  useEffect(() => {
    if (location.hash) {
      // Small timeout to ensure the DOM is fully loaded
      setTimeout(() => {
        const targetElement = document.querySelector(location.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.hash]);
  // Smooth scroll to sections when clicking on navigation links
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function () { });
      });
    };
  }, []);

  // Highlight active section in navigation based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      const sections = document.querySelectorAll('section[id]');

      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id');

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <SEO
        title="Animesh Pandey | Senior Software Engineer | Full Stack Developer"
        description="Explore the portfolio of Animesh Pandey, a Senior Software Engineer with 6+ years of expertise in backend development using PHP, Javascript, Python, and modern web technologies."
        keywords={[
          'Animesh Pandey',
          'Software Engineer',
          'PHP',
          'Python',
          'Backend Developer',
          'Full Stack Developer',
          'Web Engineer',
          'Software Portfolio',
          'React',
          'Node.js',
          'TypeScript',
          'AWS',
          'Docker',
          'Kubernetes'
        ]}
        url="https://animeshpandey.com"
        type="profile"
      />
      <Layout>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </Layout>
    </>
  );
};

export default Index;
