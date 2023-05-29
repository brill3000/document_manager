import MainCard from 'components/MainCard';
import React from 'react';
import MainGrid from 'components/workflow_new/components';

interface EmailContainerProps {
    width: string | number;
    height: string | number;
    browserHeight: string | number;
    browserWidth: string | number;
}

const index = ({ width, height, browserHeight, browserWidth }: EmailContainerProps) => {
    return (
        // @ts-expect-error unexpected
        <MainCard
            sx={{
                width: width ?? '100%',
                height: height ?? '85vh',
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
            <MainGrid />
        </MainCard>
    );
};

export default index;
