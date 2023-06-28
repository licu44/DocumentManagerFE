import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';


const ColorlibConnector = styled(StepConnector)(({ theme }) => {
    return {
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                'linear-gradient( 95deg,rgb(207 251 255) 0%,rgb(64 171 233) 50%,rgb(0 67 255) 100%)',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
        'linear-gradient( 95deg,rgb(207 251 255) 0%,rgb(64 171 233) 50%,rgb(0 67 255) 100%)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
            borderRadius: 1,
        },
    };
});

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => {
    return {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...ownerState.active && {
            backgroundColor: '#1976d2'

        },
        ...ownerState.completed && {
            backgroundColor: '#1976d2'
        },
    };
});

export default function CustomizedSteppers({ data, active, icons }) {
    return (
        <Stack sx={{ width: '100%' }} spacing={4}>
            <Stepper alternativeLabel activeStep={active} connector={<ColorlibConnector />}>
                {data.map((item, index) => {
                    return <Step key={item.id}>
                        <StepLabel
                            StepIconComponent={ColorlibStepIcon}
                            StepIconProps={{
                                icon: index + 1,
                                icons: icons,
                            }}
                        >
                            {item.status}
                        </StepLabel>
                    </Step>;
                })}
            </Stepper>
        </Stack>
    );
}

function ColorlibStepIcon(props) {
    const { active, completed, className, icon, icons } = props;

    return (
        <ColorlibStepIconRoot ownerState={{ completed: completed, active: active }} className={className}>
            {icons[String(icon)]}
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
    icon: PropTypes.node,
    icons: PropTypes.object, // new propType for icons
};

