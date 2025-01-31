import React from 'react'

export const CalculatedRecipeModal = ({ recipeData, convertions, handleConvertionsModal }) => {
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <ul className='list-unstyled'>
                            <li className="modal-title">
                                {`Recipe:${recipeData.name}`}
                            </li>
                            <li>
                                {`Number of Units: ${recipeData.amount}`}
                            </li>
                            <li>
                                {`Weight per Unit: ${recipeData.weightPerUnit}g`}
                            </li>
                        </ul>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleConvertionsModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <table className="table table-light table-striped table-bordered table-hover mw-25">
                            <thead>
                                <tr>
                                    <th scope="col">Ingredient</th>
                                    <th scope="col">Weight</th>

                                </tr>
                            </thead>
                            <tbody>
                                {convertions && convertions.map((ingredient, index) => (
                                    <tr key={index}>
                                        <td>{ingredient.name}</td>
                                        <td>{ingredient.conversion} {ingredient.unitOfMeasure}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleConvertionsModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
