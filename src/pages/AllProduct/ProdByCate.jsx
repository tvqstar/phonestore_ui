import { useParams } from 'react-router-dom';

import { useContext } from 'react';
import Product from '../../components/Product';

import { DataContext } from '../../Provider';

function ProdByCate() {
    const {nameCate} = useParams();
    const value = useContext(DataContext);
    const [pro] = value.products;

    const prodByCate = pro.filter((pr) => pr.category.name === nameCate)

    return (
        <div>
            <div className="row sm-gutter">
                {prodByCate?.map((pr) => (
                    <Product key={pr._id} data={pr} />
                ))}
            </div>
        </div>
    );
}

export default ProdByCate;
