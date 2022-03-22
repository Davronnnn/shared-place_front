import React, { useContext } from 'react';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../utils/validators';

import './PlaceForm.scss';
import Button from '../../shared/components/FormElements/Button';
import useForm from '../../shared/components/hooks/form-hook';
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const NewPlace = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
			address: {
				value: '',
				isValid: false,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false
	);
	const navigate = useNavigate();
	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('title', formState.inputs.title.value);
			formData.append('description', formState.inputs.description.value);
			formData.append('address', formState.inputs.address.value);
			formData.append('image', formState.inputs.image.value);

			await sendRequest(
				process.env.REACT_APP_URL + 'places',
				'POST',
				formData,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			navigate('/');
		} catch (error) {}
	};
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<form className='place-form' onSubmit={submitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='title'
					type='text'
					label='Title'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid title.'
					onInput={inputHandler}
				/>
				<Input
					id='description'
					type='text'
					label='Description'
					element='textarea'
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText='Please enter a valid description (at least 5 characters).'
					onInput={inputHandler}
				/>
				<Input
					id='address'
					type='text'
					label='Address'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid address.'
					onInput={inputHandler}
				/>
				<ImageUpload
					id='image'
					center
					onInput={inputHandler}
					errorText='Please provide an image'
				/>
				<Button type='submit' disabled={!formState.isValid}>
					ADD PLACE
				</Button>
			</form>
		</React.Fragment>
	);
};

export default NewPlace;
