import React, { useState } from 'react'
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { useMainContext } from '../../../context/MainContext';

export const EditIngredientForm = ({ ingredientData }) => {
    const [ingredient, setIngredient] = useState(ingredientData);
    const [deleteModal, setDeleteModal] = useState(false);
    const [edited, setEdited] = useState(false);
    const { ingredientRepo, ingredients, setIngredients } = useMainContext();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIngredient({ ...ingredient, [name]: value });
    }
    const handleUpdateIngreident = (e) => {
        e.preventDefault();
        setEdited(true)
        ingredientRepo.updateMyIngredient(ingredient.FSId, ingredient).then(() => setEdited(false))
        setIngredients(ingredients.map((item) => item.FSId === ingredient.FSId ? ingredient : item))
    }
    return (
        <>
            <header>
                <h4 className="bg-purple text-light p-2" id="ingredientHeader">{ingredientData.name}:</h4>
            </header>
            {edited && <p className="alert alert-warning">Updatting... </p>}
            <form className="row form-control m-0" id="userIngredientsForm">
                <ul className="p-3 gap-2 rounded-0 mb-0">
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">Ingredient Name</label>
                            <input type="text" name="name" value={ingredient.name} className="form-control" id="name" onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="col-md-6">
                            <div className="col-md-6">

                                <label htmlFor="unitOfMeasure" className="form-label">Unit Of Measure</label>
                                <select id="unitOfMeasure" className="form-select" name="unitOfMeasure" onChange={(e) => handleChange(e)} required>
                                    <option value="" name="">Choose...</option>
                                    {/* <!-- <option value="Kg" name="Kg">Kg</option> --> */}
                                    <option value="g" name="g">g</option>
                                    <option value="und" name="und">und</option>
                                    {/* <!-- <option value="lb" name="lb">lb</option> --> */}
                                    {/* <!-- <option value="L" name="L">L</option> --> */}
                                    <option value="mL" name="mL">mL</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="brand" className="form-label">Brand</label>
                            <input type="text" name="brand" value={ingredient.brand} className="form-control" id='brand' onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="supplier" className="form-label">Supplier</label>
                            <input type="text" name="supplier" value={ingredient.supplier} className="form-control" id="supplier" onChange={(e) => handleChange(e)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <label htmlFor="costPerKg" className="form-label">Cost per Kg or L</label>
                            <input type="number" name="costPerKg" value={ingredient.costPerKg} className="form-control" id="costPerKg" onChange={(e) => handleChange(e)} />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                            <input type="date" name="expirationDate" value={ingredient.expirationDate} className="form-control" id="expirationDate" onChange={(e) => handleChange(e)} />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="batch" className="form-label">Batch</label>
                            <input type="text" name="batch" value={ingredient.batch} className="form-control" id="batch" onChange={(e) => handleChange(e)} />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="stock" className="form-label">Stock</label>
                            <input type="number" name="stock" value={ingredient.stock} className="form-control" id="stock" onChange={(e) => handleChange(e)} />
                        </div>
                    </div>

                    <div className="d-flex gap-2 mt-2 justify-content-end">
                        <button type="button" className="btn myButton-danger" id="deleteIngredientButton"
                            onClick={() => setDeleteModal(true)}>Delete</button>
                        <button className="btn myButton-primary" name="save" onClick={(e) => handleUpdateIngreident(e)}>Save Changes</button>
                    </div>
                </ul>
            </form>
            {deleteModal && <ConfirmDeleteModal ingredient={ingredient} setDeleteModal={setDeleteModal} ingredientRepository={ingredientRepo} />}
        </>)
}

