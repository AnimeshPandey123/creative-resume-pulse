import { reducer } from '@/hooks/use-toast'

describe('use-toast reducer', () => {
  it('adds toast and enforces limit', () => {
    const state = { toasts: [] as any[] }
    const next = reducer(state, {
      type: 'ADD_TOAST',
      toast: { id: '1', open: true },
    })
    expect(next.toasts).toHaveLength(1)
    const next2 = reducer(next, {
      type: 'ADD_TOAST',
      toast: { id: '2', open: true },
    })
    // limit is 1, so only latest remains
    expect(next2.toasts).toHaveLength(1)
    expect(next2.toasts[0].id).toBe('2')
  })

  it('updates toast by id', () => {
    const base = { toasts: [{ id: '1', title: 'a', open: true }] as any[] }
    const updated = reducer(base, {
      type: 'UPDATE_TOAST',
      toast: { id: '1', title: 'b' } as any,
    })
    expect(updated.toasts[0].title).toBe('b')
  })

  it('dismisses by id and sets open=false', () => {
    const base = { toasts: [{ id: '1', open: true }] as any[] }
    const dismissed = reducer(base, { type: 'DISMISS_TOAST', toastId: '1' })
    expect(dismissed.toasts[0].open).toBe(false)
  })

  it('removes by id', () => {
    const base = { toasts: [{ id: '1', open: false }] as any[] }
    const removed = reducer(base, { type: 'REMOVE_TOAST', toastId: '1' })
    expect(removed.toasts).toHaveLength(0)
  })

  it('removes all when toastId is undefined', () => {
    const base = { toasts: [{ id: '1' }, { id: '2' }] as any[] }
    const removedAll = reducer(base, { type: 'REMOVE_TOAST' })
    expect(removedAll.toasts).toHaveLength(0)
  })
})

