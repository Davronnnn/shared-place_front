import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UsersList from '../components/UsersList';
const Users = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [data, setData] = useState();
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const resData = await sendRequest(
					`${process.env.REACT_APP_URL}users`
				);

				setData(resData.users);
			} catch (error) {}
		};
		fetchUsers();
	}, [sendRequest]);

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && data && <UsersList items={data} />}
		</React.Fragment>
	);
};

export default Users;
