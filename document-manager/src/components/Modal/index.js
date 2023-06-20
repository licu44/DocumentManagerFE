import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useAuthHeader } from 'react-auth-kit';

export default function Index({ onClose }) {
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ showForm, setShowForm ] = useState(false);
    const [ formData, setFormData ] = useState({});
    const [ backendResponse, setBackendResponse ] = useState(null);
    const auth = useAuthHeader();

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prevData) => {
            return { ...prevData, [name]: value };
        });
    };

    const handleUpload = async ({ target: { files } }) => {
        const file = files[0];
        const data = new FormData();
        data.append('file', file);
        try {
            const response = await axios.post('https://localhost:7227/api/TextManagement/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth(),
                },
            });
            setBackendResponse(response.data);
            setShowForm(true);
            setSelectedFile(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Perform form submission logic here
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={style}>
                { !selectedFile &&
                    <>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Upload File:</Typography>
                        <Button variant="contained" component="label" sx={{ mt: 2 }}>
                            <CloudUploadIcon />
                            Upload
                            <input type="file" hidden onChange={handleUpload} />
                        </Button>
                    </>
                }
                { selectedFile && backendResponse && showForm &&
                    <>
                        <Typography id="modal-modal-title" variant="h6" component="h2">Form in a modal</Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>Please fill out the form fields:</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField name="fieldName1" label="Field Name 1" value={formData.fieldName1 || ''} onChange={handleChange} fullWidth margin="normal" />
                            <TextField name="fieldName2" label="Field Name 2" value={formData.fieldName2 || ''} onChange={handleChange} fullWidth margin="normal" />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
                        </form>
                    </>
                }
            </Box>
        </Modal>
    );
}
