import React from 'react';
import { useField, useFormikContext } from 'formik';
import {
	Select,
	MenuItem,
	FormHelperText,
	InputLabel,
	FormControl,
} from '@material-ui/core';

export default function SelectGenreField({
	name,
	onSelectChange,
	...otherProps
}) {
	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(name);

	const handleChange = (e) => {
		const { value } = e.target;
		setFieldValue(name, value);
		onSelectChange(e);
	};

	const configSelectField = {
		...field,
		...otherProps,
		onChange: handleChange,
	};

	if (meta && meta.touched && meta.error) {
		configSelectField.error = true;
	}
	const genres = [
		'Drama',
		'Comedy',
		'Thriller',
		'Romance',
		'Action',
		'Horror',
		'Crime',
		'Adventure',
		'Mystery',
		'Family',
		'Fantasy',
		'Sci-Fi',
		'Music',
		'Animation',
		'Biography',
		'History',
		'Musical',
		'War',
		'Sport',
		'Western',
	];

	return (
		<>
			<FormControl required style={{ minWidth: '120px', maxWidth: '100%' }}>
				{meta.error ? (
					<InputLabel id="demo-mutiple-chip-label" shrink error required>
						Genres
					</InputLabel>
				) : (
					<InputLabel id="demo-mutiple-chip-label" shrink required>
						Genres
					</InputLabel>
				)}
				<Select {...configSelectField}>
					{genres.map((genre) => (
						<MenuItem
							key={genre}
							value={genre}
							// style={getStyles(name, personName, theme)}
						>
							{genre}
						</MenuItem>
					))}
				</Select>
				{meta.error && <FormHelperText error>{meta.error}</FormHelperText>}
			</FormControl>
			{/* {meta.error ? (
				<InputLabel id="demo-mutiple-chip-label" shrink error required>
					Genres
				</InputLabel>
			) : (
				<InputLabel id="demo-mutiple-chip-label" shrink required>
					Genres
				</InputLabel>
			)}
			<Select {...configSelectField}>
				{genres.map((genre) => (
					<MenuItem
						key={genre}
						value={genre}
						// style={getStyles(name, personName, theme)}
					>
						{genre}
					</MenuItem>
				))}
			</Select>
			{meta.error && <FormHelperText error>{meta.error}</FormHelperText>} */}
		</>
	);
}
