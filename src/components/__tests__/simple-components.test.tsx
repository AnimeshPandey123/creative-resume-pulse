import React from 'react'
import { render } from '@testing-library/react'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

describe('Simple components smoke', () => {
  it('renders Hero with heading and CTAs', () => {
    const { getByRole, getAllByRole } = render(<Hero />)
    expect(getByRole('banner', { name: /hero/i })).toBeInTheDocument()
    expect(getAllByRole('link').length).toBeGreaterThan(0)
  })

  it('renders Footer with links', () => {
    const { getByLabelText } = render(<Footer />)
    expect(getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(getByLabelText('Website')).toBeInTheDocument()
    expect(getByLabelText('Email')).toBeInTheDocument()
  })
})

