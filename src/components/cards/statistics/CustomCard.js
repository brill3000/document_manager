import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const CustomCard = ({ color, title, count, percentage, isLoss, icon }) => (
    <MainCard contentSX={{ p: 2.25 }}>
        <Stack direction="row" spacing={1} justifyContent="space-between">
            {icon}
            <Stack spacing={0.5} alignItems="flex-end">
                <Typography variant="h6" color="textSecondary">
                    {title}
                </Typography>
                {count && (
                    <Chip
                        variant="combined"
                        color={color}
                        icon={
                            <>
                                {count > 2 && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                {count <= 2 && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                            </>
                        }
                        label={`${count}`}
                        sx={{ pl: 1 }}
                        size="small"
                    />
                )}
            </Stack>
        </Stack>
        <Box sx={{ pt: 2.25 }}>
            <Grid container justifyContent="space-between">
                <Grid item>
                    <Typography variant="caption" color="textSecondary">
                        View Details
                    </Typography>
                </Grid>
                <Grid item>
                    <OpenInNewIcon color="primary" sx={{ fontSize: '1.1rem', mt: .5 }}/>
                </Grid>
            </Grid>
        </Box>
    </MainCard>
);

CustomCard.propTypes = {
    color: PropTypes.string,
    icon: PropTypes.node.isRequired,
    title: PropTypes.string,
    count: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

CustomCard.defaultProps = {
    color: 'primary'
};

export default CustomCard;
