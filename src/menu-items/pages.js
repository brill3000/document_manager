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

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'authentication',
    title: 'Administration',
    type: 'group',
    children: [
        {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/users',
            icon: icons.PeopleOutlineIcon,
            breadcrumbs: false,
            children: [
                {
                    id: 'speakersOffice',
                    title: 'Speakers Office',
                    type: 'item',
                    url: '/users/speakersOffice',
                    icon: icons.CampaignOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'clerksoffice',
                    title: 'Clerks Office',
                    type: 'item',
                    url: '/users/clerksoffice',
                    icon: icons.MiscellaneousServicesOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'finance',
                    title: 'Finance',
                    type: 'item',
                    url: '/users/finance',
                    icon: icons.MonetizationOnOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'supplychain',
                    title: 'Supply Chain',
                    type: 'item',
                    url: '/users/supplychain',
                    icon: icons.LocalShippingOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'research_and_records',
                    title: 'Research And Records',
                    type: 'item',
                    url: '/users/research_and_records',
                    icon: icons.BiotechOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'hansard',
                    title: 'Hansard',
                    type: 'item',
                    url: '/users/hansard',
                    icon: icons.NoteAltOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'ict',
                    title: 'ICT',
                    type: 'item',
                    url: '/users/ict',
                    icon: icons.DesktopWindowsOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'clerks_at_the_table',
                    title: 'Clerks at The Table',
                    type: 'item',
                    url: '/users/clerks_at_the_table',
                    icon: icons.MiscellaneousServicesOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'sergent_at_arms',
                    title: 'Sergent at arms',
                    type: 'item',
                    url: '/users/sergent_at_arms',
                    icon: icons.GavelOutlinedIcon,
                    breadcrumbs: false
                },
                {
                    id: 'reception',
                    title: 'Reception',
                    type: 'item',
                    url: '/users/reception',
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
        }
    ]
};

export default pages;
