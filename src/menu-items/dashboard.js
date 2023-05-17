// assets
import { DashboardOutlined } from '@ant-design/icons';
import { ApartmentOutlined } from '@ant-design/icons';
import { HddOutlined } from '@ant-design/icons';
import { FolderOutlined } from '@ant-design/icons';
import { BarsOutlined } from '@ant-design/icons';
import { TagsOutlined } from '@ant-design/icons';
import { RiseOutlined } from '@ant-design/icons';
import { DatabaseOutlined } from '@ant-design/icons';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import FolderDeleteOutlinedIcon from '@mui/icons-material/FolderDeleteOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SettingsPhoneOutlinedIcon from '@mui/icons-material/SettingsPhoneOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
// icons
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
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
    RiseOutlined,
    DatabaseOutlined,
    MonetizationOnOutlinedIcon,
    DesktopWindowsOutlinedIcon,
    NoteAltOutlinedIcon,
    GavelOutlinedIcon,
    SettingsPhoneOutlinedIcon,
    BiotechOutlinedIcon,
    ConnectWithoutContactOutlinedIcon,
    MiscellaneousServicesOutlinedIcon,
    LocalShippingOutlinedIcon,
    CampaignOutlinedIcon,
    MessageOutlinedIcon,
    PeopleOutlineIcon
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
            url: '/dashboard',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'documents',
            title: 'Documents',
            type: 'item',
            url: '/documents',
            icon: icons.HddOutlined,
            breadcrumbs: false,
            children: [
                {
                    id: 'my-documents',
                    title: 'My Documents',
                    type: 'item',
                    url: 'documents/my-documents',
                    icon: icons.FileOpenOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'templates',
                    title: 'Templates',
                    type: 'item',
                    url: '/documents/templates',
                    icon: icons.PostAddOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'email',
                    title: 'Email Attachments',
                    type: 'item',
                    url: '/documents/email-attachments',
                    icon: icons.StarBorderIcon,
                    breadcrumbs: false
                },
                {
                    id: 'trash',
                    title: 'Trash',
                    type: 'item',
                    url: '/documents/trash',
                    icon: icons.FolderDeleteOutlinedIcon,
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'workflows',
            title: 'Workflows',
            type: 'item',
            url: '/workflows',
            icon: icons.FiberNewOutlinedIcon,
            breadcrumbs: false
        },
        {
            id: 'emails',
            title: 'emails',
            type: 'item',
            url: '/emails',
            icon: icons.MessageOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
