import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const CustomizedTreeView = Loadable(lazy(() => import('components/FolderStructure/Treeview')));
const Customers = Loadable(lazy(() => import('components/departments/customers')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'color',
            element: <Color />
        },
        {
            path: 'documents',
            element: <CustomizedTreeView />,
            children: [
                {
                    path: 'my-documents',
                    element: <CustomizedTreeView />,
                },
                {
                    path: 'outbound-documents',
                    element: <CustomizedTreeView />,
                },
                {
                    path: 'incoming-documents',
                    element: <CustomizedTreeView />,
                },
                {
                    path: 'document-for-my-approval',
                    element: <CustomizedTreeView />,
                },
                {
                    path: 'trash',
                    element: <CustomizedTreeView />,
                }
            ]
        },
        {
            path: 'approvals',
            element: <></>
        },
        {
            path: 'departments',
            element: <Customers currentDepartment="All Members"/>,
            children: [
                {
                    path: 'speakersOffice',
                    element: <Customers currentDepartment="Speakers Office"/>,
                },
                {
                    path: 'clerksoffice',
                    element: <Customers currentDepartment="Clerks Office"/>,
                },
                {
                    path: 'finance',
                    element: <Customers currentDepartment="Finance"/>,
                },
                {
                    path: 'supplychain',
                    element: <Customers currentDepartment="Supply Chain"/>,
                },
                {
                    path: 'research_and_records',
                    element: <Customers currentDepartment="Research and Records"/>,
                },
                {
                    path: 'hansard',
                    element: <Customers currentDepartment="Hansard"/>,
                },
                {
                    path: 'ict',
                    element: <Customers currentDepartment="ICT"/>,
                },
                {
                    path: 'clerks_at_the_table',
                    element: <Customers currentDepartment="Clerks at the table"/>,
                },
                {
                    path: 'sergent_at_arms',
                    element: <Customers currentDepartment="Sergent at arms"/>,
                },
                {
                    path: 'reception',
                    element: <Customers currentDepartment="Reception"/>,
                }
            ]
        },
        {
            path: 'indexes',
            element: <></>
        },
        {
            path: 'approvals',
            element: <></>
        }
        ,{
            path: 'workflows',
            element: <></>
        },
        {
            path: 'cabinets',
            element: <></>
        },
        {
            path: 'dashboard',
            element: <DashboardDefault />
            // children: [
            //     {
            //         path: 'default',
            //         element: <DashboardDefault />
            //     }
            // ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'shadow',
            element: <Shadow />
        },
        {
            path: 'typography',
            element: <Typography />
        },
        {
            path: 'icons/ant',
            element: <AntIcons />
        }
    ]
};

export default MainRoutes;
