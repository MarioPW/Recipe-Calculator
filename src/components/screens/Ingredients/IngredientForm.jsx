import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../utilities/Spinner';
import { useMainContext } from '../../../context/MainContext';
import { ConfirmDeleteModal } from './ingredientModals/ConfirmDeleteModal';
import { t } from 'i18next';

export const IngredientForm = () => {
  const { ingredientId } = useParams();
  const { ingredientService, ingredients, setIngredients } = useMainContext();
  const [ingredientData, setIngredientData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const emptyIngredient = {
    name: '',
    unitOfMeasure: '',
    brand: '',
    supplier: '',
    costPerKg: '',
    expirationDate: '',
    batch: '',
    stock: '',
    reference: '',
    setInInventory: true
  };

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const fetchedIngredient = await ingredientService.getMyIngredientByid(ingredientId);
        setIngredientData(fetchedIngredient);
        console.log(fetchedIngredient);
      } catch (error) {
        console.error('Error fetching Ingredients:', error);
      }
    };

    if (ingredientId) {
      fetchIngredient();
      setIsEditing(true);
    } else {
      setIngredientData(emptyIngredient);
    }
  }, [ingredientId, ingredientService]);

  const handleSaveIngredient = async (e) => {
    e.preventDefault();
    const nameExists = ingredients.some(
      (item) => item.name === ingredientData.name && item.FSId !== ingredientData.FSId
    );

    if (nameExists) {
      alert(`Ingredient named ${ingredientData.name} already exists`);
      return;
    }
    const checkHasName = ingredientData.name !== "" ? true : false
    if (!checkHasName) {
      alert("Ingredient name is required.");
      return false
    }
    try {
      setLoading(true);
      if (isEditing) {
        await ingredientService.updateMyIngredient(ingredientData.FSId, ingredientData);
        setIngredients(
          ingredients.map((item) => (item.FSId === ingredientData.FSId ? ingredientData : item))
        );
      } else {
        const newIngredientId = await ingredientService.saveIngredient(ingredientData);
        setIngredients([...ingredients, { ...ingredientData, FSId: newIngredientId }]);
        setIngredientData(emptyIngredient);
      }
    } catch (error) {
      console.error('Error saving ingredient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
    setIngredientData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  if (!ingredientData) return <Spinner />;

  return (
    <>
      <header>
        <h4 className="bg-purple text-light p-2" id="ingredientHeader">
          {ingredientData.name}:
        </h4>
      </header>
      {loading && <p className="alert alert-warning">Updating...</p>}
      <form className="row form-control m-0" id="userIngredientsForm">
        <ul className="p-3 gap-2 rounded-0 mb-0">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Ingredient Name</label>
              <input
                type="text"
                name="name"
                value={ingredientData.name}
                className="form-control"
                id="name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 d-flex gap-3">
              <div className="col">
                <label htmlFor="unitOfMeasure" className="form-label">Unit Of Measure</label>
                <select
                  id="unitOfMeasure"
                  className="form-select"
                  name="unitOfMeasure"
                  value={ingredientData.unitOfMeasure}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option value="g">g</option>
                  <option value="und">und</option>
                  <option value="mL">mL</option>
                </select>
              </div>
              <div className="col">
                <label htmlFor="reference" className="form-label">Reference</label>
                <input
                  type="text"
                  name="reference"
                  value={ingredientData.reference}
                  className="form-control"
                  id="reference"
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          <div className="row">
            <div className="col-md-6 d-flex gap-3">
              <div className="col-md-6">
                <label htmlFor="brand" className="form-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={ingredientData.brand}
                  className="form-control"
                  id="brand"
                  onChange={handleChange}
                />
              </div>
              <div className="form-check col-md-6 d-flex align-items-center">
                <div>
                  <label htmlFor="setInInventory" className="form-check-label">Set in Inventory</label>
                <input
                  id="setInInventory"
                  type="checkbox"
                  className="form-check-input"
                  checked={ingredientData.setInInventory}
                  name='setInInventory'
                  onChange={handleChange}
                />
                </div>
                
              </div>

            </div>
            <div className="col-md-6">
              <label htmlFor="supplier" className="form-label">Supplier</label>
              <input
                type="text"
                name="supplier"
                value={ingredientData.supplier}
                className="form-control"
                id="supplier"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <label htmlFor="costPerKg" className="form-label">Cost per Kg or L</label>
              <input
                type="number"
                name="costPerKg"
                value={ingredientData.costPerKg}
                className="form-control"
                id="costPerKg"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={ingredientData.expirationDate}
                className="form-control"
                id="expirationDate"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="batch" className="form-label">Batch</label>
              <input
                type="text"
                name="batch"
                value={ingredientData.batch}
                className="form-control"
                id="batch"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="stock" className="form-label">Stock</label>
              <input
                type="number"
                name="stock"
                value={ingredientData.stock}
                className="form-control"
                id="stock"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-2 justify-content-end">
            <button
              type="button"
              className="myButton-danger border-0 py-2"
              id="deleteIngredientButton"
              onClick={() => setDeleteModal(true)}
            >
              Delete
            </button>
            <button
              className="myButton-primary border-0 py-2"
              name="save"
              onClick={handleSaveIngredient}
            >
              Save Changes
            </button>
          </div>
        </ul>
      </form>
      {deleteModal && (
        <ConfirmDeleteModal
          ingredient={ingredientData}
          setDeleteModal={setDeleteModal}
          ingredientService={ingredientService}
        />
      )}
    </>
  );
};
