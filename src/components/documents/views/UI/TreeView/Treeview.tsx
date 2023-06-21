import { Box, Collapse, Skeleton, Typography, alpha, styled } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useSpring, animated } from '@react-spring/web';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        from: {
            opacity: 0,
            transform: 'translate3d(20px,0,0)'
        },
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(${props.in ? 0 : 20}px,0,0)`
        }
    });
    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

const StyledTreeItemRoot = styled(
    (props: TreeItemProps & { isLoader: boolean }) => <TreeItem {...props} TransitionComponent={TransitionComponent} />,
    {
        shouldForwardProp: (props) =>
            props !== 'isLoader' && props !== 'bgColor' && props !== 'labelInfo' && props !== 'labelText' && props !== 'isFocused'
    }
)(({ theme, isLoader }) => ({
    color: theme.palette.text.secondary,
    paddingRight: 0,
    paddingTop: theme.spacing(0.5),

    [`& .${treeItemClasses.content}`]: {
        borderRadius: theme.spacing(0.5),
        paddingLeft: theme.spacing(1.5),
        backgroundColor: 'transparent',
        ...(isLoader && { padding: '0 !important', height: '1.4rem !important' }),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&.Mui-selected': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.25)} !important`,
            '&.Mui-focused': {
                backgroundColor: `${alpha(theme.palette.primary.main, 0.3)} !important`
            }
        },
        '&.Mui-focused': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important`
        },
        '&.Mui-hover': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important`
        },
        '& .MuiTreeItem-label': {
            paddingLeft: theme.spacing(1)
        }
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        display: isLoader ? 'none' : 'inherit'
    }
}));

function StyledTreeItem(props: TreeItemProps) {
    const { label, nodeId, ...other } = props;
    const otherOmitted = omit(other, ['label', 'focused']);
    return (
        <StyledTreeItemRoot
            nodeId={nodeId}
            label={
                !nodeId?.includes('loader') ? (
                    <Typography variant="body2" color="text.primary" noWrap>
                        {label}
                    </Typography>
                ) : (
                    <Box width="100%" height="100%">
                        <Skeleton width="100%" height="2.1rem" animation="wave" />
                    </Box>
                )
            }
            {...otherOmitted}
            isLoader={nodeId?.includes('loader')}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired
};

export { TransitionComponent, StyledTreeItem, StyledTreeItemRoot };
