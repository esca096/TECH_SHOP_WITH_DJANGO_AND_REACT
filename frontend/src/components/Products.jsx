import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import '../styles/Products.css';


const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
       const fetchProducts = async () => {
        try {
            const res = await api.get('/products/?limit=5'); // fetching only 5 products
            setProducts(res.data.results || res.data); // Access the results array from products API
            console.log(res.data.results); // Log the fetched products for debugging
        }catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
            toast.error('Failed to load products.');
        }
       };

       fetchProducts();

    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Featured Products</h1>
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                            />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <button className="add-to-cart-button">
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>   
                )}
            </div>
        </div>
    );
};
export default Products;