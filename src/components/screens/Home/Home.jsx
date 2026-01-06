import React from 'react';
import { useMainContext } from '../../../context/MainContext';
import { useTranslation } from 'react-i18next';

export const Home = () => {
    const { user } = useMainContext();
    const { t } = useTranslation();

    return (
        <div className="container my-5">
            <div className="row g-4">
                <div className="col-md-8">
                    <div className={`${user ? "bento-item bento-tall" : "bento-item bento-tall disabled"}`}>
                        <img src="https://res.cloudinary.com/dgovs6wlm/image/upload/v1740802234/samples/food/df2a46a8-892e-4825-9dec-bc289b0ab9a5_vft5n9.webp" alt="Cheff" />
                        <div className="bento-content">
                            <h3 className='text-warning'>{t('recipeMaster.title')}</h3>
                            <p>{t('recipeMaster.description')}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="bento-item">
                                <img src="https://res.cloudinary.com/dgovs6wlm/image/upload/v1684598480/samples/food/spices.jpg" alt="Food" />
                                <div className="bento-content">
                                    <h4 className='text-warning'>{t('rMingredients.title')}</h4>
                                    <p>{t('rMingredients.description')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="bento-item">
                                <img src="https://images.unsplash.com/photo-1493770348161-369560ae357d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxmb29kfGVufDB8MHx8fDE3MjEwNDI2MTR8MA&ixlib=rb-4.0.3&q=80&w=1080" alt="Technology" />
                                <div className="bento-content">
                                    <h4 className='text-warning'>{t('rMrecipes.title')}</h4>
                                    <p>{t('rMrecipes.description')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bento-item">
                        <img src="https://res.cloudinary.com/dgovs6wlm/image/upload/v1740804865/samples/food/Traceability-1_x4eaju.png" alt="Travel" />
                        <div className="bento-content">
                            <h4 className='text-warning'>{t('rMtraceability.title')}</h4>
                            <p>{t('rMtraceability.description')}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bento-item">
                        <img src="https://www.budgetbytes.com/wp-content/uploads/2013/07/How-to-Calculate-Recipe-Costs-H-768x576.jpg" alt="Art" />
                        <div className="bento-content">
                            <h4 className='text-warning'>{t('rMcost.title')}</h4>
                            <p>{t('rMcost.description')}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bento-item">
                        <img src="https://img.freepik.com/premium-photo/chef-checking-inventory-levels-ingredients-restaurant-kitchen-pantry_1269612-12535.jpg" alt="Sport" />
                        <div className="bento-content">
                            <h4 className='text-warning'>{t('rMinventory.title')}</h4>
                            <p>{t('rMinventory.description')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
