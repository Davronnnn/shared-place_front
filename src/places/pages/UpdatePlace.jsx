import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import useForm from '../../shared/components/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../utils/validators';
import { useHttpClient } from '../../shared/components/hooks/http-hook';

import './PlaceForm.scss';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePlace = () => {
	const auth = useContext(AuthContext);
	const { placeId } = useParams();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [place, setPlace] = useState();
	const navigate = useNavigate();

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: '',
				isValid: true,
			},
			description: {
				value: '',
				isValid: true,
			},
		},
		false
	);

	useEffect(() => {
		const fetchPlace = async () => {
			try {
				const resData = await sendRequest(
					`${process.env.REACT_APP_URL}places/${placeId}`
				);
				setPlace(resData.place);
				setFormData(
					{
						title: {
							value: resData.place?.title,
							isValid: true,
						},
						description: {
							value: resData.place?.description,
							isValid: true,
						},
					},
					true
				);
			} catch (error) {}
		};
		fetchPlace();
	}, [setFormData, sendRequest, placeId]);

	const updateSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			await sendRequest(
				`${process.env.REACT_APP_URL}places/${placeId}`,
				'PATCH',
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);

			// Navigate
			navigate(`/${auth.userId}/places`);
		} catch (error) {}
	};
	if (isLoading) {
		return (
			<div className='center'>
				<LoadingSpinner />
			</div>
		);
	}
	if (!place && !error) {
		return (
			<div className='center'>
				<Card>
					<h2>Could not find place</h2>
				</Card>
			</div>
		);
	}

	if (!formState.inputs.title.value) {
		return (
			<div className='center'>
				<h2>Loading</h2>
			</div>
		);
	}
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{!isLoading && place && (
				<form onSubmit={updateSubmitHandler} className='place-form'>
					<h1>asdklsadakljd</h1>
					<Input
						id='title'
						element='input'
						label='Title'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a valid title.'
						onInput={inputHandler}
						initialValue={place.title}
						initialValid={true}
					/>
					<Input
						id='description'
						element='textarea'
						label='Description'
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText='Please enter a valid description (min 5 characters).'
						onInput={inputHandler}
						initialValue={place.description}
						initialValid={true}
					/>
					<Button type='submit' disabled={!formState.isValid}>
						UPDATE PLACE
					</Button>
				</form>
			)}
		</React.Fragment>
	);
};

export default UpdatePlace;
