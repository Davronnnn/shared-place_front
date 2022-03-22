import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import UserItem from './UserItem';
import './UsersList.scss';
const UsersList = (props) => {
	if (props.items.length === 0) {
		return (
			<div className='center'>
				<Card>
					<h2>No users found.</h2>
				</Card>
			</div>
		);
	}
	return (
		<ul className='users-list'>
			{props.items.map((user) => (
				<UserItem
					key={user.id}
					id={user.id}
					name={user.name}
					image={user.image}
					placeCount={user.places.length}
				/>
			))}
		</ul>
	);
};

export default UsersList;
