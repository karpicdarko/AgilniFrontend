import React from 'react';
import { useField, useFormikContext } from 'formik';
import {
	Select,
	MenuItem,
	FormHelperText,
	InputLabel,
	FormControl,
} from '@material-ui/core';

/*onChange={(event) => {
    form.setFieldValue(field.name, event.target.value);
    onChange(event);
}}*/

export default function SelectCastField({
	name,
	data,
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

	return (
		<>
			<FormControl required style={{ minWidth: '120px', maxWidth: '100%' }}>
				{meta.error ? (
					<InputLabel id="demo-mutiple-chip-label" shrink error required>
						Cast
					</InputLabel>
				) : (
					<InputLabel id="demo-mutiple-chip-label" shrink required>
						Cast
					</InputLabel>
				)}
				<Select {...configSelectField}>
					{data.map((cast) => (
						<MenuItem
							key={cast.id}
							value={cast}
							// style={getStyles(name, personName, theme)}
						>
							{cast.name} {cast.surname}
						</MenuItem>
					))}
				</Select>
				{meta.error && <FormHelperText error>{meta.error}</FormHelperText>}
			</FormControl>
		</>
	);
}
