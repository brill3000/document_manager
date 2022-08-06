// assets
import { DashboardOutlined } from '@ant-design/icons';
import { ApartmentOutlined } from '@ant-design/icons';
import { HddOutlined } from '@ant-design/icons';
import { FolderOutlined } from '@ant-design/icons';
import { BarsOutlined } from '@ant-design/icons';
import { TagsOutlined } from '@ant-design/icons';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import FolderDeleteOutlinedIcon from '@mui/icons-material/FolderDeleteOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
// icons
const icons = {
    DashboardOutlined,
    ApartmentOutlined,
    HddOutlined,
    FolderOutlined,
    BarsOutlined,
    TagsOutlined,
    StarBorderIcon,
    NoteAddIcon,
    PostAddOutlinedIcon,
    TopicOutlinedIcon,
    FolderDeleteOutlinedIcon,
    DifferenceOutlinedIcon,
    FiberNewOutlinedIcon,
    FileOpenOutlinedIcon,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/',
            icon: icons.DashboardOutlined,
            breadcrumbs: false,
        },
        {
            id: 'documents',
            title: 'Documents',
            type: 'item',
            url: '/',
            icon: icons.FolderOutlined,
            breadcrumbs: false,
            children: [
                {
                    id: 'recently-accessed',
                    title: 'Recently Accessed',
                    type: 'item',
                    url: '/',
                    icon: icons.FileOpenOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'recently-added',
                    title: 'Recently Added',
                    type: 'item',
                    url: '/',
                    icon: icons.PostAddOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'favorites',
                    title: 'Favorites',
                    type: 'item',
                    url: '/',
                    icon: icons.StarBorderIcon,
                    breadcrumbs: false
                },
                {
                    id: 'all-documents',
                    title: 'All Documents',
                    type: 'item',
                    url: '/',
                    icon: icons.TopicOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'trash',
                    title: 'Trash',
                    type: 'item',
                    url: '/',
                    icon: icons.FolderDeleteOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'duplicate-documents',
                    title: 'Duplicate Documents',
                    type: 'item',
                    url: '/',
                    icon: icons.DifferenceOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'new-documents',
                    title: 'New Documents',
                    type: 'item',
                    url: '/',
                    icon: icons.FiberNewOutlinedIcon,
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'workflows',
            title: 'Workflows',
            type: 'item',
            url: '/',
            icon: icons.ApartmentOutlined,
            breadcrumbs: false
        },
        {
            id: 'cabinets',
            title: 'Cabinets',
            type: 'item',
            url: '/',
            icon: icons.HddOutlined,
            breadcrumbs: false
        },
        {
            id: 'indexes',
            title: 'Indexes',
            type: 'item',
            url: '/',
            icon: icons.BarsOutlined,
            breadcrumbs: false
        },
        {
            id: 'tags',
            title: 'Tags',
            type: 'item',
            url: '/',
            icon: icons.TagsOutlined,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
