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
            breadcrumbs: false,
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
                },
            ]
        },

        // {
        //     id: 'approvals',
        //     title: 'Approvals',
        //     type: 'item',
        //     url: '/approvals',
        //     icon: icons.RiseOutlined,
        //     breadcrumbs: false
        // },
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
        },
        {
            id: 'departments',
            title: 'Departments',
            type: 'item',
            url: '/departments',
            icon: icons.PeopleOutlineIcon,
            breadcrumbs: false,
            children: [
                {
                    id: 'speakersOffice',
                    title: 'Speakers Office',
                    type: 'item',
                    url: '/departments/speakersOffice',
                    icon: icons.CampaignOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'clerksoffice',
                    title: 'Clerks Office',
                    type: 'item',
                    url: '/departments/clerksoffice',
                    icon: icons.MiscellaneousServicesOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'finance',
                    title: 'Finance',
                    type: 'item',
                    url: '/departments/finance',
                    icon: icons.MonetizationOnOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'supplychain',
                    title: 'Supply Chain',
                    type: 'item',
                    url: '/departments/supplychain',
                    icon: icons.LocalShippingOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'research_and_records',
                    title: 'Research And Records',
                    type: 'item',
                    url: '/departments/research_and_records',
                    icon: icons.BiotechOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'hansard',
                    title: 'Hansard',
                    type: 'item',
                    url: '/departments/hansard',
                    icon: icons.NoteAltOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'ict',
                    title: 'ICT',
                    type: 'item',
                    url: '/departments/ict',
                    icon: icons.DesktopWindowsOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'clerks_at_the_table',
                    title: 'Clerks at The Table',
                    type: 'item',
                    url: '/departments/clerks_at_the_table',
                    icon: icons.MiscellaneousServicesOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'sergent_at_arms',
                    title: 'Sergent at arms',
                    type: 'item',
                    url: '/departments/sergent_at_arms',
                    icon: icons.GavelOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'reception',
                    title: 'Reception',
                    type: 'item',
                    url: '/departments/reception',
                    icon: icons.SettingsPhoneOutlinedIcon,
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'metadata',
            title: 'Metadata',
            type: 'item',
            url: '/metadata',
            icon: icons.HddOutlined,
            breadcrumbs: false
        },
        {
            id: 'thesaurus',
            title: 'Thesaurus',
            type: 'item',
            url: '/thesaurus',
            icon: icons.DatabaseOutlined,
            breadcrumbs: false
        },
    ]
};

export default dashboard;
