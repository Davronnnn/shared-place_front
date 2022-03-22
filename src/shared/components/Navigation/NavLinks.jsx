import React, { useContext } from 'react';
import './NavLinks.css';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import Button from '../FormElements/Button';
const NavLinks = () => {
	const auth = useContext(AuthContext);

	return (
		<ul className='nav-links'>
			<li>
				<NavLink to='/' exact>
					All users
				</NavLink>
			</li>
			{auth.isLoggedIn && (
				<>
					<li>
						<NavLink to={`/${auth.userId}/places`}>
							My Places
						</NavLink>
					</li>
					<li>
						<NavLink to='/places/new'>Add Places</NavLink>
					</li>
					<li>
						<button onClick={auth.logout}>Log out</button>
					</li>
				</>
			)}
			{!auth.isLoggedIn && (
				<li>
					<NavLink to='/auth'>Authenticate</NavLink>
				</li>
			)}
		</ul>
	);
};

export default NavLinks;
