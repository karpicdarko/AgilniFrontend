import React from 'react';
import Pagination from '@material-ui/lab/Pagination';

export default function Paginate({ moviesPerPage, totalMovies, paginate }) {
	const pageNumber = [];

	for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
		pageNumber.push(i);
	}
	return (
		<div>
			<Pagination count={pageNumber.length} onChange={paginate} />
		</div>
	);
}
