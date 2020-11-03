import React, { useState } from 'react';
import axios from 'axios';

import './editForms.css';

import CloseIcon from '../../icons/close_icon.svg';


export default function EditDescription({ 
	setEditDescription,
	editedDescription,
	setEditedDescription,
	setDescription
 }) {

	const saveInfo = () => {
		//request => response is OK =>
		setDescription(editedDescription);
		setEditDescription(false);
	}

	return (
		<div className="edit-form-background">
			<div className="edit-form-description">
				<div
					className="filter-close"
					onClick={() => setEditDescription(false)}
				>
					<img src={CloseIcon} alt="Close icon" draggable="false" />
				</div>
				<div className="edit-form-title">Edit description</div>
				<textarea
					id="description"
					name="description"
					maxlength="1000"
					placeholder="Enter description here..."
					required
					value={editedDescription}
					onChange={(e) => setEditedDescription(e.target.value)}
				/>
				<div className="row">
					<div className="cancel" onClick={() => setEditDescription(false)}>Cancel</div>
					<div className="save" onClick={() => saveInfo()}>Save</div>
				</div>
			</div>
		</div>
	);
}
