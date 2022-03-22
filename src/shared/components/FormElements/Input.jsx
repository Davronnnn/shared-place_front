import React, { useEffect, useReducer } from 'react';
import { validate } from '../../../utils/validators';

import './Input.scss';

const inputReducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE':
			return {
				...state,
				value: action.val,
				isValid: validate(action.val, action.validators),
			};
		case 'TOUCH':
			return {
				...state,
				isTouched: true,
			};
		default:
			return state;
	}
};

const Input = (props) => {
	const [inputState, dispatch] = useReducer(inputReducer, {
		value: props.initialValue || '',
		isTouched: false,
		isValid: props.initialValid || false,
	});

	const { id, onInput } = props;
	const { value, isValid } = inputState;
	useEffect(() => {
		onInput(id, value, isValid);
	}, [id, onInput, value, isValid]);

	const changeHandler = (e) => {
		dispatch({
			type: 'CHANGE',
			val: e.target.value,
			validators: props.validators,
		});
	};

	const touchHandler = () => {
		dispatch({
			type: 'TOUCH',
		});
	};
	const element =
		props.element === 'input' ? (
			<input
				id={props.id}
				type={props.type}
				placeholder={props.placeholder}
				onChange={changeHandler}
				value={inputState.value}
				onBlur={touchHandler}
			/>
		) : (
			<textarea
				id={props.id}
				rows={props.row || 3}
				onChange={changeHandler}
				value={inputState.value}
				onBlur={touchHandler}
			/>
		);

	return (
		<div
			className={`form-control  ${
				!inputState.isValid &&
				inputState.isTouched &&
				'form-control--invalid'
			}`}>
			<label htmlFor={props.id}>{props.label}</label>
			{element}
			{!inputState.isValid && inputState.isTouched && (
				<p>{props.errorText}</p>
			)}
		</div>
	);
};

export default Input;
