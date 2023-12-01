import { useContext } from 'react';
import Product from '../../components/Product';

import { DataContext } from '../../Provider';

function AllProduct() {
    const value = useContext(DataContext);
    const [pro] = value.products;
    // const addCart = value.addCart;

    return (
        <div>
            <div className="row sm-gutter">
                {pro.map((pr) => (
                    <Product key={pr._id} data={pr} />
                ))}
            </div>
        </div>
    );
}

export default AllProduct;
