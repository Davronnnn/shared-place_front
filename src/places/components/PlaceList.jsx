import React from 'react';
import Link from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import './PlaceList.css';

const PlaceList = (props) => {
	if (!props.items.length) {
		return (
			<div className='place-list center'>
				<Card>
					<h2>No places found. Maybe </h2>
					<Button to='/places/new'>create one?</Button>
				</Card>
			</div>
		);
	}
	return (
		<ul className='place-list'>
			{props.items.map((place) => (
				<PlaceItem
					key={place.id}
					id={place.id}
					image={place.image}
					title={place.title}
					description={place.description}
					address={place.address}
					creatorId={place.creator}
					coordinates={place.location}
					onDelete={props.onDelete}
				/>
			))}
		</ul>
	);
};

export default PlaceList;
