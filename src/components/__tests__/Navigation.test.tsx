import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Navigation from '@/components/Navigation'

// Mock ThemeProvider hook used by Navigation
jest.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() })
}))

// next/navigation is globally mocked in jest.setup.js, but we override usePathname here
jest.mock('next/navigation', () => ({
  usePathname() {
    return '/'
  }
}))

describe('Navigation', () => {
  it('renders brand and blog link', () => {
    const { getByText, getAllByText } = render(<Navigation />)
    expect(getByText('Animesh Pandey')).toBeInTheDocument()
    expect(getAllByText('Blog').length).toBeGreaterThan(0)
  })

  it('toggles mobile menu open/close', () => {
    const { getByLabelText } = render(<Navigation />)
    const openBtn = getByLabelText('Open menu')
    fireEvent.click(openBtn)
    // label should switch to Close menu
    expect(getByLabelText('Close menu')).toBeInTheDocument()

    const closeBtn = getByLabelText('Close menu')
    fireEvent.click(closeBtn)
    expect(getByLabelText('Open menu')).toBeInTheDocument()
  })
})

