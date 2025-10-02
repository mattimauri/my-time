import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../../utils/api';
import styled, { keyframes } from 'styled-components';
// import { usePushSubscription } from '../hooks/usePushSubscription';


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

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fef2f2;
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

const PasswordRecoveryLink = styled(Link)`
  text-align: center;
  color: #2563eb;
  font-size: 0.875rem;
  text-decoration: none;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SecondaryButton = styled(Link)`
  width: 100%;
  background-color: white;
  color: #2563eb;
  padding: 1rem;
  border: 1px solid #2563eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f7ff;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 20rem;
  width: 90%;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const ModalSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid #d1d5db;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: ${keyframes`
    to { transform: rotate(360deg); }
  `} 1s linear infinite;
  margin: 0 auto 1rem;
`;

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: ${keyframes`
    to { transform: rotate(360deg); }
  `} 1s linear infinite;
  margin: 2rem auto;
`;

function Login() {
  const [taxCode, setTaxCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token, loading: authLoading, handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // const { subscribeUser } = usePushSubscription();


  useEffect(() => {
    if (!authLoading && user && token) {
      navigate('/', { replace: true });
    }
  }, [user, token, authLoading, navigate]);


  if (authLoading) {
    return (
      <Container>
        <FormContainer>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0' }}>
            <LoadingSpinner />
          </div>
        </FormContainer>
      </Container>
    );
  }


  if (user && token) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

      const normalizedTaxCode = taxCode.trim().toUpperCase();
      
      if (!/^[A-Za-z0-9]{16}$/.test(normalizedTaxCode)) {
        setError('Il codice fiscale deve contenere esattamente 16 caratteri alfanumerici (senza spazi)');
        setLoading(false);
        return;
      }

      // Login
      const loginData = await login(normalizedTaxCode, password);

      // Gestione push notifications (opzionale, gestisci errori)
      // try {
      //   await subscribeUser(loginData.accessToken);
      // } catch (pushError) {
      //   console.warn('Push notification subscription failed:', pushError);
      //   // Non bloccare il login se le push notifications falliscono
      // }

      // Login nel context
      const loginResult = await handleLogin({
        ...loginData,
        user: loginData.user // I dati utente sono già nella risposta login
      });

      if (loginResult.success) {
        navigate('/', { replace: true });
      } else {
        setError(loginResult.error || 'Errore durante il login');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Errore di connessione. Riprova.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <FormContainer>
          <Title>Accedi al tuo account</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
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
                disabled={loading}
                autoComplete="username"
                inputMode="text"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci la tua password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </FormGroup>
            <ButtonGroup>
              <PrimaryButton 
                type="submit" 
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? <Spinner /> : 'Accedi'}
              </PrimaryButton>
              <SecondaryButton to="/register">
                Registrati
              </SecondaryButton>
              <PasswordRecoveryLink to="/forgot-password">
                Hai dimenticato la password?
              </PasswordRecoveryLink>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </Container>

      {/* Rimuovi il modal overlay per evitare doppio loading */}
    </>
  );
}

export default Login;