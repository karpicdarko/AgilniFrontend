import React from 'react';
import { TextField } from '@material-ui/core';
import { useField } from 'formik';

export default function TxtField({ name, ...otherProps }) {
	const [field, meta] = useField(name);

	const configTextField = {
		...field,
		...otherProps,
		required: true,
	};

	if (meta && meta.touched && meta.error) {
		configTextField.error = true;
		configTextField.helperText = meta.error;
	}

	return <TextField {...configTextField} />;
}
