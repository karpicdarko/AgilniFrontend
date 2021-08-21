import { firebase } from '@firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCM3JaosIJyVWTkoLGdCpbTez2ZAcArdgs',
	authDomain: 'agilniprojekat.firebaseapp.com',
	projectId: 'agilniprojekat',
	storageBucket: 'agilniprojekat.appspot.com',
	messagingSenderId: '265838340601',
	appId: '1:265838340601:web:6cac2c79927b3a92e63528',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage().ref();
const auth = firebase.auth();

const usersCollection = db.collection('users');
const moviesCollection = db.collection('movies');
const actorsCollection = db.collection('actors');

export {
	db,
	storage,
	auth,
	usersCollection,
	moviesCollection,
	actorsCollection,
};
