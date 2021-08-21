import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MovieFilterIcon from '@material-ui/icons/LocalMoviesSharp';

import { auth } from '../firebase';

const useStyles = makeStyles((theme) => ({
	root: {
		background: '#0d253f',
		color: 'white',
	},
	typo: {
		marginLeft: theme.spacing(1),
	},
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		paddingRight: theme.spacing(4),
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	search: {
		paddingRight: theme.spacing(4),
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: alpha(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: alpha(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(4),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
}));

function Navbar(props) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
		});
	});

	const isMenuOpen = Boolean(anchorEl);
	// const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const handleSignOut = async (event) => {
		await auth.signOut();
		handleMenuClose();
		props.history.push('/');
	};

	const handleSignIn = async (event) => {
		handleMenuClose();
		props.history.push('/signin');
	};

	const handleKeyDown = (event) => {
		if (event.keyCode === 13) {
			props.history.push(`/search/${event.target.value}`);
		}
	};

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			{user ? (
				<MenuItem onClick={handleSignOut}>Sign out</MenuItem>
			) : (
				<MenuItem onClick={handleSignIn}>Sign in</MenuItem>
			)}
		</Menu>
	);

	// const mobileMenuId = 'primary-search-account-menu-mobile';
	// const renderMobileMenu = (
	// 	<Menu
	// 		anchorEl={mobileMoreAnchorEl}
	// 		anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
	// 		id={mobileMenuId}
	// 		keepMounted
	// 		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
	// 		open={isMobileMenuOpen}
	// 		onClose={handleMobileMenuClose}
	// 	>
	// 		<MenuItem>
	// 			<IconButton aria-label="show 4 new mails" color="inherit">
	// 				<Badge badgeContent={4} color="secondary">
	// 					<MailIcon />
	// 				</Badge>
	// 			</IconButton>
	// 			<p>Messages</p>
	// 		</MenuItem>
	// 		<MenuItem>
	// 			<IconButton aria-label="show 11 new notifications" color="inherit">
	// 				<Badge badgeContent={11} color="secondary">
	// 					<NotificationsIcon />
	// 				</Badge>
	// 			</IconButton>
	// 			<p>Notifications</p>
	// 		</MenuItem>
	// 		<MenuItem onClick={handleProfileMenuOpen}>
	// 			<IconButton
	// 				aria-label="account of current user"
	// 				aria-controls="primary-search-account-menu"
	// 				aria-haspopup="true"
	// 				color="inherit"
	// 			>
	// 				<AccountCircle />
	// 			</IconButton>
	// 			<p>Profile</p>
	// 		</MenuItem>
	// 	</Menu>
	// );

	return (
		<div className={classes.grow}>
			<AppBar position="static" className={classes.root}>
				<Toolbar>
					{/* <img
						src={reel}
						style={{ width: '70px', height: '70px', color: 'white' }}
					/> */}
					{/* <Typography className={classes.title} variant="h6" noWrap>
						Movies
					</Typography> */}

					<div className={classes.sectionDesktop}>
						<MovieFilterIcon fontSize="large" />
						<Typography className={classes.typo} variant="h6" noWrap>
							<Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
								AgileDb
							</Link>
						</Typography>
					</div>
					<div className={classes.grow} />
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'search' }}
							onKeyDown={handleKeyDown}
						/>
					</div>
					<IconButton
						edge="end"
						aria-label="account of current user"
						aria-controls={menuId}
						aria-haspopup="true"
						onClick={handleProfileMenuOpen}
						color="inherit"
					>
						<AccountCircle />
					</IconButton>
					{user ? (
						<Typography className={classes.typo} variant="body2" noWrap>
							{user.email}
						</Typography>
					) : (
						<></>
					)}
					{/* <div className={classes.sectionMobile}>
						<IconButton
							aria-label="show more"
							aria-controls={mobileMenuId}
							aria-haspopup="true"
							onClick={handleMobileMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</div> */}
				</Toolbar>
			</AppBar>
			{/* {renderMobileMenu} */}
			{renderMenu}
		</div>
	);
}

export default withRouter(Navbar);
