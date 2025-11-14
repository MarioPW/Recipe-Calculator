import React from 'react';
import { SearchInput } from './SearchInput';
import { Link } from 'react-router-dom';
import { CustomButton } from './CustomButton';

import { useEffect, useRef } from 'react';

export const SecondaryNavbar = ({ title, buttons = [], links = [], searchInput = null, collapseButtonId = null, children = null, border = true }) => {
  const collapseRef = useRef(null);

  useEffect(() => {
    // Initialize the Bootstrap collapse when the component mounts
    if (collapseRef.current && window.bootstrap) {
      const bsCollapse = new window.bootstrap.Collapse(collapseRef.current, {
        toggle: false
      });
      
      // Save the instance in the ref for later use
      collapseRef.current.bsCollapse = bsCollapse;
    }
  }, []);

  const handleLinkClick = () => {
    // Collapse the menu only on small screens
    if (window.innerWidth < 992 && collapseRef.current?.bsCollapse) {
      collapseRef.current.bsCollapse.hide();
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${border ? 'border' : ''} bg-color-main w-100`}>
      <div className="container-fluid d-flex flex-wrap align-items-center">
        <h2 className="navbar-brand text-light ps-2 text-break"
          style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
        >{title}</h2>

        <button
          className="btn btn-outline-light d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#" + collapseButtonId}
          aria-expanded="false"
          aria-controls={collapseButtonId}
        >
          <i className="bi bi-list"></i>
        </button>
        {searchInput && (
          <div className="flex-grow-1 my-2 my-lg-0 mx-lg-3" style={{ maxWidth: "300px" }}>
            <SearchInput
              items={searchInput.items || []}
              url={searchInput.url}
              action={searchInput.action}
            />
          </div>
        )}
        <div 
          ref={collapseRef}
          className="collapse navbar-collapse d-lg-block" 
          id={collapseButtonId}
        >
          <ul className="navbar-nav bg-color-main gap-2 w-100 p-2 m-0 d-flex flex-column flex-lg-row justify-content-end">
            {buttons && buttons.map(({ label, action }, index) => (
              <li key={index} className="nav-item list-group-item">
                <CustomButton
                  className="light"
                  onClick={() => {
                    handleLinkClick();
                    action();
                  }}
                  label={label}
                />
              </li>
            ))}
            {links.map(({ label, url }, index) => (
              <li key={index} className="nav-item list-group-item">
                <Link 
                  className="btn btn-sm btn-outline-success text-light" 
                  to={url}
                  onClick={handleLinkClick}
                >
                  {label}
                </Link>
              </li>
            ))}
            {children && children.map(
              (child, index) => (
                <li key={index} className="nav-item list-group-item">
                  <span>
                    {child}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};