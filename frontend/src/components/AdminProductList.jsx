// for listing products and adding products

import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../token';
import '../styles/AdminProducts.css';
import {toast} from 'react-toastify';


const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", quantity: "" });
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

    // fetch existing products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                    throw new Error('No access token found');
                }
                const res = await api.get('/api/products/', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setProducts(res.data.resuslt || []); // Access the results array from products API
            } catch (error) {
                console.error('Error getting products:', error);
                setError(error);
                toast.error('Failed to fetch products.');
            }
        };
        fetchProducts();
    }, []);


    // handle change for input products form
    const handleInputChange = (e) => {
        setNewProduct({...newProduct, [e.target.name]: e.target.value });
    };

    // handle image upload
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // handle form submission to add new product with image
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                throw new Error('No access token found');
            }
            // get the from data to include in the request
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('price', newProduct.price);
            formData.append('quantity', newProduct.quantity);
            if (image) {
                formData.append('image', image);
            }

            const res = await api.post('/api/products/', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProducts([...products, res.data]); // Add the new product to the list
            setNewProduct({ name: "", description: "", price: "", quantity: "" }); // reset form
            setImage(null);
            toast.success('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Failed to add product.');
            toast.error('Failed to add product.');
        }
    };
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="admin-container">
            <h1>Manage Products</h1>
            
            <ul>
                {products.length > 0 ? (
                    products.map((product) => (
                        <li key={product.id}>

                            {product.name} - <a href={`/api/products/${product.id}`}>Edit</a>

                        </li>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </ul>
            { /* Form to add new product */}
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name" >Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                    /> 
                </div>

                <div>
                    <label htmlFor="name">Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        required
                    /> 
                </div>

                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        required
                    /> 
                </div>

                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={newProduct.quantity}
                        onChange={handleInputChange}
                        required
                    /> 
                </div>

                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    /> 
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}
export default AdminProductList;