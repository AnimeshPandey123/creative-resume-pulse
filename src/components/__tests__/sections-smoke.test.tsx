import React from 'react';
import { render } from '@testing-library/react';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import LatestWriting from '@/components/LatestWriting';
import Skills from '@/components/Skills';
import Education from '@/components/Education';

describe('Sections smoke tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders About section', () => {
    const { getByRole } = render(<About />);
    expect(getByRole('region', { name: /about/i })).toBeInTheDocument();
  });

  it('renders Experience section', () => {
    const { getByRole } = render(<Experience />);
    expect(
      getByRole('region', { name: /built with great teams/i })
    ).toBeInTheDocument();
  });

  it('renders Projects section', () => {
    const { getByRole } = render(<Projects />);
    expect(
      getByRole('region', { name: /selected index/i })
    ).toBeInTheDocument();
  });

  it('renders Latest Writing section', () => {
    const { getByRole } = render(<LatestWriting />);
    expect(
      getByRole('region', { name: /thinking, in public/i })
    ).toBeInTheDocument();
  });

  it('renders Skills section', () => {
    const { getByRole } = render(<Skills />);
    expect(
      getByRole('region', { name: /core to the edge/i })
    ).toBeInTheDocument();
  });

  it('renders Education section', () => {
    const { getByRole } = render(<Education />);
    expect(
      getByRole('region', { name: /always learning/i })
    ).toBeInTheDocument();
  });
});
