import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { forgotPassword } from '../../utils/api';

// Styled components (simili a quelli del Login)
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

function ForgotPassword() {
  const [taxCode, setTaxCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validazione codice fiscale: deve avere esattamente 16 caratteri alfanumerici, senza spazi
    const normalizedTaxCode = taxCode.trim().toUpperCase();

    if (!/^[A-Za-z0-9]{16}$/.test(normalizedTaxCode)) {
      setError('Il codice fiscale deve contenere esattamente 16 caratteri alfanumerici (senza spazi)');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(normalizedTaxCode);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante il recupero password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <BackLink to="/login">← Torna al Login</BackLink>
        <Title>Recupera Password</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <SuccessMessage>
            Una email con le istruzioni per reimpostare la password è stata inviata all'indirizzo associato al tuo codice fiscale.
          </SuccessMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="taxCode">Codice Fiscale</Label>
            <Input
              type="text"
              id="taxCode"
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
              placeholder="Inserisci il tuo codice fiscale"
              required
              disabled={loading || success}
            />
          </FormGroup>
          
          <ButtonGroup>
            <PrimaryButton 
              type="submit" 
              disabled={loading || success}
            >
              {loading ? <Spinner /> : 'Recupera Password'}
            </PrimaryButton>
          </ButtonGroup>
        </Form>
        
        {success && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>Non hai ricevuto l'email? <Link to="/login" style={{ color: '#2563eb' }}>Riprova</Link></p>
          </div>
        )}
      </FormContainer>
    </Container>
  );
}

export default ForgotPassword;