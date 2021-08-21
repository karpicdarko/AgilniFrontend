import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { auth, usersCollection } from '../firebase';
import { withRouter } from 'react-router';
import { OpenInBrowserRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: '#0d253f',
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		backgroundColor: '#0d253f',
	},
}));

function SignUp(props) {
	const classes = useStyles();
	const [errorMessage, setErrorMessage] = useState('');
	const [open, setOpen] = useState(false);
	const [vertical] = useState('top');
	const [horizontal] = useState('center');

	const register = async (event) => {
		event.preventDefault();
		await auth
			.createUserWithEmailAndPassword(
				event.target.email.value,
				event.target.password.value
			)
			.then(() => {
				async function onAuth() {
					await auth.signOut();
					await usersCollection.add({
						name: event.target.firstName.value,
						lastName: event.target.lastName.value,
						email: event.target.email.value,
						password: event.target.password.value,
					});
					props.history.push('/signin');
				}
				onAuth();
			})
			.catch((err) => {
				setErrorMessage(err.message);
				setOpen(true);
			});
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<form className={classes.form} onSubmit={register}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="fname"
								name="firstName"
								variant="outlined"
								required
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="lname"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/signin" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				onClose={() => setOpen(false)}
				key={vertical + horizontal}
				autoHideDuration={5000}
			>
				<Alert onClose={() => setOpen(false)} severity="error">
					{errorMessage}
				</Alert>
			</Snackbar>
		</Container>
	);
}

export default withRouter(SignUp);
