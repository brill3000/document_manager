import { VirtuosoGrid } from 'react-virtuoso';
import styled from '@emotion/styled';
import { Box } from '@mui/material';

const ItemContainer = styled.div`
    padding: 0.5rem;
    width: 33%;
    display: flex;
    flex: none;
    align-content: stretch;
    box-sizing: border-box;

    @media (max-width: 1024px) {
        width: 50%;
    }

    @media (max-width: 300px) {
        width: 100%;
    }
`;

const ItemWrapper = (
    <Box
        sx={{
            flex: 1,
            textAlign: 'center',
            fontSize: '80%',
            p: 1,
            border: '1px solid var(gray)',
            whiteSpace: 'nowrap'
        }}
    ></Box>
);

const ListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;


export default function VirtualizedList() {
    return (
        <>
            <VirtuosoGrid
                style={{ height: 400 }}
                totalCount={10000}
                overscan={200}
                components={{
                    Item: ItemContainer,
                    List: ListContainer,
                    ScrollSeekPlaceholder: ({ height, width, index }) => (
                        <ItemContainer>
                            <ItemWrapper>{'--'}</ItemWrapper>
                        </ItemContainer>
                    )
                }}
                itemContent={(index) => <ItemWrapper>Item {index}</ItemWrapper>}
                scrollSeekConfiguration={{
                    enter: (velocity) => Math.abs(velocity) > 200,
                    exit: (velocity) => Math.abs(velocity) < 30,
                    change: (_, range) => console.log({ range })
                }}
            />
            <style>{`html, body, #root { margin: 0; padding: 0 }`}</style>
        </>
    );
}
