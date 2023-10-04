import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import { UserContext } from '../../context';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useAuthDataContext } from '../../context';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';


export default function Index({ onClose, id, status, docName, updateTableData, documentOptions }) {
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ showForm, setShowForm ] = useState(false);
    const [ formData, setFormData ] = useState({});
    const [ backendResponse, setBackendResponse ] = useState(null);
    const [ selectedDoc, setSelectedDoc ] = useState(null);

    const auth = useAuthHeader();

    const userId = useAuthDataContext();


    useEffect(() => {
        if(status) {
            axios.get(`https://localhost:7227/api/TextManagement/documentFields/${userId}/${id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth(),
                } })
                .then((response) => {
                    setBackendResponse(response.data);
                    setFormData(response.data);
                    setShowForm(true);
                    setSelectedFile(true);
                })
                .catch((error) => {
                    return console.error('Error fetching documents:', error);
                });
        }
    }, [ status ]);


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
            const response = await
            axios.post(`https://localhost:7227/api/TextManagement/processFile/?userId=${userId}&documentType=${id}`,
                data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': auth(),
                    },
                });
            setBackendResponse(response.data);
            setFormData(response.data);
            setShowForm(true);
            setSelectedFile(true);
            updateTableData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`https://localhost:7227/api/TextManagement/update/${userId}/${id}`,
                formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': auth(),
                    },
                });
            updateTableData();
        } catch (error) {
            console.error(error);
        }
        onClose();
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/TextManagement/${id}/${selectedDoc}/download`,
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': auth(),
                    },
                }
            );

            const blob = new Blob(
                [ response.data ],
                {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });
            saveAs(blob, `${selectedDoc} - ${docName}.docx`);
        } catch (error) {
            console.error(error);
        }
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
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {docName}
                </Typography>
                {documentOptions &&
                <>
                    <Typography
                        id="modal-modal-description"
                        variant="h6"
                        sx={{ mt: 2 }}
                    >
                        Please select the document:
                    </Typography>
                    <Select
                        sx={{ mt: 2, width:'100%' }}

                        value={documentOptions.type}
                        onChange={(event) => {
                            setSelectedDoc(event.target.value);
                        }}
                    >
                        {documentOptions.map((item) => {
                            return <MenuItem key={item.id} value={item.type}>
                                {item.type}
                            </MenuItem>;
                        }
                        )}
                    </Select>
                </>
                }
                { !selectedFile && !status &&
                    <>
                        { !documentOptions ?
                            <Button variant="contained" component="label" sx={{ mt: 2, display: 'flex' }}>
                                <CloudUploadIcon />
                            Upload
                                <input type="file" hidden onChange={handleUpload} />
                            </Button> :
                            <Button variant="contained" component="label" sx={{ mt: 2, display: 'flex' }} onClick={handleDownload}>
                                <DownloadIcon />
                            Download
                            </Button>}
                    </>
                }
                { selectedFile && backendResponse && showForm &&
                    <>
                        <Typography
                            id="modal-modal-description"
                            variant="h6"
                            sx={{ mt: 2 }}
                        >
                        Please check the form fields:
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            {Object.entries(backendResponse).map(([ key, value ]) => {
                                { console.log(formData[key], value, 'test'); }
                                return <TextField
                                    key={key}
                                    name={key}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={formData[key] }
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />;
                            }
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, width: '100%' }}
                            >
                            Submit
                            </Button>
                        </form>
                    </>
                }
            </Box>
        </Modal>
    );
}
