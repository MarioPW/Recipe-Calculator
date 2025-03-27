import React from 'react';
import { SearchInput } from './SearchInput';
import { Link } from 'react-router-dom';

export const SecondaryNavbar = ({ title, buttonsActions = [], links = [], searchInput = null, collapseButtonText = null }) => {
  return (
    <nav className="navbar navbar-expand-lg border mt-1 bg-color-main pe-2">
      <a className="navbar-brand text-light ps-2" href="#">{title}</a>

      <button
        className="btn btn-outline-light me-2 d-lg-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#actionsCollapse2"
        aria-expanded="false"
        aria-controls="actionsCollapse2"
      >
        <i className="bi bi-list"></i> {collapseButtonText}
      </button>
      
      {searchInput && <SearchInput items={searchInput?.items || []} url={searchInput.url} setItemsList={searchInput.setItemsList}/>}
      
      <div className="collapse navbar-collapse position-relative d-lg-block" id="actionsCollapse2">
        <ul className="navbar-nav position-absolute bg-color-main gap-2 w-100 p-2 m-0 d-flex justify-content-end">
          {buttonsActions.map(({ label, action }, index) => (
            <li key={index} className="nav-item list-group-item">
              <button className="btn btn-sm btn-outline-light d-sm-block" onClick={action}>
                {label}
              </button>
            </li>
          ))}
          {links.map(({ label, url }, index) => (
            <li key={index} className="nav-item list-group-item">
              <Link className="myButton-success fw-bold d-inline-block text-center" to={url}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};