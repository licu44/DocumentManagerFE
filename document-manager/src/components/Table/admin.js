import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAuthHeader } from 'react-auth-kit';
import { UserContext } from '../../context';
import { useContext } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import Modal from '../Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const StyledTableCell = styled(TableCell)(({ theme }) => {
    return {
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
            fontWeight: 'bold',
            borderBottom: 'none',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 15,
        },
    };
});


const StyledTableRow = styled(TableRow)(({ theme }) => {
    return {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    };
});

export default function CustomizedTables() {
    const auth = useAuthHeader();

    const [ docs, setDocs ] = useState([]);
    const [ dropdownValues, setdropdownValues ] = useState();
    const [ isOpen, setIsOpen ] = useState(false);
    const [ user, setUser ] = useState(false);
    const [ documentOptions, setDocumentOptions ] = useState([]);
    const [ selectedId, setSelectedId ] = useState();


    const updateTableData = () => {
        axios.get('https://localhost:7227/api/admin/users', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': auth(),
            } })
            .then((response) => {
                setDocs(response.data);
            })
            .catch((error) => {
                return console.error('Error fetching users:', error);
            });
        axios.get('https://localhost:7227/api/Admin/types', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': auth(),
            } })
            .then((response) => {
                setDocumentOptions(response.data);
            })
            .catch((error) => {
                return console.error('Error fetching documents:', error);
            });
    };

    const getDropdownValues = () => {
        axios.get('https://localhost:7227/api/status/statuses', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': auth(),
            } })
            .then((response) => {
                setdropdownValues(response.data);
            })
            .catch((error) => {
                return console.error('Error fetching statuses:', error);
            });
    };

    const updateStatus = (userId, feedbackStatusId, authorizationStatusId, engineeringStatusId) => {
        axios.post(`https://localhost:7227/api/Admin/userstatus/${ userId}`, {
            feedbackStatusId: feedbackStatusId ? feedbackStatusId : 1,
            authorizationStatusId: authorizationStatusId ? authorizationStatusId : 1,
            engineeringStatusId: engineeringStatusId ? engineeringStatusId : 1
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth(),
            }
        })
            .then((response) => {
                console.log('Update successful', response);
                updateTableData();
            })
            .catch((error) => {
                console.error('Error updating status:', error);
            });
    };


    useEffect(() => {
        getDropdownValues();
        updateTableData();
    }, []);

    const handleClick = (row) => {
        const { id, userStatus } = row;
        const { feedbackId, authorizationId, engineeringId } = userStatus;
        updateStatus(id, feedbackId, authorizationId, engineeringId);
    };

    const handleClickDocs = (row) => {
        setUser(`${row.firstName } ${ row.lastName}`);
        setSelectedId(row.id);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };


    const handleSelectChange = (event, type, id) => {
        const value = event.target.value;
        setDocs(docs.map((doc) => {
            if (doc.id === id) {
                return {
                    ...doc,
                    userStatus: { ...doc.userStatus, [`${type}Id`]: value }
                };
            }
            return doc;
        }));
    };

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7227/api/Admin/types/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth(),
            }
        })
            .then((response) => {
                getDropdownValues();
                updateTableData();
                setIsOpen(false);
            })
            .catch((error) => {
                console.error('Error deleting entry:', error);
            });
    };

    const handleAdd = (event) => {
        if (event && event.target && event.target.files.length > 0) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            axios
                .post('https://localhost:7227/api/Admin/documents', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': auth(),
                    },
                })
                .then((response) => {
                    getDropdownValues();
                    updateTableData();
                })
                .catch((error) => {
                    console.error('Error uploading document:', error);
                });
        }
    };

    const [ selectedRestrictedValues, setSelectedRestrictedValues ] = useState({});

    const initialRestrictedValues = {};

    documentOptions.forEach((row) => {
        initialRestrictedValues[row.id] = row.restricted ? 'true' : 'false';
    });

    const handleRestrictedValueChange = (event, documentId) => {
        const value = event.target.value;
        setSelectedRestrictedValues((prevValues) => {
            return {
                ...prevValues,
                [documentId]: value,
            };
        });
    };

    const handleUpdateRestricted = (documentId) => {
        const value = selectedRestrictedValues[documentId];

        axios
            .put(`https://localhost:7227/api/Admin/generatedocs/${documentId}/restricted`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth(),
                },
            })
            .then((response) => {
                console.log('Restricted value updated');
            })
            .catch((error) => {
                console.error('Error updating restricted value:', error);
            });
    };


    return (
        <>
            {isOpen &&
            <Modal
                id={selectedId}
                onClose={handleClose}
                docName={user}
                documentOptions={documentOptions}
                updateTableData={updateTableData}
            />}
            {docs && documentOptions && dropdownValues &&
            <>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mt: 3, ml:3 }}>
                    Genrated Document Types:
                </Typography>
                <Box style={{ padding: '35px' }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell colSpan={5}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 0, mt: 2 }}>
                                            Add new:
                                            <label htmlFor="file-upload" style={{ display: 'inline-block' }}>
                                                <IconButton
                                                    aria-label="add"
                                                    color="primary"
                                                    fontSize="large"
                                                    component="span"
                                                >
                                                    <AddCircleIcon />
                                                </IconButton>
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                hidden
                                                onChange={handleAdd}
                                            />
                                        </Typography>

                                    </StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>ID</StyledTableCell>
                                    <StyledTableCell>Type</StyledTableCell>
                                    <StyledTableCell >Restricted</StyledTableCell>
                                    <StyledTableCell>Update</StyledTableCell>
                                    <StyledTableCell>Delete</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    documentOptions.map((row) => {
                                        return <StyledTableRow key={row.id}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.id}
                                            </StyledTableCell>
                                            <StyledTableCell>{row.type}</StyledTableCell>
                                            <StyledTableCell>
                                                {console.log(row.restricted, 'ROW')}
                                                <Select
                                                    value={
                                                        selectedRestrictedValues[row.id] !== undefined ?
                                                            selectedRestrictedValues[row.id] :
                                                            initialRestrictedValues[row.id]}
                                                    onChange={(event) => {
                                                        return handleRestrictedValueChange(event, row.id);
                                                    }}
                                                >
                                                    <MenuItem value="true">Yes</MenuItem>
                                                    <MenuItem value="false">No</MenuItem>
                                                </Select>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <IconButton
                                                    aria-label="save"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => {
                                                        return handleUpdateRestricted(row.id);
                                                    }}
                                                >
                                                    <SaveIcon fontSize="small" />
                                                </IconButton>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <IconButton
                                                    aria-label="delete"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => {
                                                        return handleDelete(row.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </StyledTableCell>
                                        </StyledTableRow>;
                                    }
                                    )
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mt: 3, ml:3 }}>
                    Update Status:
                </Typography>
                <Box style={{ padding: '35px' }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell colSpan={11}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 0, mt: 2 }}>
                                            Users
                                        </Typography>
                                    </StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>ID</StyledTableCell>
                                    <StyledTableCell>Username</StyledTableCell>
                                    <StyledTableCell >Email</StyledTableCell>
                                    <StyledTableCell align="right">First Name</StyledTableCell>
                                    <StyledTableCell align="right">Last Name</StyledTableCell>
                                    <StyledTableCell align="right">Phone Number</StyledTableCell>
                                    <StyledTableCell align="right">Documents</StyledTableCell>
                                    <StyledTableCell align="center">Feedback</StyledTableCell>
                                    <StyledTableCell align="center">Authorization</StyledTableCell>
                                    <StyledTableCell align="center">Engineering</StyledTableCell>
                                    <StyledTableCell align="right">Update</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {docs.map((row) => {
                                    return <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.id}
                                        </StyledTableCell>
                                        <StyledTableCell>{row.username}</StyledTableCell>
                                        <StyledTableCell>{row.email}</StyledTableCell>
                                        <StyledTableCell>{row.firstName}</StyledTableCell>
                                        <StyledTableCell>{row.lastName}</StyledTableCell>
                                        <StyledTableCell>{row.phoneNumber}</StyledTableCell>
                                        <StyledTableCell><IconButton
                                            aria-label="delete"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                handleClickDocs(row);
                                            }}
                                        >
                                            <FolderCopyIcon fontSize="small" />
                                        </IconButton></StyledTableCell>


                                        <StyledTableCell>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={row.userStatus.feedbackId || 1}
                                                    onChange={(event) => {
                                                        return handleSelectChange(event, 'feedback', row.id);
                                                    }}
                                                >
                                                    {dropdownValues.feedbackStatuses.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id}>
                                                            {item.status}
                                                        </MenuItem>;
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={row.userStatus.authorizationId || 1}
                                                    onChange={(event) => {
                                                        return handleSelectChange(event, 'authorization', row.id);
                                                    }}
                                                >
                                                    {dropdownValues.authorizationStatuses.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id}>
                                                            {item.status}
                                                        </MenuItem>;
                                                    }
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={row.userStatus.engineeringId || 1}
                                                    onChange={(event) => {
                                                        return handleSelectChange(event, 'engineering', row.id);
                                                    }}
                                                >
                                                    {dropdownValues.engineeringStatuses.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id}>
                                                            {item.status}
                                                        </MenuItem>;
                                                    }
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <IconButton
                                                aria-label="delete"
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    handleClick(row);
                                                }}
                                            >
                                                <SaveIcon fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>;
                                }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </>
            }
        </>
    );
}
