import React, { useRef, useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom'

export default function Signup(props) {
    const database = props.database;
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const fNameRef = useRef();
    const lNameRef = useRef();
    const ONYENRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        try {
            setError('');
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value, fNameRef.current.value, lNameRef.current.value, ONYENRef.current.value, database);
            history.push('/my-courses');
        } catch {
            setError('Failed to create an account');

        }

        setLoading(false);
    }
    return (
        <>
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
            <div className="w-100" style={{ maxWidth: "400px"}}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="name" ref={fNameRef} required />
                        </Form.Group>
                        <Form.Group id="name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="name" ref={lNameRef} required />
                        </Form.Group>
                        <Form.Group id="onyen">
                            <Form.Label>UNC ONYEN</Form.Label>
                            <Form.Control type="onyen" ref={ONYENRef} required />
                        </Form.Group>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Button disabed={loading} className="w-100 mt-3" type="submit">Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Login</Link>
            </div>
            </div>
        </Container>
        </>
    )
}