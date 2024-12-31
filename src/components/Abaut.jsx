import React from 'react';

export const Abaut = () => {
  return (
    <div className="mt-2" id="info">
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
              <p>Once your ingredients are saved, you can create your recipes.</p>
            </li>
            <hr />
            <li>
              <h5 className="text-warning">Traceability:</h5>
              <p>Make traceability of your recipes easily.</p>
            </li>
            <hr />
            <li>
              <h5 className="text-warning">Cost:</h5>
              <p>Cost your recipes easily.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};