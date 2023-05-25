import { Box, Divider } from '@mui/material';
import React from 'react';
import Content from './browser/Container';
import FileBrowserNavigation from './browser/navigation/bottom/Footer';
import { FileBrowserProps } from '../Interface/FileBrowser';
import { useStore } from '../data/global_state';
import FileBrowserTopNav from './browser/navigation/top/TopNav';
import { useViewStore } from '../data/global_state/slices/view';
import MainCard from 'components/MainCard';

/**
 * This is a main file browser component, it takes an array of documents and creates a virtual filebrowser using react
 */

const FileBrowser = ({ height, width, bgColor, borderRadius }: FileBrowserProps) => {
    const { dragging } = useStore();
    const topRef = React.useRef<HTMLInputElement | null>(null);
    const bottomRef = React.useRef<HTMLInputElement | null>(null);
    // const [heightContent, setHeightContent] = React.useState<number | null>(null);
    const { setBrowserHeight, setBrowserWidth, browserHeight, browserWidth } = useViewStore();
    const ref = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
        const handleWindowResize = () => {
            setBrowserHeight(window.innerHeight);
            setBrowserWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });

    React.useEffect(() => {
        setBrowserHeight(window.innerHeight * 0.96);
        setBrowserWidth(window.innerWidth * 0.96);
    }, [setBrowserHeight, setBrowserWidth]);

    React.useEffect(() => {
        dragging ? document.body.classList.add('dragging') : document.body.classList.remove('dragging');
    }, [dragging]);

    // React.useEffect(() => {
    //   const topHeight = topRef.current !== null && topRef.current !== undefined ? topRef.current.clientHeight : null
    //   const bottomHeight = bottomRef.current !== null && bottomRef.current !== undefined ? bottomRef.current.clientHeight : null
    //   if (topHeight !== undefined && topHeight !== null && bottomHeight !== undefined && bottomHeight !== null) {
    //     // if (height && height - bottomHeight > 0) {
    //     //   setHeightContent(height - bottomHeight)
    //     // } else {
    //     // setHeightContent((windowHeight * .7 * .8) - topHeight + bottomHeight)
    //     // }
    //   }
    // }, [height, windowHeight, windowWidth])

    return (
        // @ts-expect-error The component takes children
        <MainCard
            sx={{
                width: width ?? browserWidth,
                height: height ?? browserHeight,
                display: 'flex',
                flexDirection: 'column',
                '& .MuiCardContent-root': {
                    p: 0,
                    height: '100%',
                    width: '100%',
                    '&:last-child': {
                        p: '0 !important'
                    }
                }
            }}
        >
            <Box height="17%">
                <FileBrowserTopNav ref={topRef} bgColor={bgColor} borderRadius={borderRadius} />
            </Box>
            <Box height="75%">
                <Content gridRef={ref} />
            </Box>
            <Divider />
            <Box height="8%">
                <FileBrowserNavigation ref={bottomRef} />
            </Box>
        </MainCard>
    );
};

export default FileBrowser;
