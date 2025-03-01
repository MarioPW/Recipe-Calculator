import React from 'react'
import { useMainContext } from '../context/MainContext';
import { Link } from 'react-router-dom';
export const Home = () => {
    const { setRecipe, user } = useMainContext();

    return (
        <div className="container my-5">
            <div className="row g-4">
                <div className="col-md-8">
                <div className={`${user ? "bento-item bento-tall" : "bento-item bento-tall disabled"}`}>
                        <img src="https://res.cloudinary.com/dgovs6wlm/image/upload/v1740802234/samples/food/df2a46a8-892e-4825-9dec-bc289b0ab9a5_vft5n9.webp" alt="Cheff" />
                        <div className="bento-content">
                            <h3 className='text-warning'>Recipe Master</h3>
                            <p>Create and manage your culinary creations with ease.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="bento-item">
                                <img src="https://res.cloudinary.com/dgovs6wlm/image/upload/v1684598480/samples/food/spices.jpg" alt="Food" />
                                <div className="bento-content">
                                    <h4 className='text-warning'>Ingredients</h4>
                                    <p>Save your ingredients to create and manage your recipes.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="bento-item">
                                <img src="https://images.unsplash.com/photo-1493770348161-369560ae357d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxmb29kfGVufDB8MHx8fDE3MjEwNDI2MTR8MA&ixlib=rb-4.0.3&q=80&w=1080" alt="Technology" />
                                <div className="bento-content">
                                    <h4 className='text-warning'>Recipes</h4>
                                    <p>Combine your ingredients to craft delicious recipes with precise measurements.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bento-item">
                        <img src="https://res.cloudinary.com/dgovs6wlm/image/upload/v1740804865/samples/food/Traceability-1_x4eaju.png" alt="Travel" />
                        <div className="bento-content">
                            <h4 className='text-warning'>Traceability</h4>
                            <p>Make traceability of your recipes easily.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bento-item">
                        <img src="https://www.budgetbytes.com/wp-content/uploads/2013/07/How-to-Calculate-Recipe-Costs-H-768x576.jpg" alt="Art" />
                        <div className="bento-content">
                            <h4 className='text-warning'>Cost</h4>
                            <p>Calculate the cost of your recipes to maintain profitability and control.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bento-item">
                        <img src="https://img.freepik.com/premium-photo/chef-checking-inventory-levels-ingredients-restaurant-kitchen-pantry_1269612-12535.jpg" alt="Sport" />
                        <div className="bento-content">
                            <h4 className='text-warning'>Inventory</h4>
                            <p>Manage your ingredients stock and inventory.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
