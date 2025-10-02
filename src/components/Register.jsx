import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../../utils/api';
import styled, { keyframes } from 'styled-components';

const FormContainer = styled.div`
  width: 100%;
  max-width: 20rem;
  margin: 2rem auto;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    max-width: 28rem;
    padding: 1.5rem;
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 0.75rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: ${spin} 1s linear infinite;
`;

function Register() {
  const [taxCode, setTaxCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token, loading: authLoading, handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect se già autenticato
  useEffect(() => {
    if (!authLoading && user && token) {
      navigate('/', { replace: true });
    }
  }, [user, token, authLoading, navigate]);

  // Mostra loading durante il controllo dell'autenticazione
  if (authLoading) {
    return (
      <FormContainer>
        <div className="flex justify-center items-center py-8">
          <Spinner />
        </div>
      </FormContainer>
    );
  }

  // Se già autenticato, non mostrare il form
  if (user && token) {
    return null;
  }

  const isButtonDisabled = () => {
    const normalizedTaxCode = taxCode.trim();
    const isTaxCodeValid = /^[A-Za-z0-9]{16}$/.test(normalizedTaxCode);
    const isPasswordValid = password.length >= 8;
    
    return !isTaxCodeValid || !isPasswordValid || loading;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedTaxCode = taxCode.trim();

    if (!/^[A-Za-z0-9]{16}$/.test(normalizedTaxCode)) {
      setError('Il codice fiscale deve contenere esattamente 16 caratteri alfanumerici (senza spazi)');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email non valida');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password deve essere di almeno 8 caratteri');
      return;
    }

    try {
      setLoading(true);
      
      // Chiamata all'API - ora restituisce l'intera response
      const response = await register(email, password, normalizedTaxCode);
      
      console.log('Risposta registrazione:', response);
      
      // Verifica che la struttura sia corretta
      if (response.data && response.data.accessToken && response.data.user) {
        handleLogin(response.data);
        navigate('/', { replace: true });
      } else {
        throw new Error('Struttura della risposta non valida');
      }
      
    } catch (err) {
      console.log('Errore registrazione:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Errore di registrazione');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>Registrati</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="taxCode">Codice Fiscale</Label>
          <Input
            type="text"
            id="taxCode"
            value={taxCode}
            onChange={(e) => setTaxCode(e.target.value)}
            required
            maxLength={16}
            placeholder="16 caratteri alfanumerici"
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email (opzionale)</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@esempio.com"
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Almeno 8 caratteri"
            disabled={loading}
          />
        </FormGroup>
        <Button type="submit" disabled={isButtonDisabled()}>
          {loading ? <Spinner /> : 'Registrati'}
        </Button>
      </Form>
    </FormContainer>
  );
}

export default Register;