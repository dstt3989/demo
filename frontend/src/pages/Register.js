import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Frontend validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setSuccessMessage('');
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await registerUser(formData);
      
      // Store token if provided (for auto-login)
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      
      setSuccessMessage(res.message || 'Registration successful!');
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: ''
      });
      
      // Optionally redirect to login or dashboard
      setTimeout(() => {
        // You can redirect here, e.g., window.location.href = '/login';
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.data) {
        const { message, details } = err.response.data;
        setErrors({ 
          general: details || message || 'Registration failed. Please try again.' 
        });
      } else {
        setErrors({ 
          general: 'Network error. Please check your connection and try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Register</h2>
      
      {successMessage && (
        <div style={{ 
          color: 'green', 
          backgroundColor: '#d4edda',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {successMessage}
        </div>
      )}
      
      {errors.general && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#f8d7da',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text"
            name="name"
            placeholder="Full Name" 
            value={formData.name}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: errors.name ? '1px solid red' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
          {errors.name && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.name}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="email"
            name="email"
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: errors.email ? '1px solid red' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
          {errors.email && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password"
            name="password"
            placeholder="Password (min. 6 characters)" 
            value={formData.password}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: errors.password ? '1px solid red' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
          {errors.password && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.password}
            </div>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          style={{ 
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Register;

