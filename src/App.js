import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
// import Users from './users/pages/Users';
// import UserPlaces from './places/pages/UserPlaces';
// import NewPlace from './places/pages/NewPlaces.jsx';
// import UpdatePlace from './places/pages/UpdatePlace';

// import Auth from './users/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/components/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = React.lazy(() => import('./users/pages/Users'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlaces.jsx'));
const Auth = React.lazy(() => import('./users/pages/Auth.jsx'));

const App = () => {
	const { login, logout, token, userId } = useAuth();
	let routes;
	if (token) {
		routes = (
			<Routes>
				<Route path='/' element={<Users />} />
				<Route path='/:userId/places' element={<UserPlaces />} />
				<Route path='/places/new' element={<NewPlace />} />
				<Route path='/places/:placeId' element={<UpdatePlace />} />
			</Routes>
		);
	} else {
		routes = (
			<Routes>
				<Route path='/' element={<Users />} />
				<Route path='/:userId/places' element={<UserPlaces />} />
				<Route path='/auth' element={<Auth />} />
			</Routes>
		);
	}
	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				login: login,
				logout: logout,
				userId: userId,
			}}>
			<BrowserRouter>
				<MainNavigation />
				<main>
					<Suspense
						fallback={
							<div className='center'>
								<LoadingSpinner />
							</div>
						}>
						{routes}
					</Suspense>
				</main>
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

export default App;
