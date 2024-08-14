import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function SearchBox() {
    const [keyword, setKeyword] = useState('');
    const [showInput, setShowInput] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword) {
            navigate(`/?keyword=${keyword}&page=1`);
        } else {
            navigate(navigate(location.path));
        }
    }

    const toggleInputVisibility = () => {
        setShowInput(true);
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {showInput && (
                    <Form.Control
                        type='text'
                        name='q'
                        onChange={(e) => setKeyword(e.target.value)}
                        className='mr-sm-2 ml-sm-5'
                        autoFocus
                        style={{ marginRight: '5px' }}
                    />
                )}
                {!showInput && (
                    <Button
                        type='button'
                        variant='outline-dark'
                        className='p-2'
                        onClick={toggleInputVisibility}
                    >
                        <i className='fas fa-magnifying-glass'></i>
                    </Button>
                )}
                {showInput && (
                    <Button
                        type='submit'
                        variant='outline-dark'
                        className='p-2'
                    >
                        <i className='fas fa-magnifying-glass'></i>
                    </Button>
                )}
            </div>
        </Form>
    );
}

export default SearchBox;
