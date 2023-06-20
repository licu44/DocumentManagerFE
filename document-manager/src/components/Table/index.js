import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Modal from '../Modal';

const StyledTableCell = styled(TableCell)(({ theme }) => {
    return {
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
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

function createData(name, calories, fat, carbs, protein) {
    return { name: name, calories: calories, fat: fat, carbs: carbs, protein: protein };
}

const rows = [
    createData('Carte de inentitate', 159, 6.0, 24, 4.0),
    createData('Certificat de urbanism', 237, 9.0, 37, 4.3),
    createData('Extras C.F.', 262, 16.0, 24, 6.0),
    createData('Extras Plan Cadastral', 305, 3.7, 67, 4.3),
];

export default function CustomizedTables() {
    const [ isOpen, setIsOpen ] = useState(false);

    const handleClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && <Modal onClose={handleClose} />}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                paddingTop="90px"
            >
                <Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 900 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>ID</StyledTableCell>
                                    <StyledTableCell>Type</StyledTableCell>
                                    <StyledTableCell align="right">Name</StyledTableCell>
                                    <StyledTableCell align="right">Upload Date</StyledTableCell>
                                    <StyledTableCell align="right">Status</StyledTableCell>
                                    <StyledTableCell align="right"></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => {
                                    return <StyledTableRow key={row.name}>
                                        <StyledTableCell component="th" scope="row">
                      5555
                                        </StyledTableCell>
                                        <StyledTableCell>{row.name}</StyledTableCell>
                                        <StyledTableCell align="right">{row.calories}</StyledTableCell>
                                        <StyledTableCell align="right">{row.fat}</StyledTableCell>
                                        <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <IconButton
                                                aria-label="delete"
                                                color="primary"
                                                size="small"
                                                onClick={handleClick}
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
            </Box>
        </>
    );
}
