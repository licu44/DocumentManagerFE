import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function SignUp(props) {
    const [ formValues, setFormValues ] = React.useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [ formErrors, setFormErrors ] = React.useState({});
    const [ showSnackbar, setShowSnackbar ] = React.useState(false);
    const [ snackbarMessage, setSnackbarMessage ] = React.useState('');
    const [ severity, setServerity ] = React.useState('error');

    const handleSnackbarClose = () => {
        setShowSnackbar(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validateForm()) {
            const userData = {
                id: 0,
                username: formValues.username,
                password: formValues.password,
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                email: formValues.email,
                phoneNumber: formValues.phone,
                role: '',
            };

            axios
                .post('https://localhost:7227/api/Auth/register', userData)
                .then((response) => {
                    console.log(response);
                    setSnackbarMessage('Registration successful!');
                    setShowSnackbar(true);
                    setServerity('success');
                    props.setRegister(false);
                })
                .catch((error) => {
                    console.error(error);
                    setSnackbarMessage('Registration failed. Please try again.');
                    setShowSnackbar(true);
                    setServerity('error');
                });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => {
            return {
                ...prevValues,
                [name]: value,
            };
        });
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (formValues.firstName.trim() === '') {
            errors.firstName = true;
            isValid = false;
        }

        if (formValues.lastName.trim() === '') {
            errors.lastName = true;
            isValid = false;
        }

        if (formValues.username.trim() === '') {
            errors.username = true;
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formValues.email.trim() === '' || !emailRegex.test(formValues.email)) {
            errors.email = true;
            isValid = false;
        }

        if (formValues.phone.trim() === '') {
            errors.phone = true;
            isValid = false;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (formValues.password.trim() === '' || !passwordRegex.test(formValues.password)) {
            errors.password = true;
            isValid = false;
        }

        if (formValues.confirmPassword.trim() === '') {
            errors.confirmPassword = true;
            isValid = false;
        } else if (formValues.password !== formValues.confirmPassword) {
            errors.confirmPassword = true;
            isValid = false;
        }
        setSnackbarMessage('Correct the errors!');

        setFormErrors(errors);
        setShowSnackbar(!isValid);
        console.log(formErrors);

        return isValid;
    };

    const handleLogin = () => {
        props.setRegister(false);
    };

    return (
        <>
            <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>


            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
          Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={formValues.firstName}
                                onChange={handleInputChange}
                                error={formErrors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={formValues.lastName}
                                onChange={handleInputChange}
                                error={formErrors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={formValues.username}
                                onChange={handleInputChange}
                                error={formErrors.username}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formValues.email}
                                onChange={handleInputChange}
                                error={formErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="phone"
                                label="Phone Number"
                                type="number"
                                name="phone"
                                autoComplete="phone"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+40</InputAdornment>,
                                }}
                                value={formValues.phone}
                                onChange={handleInputChange}
                                error={formErrors.phone}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formValues.password}
                                onChange={handleInputChange}
                                error={formErrors.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formValues.confirmPassword}
                                onChange={handleInputChange}
                                error={formErrors.confirmPassword}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link onClick={handleLogin}>
                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}
