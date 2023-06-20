import PropTypes from 'prop-types';
import { ElementType, Ref, forwardRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Chip,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Collapse,
    List,
    IconButton,
    alpha,
    ChipProps
} from '@mui/material';

// project import
import { activeItem } from 'store/reducers/menu';
import { setCurrentDepartment } from 'store/reducers/departments';
import { setUsers } from 'store/reducers/departments';
import { customers } from 'components/departments/__mocks__/customers copy';

import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { first, isArray, isEmpty } from 'lodash';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface ItemProps {
    id: string;
    title: string;
    type: string;
    target: string;
    external?: boolean;
    url: string;
    icon: ElementType;
    breadcrumbs: boolean;
    children: Array<ItemProps>;
    disabled?: boolean;
    chip: ChipProps;
}
interface NavItemProps {
    item: ItemProps;
    children: Array<ItemProps>;
    level: number;
}

const NavItem = ({ item, level, children }: NavItemProps) => {
    // ============================== | STATE | =========================== //
    const [open, setOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    // ============================== | THEME | =========================== //
    const theme = useTheme();
    // ============================== | STORE | =========================== //
    const dispatch = useDispatch();
    // @ts-expect-error expected
    const menu = useSelector((state) => state.menu);
    const { drawerOpen, openItem } = menu;
    // ================================= | ROUTES | ============================= //
    const { pathname } = useLocation();

    const handleClick = () => {
        if (!isDisabled) setOpen(true);
    };

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps = {
        component: forwardRef((props, ref) => (
            <Link ref={ref as Ref<HTMLAnchorElement> | undefined} {...props} to={item.url} target={itemTarget} />
        ))
    };
    if (item?.external) {
        // @ts-expect-error expects
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }
    const listChildreItemProps = (child: ItemProps) => ({
        component: forwardRef((props, ref) => (
            <Link ref={ref as Ref<HTMLAnchorElement> | undefined} {...props} to={child.url} target={itemTarget} />
        ))
    });
    // ============================== | EVENT HANDLER | =========================== //
    const itemHandler = (id: string, parent: string) => {
        handleClick();
        const menuChildren = item.children ? item.children.map((child) => child.id) : [];
        const isSelected = openItem.some((x: string) => menuChildren?.includes(x));
        if (!isSelected) dispatch(activeItem({ openItem: [id] }));
        if (parent.toLowerCase() === 'departments') {
            dispatch(setCurrentDepartment({ currentDepartment: 'All Departments' }));
            dispatch(setUsers({ users: customers }));
        }
    };
    // ============================== | CONSTANTS | =========================== //
    const Icon = item.icon;
    const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;
    const menuChildren = item.children ? item.children.map((child) => child.id) : [];
    const isSelected = openItem.findIndex((id: string) => id === item.id || menuChildren?.includes(id)) > -1;
    const textColor = 'text.primary';
    const iconSelectedColor = 'primary.main';

    // ============================== | EFFECTS | =========================== //
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

    useEffect(() => {
        const pathArray = pathname.split('/');
        if (isArray(pathArray) && !isEmpty(pathArray)) {
            pathArray.includes('documents') && setOpen(true);
            pathArray.shift();
            pathArray.shift();
            if (pathArray.length > 0) {
                dispatch(activeItem({ openItem: [first(pathArray)] }));
            }
        }
    }, [pathname]);

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
                                    bgcolor: 'primary.lighter'
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
                        avatar={
                            item.chip.avatar && <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.main }}>{item.chip.avatar}</Avatar>
                        }
                    />
                )}
                {children &&
                    (open ? (
                        <IconButton
                            size="small"
                            sx={{ color: 'warning' }}
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
                            onClick={() => setOpen(true)}
                            onMouseOver={() => setIsDisabled(false)}
                        >
                            <ArrowDropDown color="primary" />
                        </IconButton>
                    ))}
            </ListItemButton>
            {children && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }} disablePadding>
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
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            borderRight: `2px solid ${theme.palette.primary.light}`
                                        },
                                        '&.Mui-selected': {
                                            borderRight: `2px solid ${theme.palette.primary.light}`,
                                            '&:hover': {
                                                // color: iconSelectedColor,
                                                borderRight: `2px solid ${theme.palette.primary.main}`
                                            }
                                        }
                                    })
                                }}
                            >
                                {child.icon && <ListItemIcon>{<child.icon style={{ fontSize: '1rem' }} />}</ListItemIcon>}
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