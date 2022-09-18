import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import Chip from '@mui/material/Chip';
// icons
import { HiFolder, HiFolderOpen, HiHome } from "react-icons/hi";


// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { setCurrentFolder } from 'store/reducers/documents';
import PropTypes from 'prop-types';
import { MenuItem, Menu } from '@mui/material';




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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        if (event) {
            setAnchorEl(event.currentTarget);
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                aria-labelledby="with-menu-demo-breadcrumbs"
            >   
                {
                    history?.filter((_,i) => i !== history.length - 1 && i !== history.length - 2 ).map((history,index) => <MenuItem onClick={(e) => {handleClose(); handleClick(e, history.id)}} key={index}>{history.label}</MenuItem>).reverse()
                }
            </Menu>
            <Breadcrumbs aria-label="breadcrumb">
                {
                    history?.length > 3 && (
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label={
                                <span >
                                    •••
                                </span>
                            }
                            style={{ maxWidth: '150px' }}
                            onClick={handleClickMenu}
                        ></StyledBreadcrumb>
                    )
                }
                {
                    history?.map((element, i) => {
                        return (
                            history.length < 4 ?
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
                                    icon={i === 0 ? <HiHome size={19} /> : i === history.length - 1 ? <HiFolderOpen size={19}/> : <HiFolder size={19}/> }
                                />
                                : (i === history.length - 1 || i === history.length - 2) && (
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
                                        icon={i === 0 ? <HiHome size={19} /> : i === history.length - 1 ?  <HiFolderOpen size={19}/> : <HiFolder size={19} />}
                                    />
                                )
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

