import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import '../styles/Products.css';
import { useCart } from './CartContext';
import { useAuthentication } from '../auth'; 
import { useNavigate } from 'react-router-dom';


const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const { isAuthorized } = useAuthentication();
    const navigate = useNavigate();



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

    // Function to handle adding a product to the cart
    const handleAddToCart = (product) => {
        if (!isAuthorized) {
            navigate('/login'); // Redirect to login page if not authorized
        } else {
            const item = { ...product, quantity: 1 }; // default to 1 item
            addToCart(item);

            // Show success notification
            toast.success(`${product.name} added to cart!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

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
                            <button onClick={() => handleAddToCart(product)} className="add-to-cart-button">
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