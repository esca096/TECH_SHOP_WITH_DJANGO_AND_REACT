import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import '../styles/AdminProducts.css';

const AdminProductEdit = () => {
    const {id} = useParams();
    const navigate = useNavigate(); 

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        image: ""
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/api/products/${id}`);
                console.log('Fetched product data:', res.data);
                setProduct(res.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to fetch product details.');
            }
        };
        fetchProduct();
    }, [id]);
    
    // handle file input image
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        console.log('Selected image:' + e.target.files[0]);
    };

    //handle product update, with include image update
    const handleUpdate = async (e) => {
        try {
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('description', product.description);
            formData.append('price', product.price);
            formData.append('quantity', product.quantity);
            if (image) {
                formData.append('image', image);
            }
            console.log(formData);

            await api.put(`/api/products/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product updated successfully!');
            navigate('/api/products');
        } catch (error) {
            toast.error('Failed to update product.');
            console.error(error);
        }
    };


    const handleDelete = async () => {
        try {
            await api.delete(`/api/products/${id}`);
            toast.success('Product deleted successfully!');
            navigate('/api/products');
        } catch (error) {
            toast.error('Failed to delete product.');
            console.error(error);
        }
    };
    
    return (
        <div className="admin-container">
            <h1>Edit Product</h1>
            <div>
                {product.image && (
                    <div>
                        <img src={product.image} alt={product.name}
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }} /> 
                    </div>
                )}
                {/* Form fields for the product data */}

                <input 
                    type="text" 
                    placeholder="Product Name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />

                <input 
                    type="number" 
                    placeholder="Price"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />

                <textarea 
                    placeholder="Description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />

                <div>
                    <label>Change Image</label>
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <button onClick={handleUpdate}>Update Product</button>
                <button onClick={handleDelete} style={{marginLeft: "10px", color: "white"}}>
                    Delete Product
                </button>
            </div>
        </div>
    );
}

export default AdminProductEdit;