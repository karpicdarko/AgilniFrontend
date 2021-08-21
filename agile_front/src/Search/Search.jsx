import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { moviesCollection } from '../firebase';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: '100%',
		padding: '10px',
		backgroundColor: theme.palette.background.paper,
	},

	liContainer: {
		width: '100%',
		maxHeight: '20%',
	},
	liSubContainer: {
		display: 'flex',
	},
	image: {
		maxWidth: '5em',
		maxHeight: 'auto',
	},
	text: {
		maxHeight: '100%',
		maxWidth: '75%',
		marginLeft: '5px',
	},
}));

function Search(props) {
	const classes = useStyles();
	const [movies, setMovies] = useState([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		async function fetchMovies() {
			var tempMov = [];
			await moviesCollection.get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					tempMov.push({
						id: doc.id,
						title: doc.data().title.toLowerCase(),
						poster_src: doc.data().poster_src,
					});
				});
			});
			const filterMov = await tempMov.filter((m) =>
				m.title.includes(props.match.params.query.toLowerCase())
			);
			setMovies(filterMov);
			setLoaded(true);
		}
		fetchMovies();
	}, [props.match.params.query]);

	return (
		<List className={classes.root}>
			{loaded &&
				movies.map((movie) => (
					<div key={movie.id}>
						<ListItem className={classes.liContainer} alignItems="flex-start">
							<Link
								to={`/movies/${movie.id}`}
								style={{ color: 'black', textDecoration: 'none' }}
							>
								<div className={classes.liSubContainer}>
									<div className={classes.image}>
										<img
											className={classes.image}
											src={movie.poster_src}
											alt="poster"
										/>
									</div>
									<div className={classes.text}>
										<ListItemText
											primary={movie.title.replace(/\b(\w)/g, (s) =>
												s.toUpperCase()
											)}
											// className={classes.title}
											secondary={
												<React.Fragment>
													<Typography
														component="span"
														variant="body2"
														// className={classes.inline}
														color="textPrimary"
													>
														<Moment format="MMM D, YYYY">
															{movie.release_date}
														</Moment>
													</Typography>
												</React.Fragment>
											}
										/>
									</div>
								</div>
							</Link>
						</ListItem>
						<Divider variant="inset" component="li" />
					</div>
				))}
		</List>
	);
}
export default withRouter(Search);
