import { Box, Tab, Tabs } from '@mui/material';
import { a11yProps } from 'components/documents/views/UI/Tabs';
import { SyntheticEvent } from 'react';

export function FlowTabList({ tab, handleChangeTab }: { tab: number; handleChangeTab: (e: SyntheticEvent, tab: number) => void }) {
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChangeTab} aria-label="workflow tabs">
                    <Tab
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textTransform: 'capitalize'
                        }}
                        // icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                        label="Design Forms"
                        {...a11yProps(0)}
                    />
                    <Tab
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textTransform: 'capitalize'
                        }}
                        // icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                        label="Design Workflow"
                        {...a11yProps(1)}
                    />
                    <Tab
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textTransform: 'capitalize'
                        }}
                        // icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                        label="Initiate Workflow"
                        {...a11yProps(2)}
                    />
                </Tabs>
            </Box>
        </>
    );
}
