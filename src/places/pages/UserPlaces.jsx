import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [places, setPlaces] = useState();
	const userId = useParams().userId;
	useEffect(() => {
		const fetchPlace = async () => {
			try {
				const resData = await sendRequest(
					`${process.env.REACT_APP_URL}places/users/${userId}`
				);
				setPlaces(resData.places);
			} catch (error) {}
		};
		fetchPlace();
	}, [sendRequest, userId]);

	const onDelete = (placeId) => {
		setPlaces((prevPlaces) =>
			prevPlaces.filter((place) => place.id !== placeId)
		);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && places && (
				<PlaceList items={places} onDelete={onDelete} />
			)}
		</React.Fragment>
	);
};

export default UserPlaces;
