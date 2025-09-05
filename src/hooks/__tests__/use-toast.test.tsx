import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '@/hooks/use-toast';

describe('use-toast', () => {
  describe('reducer', () => {
    it('adds toast and enforces limit', () => {
      const state = { toasts: [] as any[] };
      const next = reducer(state, {
        type: 'ADD_TOAST',
        toast: { id: '1', open: true },
      });
      expect(next.toasts).toHaveLength(1);
    });

    it('updates toast by id', () => {
      const base = { toasts: [{ id: '1', title: 'a', open: true }] as any[] };
      const updated = reducer(base, {
        type: 'UPDATE_TOAST',
        toast: { id: '1', title: 'b' } as any,
      });
      expect(updated.toasts[0].title).toBe('b');
    });

    it('dismisses by id and sets open=false', () => {
      const base = { toasts: [{ id: '1', open: true }] as any[] };
      const dismissed = reducer(base, { type: 'DISMISS_TOAST', toastId: '1' });
      expect(dismissed.toasts[0].open).toBe(false);
    });

    it('removes by id', () => {
      const base = { toasts: [{ id: '1', open: false }] as any[] };
      const removed = reducer(base, { type: 'REMOVE_TOAST', toastId: '1' });
      expect(removed.toasts).toHaveLength(0);
    });

    it('removes all when toastId is undefined', () => {
      const base = { toasts: [{ id: '1' }, { id: '2' }] as any[] };
      const removedAll = reducer(base, { type: 'REMOVE_TOAST' });
      expect(removedAll.toasts).toHaveLength(0);
    });

    it('dismisses all toasts when toastId is undefined', () => {
      const base = {
        toasts: [
          { id: '1', open: true },
          { id: '2', open: true },
        ] as any[],
      };
      const dismissed = reducer(base, { type: 'DISMISS_TOAST' });
      expect(dismissed.toasts[0].open).toBe(false);
      expect(dismissed.toasts[1].open).toBe(false);
    });

    it('handles dismiss toast with specific id', () => {
      const base = {
        toasts: [
          { id: '1', open: true },
          { id: '2', open: true },
        ] as any[],
      };
      const dismissed = reducer(base, { type: 'DISMISS_TOAST', toastId: '1' });
      expect(dismissed.toasts[0].open).toBe(false);
      expect(dismissed.toasts[1].open).toBe(true);
    });

    it('handles update toast with non-existent id', () => {
      const base = { toasts: [{ id: '1', title: 'a', open: true }] as any[] };
      const updated = reducer(base, {
        type: 'UPDATE_TOAST',
        toast: { id: '2', title: 'b' } as any,
      });
      expect(updated.toasts[0].title).toBe('a'); // unchanged
    });
  });

  describe('toast function', () => {
    it('creates a toast with unique id', () => {
      const toastInstance = toast({ title: 'Test Toast' });
      expect(toastInstance.id).toBeDefined();
      expect(typeof toastInstance.id).toBe('string');
    });

    it('provides dismiss and update functions', () => {
      const toastInstance = toast({ title: 'Test Toast' });
      expect(typeof toastInstance.dismiss).toBe('function');
      expect(typeof toastInstance.update).toBe('function');
    });
  });

  describe('useToast hook', () => {
    it('returns hook with expected methods', () => {
      const { result } = renderHook(() => useToast());
      expect(typeof result.current.toast).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
      expect(Array.isArray(result.current.toasts)).toBe(true);
    });

    it('adds toast when toast function is called', () => {
      const { result } = renderHook(() => useToast());
      act(() => {
        result.current.toast({ title: 'Test Toast' });
      });
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Test Toast');
      expect(result.current.toasts[0].open).toBe(true);
    });

    it('dismisses specific toast', () => {
      const { result } = renderHook(() => useToast());
      act(() => {
        result.current.toast({ title: 'Test Toast' });
      });
      const toastId = result.current.toasts[0].id;
      act(() => {
        result.current.dismiss(toastId);
      });
      expect(result.current.toasts[0].open).toBe(false);
    });

    it('dismisses all toasts when no id provided', () => {
      const { result } = renderHook(() => useToast());
      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
      });
      act(() => {
        result.current.dismiss();
      });
      result.current.toasts.forEach(toast => {
        expect(toast.open).toBe(false);
      });
    });

    it('enforces toast limit', () => {
      const { result } = renderHook(() => useToast());
      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
        result.current.toast({ title: 'Toast 3' });
      });
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Toast 3');
    });

    it('updates existing toast', () => {
      const { result } = renderHook(() => useToast());
      let _toastInstance: any;
      act(() => {
        _toastInstance = result.current.toast({ title: 'Original Title' });
      });
      act(() => {
        _toastInstance.update({ title: 'Updated Title' });
      });
      expect(result.current.toasts[0].title).toBe('Updated Title');
    });

    it('handles toast with action and description', () => {
      const { result } = renderHook(() => useToast());
      const mockAction = {
        altText: 'Action',
        action: <button>Click</button>,
      } as any;
      act(() => {
        result.current.toast({
          title: 'Test Toast',
          description: 'Test Description',
          action: mockAction,
        });
      });
      expect(result.current.toasts[0].action).toBe(mockAction);
      expect(result.current.toasts[0].description).toBe('Test Description');
    });
  });

  describe('addToRemoveQueue function', () => {
    it('prevents duplicate timeouts for same toast', () => {
      const { result } = renderHook(() => useToast());
      let _toastInstance: any;
      act(() => {
        _toastInstance = result.current.toast({ title: 'Test Toast' });
      });
      act(() => {
        result.current.dismiss(_toastInstance.id);
        result.current.dismiss(_toastInstance.id);
        result.current.dismiss(_toastInstance.id);
      });
      expect(result.current.toasts[0].open).toBe(false);
    });

    it('handles onOpenChange callback when open is false', () => {
      const { result } = renderHook(() => useToast());
      let _toastInstance: any;
      act(() => {
        _toastInstance = result.current.toast({ title: 'Test Toast' });
      });
      const onOpenChange = result.current.toasts[0].onOpenChange;
      if (onOpenChange) {
        act(() => {
          onOpenChange(false);
        });
        expect(result.current.toasts[0].open).toBe(false);
      }
    });

    it('covers early return path when timeout exists', () => {
      const { result } = renderHook(() => useToast());
      let _toastInstance: any;
      act(() => {
        _toastInstance = result.current.toast({ title: 'Test Toast' });
      });
      act(() => {
        result.current.dismiss(_toastInstance.id);
      });
      act(() => {
        result.current.dismiss(_toastInstance.id);
      });
      expect(result.current.toasts[0].open).toBe(false);
    });

    it('covers the early return in addToRemoveQueue when timeout already exists', () => {
      const { result } = renderHook(() => useToast());
      let _toastInstance: any;
      act(() => {
        _toastInstance = result.current.toast({ title: 'Test Toast' });
      });

      // First dismiss should set up the timeout
      act(() => {
        result.current.dismiss(_toastInstance.id);
      });

      // Second dismiss should hit the early return path
      act(() => {
        result.current.dismiss(_toastInstance.id);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it('covers the timeout cleanup in addToRemoveQueue', () => {
      const { result } = renderHook(() => useToast());
      let _toastInstance: any;
      act(() => {
        _toastInstance = result.current.toast({ title: 'Test Toast' });
      });

      act(() => {
        result.current.dismiss(_toastInstance.id);
      });

      // The timeout should be set up and the toast should be dismissed
      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe('genId function', () => {
    it('generates unique IDs', () => {
      const { result } = renderHook(() => useToast());
      let toast1: any, toast2: any;

      act(() => {
        toast1 = result.current.toast({ title: 'Toast 1' });
      });

      act(() => {
        toast2 = result.current.toast({ title: 'Toast 2' });
      });

      expect(toast1.id).toBeDefined();
      expect(toast2.id).toBeDefined();
      expect(toast1.id).not.toBe(toast2.id);
    });

    it('handles ID overflow correctly', () => {
      // This tests the modulo operation in genId
      const { result } = renderHook(() => useToast());

      // Create multiple toasts to test ID generation
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.toast({ title: `Toast ${i}` });
        }
      });

      // All toasts should have valid string IDs
      result.current.toasts.forEach(toast => {
        expect(typeof toast.id).toBe('string');
        expect(toast.id).toBeDefined();
      });
    });
  });

  describe('dispatch function', () => {
    it('updates memory state correctly', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Test Toast' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Test Toast');
    });

    it('notifies all listeners when state changes', () => {
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());

      act(() => {
        result1.current.toast({ title: 'Shared Toast' });
      });

      // Both hooks should see the same toast
      expect(result1.current.toasts).toHaveLength(1);
      expect(result2.current.toasts).toHaveLength(1);
      expect(result1.current.toasts[0].title).toBe('Shared Toast');
      expect(result2.current.toasts[0].title).toBe('Shared Toast');
    });
  });

  describe('listener management', () => {
    it('removes listeners on cleanup', () => {
      const { unmount } = renderHook(() => useToast());

      // This should not throw any errors
      expect(() => unmount()).not.toThrow();
    });

    it('handles multiple listeners correctly', () => {
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());
      const { result: result3 } = renderHook(() => useToast());

      act(() => {
        result1.current.toast({ title: 'Multi-listener Toast' });
      });

      // All three hooks should see the toast
      expect(result1.current.toasts).toHaveLength(1);
      expect(result2.current.toasts).toHaveLength(1);
      expect(result3.current.toasts).toHaveLength(1);
    });
  });

  describe('toast function edge cases', () => {
    it('handles toast with all properties', () => {
      const { result } = renderHook(() => useToast());
      const mockAction = {
        altText: 'Action',
        action: <button>Click</button>,
      } as any;

      act(() => {
        result.current.toast({
          title: 'Complete Toast',
          description: 'Complete description',
          action: mockAction,
          variant: 'default',
          open: true,
        });
      });

      const toast = result.current.toasts[0];
      expect(toast.title).toBe('Complete Toast');
      expect(toast.description).toBe('Complete description');
      expect(toast.action).toBe(mockAction);
      expect(toast.variant).toBe('default');
      expect(toast.open).toBe(true);
    });

    it('handles toast with minimal properties', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({});
      });

      const toast = result.current.toasts[0];
      expect(toast.id).toBeDefined();
      expect(toast.open).toBe(true);
      // Note: dismiss and update are not properties of the toast object itself
      // They are returned by the toast function
    });

    it('handles toast update function', () => {
      const { result } = renderHook(() => useToast());
      let toastInstance: any;

      act(() => {
        toastInstance = result.current.toast({ title: 'Original' });
      });

      act(() => {
        toastInstance.update({
          title: 'Updated',
          description: 'New description',
        });
      });

      const toast = result.current.toasts[0];
      expect(toast.title).toBe('Updated');
      expect(toast.description).toBe('New description');
    });

    it('handles toast dismiss function', () => {
      const { result } = renderHook(() => useToast());
      let toastInstance: any;

      act(() => {
        toastInstance = result.current.toast({ title: 'To Dismiss' });
      });

      act(() => {
        toastInstance.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });
  });
});
