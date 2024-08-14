import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { useParams, useNavigate } from 'react-router-dom';
import { listProductsDetails } from '../actions/productActions';

function SalesScreen() {
    const { id: productId } = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [totalItemsPurchased, setTotalItemsPurchased] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [cost, setCost] = useState(0);
    const [net, setNet] = useState(0);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { error, loading, product } = productDetails;

    useEffect(() => {
        if (!product.price || product._id !== Number(productId)) {
            dispatch(listProductsDetails(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setTotalItemsPurchased(product.total_items_purchased);
            setTotalEarnings(product.price * product.total_items_purchased);
            setCost(product.price * 0.8);
            setNet(product.price * 0.2 * product.total_items_purchased) // Calculate cost as 90% of price
        }
    }, [product, dispatch, productId]);

    const submitHandler = (e) => {
        e.preventDefault();
        // Add any submission logic here if needed
    };

    return (
        <div>
            <Link to='/admin/productlist'>
                Go Back
            </Link>
            <FormContainer>
                <h2>{name}</h2>
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='price'>
                            <Form.Label>Price per unit</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter price'
                                value={`$${price}`}
                                onChange={(e) => setPrice(e.target.value)}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group controlId='cost'>
                            <Form.Label>Cost per unit</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter cost'
                                value={`$${cost.toFixed(2)}`} // Display cost as 90% of price
                                onChange={(e) => setCost(e.target.value)}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group controlId='category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group controlId='countinstock'>
                            <Form.Label>Items in Stock</Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter stock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                    readOnly
                                />
                                {countInStock === 0 ? (
                                    <span style={{ color: 'red', marginLeft: '10px' }}>Out of stock</span>
                                ) : countInStock < totalItemsPurchased ? (
                                    <span style={{ color: 'yellow', marginLeft: '10px' }}>Low stock</span>
                                ) : null}
                            </div>
                        </Form.Group>

                        <Form.Group controlId='totalitemspurchased'>
                            <Form.Label>Current Sales</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter total items purchased'
                                value={totalItemsPurchased}
                                onChange={(e) => setTotalItemsPurchased(e.target.value)}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group controlId='totalearnings'>
                            <Form.Label>Gross Income</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter total earnings'
                                value={`$${totalEarnings.toFixed(2)}`}
                                onChange={(e) => setTotalEarnings(e.target.value)}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group controlId='totalnet'>
                            <Form.Label>Net Income</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter total net earnings'
                                value={`$${net.toFixed(2)}`}
                                onChange={(e) => setNet(e.target.value)}
                                readOnly
                            />
                        </Form.Group>

                    </Form>
                )}
            </FormContainer>
        </div>
    );
}

export default SalesScreen;
