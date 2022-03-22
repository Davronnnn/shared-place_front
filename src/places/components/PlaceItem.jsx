import React, { useContext, useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import { useHttpClient } from '../../shared/components/hooks/http-hook';

import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Map from '../../shared/components/UIElements/Map';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceItem.css';
const PlaceItem = (props) => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [showMap, setShowMap] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const img = props.image;
	const openMapHandler = () => setShowMap(true);
	console.log(img);
	const closeMapHandler = () => setShowMap(false);

	const showDeleteHandler = () => {
		setShowConfirm(true);
	};

	const cancelDeleteHandler = () => setShowConfirm(false);

	const confirmDeleteHandler = async () => {
		setShowConfirm(false);

		try {
			await sendRequest(
				`${process.env.REACT_APP_URL}places/${props.id}`,
				'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			props.onDelete(props.id);
		} catch (error) {}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={props.address}
				contentClass='place-item__modal-content'
				footerClass='place-item__modal-actions'
				footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
				<div className='map-container'>
					<h2>
						<Map center={props.coordinates} zoom={16} />
					</h2>
				</div>
			</Modal>
			<Modal
				show={showConfirm}
				onCancel={cancelDeleteHandler}
				header='Are you sure?'
				footerClass='place-item__modal-actions'
				footer={
					<React.Fragment>
						<Button onClick={cancelDeleteHandler} inverse>
							Cancel
						</Button>
						<Button onClick={confirmDeleteHandler} danger>
							Delete
						</Button>
					</React.Fragment>
				}>
				<p>
					Do you want to proceed and delete this place? Please note
					that it can't be undone after deleted.
				</p>
			</Modal>
			<li className='place-item'>
				<Card className='palce-item__content'>
					{isLoading && <LoadingSpinner asOverlay />}
					<div className='place-item__image'>
						<img
							src={process.env.REACT_APP_URL_ASSET + img}
							alt={props.title}
						/>
					</div>
					<div className='place-item__info'>
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className='place-item__actions'>
						<Button inverse onClick={openMapHandler}>
							View on map
						</Button>
						{auth.userId === props.creatorId && (
							<>
								<Button to={`/places/${props.id}`}>Edit</Button>
								<Button onClick={showDeleteHandler} danger>
									Delete
								</Button>
							</>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default PlaceItem;
