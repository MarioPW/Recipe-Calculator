import React from 'react'

export const NavBar = () => {
  return (
    <>
    {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" id="navbarMain">
        <div className="container-fluid">
          <h1 className="navbar-brand text-light">@PW Recipe Calculator</h1>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="d-flex flex-lg-row flex-column mb-2 mb-lg-0 gap-3" id="nav-user-info">
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
