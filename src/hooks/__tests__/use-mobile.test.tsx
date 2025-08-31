import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

describe('useIsMobile', () => {
  it('returns false on desktop and true on mobile when media query changes', () => {
    const listeners: Array<() => void> = []
    // @ts-expect-error override in test
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: '(max-width: 767px)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((_event: string, cb: any) => listeners.push(cb)),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    // Start with desktop width
    // @ts-expect-error override in test
    window.innerWidth = 1024
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      // Switch to mobile width and fire media change
      // @ts-expect-error override in test
      window.innerWidth = 375
      listeners.forEach((cb) => cb({ matches: true }))
    })
    expect(result.current).toBe(true)
  })
})

