import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SearchHeader extends Component {
	render() {
		const { headerName, name, addToLink, onSubmit, onChange } = this.props;

		return (
			<div className="w-100 mt-3 p-3 d-flex justify-content-center">
				<div className="admin-search-header">
					<h1>{headerName}</h1>

					<div className="admin-search">
						<form
							noValidate
							autoComplete="off"
							onSubmit={onSubmit}
						>
							<label htmlFor="search-admin-name" className="admin-search-field">
								<input
									type="text"
									id="search-admin-name"
									name="Name"
									placeholder={`Search for ${name} Name...`}
									onChange={onChange}
								/>
								<button className="admin-search-button" type="submit">
									<i className="fas fa-search" /> Search
								</button>
							</label>
						</form>

						<Link
							to={addToLink}
							className="admin-search-link"
						>
							{`Add New ${name}`}
						</Link>
					</div>
				</div>

			</div>
		);
	}
}

export default SearchHeader
