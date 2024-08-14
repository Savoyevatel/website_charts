import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { useNavigate, useLocation } from 'react-router-dom';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import axios from 'axios';

function ProductListScreen() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const productList = useSelector(state => state.productList);
    const { loading, error, products, pages, page } = productList;

    const productDelete = useSelector(state => state.productDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

    const productCreate = useSelector(state => state.productCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    let keyword = location.search;

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET });

        if (!userInfo.isAdmin) {
            navigate('/login');
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts(keyword));
        }

    }, [dispatch, navigate, userInfo, keyword, successDelete, successCreate, createdProduct]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const createProductHandler = () => {
        dispatch(createProduct());
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get('/api/charts/user_download/', {
                responseType: 'blob', // Important for file downloads
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_spendings.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Error downloading CSV:", err);
        }
    };

    return (
        <div>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-end'>
                    {/* //text end right, text right middle  */}
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i>Create Product
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <div>
                            <Table striped bordered hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>PRICE</th>
                                        <th>CATEGORY</th>
                                        <th>BRAND</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>{product._id}</td>
                                            <td>{product.name}</td>
                                            <td>${product.price}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                        <Button variant='light' className='btn-sm'>
                                                            <i className='fas fa-edit'></i> Edit
                                                        </Button>
                                                    </LinkContainer>

                                                    <LinkContainer to={`/admin/product/${product._id}/sales`}>
                                                        <Button variant='info' className='btn-sm'>
                                                            <i className='fas fa-chart-line'></i> Sales
                                                        </Button>
                                                    </LinkContainer>

                                                    <LinkContainer to={`/admin/product/${product._id}/sentiment`}>
                                                        <Button variant='primary' className='btn-sm'>
                                                            <i className='fas fa-smile'></i> Sentiment
                                                        </Button>
                                                    </LinkContainer>

                                                    <Button variant='success' className='btn-sm' onClick={handleDownload}>
                                                        <i className='fas fa-download'></i> Csv
                                                    </Button>

                                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                                        <i className='fas fa-trash'></i> Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Paginate pages={pages} page={page} isAdmin={true} />
                        </div>
                    )}
        </div>
    );
}

export default ProductListScreen;
