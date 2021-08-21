import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './nav/Navbar';
import AllMovies from './allMovies/AllMovies';
import MovieInfo from './movieInfo/MovieInfo';
import SignIn from './Auth/Signin';
import SignUp from './Auth/Signup';
import Search from './Search/Search';

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
				<Switch>
					<Route exact path={['/', '/home']} component={AllMovies} />
					<Route path="/movies/:id" component={MovieInfo} />
					<Route path="/signin" component={SignIn} />
					<Route path="/signup" component={SignUp} />
					<Route path="/search/:query" component={Search} />
					{/* <Search /> */}
				</Switch>
			</div>
		</Router>
	);
}

export default App;
