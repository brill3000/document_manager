import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase, Typography } from '@mui/material';

// project import
import Logo from './Logo';
import config from 'config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to, nologo, title }) => (
    <ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
        {!nologo && <Logo />}
        {/* <Typography variant="h4" color={(theme) => theme.palette.text.primary} ml={2}>
            {title ?? 'E-County'}
        </Typography> */}
    </ButtonBase>
);

LogoSection.propTypes = {
    sx: PropTypes.object,
    to: PropTypes.string
};

export default LogoSection;
