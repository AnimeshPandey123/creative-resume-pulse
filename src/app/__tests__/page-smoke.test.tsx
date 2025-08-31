import React from 'react'
import { render } from '@testing-library/react'
import HomePage from '@/app/page'

jest.mock('@/layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}))

jest.mock('@/components/Hero', () => ({
  __esModule: true,
  default: () => <div data-testid="hero" />,
}))
jest.mock('@/components/About', () => ({
  __esModule: true,
  default: () => <div data-testid="about" />,
}))
jest.mock('@/components/Experience', () => ({
  __esModule: true,
  default: () => <div data-testid="experience" />,
}))
jest.mock('@/components/Projects', () => ({
  __esModule: true,
  default: () => <div data-testid="projects" />,
}))
jest.mock('@/components/Skills', () => ({
  __esModule: true,
  default: () => <div data-testid="skills" />,
}))
jest.mock('@/components/Education', () => ({
  __esModule: true,
  default: () => <div data-testid="education" />,
}))
jest.mock('@/components/Contact', () => ({
  __esModule: true,
  default: () => <div data-testid="contact" />,
}))

describe('HomePage', () => {
  it('renders sections within layout', () => {
    const { getByTestId } = render(<HomePage />)
    expect(getByTestId('layout')).toBeInTheDocument()
    expect(getByTestId('hero')).toBeInTheDocument()
    expect(getByTestId('about')).toBeInTheDocument()
    expect(getByTestId('experience')).toBeInTheDocument()
    expect(getByTestId('projects')).toBeInTheDocument()
    expect(getByTestId('skills')).toBeInTheDocument()
    expect(getByTestId('education')).toBeInTheDocument()
    expect(getByTestId('contact')).toBeInTheDocument()
  })
})

