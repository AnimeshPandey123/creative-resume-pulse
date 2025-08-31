import React from 'react'
import { render } from '@testing-library/react'
import ClientProviders from '@/components/ClientProviders'

jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />,
}))

jest.mock('@/components/ui/sonner', () => ({
  Toaster: ({}) => <div data-testid="sonner" />,
}))

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <div data-testid="tooltip-provider">{children}</div>,
}))

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query')
  return {
    ...actual,
    QueryClient: function MockQueryClient() { return {} as any },
    QueryClientProvider: ({ children }: any) => <div data-testid="rq-provider">{children}</div>,
  }
})

jest.mock('@/components/PerformanceOptimizer', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="perf-opt">{children}</div>,
}))

describe('ClientProviders', () => {
  it('composes providers and renders toasters', () => {
    const { getByTestId } = render(
      <ClientProviders>
        <div data-testid="content" />
      </ClientProviders>
    )
    expect(getByTestId('rq-provider')).toBeInTheDocument()
    expect(getByTestId('tooltip-provider')).toBeInTheDocument()
    expect(getByTestId('perf-opt')).toBeInTheDocument()
    expect(getByTestId('toaster')).toBeInTheDocument()
    expect(getByTestId('sonner')).toBeInTheDocument()
    expect(getByTestId('content')).toBeInTheDocument()
  })
})

