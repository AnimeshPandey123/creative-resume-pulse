import React from 'react'
import { render } from '@testing-library/react'
import HotjarAnalytics from '@/components/Hotjar'

jest.mock('@hotjar/browser', () => ({
  __esModule: true,
  default: { init: jest.fn() },
}))

describe('HotjarAnalytics', () => {
  it('initializes Hotjar on mount', () => {
    const { default: Hotjar } = require('@hotjar/browser')
    render(<HotjarAnalytics />)
    expect(Hotjar.init).toHaveBeenCalled()
  })
})

