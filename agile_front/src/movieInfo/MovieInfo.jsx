import React, { Component } from 'react';
import './movieInfo.css';
import imdbLogo from '../assets/imdbLogo.svg';

import { moviesCollection, actorsCollection, auth } from '../firebase';
import { withRouter } from 'react-router-dom';

import Moment from 'react-moment';
import NumberFormat from 'react-number-format';

import { Formik, Form } from 'formik';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	AppBar,
	Toolbar,
	Slide,
	Card,
	CardMedia,
	CardContent,
	TextField,
	IconButton,
	Typography,
	Grid,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import Create from '@material-ui/icons/Create';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	card: {
		padding: '0px',
		margin: '0px',
		width: '100%',
		height: '100%',
	},
	content: {
		paddingBottom: '100px',
	},

	media: {
		// height: '100%',
		// width: '100%',
	},
	appBar: {
		position: 'relative',
		color: 'white',
		backgroundColor: '#0d253f',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
});
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
class MovieInfo extends Component {
	state = {
		movie: {},
		actors: [],
		open: false,
		upOpen: false,
		movieUpdate: {
			title: '',
			release_date: '',
			runtime: '',
			tagline: '',
			overview: '',
			status: '',
			original_language: '',
			budget: '',
			revenue: '',
		},
		user: null,
		loaded: false,
	};

	async componentDidMount() {
		const ids = this.props.match.params.id;
		await moviesCollection
			.doc(ids)
			.get()
			.then((doc) => {
				if (doc.exists) {
					this.setState({
						movie: doc.data(),
						movieUpdate: {
							title: doc.data().title,
							release_date: doc.data().release_date,
							runtime: doc.data().runtime,
							tagline: doc.data().tagline,
							overview: doc.data().overview,
							status: doc.data().status,
							original_language: doc.data().original_language,
							budget: doc.data().budget,
							revenue: doc.data().revenue,
						},
					});
				} else {
					console.log('No such document!');
				}
			});
		const { movie } = this.state;
		var acts = [];
		for await (var act of movie.cast) {
			var id = act.id.replace(/ /g, '');
			await actorsCollection
				.doc(id)
				.get()
				.then((doc) => {
					acts.push(doc.data());
				});
		}
		this.setState({ actors: acts });
		await auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ user: user });
			} else {
				this.setState({ user: null });
			}
		});
		this.setState({ loaded: true });
	}

	runtimeFormatter = (runtime) => {
		if (runtime > 60) {
			const hours = Math.floor(runtime / 60);
			return hours + 'h ' + (runtime - hours * 60) + 'min';
		} else if (runtime === 60) {
			return '1h';
		} else {
			return runtime + 'min';
		}
	};

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleUpdateClickOpen = () => {
		this.setState({ upOpen: true });
	};

	handleUpdateClose = () => {
		this.setState({ upOpen: false });
	};

	handleMovieDelete = async (id) => {
		await moviesCollection
			.doc(id)
			.delete()
			.then(() => {
				console.log('Document successfully deleted!');
			});
		this.setState({ open: false });
		this.props.history.push('/');
	};

	handleChangeTitle = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: { ...prevState.movieUpdate, title: event.target.value },
		}));
		console.log('Change is made title ' + this.state.movieUpdate.title);
	};
	handleChangeDate = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: {
				...prevState.movieUpdate,
				release_date: event.target.value,
			},
		}));
		console.log('Change is made  date ' + this.state.movieUpdate.release_date);
	};
	handleChangeBudget = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: { ...prevState.movieUpdate, budget: event.target.value },
		}));
		console.log('Change is made  budget ' + this.state.movieUpdate.budget);
	};
	handleChangeLanguage = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: {
				...prevState.movieUpdate,
				original_language: event.target.value,
			},
		}));
		console.log(
			'Change is made language ' + this.state.movieUpdate.original_language
		);
	};
	handleChangeRevenue = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: { ...prevState.movieUpdate, revenue: event.target.value },
		}));
		console.log('Change is made revenue ' + this.state.movieUpdate.revenue);
	};
	handleChangeRuntime = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: {
				...prevState.movieUpdate,
				runtime: event.target.value,
			},
		}));
		console.log('Change is made runtime ' + this.state.movieUpdate.runtime);
	};
	handleChangeStatus = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: { ...prevState.movieUpdate, status: event.target.value },
		}));
		console.log('Change is made status ' + this.state.movieUpdate.status);
	};
	handleChangeTagline = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: { ...prevState.movieUpdate, tagline: event.target.value },
		}));
		console.log('Change is made tagline ' + this.state.movieUpdate.tagline);
	};
	handleChangeOverview = async (event) => {
		await this.setState((prevState) => ({
			movieUpdate: { ...prevState.movieUpdate, overview: event.target.value },
		}));
		console.log('Change is made overview ' + this.state.movieUpdate.overview);
	};

	saveUpdate = async () => {
		console.log('Update initiated =>' + JSON.stringify(this.state.movieUpdate));
		await moviesCollection
			.doc(this.props.match.params.id)
			.update(this.state.movieUpdate);
		window.location.reload();
	};

	render() {
		const { classes } = this.props;
		const { movie, actors, open, upOpen, user, loaded, movieUpdate } =
			this.state;
		const runtime = this.runtimeFormatter(movie.runtime);
		const movieProps = [
			{
				tag: 'Title',
				value: movie.title,
				onChange: this.handleChangeTitle,
				type: 'text',
			},
			{
				tag: 'Tagline',
				value: movie.tagline,
				onChange: this.handleChangeTagline,
			},
			{
				tag: 'Status',
				value: movie.status,
				onChange: this.handleChangeStatus,
				type: 'text',
			},
			{
				tag: 'Release date',
				value: movie.release_date,
				onChange: this.handleChangeDate,
				type: 'date',
			},
			{
				tag: 'Runtime',
				value: movie.runtime,
				onChange: this.handleChangeRuntime,
				type: 'text',
			},
			{
				tag: 'Original language',
				value: movie.original_language,
				onChange: this.handleChangeLanguage,
				type: 'text',
			},
			{
				tag: 'Budget',
				value: movie.budget,
				onChange: this.handleChangeBudget,
				type: 'text',
			},
			{
				tag: 'Revenue',
				value: movie.revenue,
				onChange: this.handleChangeRevenue,
				type: 'text',
			},
		];
		return (
			loaded && (
				<div>
					<div
						className="infoBox"
						style={{
							backgroundImage:
								'linear-gradient(rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.92)),url(' +
								movie.back_drop +
								')',
						}}
					>
						<div className="boxLeft">
							<div
								className="pictureBox"
								style={{ content: 'url(' + movie.poster_src + ')' }}
							></div>
						</div>
						<div className="boxRight">
							<div className="infoText">
								<div className="title">
									<h1>
										<p id="name">{movie.title}</p>

										<p id="year">
											(<Moment format="YYYY">{movie.release_date}</Moment>)
										</p>
									</h1>
									<div className="facts">
										<div className="date">
											<Moment format="DD/MM/YYYY">{movie.release_date}</Moment>
										</div>
										<div className="dotContainer">
											<span className="dot"></span>
										</div>
										<div className="genre">
											{movie.genres &&
												movie.genres.map((gen) => <p key={gen}>{gen}</p>)}
										</div>
										<div className="dotContainer">
											<span className="dot"></span>
										</div>
										<div className="runtime">{runtime}</div>
									</div>
								</div>
								<div className="rating">
									<div className="badge">
										<img src={imdbLogo} alt="imdbLogo" />
									</div>
									<div className="rate">{movie.vote_average}</div>
								</div>
								<div className="overview">
									<div className="tagline">{movie.tagline}</div>
									<div className="overviewText">
										<h2>Overview</h2>
										<p>{movie.overview}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="bottomInfo">
						<div className="leftInfo">
							<div className="castTitle">Top billed cast</div>
							<div className="castCards">
								{actors.map((actor) => (
									<div key={actor.pic_src} className="card">
										<Card className={classes.card}>
											<CardMedia
												component="img"
												className={classes.media}
												image={actor.pic_src}
												title="Gardians"
											/>
											<CardContent className={classes.content}>
												<div className="actName">
													{actor.name} {actor.surname}
												</div>
											</CardContent>
										</Card>
									</div>
								))}
							</div>
						</div>
						<div className="rightInfo">
							<div className="rightInfoLi">
								<div className="liTitle">Status</div>
								<div className="liContent">{movie.status}</div>
							</div>

							<div className="rightInfoLi">
								<div className="liTitle">Original Language</div>
								<div className="liContent">{movie.original_language}</div>
							</div>

							<div className="rightInfoLi">
								<div className="liTitle">Budget</div>
								<div className="liContent">
									<NumberFormat
										value={movie.budget}
										displayType={'text'}
										thousandSeparator={true}
										prefix={'$'}
									/>
								</div>
							</div>

							<div className="rightInfoLi">
								<div className="liTitle">Revenue</div>
								<div className="liContent">
									<NumberFormat
										value={movie.revenue}
										displayType={'text'}
										thousandSeparator={true}
										prefix={'$'}
									/>
								</div>
							</div>
							<div className="rightInfoLi">
								<hr />
								{user ? (
									<div className="liContent">
										<IconButton
											aria-label="Delete"
											aria-haspopup="false"
											onClick={this.handleClickOpen}
											color="inherit"
										>
											<Delete fontSize="large" />
										</IconButton>
										<IconButton
											aria-label="Update"
											aria-haspopup="false"
											onClick={this.handleUpdateClickOpen}
											color="inherit"
										>
											<Create fontSize="large" />
										</IconButton>
									</div>
								) : (
									<></>
								)}
							</div>
						</div>
					</div>
					<Dialog
						open={open}
						onClose={this.handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							Brisanje filma {movie.title}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								Da li ste sigurni da želite da obrišete film {movie.title}?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleClose} color="primary">
								Ne
							</Button>
							<Button
								onClick={() =>
									this.handleMovieDelete(this.props.match.params.id)
								}
								color="primary"
								autoFocus
							>
								Da
							</Button>
						</DialogActions>
					</Dialog>
					<Dialog
						fullScreen
						open={upOpen}
						onClose={this.handleUpdateClose}
						TransitionComponent={Transition}
					>
						<Formik
							initialValues={{ ...movieUpdate }}
							onSubmit={this.saveUpdate}
						>
							<Form>
								<AppBar className={classes.appBar}>
									<Toolbar>
										<IconButton
											edge="start"
											color="inherit"
											onClick={this.handleUpdateClose}
											aria-label="close"
										>
											<CloseIcon />
										</IconButton>
										<Typography variant="h6" className={classes.title}>
											{movie.title}
										</Typography>
										<Button autoFocus color="inherit" type="submit">
											save
										</Button>
									</Toolbar>
								</AppBar>
								<div className="update">
									<div className="updateLeft">
										<div
											className="updatePictureBox"
											style={{ content: 'url(' + movie.poster_src + ')' }}
										></div>
									</div>
									<div className="updateRight">
										<Grid container spacing={1}>
											{movieProps.map((prop) => (
												<Grid item xs={3} key={prop.tag}>
													<div className="updateField">
														<TextField
															required
															type={prop.type}
															className="standard-required"
															label={prop.tag}
															defaultValue={prop.value}
															onChange={prop.onChange}
														/>
													</div>
												</Grid>
											))}
											<Grid item xs={12}>
												<div className="updateFieldOverview">
													<TextField
														label="Overview"
														required
														multiline
														minRows={1}
														maxRows={10}
														fullWidth
														defaultValue={movie.overview}
														onChange={this.handleChangeOverview}
													/>
												</div>
											</Grid>
										</Grid>
									</div>
								</div>
							</Form>
						</Formik>
					</Dialog>
				</div>
			)
		);
	}
}

export default withRouter(withStyles(styles)(MovieInfo));
