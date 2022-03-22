import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';

import './ImageUpload.css';

const ImageUpload = (props) => {
	const filePickerRef = useRef();
	const [file, setFile] = useState();
	const [previewUrl, setPreviewUrl] = useState(false);
	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		if (!file) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	const pickHandler = (e) => {
		let pickedFile;
		let fileIsValid = isValid;
		if (e.target.files && e.target.files.length === 1) {
			pickedFile = e.target.files[0];
			setFile(pickedFile);
			setIsValid(true);
			fileIsValid = true;
		} else {
			setIsValid(false);
			fileIsValid = false;
		}
		props.onInput(props.id, pickedFile, fileIsValid);
	};

	const pickImageHandler = () => {
		filePickerRef.current.click();
	};
	return (
		<div className='form-control'>
			<input
				accept='.jpg, .jpeg, .png'
				type='file'
				name=''
				id={props.id}
				style={{ display: 'none' }}
				ref={filePickerRef}
				onChange={pickHandler}
			/>
			<div className={`image-upload ${props.center && 'center'}`}>
				<div className='image-upload__preview'>
					{previewUrl && <img src={previewUrl} alt='Preview' />}
					{!previewUrl && <p>Please pick an image.</p>}
				</div>
				<Button type='button' onClick={pickImageHandler}>
					Pick Image
				</Button>
			</div>
			{!isValid && <p>{props.errorText}</p>}
		</div>
	);
};

export default ImageUpload;
