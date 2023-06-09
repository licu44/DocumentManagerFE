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
import Modal from '../Modal';
import Button from '@mui/material/Button';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import { UserContext } from '../../context';
import { useContext } from 'react';
import Tooltip from '@mui/material/Tooltip';
import GenerateTable from './generate';
import { useAuthDataContext } from '../../context';


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
const StatusTableCell = styled(TableCell)(({ status }) => {
    switch(status) {
    case 'VERIFIED':
        return { color: 'green', fontWeight: 'bold' };
    case 'UPLOADED':
        return { color: 'orange', fontWeight: 'bold' };
    case null:
    case '':
        return { color: 'red', fontWeight: 'bold' };
    default:
        return {};
    }
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

    const userId = useAuthDataContext();


    const [ docs, setDocs ] = useState([]);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ selectedId, setSelectedId ] = useState('');
    const [ selectedStatus, setSelectedStatus ] = useState('');
    const [ selectedDocName, setSelectedDocName ] = useState('');
    const [ generatedDocs, setGeneratedDocs ] = useState(false);
    const [ showButton, setShowButton ] = useState(false);
    const [ refreshTable, setRefreshTable ] = useState();

    console.log(showButton, 'showButton');

    const updateTableData = () => {
        axios.get(`https://localhost:7227/api/TextManagement/${userId}/documents`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': auth(),
            } })
            .then((response) => {
                setDocs(response.data);
                setGeneratedDocs(response.data.some((item) => {
                    return item.status === null;
                }));
            })
            .catch((error) => {
                return console.error('Error fetching documents:', error);
            });
    };

    const handleGenerate = async (id) => {
        try {
            await axios.get(`https://localhost:7227/api/TextManagement/${userId}/generate`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': auth(),
                    },
                });
            setRefreshTable(true);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        updateTableData();
    }, []);

    const handleClick = (id, status, docName) => {
        setIsOpen(true);
        setSelectedId(id);
        setSelectedStatus(status);
        setSelectedDocName(docName);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedId('');
    };

    return (
        <>
            {isOpen &&
            <Modal
                id={selectedId}
                onClose={handleClose}
                status={selectedStatus}
                docName={selectedDocName}
                updateTableData={updateTableData}
            />}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mt: 3, ml:3 }}>
                    Upload documents:
            </Typography>
            <Box style={{ padding: '35px' }}>
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell colSpan={6}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 0, mt: 2 }}>
                                        Necessary Documents
                                    </Typography>
                                </StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell>Type</StyledTableCell>
                                <StyledTableCell align="right">Upload Date</StyledTableCell>
                                <StyledTableCell align="right">Status</StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {docs.map((row) => {
                                return <StyledTableRow key={row.docId}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.docId}
                                    </StyledTableCell>
                                    <StyledTableCell>{row.docName}</StyledTableCell>
                                    <StyledTableCell align="right">{row.creationDate}</StyledTableCell>
                                    <StatusTableCell align="right" status={row.status}>
                                        {row.status ? row.status : 'NOT UPLOADED'}
                                    </StatusTableCell>
                                    <StyledTableCell align="right">
                                        <IconButton
                                            aria-label="delete"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                handleClick(row.docId, row.status, row.docName);
                                            }}
                                        >
                                            <OpenInNewIcon fontSize="small" />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>;
                            }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Tooltip title={generatedDocs ? 'Upload all the necessary documents' : ''}>
                <span>
                    <Box
                        sx={{
                            opacity: !generatedDocs ? 1 : 0.5
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                            }}
                        >

                            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', ml:3 }}>
                    Generate documents:
                            </Typography>
                            {showButton &&
                            <Tooltip title={generatedDocs ? 'Documents had been allready generated' : ''}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ fontWeight: 'bold', ml:3 }}
                                    disabled={generatedDocs}
                                    onClick={handleGenerate}
                                >
                                    GENERATE
                                </Button>
                            </Tooltip>
                            }
                        </Box>
                        <GenerateTable setShowButton={setShowButton} refreshTable={refreshTable}/>
                    </Box>
                </span>
            </Tooltip>


        </>
    );
}
