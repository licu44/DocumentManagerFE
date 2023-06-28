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
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Modal from '../Modal';
import Button from '@mui/material/Button';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import { UserContext } from '../../context';
import { useContext } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { saveAs } from 'file-saver';
import IconButton from '@mui/material/IconButton';
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

export default function CustomizedTables({ setShowButton, refreshTable }) {
    const auth = useAuthHeader();
    const authData = useAuthUser();

    const userId = useAuthDataContext();


    const [ docs, setDocs ] = useState([]);

    const updateTableData = () => {
        axios.get(`https://localhost:7227/api/TextManagement/${userId}/documents/generated`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': auth(),
            } })
            .then((response) => {
                setDocs(response.data);
                setShowButton(response.data.some((item) => {
                    return item.creationDate === null;
                }));
            })
            .catch((error) => {
                return console.error('Error fetching documents:', error);
            });
    };


    useEffect(() => {
        updateTableData();
    }, [ refreshTable ]);

    const handleClick = async (docName) => {
        try {
            const response = await axios.get(`https://localhost:7227/api/TextManagement/${userId}/${docName}/download`,
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
            saveAs(blob, `${docName}-${userId}.docx`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Box style={{ padding: '35px' }}>
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell colSpan={6}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 0, mt: 2 }}>
                                        Generated Docs
                                    </Typography>
                                </StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell >Creation Date</StyledTableCell>
                                <StyledTableCell align="center">Download</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {docs.map((row) => {
                                return <StyledTableRow key={row.docId}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.docId}
                                    </StyledTableCell>
                                    <StyledTableCell>{row.docName}</StyledTableCell>
                                    <StyledTableCell >{row.creationDate}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton
                                            aria-label="delete"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                handleClick(row.docName);
                                            }}
                                        >
                                            <DownloadIcon fontSize="small" />
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
    );
}
