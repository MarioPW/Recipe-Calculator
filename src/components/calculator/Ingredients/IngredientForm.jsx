import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { IngredientRepo } from '../../../ingredients/services';
import { auth, db } from '../../../firebaseConfig';
import { EditIngredientForm } from './EditIngredientForm';
import { Spinner } from '../../../utilities/components/Spinner';
import { useMainContext } from '../../../context/MainContext';

export const IngredientForm = () => {
  const { ingredientId } = useParams();
  const { ingredientRepo } = useMainContext();
  const [ingredientData, setIngredientData] = useState({
    name: "",
    unitOfMeasure: "",
    brand: "",
    supplier: "",
    costPerKg: "",
    expirationDate: "",
    batch: "",
    stock: ""
  })

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const fetchedIngredient = await ingredientRepo.getMyIngredientByid(ingredientId);
        setIngredientData(fetchedIngredient)
      } catch (error) {
        console.error('Error fetching Ingredients:', error);
      }
    }
    ingredientId && fetchIngredient();
  }, [ingredientId])
  const handleSaveIngredient = (e) => {
    e.preventDefault();
    ingredientRepo.saveIngredient(ingredientData)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngredientData({ ...ingredientData, [name]: value });
  }
  return (
    <>{ !ingredientId ? (
      <div className="">
        <header>
          <h4 className="bg-purple text-light p-2" id="ingredientHeader">New Ingredient:</h4>
        </header>
        <form className="row form-control m-0" id="userIngredientsForm">
          <ul className="p-3 gap-2 rounded-0 mb-0">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">Ingredient Name</label>
                <input type="text" name="name" className="form-control" id="name" onChange={(e) => handleChange(e)} />
              </div>
              <div className="col-md-6">
                <div className="col-md-6">

                  <label htmlFor="unitOfMeasure" className="form-label">Unit Of Measure</label>
                  <select id="unitOfMeasure" className="form-select" name="unitOfMeasure" onChange={(e) => handleChange(e)} required>
                    <option value="" name="">Choose...</option>
                    {/* <!-- <option value="Kg" name="Kg">Kg</option> --> */}
                    <option value="g" name="g">g</option>
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
                <input type="text" name="brand" className="form-control" id='brand' onChange={(e) => handleChange(e)} />
              </div>
              <div className="col-md-6">
                <label htmlFor="supplier" className="form-label">Supplier</label>
                <input type="text" name="supplier" className="form-control" id="supplier" onChange={(e) => handleChange(e)} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <label htmlFor="costPerKg" className="form-label">Cost per Kg or L</label>
                <input type="number" name="costPerKg" className="form-control" id="costPerKg" onChange={(e) => handleChange(e)} />
              </div>

              <div className="col-md-3">
                <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                <input type="date" name="expirationDate" className="form-control" id="expirationDate" onChange={(e) => handleChange(e)} />
              </div>

              <div className="col-md-3">
                <label htmlFor="batch" className="form-label">Batch</label>
                <input type="text" name="batch" className="form-control" id="batch" onChange={(e) => handleChange(e)} />
              </div>

              <div className="col-md-3">
                <label htmlFor="stock" className="form-label">Stock</label>
                <input type="number" name="stock" className="form-control" id="stock" onChange={(e) => handleChange(e)} />
              </div>
            </div>

            <div className="d-flex gap-2 mt-2 justify-content-end">
              <button className="btn myButton-primary" name="save" onClick={(e) => handleSaveIngredient(e)}>Save</button>
            </div>
          </ul>
        </form>
      </div>
    ) : ingredientData.name !== "" ? <EditIngredientForm ingredientData={ingredientData} ingredientRepository={ingredientRepo}/>
    : <Spinner />
    }</>
  )
}
