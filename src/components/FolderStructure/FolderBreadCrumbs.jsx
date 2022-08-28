import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
// icons
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { setCurrentFolder } from 'store/reducers/documents';
import PropTypes from 'prop-types';




const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const nullable = propType => (props, propName, ...rest) =>
    props[propName] === null ? null : propType(props, propName, ...rest);


export default function FolderBreadCrumbs({ history, setHistory }) {
    const dispatch = useDispatch();

    const handleClick = (event, id) => {
        event.preventDefault();
        if (history) {
            const index = history?.findIndex(x => x.id === id)
            if (index > -1)
                setHistory(history?.filter((_, i) => i <= index), "history")
            if (id) dispatch(setCurrentFolder({ currentFolder: id }))
        }
    }
    return (
        <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
                {
                    history?.map((element, i) => {
                        return (
                            <StyledBreadcrumb
                                key={element.id}
                                component="a"
                                href="#"
                                label={
                                    <span style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {element.label}
                                    </span>
                                }
                                style={{ maxWidth: '150px' }}
                                onClick={(e) => handleClick(e, element.id)}
                                icon={i === 0 ? <HomeRoundedIcon fontSize="small" /> : <FolderRoundedIcon />}
                            />
                        )
                    })
                }
            </Breadcrumbs>
        </div>
    );
}

FolderBreadCrumbs.propTypes = {
    history: nullable(PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired)
};

