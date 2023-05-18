import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse, List, IconButton } from '@mui/material';

// project import
import { activeItem } from 'store/reducers/menu';
import { setCurrentDepartment } from 'store/reducers/departments';
import { setUsers } from 'store/reducers/departments';
import { customers } from 'components/departments/__mocks__/customers copy';

import { ArrowDropDown, ArrowDropUp } from '../../../../../../node_modules/@mui/icons-material/index';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level, children }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menu);
    const { drawerOpen, openItem } = menu;
    const [open, setOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleClick = () => {
        if (!isDisabled) setOpen(true);
    };

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }
    let listChildreItemProps = (child) => ({
        component: forwardRef((props, ref) => <Link ref={ref} {...props} to={child.url} target={itemTarget} />)
    });

    const itemHandler = (id, parent) => {
        handleClick();
        const menuChildren = item.children ? item.children.map((child) => child.id) : [];
        const isSelected = openItem.some((id) => menuChildren?.includes(id));
        if (!isSelected) dispatch(activeItem({ openItem: [id] }));
        if (parent.toLowerCase() === 'departments') {
            dispatch(setCurrentDepartment({ currentDepartment: 'All Departments' }));
            dispatch(setUsers({ users: customers }));
        }
    };

    const Icon = item.icon;
    const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;
    const menuChildren = item.children ? item.children.map((child) => child.id) : [];
    const isSelected = openItem.findIndex((id) => id === item.id || menuChildren?.includes(id)) > -1;

    // active menu item on page load
    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch(activeItem({ openItem: [item.id] }));
        }
        // eslint-disable-next-line
    }, []);

    const textColor = 'text.primary';
    const iconSelectedColor = 'primary.main';

    return (
        <>
            <ListItemButton
                {...listItemProps}
                disabled={item.disabled}
                onClick={() => itemHandler(item.id, item.title)}
                selected={isSelected}
                sx={{
                    zIndex: 1201,
                    pl: drawerOpen ? `${level * 28}px` : 1.5,
                    py: !drawerOpen && level === 1 ? 1.25 : 1,
                    ...(drawerOpen && {
                        '&:hover': {
                            bgcolor: 'primary.lighter'
                        },
                        '&.Mui-selected': {
                            bgcolor: 'primary.lighter',
                            borderRight: `2px solid ${theme.palette.primary.main}`,
                            color: iconSelectedColor,
                            '&:hover': {
                                color: iconSelectedColor,
                                bgcolor: 'primary.lighter'
                            }
                        }
                    }),
                    ...(!drawerOpen && {
                        '&:hover': {
                            bgcolor: 'transparent'
                        },
                        '&.Mui-selected': {
                            '&:hover': {
                                bgcolor: 'transparent'
                            },
                            bgcolor: 'transparent'
                        }
                    })
                }}
            >
                {itemIcon && (
                    <ListItemIcon
                        sx={{
                            minWidth: 28,
                            color: isSelected ? iconSelectedColor : textColor,
                            ...(!drawerOpen && {
                                borderRadius: 1.5,
                                width: 36,
                                height: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover': {
                                    bgcolor: 'secondary.lighter'
                                }
                            }),
                            ...(!drawerOpen &&
                                isSelected && {
                                    bgcolor: 'primary.lighter',
                                    '&:hover': {
                                        bgcolor: 'primary.lighter'
                                    }
                                })
                        }}
                    >
                        {itemIcon}
                    </ListItemIcon>
                )}
                {(drawerOpen || (!drawerOpen && level !== 1)) && (
                    <ListItemText
                        primary={
                            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                                {item.title}
                            </Typography>
                        }
                    />
                )}
                {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
                    <Chip
                        color={item.chip.color}
                        variant={item.chip.variant}
                        size={item.chip.size}
                        label={item.chip.label}
                        avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                    />
                )}
                {children &&
                    (open ? (
                        <IconButton
                            size="small"
                            sx={{ color: 'warning' }}
                            variant="outlined"
                            onMouseOver={() => setIsDisabled(true)}
                            onMouseOut={() => setIsDisabled(false)}
                            onClick={() => setOpen(false)}
                        >
                            <ArrowDropUp color="primary" />
                        </IconButton>
                    ) : (
                        <IconButton
                            size="small"
                            sx={{ color: 'warning' }}
                            variant="outlined"
                            onClick={() => setOpen(true)}
                            onMouseOver={() => setIsDisabled(false)}
                        >
                            <ArrowDropDown color="primary" />
                        </IconButton>
                    ))}
            </ListItemButton>
            {children && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" sx={{ bgcolor: '#eeeeef' }} disablePadding>
                        {children.map((child) => (
                            <ListItemButton
                                key={child.id}
                                {...listChildreItemProps(child)}
                                onClick={() => {
                                    dispatch(activeItem({ openItem: [child.id] }));
                                    dispatch(setCurrentDepartment({ currentDepartment: child.title }));
                                    dispatch(setUsers({ users: customers }));
                                }}
                                selected={child.id === openItem[0]}
                                sx={{
                                    pl: 4,
                                    ...(drawerOpen && {
                                        '&:hover': {
                                            bgcolor: '#8c8c8c6b'
                                        },
                                        '&.Mui-selected': {
                                            bgcolor: '#8c8c8c6b',
                                            '&:hover': {
                                                // color: iconSelectedColor,
                                                bgcolor: '#8c8c8c6b'
                                            }
                                        }
                                    })
                                }}
                            >
                                {child.icon && <ListItemIcon>{<child.icon style={{ fontSize: '1.1rem' }} />}</ListItemIcon>}
                                <ListItemText primary={child.title} sx={{ pl: 1 }} primaryTypographyProps={{ fontSize: '.8rem' }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
};

export default NavItem;
