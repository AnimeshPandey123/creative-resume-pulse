import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'

function Harness() {
  const { toasts, toast, dismiss } = useToast()
  const lastRef = React.useRef<null | { id: string; update: Function; dismiss: Function }>(null)

  return (
    <div>
      <div data-testid="count">{toasts.length}</div>
      <div data-testid="open">{String(toasts[0]?.open ?? false)}</div>
      <div data-testid="title">{String(toasts[0]?.title ?? '')}</div>
      <div data-testid="id">{String(toasts[0]?.id ?? '')}</div>

      <button
        onClick={() => {
          lastRef.current = toast({ title: 'A', description: 'd' }) as any
        }}
      >add</button>

      <button
        onClick={() => {
          if (lastRef.current) {
            lastRef.current.update({ id: lastRef.current.id, title: 'B' } as any)
          }
        }}
      >update</button>

      <button
        onClick={() => {
          lastRef.current?.dismiss()
        }}
      >dismiss-one</button>

      <button onClick={() => dismiss()}>dismiss-all</button>
    </div>
  )
}

describe('useToast integration', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('creates, updates, dismisses, and auto-removes a toast', () => {
    const { getByTestId, getByText } = render(<Harness />)

    expect(getByTestId('count').textContent).toBe('0')

    fireEvent.click(getByText('add'))
    expect(getByTestId('count').textContent).toBe('1')
    expect(getByTestId('open').textContent).toBe('true')
    expect(getByTestId('title').textContent).toBe('A')
    const firstId = getByTestId('id').textContent
    expect(firstId).not.toBe('')

    fireEvent.click(getByText('update'))
    expect(getByTestId('title').textContent).toBe('B')

    fireEvent.click(getByText('dismiss-one'))
    expect(getByTestId('open').textContent).toBe('false')

    act(() => { jest.runOnlyPendingTimers() })
    expect(getByTestId('count').textContent).toBe('0')

    // create again to ensure ids increment and dismiss-all path is covered
    fireEvent.click(getByText('add'))
    const secondId = getByTestId('id').textContent
    expect(secondId).not.toBe(firstId)

    fireEvent.click(getByText('dismiss-all'))
    expect(getByTestId('open').textContent).toBe('false')
    act(() => { jest.runOnlyPendingTimers() })
    expect(getByTestId('count').textContent).toBe('0')
  })
})

