import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stepper from '../../components/Stepper';
import axios from 'axios';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import { UserContext } from '../../context';
import { useContext } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PostAddIcon from '@mui/icons-material/PostAdd';
import GenerateDocuments from '@mui/icons-material/HomeWork';
import Authorization from '@mui/icons-material/Gavel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Completed from '@mui/icons-material/CheckCircle';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import Electrical from '@mui/icons-material/Bolt';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import Thermal from '@mui/icons-material/DeviceThermostat';
import FenceIcon from '@mui/icons-material/Fence';
import ConstructionIcon from '@mui/icons-material/Construction';
import PlanReview from '@mui/icons-material/SquareFoot';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import CabinIcon from '@mui/icons-material/Cabin';
import { useAuthDataContext } from '../../context';


const Index = () => {
    const auth = useAuthHeader();

    const userId = useAuthDataContext();

    const [ statusData, setStatusData ] = useState();

    const iconsFeedback = {
        1: <SpeakerNotesIcon />,
        2: <PlanReview />,
        3: <CabinIcon />,
        4: <Completed />,
    };
    const iconsAuthorization = {
        1: <CloudUploadIcon />,
        2: <PostAddIcon />,
        3: <LocationCityIcon />,
        4: <DomainVerificationIcon />,
        5: <Authorization />,
        6: <Completed />,
    };

    const iconsEngineering = {
        1: <ArchitectureIcon />,
        2: <EngineeringIcon />,
        3: <Electrical />,
        4: <PlumbingIcon />,
        5: <Thermal />,
        6: <FenceIcon />,
        7: <ConstructionIcon />,
        8: <Completed />,
    };


    useEffect(() => {
        axios.get(`https://localhost:7227/api/Status/userstatus/${userId}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': auth(),
            }
        })
            .then((response) => {
                setStatusData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching documents:', error);
            });
    }, []);

    return (
        <>
            {statusData &&
            <Box
                component="main"
                sx={{
                    p: 3,
                }}
            >
                <Toolbar />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mt: 3, ml:6, mb: 6 }}>
                    1. Feedback
                </Typography>
                <Stepper
                    data={statusData.feedbackStatuses}
                    active={statusData.userStatus.feddbackId - 1}
                    icons={iconsFeedback}

                />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mt: 3, ml:6, mb: 6 }}>
                    2. Authorization
                </Typography>
                <Stepper
                    data={statusData.authorizationStatuses}
                    active={statusData.userStatus.authorizationId - 1}
                    icons={iconsAuthorization}

                />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mt: 3, ml:6, mb: 6 }}>
                    3. Engineering
                </Typography>
                <Stepper
                    data={statusData.engineeringStatuses}
                    active={statusData.userStatus.engineeringId - 1}
                    icons={iconsEngineering}
                />

            </Box>
            }
        </>
    );
};

export default Index;
