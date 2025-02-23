import React from 'react';

export const Abaut = () => {
  return (
    <div className="mt-5" id="info">
      <div className="d-flex justify-content-center mb-3">
        <div className="card text-bg-dark p-3">
          <ul>
            <li>
              <h5 className="text-warning">Ingredients:</h5>
              <p>Save your ingredients to create and manage your recipes.</p>
            </li>
            <hr />
            <li>
              <h5 className="text-warning">Recipes:</h5>
              <p>Combine your ingredients to craft delicious recipes with precise measurements.</p>
            </li>
            <hr />
            <li>
              <h5 className="text-warning">Traceability:</h5>
              <p>Make traceability of your recipes easily.</p>
            </li>
            <hr />
            <li>
              <h5 className="text-warning">Cost:</h5>
              <p>Calculate the cost of your recipes to maintain profitability and control.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};