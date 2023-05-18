import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../data/History';

describe('useSelected hook', () => {
    it('Should add nodes history object and nav maps', async () => {
        const { result } = renderHook(() => useHistory());
        await act(async () => {
            result.current.select('1folder');
        });
        expect(result.current.history.get('1folder')).toBe(0);
        expect(result.current.nav).toStrictEqual(['1folder']);
        await act(async () => {
            result.current.select('2folder');
        });
        expect(result.current.history.get('2folder')).toBe(1);
        expect(result.current.nav).toStrictEqual(['1folder', '2folder']);

        await act(async () => {
            result.current.select('3folder');
        });
        expect(result.current.history.get('3folder')).toBe(2);
    });
    it('Should remove all nodes that came after the selected node', async () => {
        const map = new Map();
        map.set('1folder', 0);
        const { result } = renderHook(() => useHistory());
        await act(async () => {
            result.current.select('1folder');
        });
        expect(result.current.history.get('1folder')).toBe(0);

        await act(async () => {
            result.current.select('2folder');
        });
        expect(result.current.history.get('2folder')).toBe(1);

        await act(async () => {
            result.current.select('3folder');
        });
        expect(result.current.history.get('3folder')).toBe(2);
        await act(async () => {
            result.current.select('1folder');
        });
        expect(result.current.history.get('1folder')).toBe(0);
        expect(result.current.nav).toStrictEqual(['1folder']);

        expect(result.current.history).toStrictEqual(map);
    });
});
