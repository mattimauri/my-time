import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { resetPassword } from '../../utils/api';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 0.75rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1f2937;

  @media (max-width: 480px) {
    font-size: 1.375rem;
    margin-bottom: 1.25rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #2563eb;
  text-decoration: none;
  margin-bottom: 1rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border-radius: 0.5rem;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: #059669;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f0fdf4;
  border-radius: 0.5rem;
  text-align: center;
`;

const InfoMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9375rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  width: 100%;
  background-color: #2563eb;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 0.9375rem;
  }
`;

const Spinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${keyframes`
    to { transform: rotate(360deg); }
  `} 1s linear infinite;
  margin: 0 auto;
`;

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Token di reset non valido o mancante');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validazione
    if (!password || password.length < 4) {
      setError('La password deve essere di almeno 4 caratteri');
      return;
    }

    if (password !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password, confirmPassword);
      setSuccess(true);
      
      // Reindirizza al login dopo 3 secondi
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante il reset della password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container>
        <FormContainer>
          <Title>Reset Password</Title>
          <ErrorMessage>Token di reset non valido o mancante</ErrorMessage>
          <BackLink to="/login">← Torna al Login</BackLink>
        </FormContainer>
      </Container>
    );
  }

  return (
    <Container>
      <FormContainer>
        <BackLink to="/login">← Torna al Login</BackLink>
        <Title>Reimposta Password</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <SuccessMessage>
            Password reimpostata con successo! Verrai reindirizzato alla pagina di login.
          </SuccessMessage>
        )}
        
        {!success && (
          <InfoMessage>
            Inserisci la tua nuova password e confermala.
          </InfoMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="password">Nuova Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la nuova password"
              required
              disabled={loading || success}
              minLength={4}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Conferma Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Conferma la nuova password"
              required
              disabled={loading || success}
              minLength={4}
            />
          </FormGroup>
          
          <ButtonGroup>
            <PrimaryButton 
              type="submit" 
              disabled={loading || success}
            >
              {loading ? <Spinner /> : 'Reimposta Password'}
            </PrimaryButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Container>
  );
}

export default ResetPassword;