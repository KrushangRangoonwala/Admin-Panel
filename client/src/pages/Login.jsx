import React, { useState } from 'react';
import { useFormik } from 'formik';
import api from '../axiosConfig';
import './Login.css';
import { useNavigate } from 'react-router';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function handleLogin() {
        try {
            const response = await api.post('/login', {
                name: formik.values.name,
                password: formik.values.password
            });
            console.log('Login response:', response);
            localStorage.setItem('UserName',formik.values.name);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            password: ''
        },
        onSubmit: values => {
            console.log('Form Data:', values);
            handleLogin();
            // add login logic here
        }
    });

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={formik.handleSubmit}>
                <h2>Login</h2>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        required
                    />
                </div>

                <div className="form-group password-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="toggle-icon">
                            <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                        </span>
                    </div>
                </div>

                <button type="submit" className="login-btn">Login</button>

                <p className="forgot">Forgot your password?</p>
            </form>
        </div>
    );
};

export default Login;
