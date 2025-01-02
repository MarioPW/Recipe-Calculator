import React from 'react'

export const AuxNavBar = () => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark fs-5 mb-3 border-top" id="navbar">
    <div className="container d-flex flex-sm-column justify-content-between">
      <div className="d-flex justify-content-between">
        <button className="navbar-toggler text-light" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon text-light"></span>
        </button>
      </div>
      <div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item" id="newRecipe">
              <a className="nav-link active fs-6 text-light" aria-current="page" href="#">New Recipe</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active fs-6 text-light" aria-current="page" id="newIngredient" href="#">New
                Ingredient</a>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-light fs-6" href="#" id="my-recipes" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">My Recipes</a>
              <ul id="nav-recipes-dropdown" className="dropdown-menu" aria-labelledby="my-recipes">
                {/* <!-- My Recipes --> */}
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-light fs-6" href="#" id="my-ingredients" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">My Ingredients</a>
              <ul id="nav-ingredients-dropdown" className="dropdown-menu" aria-labelledby="my-ingredients">
                {/* <!-- My Ingredients --> */}
              </ul>
            </li>

          </ul>
          {/* <!-- <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search My Recipe"
                  aria-label="Search"
                  id="searchInput"
                />
                <button className="btn btn-outline-light" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </form> --> */}
        </div>
      </div>
    </div>
  </nav>
  )
}
