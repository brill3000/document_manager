import PropTypes from 'prop-types';
import * as React from 'react';

interface ScrollSyncProps {
    children: ({
        onScroll,
        scrollLeft,
        scrollTop,
        clientHeight,
        clientWidth,
        scrollHeight,
        scrollWidth
    }: {
        onScroll: ({
            clientHeight,
            clientWidth,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth
        }: {
            clientHeight: number;
            clientWidth: number;
            scrollHeight: number;
            scrollLeft: number;
            scrollTop: number;
            scrollWidth: number;
        }) => void;
        scrollLeft: number;
        scrollTop: number;
        clientHeight: number;
        clientWidth: number;
        scrollHeight: number;
        scrollWidth: number;
    }) => React.ReactNode;
}

interface ScrollSyncState {
    clientHeight: number;
    clientWidth: number;
    scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
}

/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */
export default function ScrollSync({ children }: ScrollSyncProps) {
    const [state, setState] = React.useState<ScrollSyncState>({
        clientHeight: 0,
        clientWidth: 0,
        scrollHeight: 0,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 0
    });

    const _onScroll = React.useCallback(
        ({
            clientHeight,
            clientWidth,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth
        }: {
            clientHeight: number;
            clientWidth: number;
            scrollHeight: number;
            scrollLeft: number;
            scrollTop: number;
            scrollWidth: number;
        }) => {
            setState({
                clientHeight,
                clientWidth,
                scrollHeight,
                scrollLeft,
                scrollTop,
                scrollWidth
            });
        },
        []
    );

    return (
        <>
            {children({
                clientHeight: state.clientHeight,
                clientWidth: state.clientWidth,
                onScroll: _onScroll,
                scrollHeight: state.scrollHeight,
                scrollLeft: state.scrollLeft,
                scrollTop: state.scrollTop,
                scrollWidth: state.scrollWidth
            })}
        </>
    );
}

ScrollSync.propTypes = {
    /**
     * Function responsible for rendering 2 or more virtualized components.
     * This function should implement the following signature:
     * ({ onScroll, scrollLeft, scrollTop, clientHeight, clientWidth, scrollHeight, scrollWidth }) => PropTypes.element
     */
    children: PropTypes.func.isRequired
};
