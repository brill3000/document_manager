import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoutes from './ProtectedRoutes';
import IndexTable from 'components/indexes/IndexTable';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const Roles = Loadable(lazy(() => import( 'components/approvals')));
const Workflow = Loadable(lazy(() => import( 'components/workflows')));
const Email = Loadable(lazy(() => import( 'components/email')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
// const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
// const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
// const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
// const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const CustomizedTreeView = Loadable(lazy(() => import('components/FolderStructure/Treeview')));
const Users = Loadable(lazy(() => import('components/users')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes> ,
    children: [
        {
            path: '/',
            element: <ProtectedRoutes><DashboardDefault /></ProtectedRoutes>
        },
        // {
        //     path: 'color',
        //     element: <Color />
        // },
        {
            path: 'documents',
            element: <ProtectedRoutes><CustomizedTreeView /></ProtectedRoutes>,
            children: [
                {
                    path: 'my-documents',
                    element: <ProtectedRoutes><CustomizedTreeView content="my_documents" /></ProtectedRoutes>,
                },
                {
                    path: 'outbound-documents',
                    element: <ProtectedRoutes><CustomizedTreeView content="outbound_documents" />,</ProtectedRoutes>
                },
                {
                    path: 'incoming-documents',
                    element: <ProtectedRoutes><CustomizedTreeView content="incoming_documents" /></ProtectedRoutes>,
                },
                {
                    path: 'document-for-my-approval',
                    element: <ProtectedRoutes><CustomizedTreeView content="document-for-my-approval" /></ProtectedRoutes>,
                },
                {
                    path: 'trash',
                    element: <ProtectedRoutes><CustomizedTreeView content="" /></ProtectedRoutes>,
                }
            ]
        },
        {
            path: 'departments',
            element: <ProtectedRoutes><Users title="All Departments"/></ProtectedRoutes>,
            children: [
                {
                    path: 'speakersOffice',
                    element: <ProtectedRoutes><Users title="Speaker's Office"/></ProtectedRoutes>,
                },
                {
                    path: 'clerksoffice',
                    element: <ProtectedRoutes><Users title="Clerk's Office"/></ProtectedRoutes>
                },
                {
                    path: 'finance',
                    element: <ProtectedRoutes><Users title="Finance"/></ProtectedRoutes>,
                },
                {
                    path: 'supplychain',
                    element: <ProtectedRoutes><Users title="Supply Chain"/></ProtectedRoutes>,
                },
                {
                    path: 'research_and_records',
                    element: <ProtectedRoutes><Users title="Research and Record"/></ProtectedRoutes>,
                },
                {
                    path: 'hansard',
                    element: <ProtectedRoutes><Users title="Hansard"/></ProtectedRoutes>,
                },
                {
                    path: 'ict',
                    element: <ProtectedRoutes><Users title="ICT"/></ProtectedRoutes>,
                },
                {
                    path: 'clerks_at_the_table',
                    element: <ProtectedRoutes><Users title="Clerks at the Table"/></ProtectedRoutes>
                },
                {
                    path: 'sergent_at_arms',
                    element: <ProtectedRoutes><Users title="Sergent at arms"/></ProtectedRoutes>,
                },
                {
                    path: 'reception',
                    element: <ProtectedRoutes><Users title="Reception"/></ProtectedRoutes>,
                }
            ]
        },
        {
            path: 'indexes',
            element: <ProtectedRoutes><IndexTable/></ProtectedRoutes>
        },
        {
            path: 'approvals',
            element: <ProtectedRoutes><Roles/></ProtectedRoutes>
        }
        ,{
            path: 'workflows',
            element: <ProtectedRoutes><Workflow/></ProtectedRoutes>
        },
        {
            path: 'cabinets',
            element:<ProtectedRoutes><CustomizedTreeView /></ProtectedRoutes>
        },
        {
            path: 'messages',
            element:<ProtectedRoutes><Email/></ProtectedRoutes>
        },
        {
            path: 'dashboard',
            element: <ProtectedRoutes><DashboardDefault /></ProtectedRoutes>
            // children: [
            //     {
            //         path: 'default',
            //         element: <DashboardDefault />
            //     }
            // ]
        },
        // {
        //     path: 'sample-page',
        //     element: <ProtectedRoutes><SamplePage /></ProtectedRoutes>
        // },
        // {
        //     path: 'shadow',
        //     element: <ProtectedRoutes><Shadow /></ProtectedRoutes>
        // },
        // {
        //     path: 'typography',
        //     element: <ProtectedRoutes><Typography /></ProtectedRoutes>
        // },
        // {
        //     path: 'icons/ant',
        //     element: <ProtectedRoutes><AntIcons /></ProtectedRoutes>
        // }
    ]
};

export default MainRoutes;
