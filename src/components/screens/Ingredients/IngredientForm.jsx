import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../common/Spinner';
import { useMainContext } from '../../../context/MainContext';
import { ConfirmDeleteModal } from './ingredientModals/ConfirmDeleteModal';
import { useTranslation } from 'react-i18next';
import { ingredientSchema } from '../../../validations/ingredientValidation';
import { z } from "zod";

export const IngredientForm = () => {
  const { ingredientId } = useParams();
  const { ingredientService, ingredients, setIngredients } = useMainContext();
  const [ingredientData, setIngredientData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { t } = useTranslation();

  const emptyIngredient = {
    name: '',
    unitOfMeasure: '',
    brand: '',
    supplier: '',
    costPerKg: 0,
    expirationDate: '',
    batch: '',
    stock: 0,
    reference: '',
    setInInventory: true
  };

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const fetchedIngredient = await ingredientService.getMyIngredientByid(ingredientId);
        setIngredientData(fetchedIngredient);
      } catch (error) {
        console.error(t("errors.fetch"), error);
      }
    };

    if (ingredientId) {
      fetchIngredient();
      setIsEditing(true);
    } else {
      setIngredientData(emptyIngredient);
    }
  }, [ingredientId, ingredientService, t]);

  const handleSaveIngredient = async (e) => {
    e.preventDefault();
    const nameExists = ingredients.some(
      (item) => item.name === ingredientData.name && item.FSId !== ingredientData.FSId && item.reference !== ingredientData.reference
    );

    if (nameExists) {
      alert(t("ingredientForm.nameExists", { name: ingredientData.name }));
      return;
    }

    try {
      ingredientSchema.parse(ingredientData);
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
      const message =
      error instanceof z.ZodError
          ? error.errors.map((e) => e.message).join("\n")
          : "Ha ocurrido un error de validación.";
      alert(message);
      return;
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
      <nav className='navbar navbar-expand-lg border mt-1 bg-color-main pe-2'>
        <div className='container-fluid'>
          <h2 className='navbar-brand text-light ps-2 m-0'>{ingredientData.name}</h2>
        </div>
      </nav>
      {loading && <p className="alert alert-warning m-0">{t('ingredientForm.updating')}</p>}
      <form className="row form-control m-0" id="userIngredientsForm">
        <ul className="p-3 gap-2 rounded-0 mb-0">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">{t('ingredientForm.name')}</label>
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
              <div className="col"> <label htmlFor="reference" className="form-label">{t('ingredientForm.reference')}</label>
                <input
                  type="text"
                  name="reference"
                  value={ingredientData.reference}
                  className="form-control"
                  id="reference"
                  onChange={handleChange}
                />

              </div>
              <div className="col">
                <label htmlFor="unitOfMeasure" className="form-label">{t('ingredientForm.unitOfMeasure')} </label>
                <select
                  id="unitOfMeasure"
                  className="form-select"
                  name="unitOfMeasure"
                  value={ingredientData.unitOfMeasure}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('ingredientForm.choose')}</option>
                  <option value="g">g</option>
                  <option value="und">und</option>
                  <option value="mL">mL</option>
                </select>
              </div>
            </div>

          </div>

          <div className="row">
            <div className="col-md-6 d-flex gap-3">
              <div className="col-md-6">
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
              <div className="form-check col-md-6 d-flex align-items-center">
                <div>
                  <label htmlFor="setInInventory" className="form-check-label">{t('ingredientForm.setInInventory')}</label>
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
            <div className="col-md-6 d-flex gap-3">
              <div className="col-md-6">
                <label htmlFor="minStock" className="form-label">{t('ingredientForm.minStock')}</label>
                <input
                  type="number"
                  name="minStock"
                  value={ingredientData.minStock}
                  className="form-control"
                  id="minStock"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="supplier" className="form-label">{t('ingredientForm.supplier')}</label>
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
          </div>

          <div className="row">
            <div className="col-md-3">
              <label htmlFor="costPerKg" className="form-label">{t('ingredientForm.costPerKg')}</label>
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
              <label htmlFor="expirationDate" className="form-label">{t('ingredientForm.expirationDate')}</label>
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
              <label htmlFor="batch" className="form-label">{t('ingredientForm.batch')}</label>
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
              <label htmlFor="brand" className="form-label">{t('ingredientForm.brand')}</label>
              <input
                type="text"
                name="brand"
                value={ingredientData.brand}
                className="form-control"
                id="brand"
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
              {t('ingredientForm.delete')}
            </button>
            <button
              className="myButton-primary border-0 py-2"
              name="save"
              onClick={handleSaveIngredient}
            >
              {t('ingredientForm.saveChanges')}
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
