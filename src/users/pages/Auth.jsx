import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../utils/validators';
import useForm from '../../shared/components/hooks/form-hook';
import Button from '../../shared/components/FormElements/Button';

import './Auth.scss';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const Auth = () => {
	const auth = useContext(AuthContext);
	let navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);
	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (isLogin) {
			try {
				const resData = await sendRequest(
					`${process.env.REACT_APP_URL}users/login`,
					'POST',

					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{ 'Content-Type': 'application/json' }
				);

				auth.login(resData.userId, resData.token);
				navigate('/');
			} catch (err) {}
		} else {
			try {
				const formData = new FormData();
				formData.append('email', formState.inputs.email.value);
				formData.append('name', formState.inputs.name.value);
				formData.append('password', formState.inputs.password.value);
				formData.append('image', formState.inputs.image.value);

				const resData = await sendRequest(
					`${process.env.REACT_APP_URL}users/signup`,
					'POST',
					formData
				);
				auth.login(resData.userId, resData.token);
				navigate('/');
			} catch (error) {}
		}
	};

	const switchModeHandler = () => {
		if (!isLogin) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
					image: undefined,
				},
				formState.inputs.email.isValid &&
					formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
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
		}

		setIsLogin((prev) => !prev);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className='authentication'>
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login required</h2>
				<hr />

				<form onSubmit={submitHandler}>
					{!isLogin && (
						<Input
							element='input'
							id='name'
							label='Name'
							validators={[VALIDATOR_REQUIRE()]}
							errorText='Please enter a valid name.'
							onInput={inputHandler}
						/>
					)}

					<Input
						element='input'
						id='email'
						label='E-mail'
						validators={[VALIDATOR_EMAIL()]}
						errorText='Please enter a valid email.'
						onInput={inputHandler}
					/>
					<Input
						element='input'
						id='password'
						type='password'
						label='Password'
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText='Please enter a valid password (at least 5 characters).'
						onInput={inputHandler}
					/>
					{!isLogin && (
						<ImageUpload
							id='image'
							center
							onInput={inputHandler}
							errorText='Please provide an image'
						/>
					)}
					<Button type='submit' disabled={!formState.isValid}>
						{isLogin ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					Switch to {isLogin ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
