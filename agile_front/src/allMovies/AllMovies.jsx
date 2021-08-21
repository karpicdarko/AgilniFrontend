import React, { Component } from 'react';
import './allMovies.css';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Paginate from '../pagination/Pagination';
import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
import TxtField from '../UIComponents/TxtField';
import SelectGenreField from '../UIComponents/GenreSelectField';
import SelectCastField from '../UIComponents/CastSelectField';

import {
	db,
	actorsCollection,
	moviesCollection,
	storage,
	auth,
} from '../firebase';

import Moment from 'react-moment';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

import {
	Fab,
	Button,
	Dialog,
	AppBar,
	Toolbar,
	Grid,
	IconButton,
	Slide,
	Typography,
	FormControl,
	Input,
	Chip,
	CardContent,
	CardActionArea,
	Snackbar,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
	appBar: {
		position: 'relative',
		color: 'white',
		backgroundColor: '#0d253f',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300,
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: 2,
	},
	input: {
		display: 'none',
	},

	button: {
		color: '#0d253f',
		margin: 10,
	},
	error: {
		color: '#fff',
	},
});

// const FORM_VALIDATION = Yup.object().shape({
// 	title: Yup.string().required('Required'),
// 	tagline: Yup.string().required('Required'),
// 	status: Yup.string().required('Required'),
// 	runtime: Yup.string().required('Required'),
// 	original_language: Yup.string().required('Required'),
// 	budget: Yup.string().required('Required'),
// 	revenue: Yup.string().required('Required'),
// 	vote_average: Yup.string().required('Required'),
// 	overview: Yup.string().required('Required'),
// 	release_date: Yup.date().required('Required'),
// 	genres: Yup.array()
// 		.min(1, 'Required')
// 		.of(Yup.string().strict())
// 		.strict()
// 		.required(),
// 	cast: Yup.array()
// 		.min(1, 'Required')
// 		.of(Yup.object().strict())
// 		.strict()
// 		.required(),
// });

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class AllMovies extends Component {
	state = {
		movies: [],
		addOpen: false,
		movieAdd: {
			title: '',
			release_date: '',
			runtime: '',
			tagline: '',
			overview: '',
			status: '',
			original_language: '',
			budget: '',
			revenue: '',
			vote_average: '',
			genres: [],
			cast: [],
		},
		dispGenres: [],
		dispCast: [],
		selecCast: [],
		selecGenre: [],
		posterLoaded: false,
		backdropLoaded: false,
		posterName: '',
		backdropName: '',
		selectedPoster: null,
		selectedBackdrop: null,
		uploadPoster: null,
		uploadBackdrop: null,
		user: null,
		loaded: false,
		currentPage: 1,
		moviesPerPage: 8,
		numberOfMovies: 0,
		sliceMovies: [],
		snackOpen: false,
		snackMessage: '',
	};

	async componentDidMount() {
		var tempMovies = [];
		var tempActors = [];
		const indexOfLast = this.state.currentPage * this.state.moviesPerPage;
		const indexOfFirst = indexOfLast - this.state.moviesPerPage;
		await moviesCollection.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				tempMovies.push({ id: doc.id, ...doc.data() });
			});
			this.setState({ movies: tempMovies });
		});
		this.setState({
			numberOfMovies: tempMovies.length,
			sliceMovies: this.state.movies.slice(indexOfFirst, indexOfLast),
		});
		await actorsCollection.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				tempActors.push({ id: doc.id, ...doc.data() });
			});
			this.setState({ dispCast: tempActors });
		});
		this.setState();
		await auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ user: user });
			} else {
				this.setState({ user: null });
			}
		});
		this.setState({ loaded: true });
	}

	componentDidUpdate(previousProps, previousState) {
		if (previousState.currentPage !== this.state.currentPage) {
			const indexOfLast = this.state.currentPage * this.state.moviesPerPage;
			const indexOfFirst = indexOfLast - this.state.moviesPerPage;
			this.setState({
				sliceMovies: this.state.movies.slice(indexOfFirst, indexOfLast),
			});
		}
	}

	handleAddClickOpen = () => {
		this.setState({ addOpen: true });
	};

	handleAddClose = () => {
		this.setState({ addOpen: false });
	};

	addMovie = async (values) => {
		const { selectedPoster, selectedBackdrop } = this.state;
		if (!selectedPoster) {
			this.setState({
				snackOpen: true,
				snackMessage: 'Poster image is required.',
			});
		} else if (!selectedBackdrop) {
			this.setState({
				snackOpen: true,
				snackMessage: 'Backdrop image is required.',
			});
		} else {
			this.setState({ movieAdd: values });
			const { selecCast } = this.state;
			var tempRef = [];
			for await (var cast of selecCast) {
				tempRef.push(db.doc('actors/' + cast.id));
			}
			this.setState((prevState) => ({
				movieAdd: {
					...prevState.movieAdd,
					genres: this.state.selecGenre,
					cast: tempRef,
				},
			}));
			const posterData = await storage
				.child('posters/' + this.state.posterName)
				.put(this.state.uploadPoster);
			const backdropData = await storage
				.child('backdrops/' + this.state.backdropName)
				.put(this.state.uploadBackdrop);
			const movie = await moviesCollection.add(this.state.movieAdd);
			const posterUrl = await posterData.ref.getDownloadURL();
			const backdropUrl = await backdropData.ref.getDownloadURL();
			await moviesCollection.doc(movie.id).update({
				poster_src: posterUrl,
				back_drop: backdropUrl,
			});

			window.location.reload();
		}
	};

	handleCastChange = async (event) => {
		await this.setState({ selecCast: event.target.value });
	};

	handleGenreChange = async (event) => {
		await this.setState({ selecGenre: event.target.value });
	};

	handlePosterUploadClick = (event) => {
		var file = event.target.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = function (e) {
			this.setState({
				selectedPoster: [reader.result],
				posterName: file.name,
				uploadPoster: file,
			});
		}.bind(this);

		this.setState({
			posterLoaded: true,
		});
	};

	handleBackdropUploadClick = (event) => {
		var file = event.target.files[0];
		const reader = new FileReader();
		var url = reader.readAsDataURL(file);
		console.log(url);

		reader.onloadend = function (e) {
			this.setState({
				selectedBackdrop: [reader.result],
				backdropName: file.name,
				uploadBackdrop: file,
			});
		}.bind(this);

		this.setState({
			backdropLoaded: true,
			// selectedBackdrop: event.target.files[0],
		});
	};

	posterImageResetHandler = (event) => {
		this.setState({
			posterLoaded: false,
			selectedPoster: null,
		});
	};

	backdropImageResetHandler = (event) => {
		this.setState({
			backdropLoaded: false,
			selectedBackdrop: null,
		});
	};

	handlePaginate = (event, page) => {
		console.log('Ovo bi trebalo biti stranica: ' + page);
		this.setState({ currentPage: page });
	};

	handleGenreSelectValidation = () => {
		const { selecGenre } = this.state;
		if (!selecGenre.length) {
			this.setState({ genresHasError: true });
		} else {
			this.setState({ genresHasError: false });
		}
	};

	handleCastSelectValidation = () => {
		const { selecCast } = this.state;
		if (!selecCast.length) {
			this.setState({ castHasError: true });
		} else {
			this.setState({ castHasError: false });
		}
	};

	handleSnackClose = () => {
		this.setState({ snackOpen: false });
	};

	render() {
		const { classes } = this.props;
		const {
			movieAdd,
			sliceMovies,
			addOpen,
			dispCast,
			selecCast,
			selecGenre,
			posterLoaded,
			backdropLoaded,
			user,
			loaded,
			moviesPerPage,
			numberOfMovies,
			snackOpen,
			snackMessage,
		} = this.state;
		const vertical = 'top';
		const horizontal = 'center';
		return (
			loaded && (
				<>
					<div className="container">
						{sliceMovies.map((movie) => (
							<div key={movie.id} className="cardAll">
								<div className="block">
									<div className="head">
										<div className="box">
											<Link
												to={`/movies/${movie.id}`}
												style={{ color: 'white', textDecoration: 'none' }}
											>
												<p>View more</p>
												<p>details</p>
											</Link>
										</div>
									</div>

									<div className="overlay"></div>
									<div
										className="bg"
										style={{
											backgroundImage: 'url(' + movie.poster_src + ')',
										}}
									></div>
								</div>
								<div className="blockTitle"> {movie.title}</div>
								<div className="blockYear">
									<Moment format="YYYY">{movie.release_date}</Moment>
								</div>
							</div>
						))}
						{user ? (
							<div id="footer">
								<div id="footerback">
									<Fab
										id="fab"
										variant="extended"
										size="small"
										aria-label="add"
										onClick={this.handleAddClickOpen}
									>
										<AddIcon />
										Add movie
									</Fab>
								</div>
							</div>
						) : (
							<></>
						)}
						<Dialog
							fullScreen
							open={addOpen}
							onClose={this.handleAddClose}
							TransitionComponent={Transition}
						>
							<Formik
								initialValues={{ ...movieAdd }}
								// validationSchema={FORM_VALIDATION}
								onSubmit={(values) => this.addMovie(values)}
							>
								<Form>
									<AppBar className={classes.appBar}>
										<Toolbar>
											<IconButton
												edge="start"
												color="inherit"
												onClick={this.handleAddClose}
												aria-label="close"
											>
												<CloseIcon />
											</IconButton>
											<Typography variant="h6" className={classes.title}>
												Add movie
											</Typography>
											<Button autoFocus color="inherit" type="submit">
												Add
											</Button>
										</Toolbar>
									</AppBar>
									<div className="update">
										<Grid container spacing={1}>
											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="title"
														type="text"
														label="Title"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>

											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="tagline"
														type="text"
														label="Tagline"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>
											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="release_date"
														type="date"
														label="Release date"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>
											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="status"
														type="text"
														label="Status"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>
											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="runtime"
														type="text"
														label="Runtime"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>
											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="original_language"
														type="text"
														label="Language"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>
											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="budget"
														type="text"
														label="Budget"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>
											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="revenue"
														type="text"
														label="Revenue"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>
											<Grid item xs={3}>
												<div className="updateField">
													<TxtField
														name="vote_average"
														type="text"
														label="Rating"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>

											<Grid item xs={9}>
												<div className="updateFieldOverview">
													<TxtField
														multiline
														minRows={1}
														maxRows={4}
														fullWidth
														name="overview"
														type="text"
														label="Overview"
														InputLabelProps={{ shrink: true }}
														className="standard-required"
													/>
												</div>
											</Grid>

											<Grid item xs={3}>
												<div className="updateFieldOverview">
													<SelectGenreField
														name="genres"
														labelId="demo-mutiple-chip-label2"
														id="demo-mutiple-chip2"
														multiple
														value={selecGenre}
														onSelectChange={this.handleGenreChange}
														input={<Input id="select-multiple-chip2" />}
														renderValue={(selected) => (
															<div className={classes.chips}>
																{selected.map((value) => (
																	<Chip
																		key={value}
																		label={value}
																		className={classes.chip}
																	/>
																))}
															</div>
														)}
														MenuProps={{
															PaperProps: {
																style: {
																	maxHeight: 48 * 4.5 + 8,
																	width: 250,
																},
															},
														}}
													/>
												</div>
											</Grid>
											<Grid item xs={9}>
												<div className="updateFieldOverview">
													<FormControl className={classes.formControl}>
														<SelectCastField
															data={dispCast}
															name="cast"
															labelId="demo-mutiple-chip-label"
															id="demo-mutiple-chip"
															multiple
															value={selecCast}
															onSelectChange={this.handleCastChange}
															input={<Input id="select-multiple-chip" />}
															renderValue={(selected) => (
																<div className={classes.chips}>
																	{selected.map((value) => (
																		<Chip
																			key={value.id}
																			label={value.name + ' ' + value.surname}
																			className={classes.chip}
																		/>
																	))}
																</div>
															)}
															MenuProps={{
																PaperProps: {
																	style: {
																		maxHeight: 48 * 4.5 + 8,
																		width: 250,
																	},
																},
															}}
														/>
													</FormControl>
												</div>
											</Grid>

											<Grid item xs={4}>
												<div className="posterImage">
													{posterLoaded ? (
														<div className="posterLoaded">
															<CardActionArea
																onClick={this.posterImageResetHandler}
																className="image"
															>
																<img
																	width="100%"
																	// className={classes.media}
																	src={this.state.selectedPoster}
																	alt=""
																/>
															</CardActionArea>
															<div className="middle">
																<div className="text">
																	Click on the poster to reset.
																</div>
															</div>
														</div>
													) : (
														<CardContent>
															<Grid
																container
																justifyContent="center"
																alignItems="center"
															>
																<input
																	accept="image/*"
																	className={classes.input}
																	id="contained-button-file"
																	multiple
																	type="file"
																	onChange={this.handlePosterUploadClick}
																/>
																<label htmlFor="contained-button-file">
																	<Fab
																		component="span"
																		className={classes.button}
																	>
																		<AddPhotoAlternateIcon />
																	</Fab>
																</label>
																<label htmlFor="contained-button-file">
																	Add poster image
																</label>
															</Grid>
														</CardContent>
													)}
												</div>
											</Grid>
											<Grid item xs={8}>
												<div className="backdropImage">
													{backdropLoaded ? (
														<div className="backdropLoaded">
															<CardActionArea
																onClick={this.backdropImageResetHandler}
																className="image"
															>
																<img
																	width="100%"
																	// className={classes.media}
																	src={this.state.selectedBackdrop}
																	alt=""
																/>
															</CardActionArea>
															<div className="middle">
																<div className="text">
																	Click on the backdrop to reset.
																</div>
															</div>
														</div>
													) : (
														<CardContent>
															<Grid
																container
																justifyContent="center"
																alignItems="center"
															>
																<input
																	accept="image/*"
																	className={classes.input}
																	id="contained-button-file2"
																	multiple
																	type="file"
																	onChange={this.handleBackdropUploadClick}
																/>
																<label htmlFor="contained-button-file2">
																	<Fab
																		component="span"
																		className={classes.button}
																	>
																		<AddPhotoAlternateIcon />
																	</Fab>
																</label>
																<label htmlFor="contained-button-file2">
																	Add backdrop image
																</label>
															</Grid>
														</CardContent>
													)}
												</div>
											</Grid>
										</Grid>
									</div>
								</Form>
							</Formik>
						</Dialog>
						<Snackbar
							anchorOrigin={{ vertical, horizontal }}
							open={snackOpen}
							onClose={this.handleSnackClose}
							key={vertical + horizontal}
							autoHideDuration={5000}
						>
							<Alert onClose={this.handleSnackClose} severity="error">
								{snackMessage}
							</Alert>
						</Snackbar>
					</div>
					<div className="pagination">
						<Paginate
							moviesPerPage={moviesPerPage}
							totalMovies={numberOfMovies}
							paginate={this.handlePaginate}
						/>
					</div>
				</>
			)
		);
	}
}

export default withRouter(withStyles(styles)(AllMovies));
