import { useCallback, useEffect, useState } from 'react';

let logoutTimer;

export const useAuth = () => {
	const [token, setToken] = useState(false);
	const [userId, setUserId] = useState(false);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();

	const login = useCallback((uid, token, expDate) => {
		setToken(token);
		setUserId(uid);
	
		const ExpirationDate =
			expDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(ExpirationDate);
		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: uid,
				token: token,
				expiration: ExpirationDate.toISOString(),
			})
		);
	}, []);

	const logout = useCallback((uid) => {
		setToken(null);
		setUserId(null);
		setTokenExpirationDate(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));
		if (
			storedData &&
			storedData.token &&
			new Date(storedData.expiration) > new Date()
		) {
			login(
				storedData.userId,
				storedData.token,
				new Date(storedData.expiration)
			);
		}
	}, [login]);

	return { login, logout, token, userId };
};
