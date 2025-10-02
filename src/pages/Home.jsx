import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateWorkingStatus, updateUserProfile, getUsers } from '../../utils/api';
import styled, { keyframes } from 'styled-components';

// Styled components (unchanged)
const Container = styled.div`
  width: 100%;
  max-width: 48rem;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const ProfileSection = styled.div`
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
`;

const EditButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

const Text = styled.p`
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-weight: 600;
  min-width: 120px;
`;

const Value = styled.span`
  flex: 1;
  text-align: right;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #10b981;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: ${spin} 1s linear infinite;
  margin-right: 0.5rem;
`;

const SaveButton = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  
  &:hover:not(:disabled) {
    background-color: #059669;
  }
  
  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background-color: #dc2626;
  }
  
  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const ToggleLabel = styled.label`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const ToggleInput = styled.input`
  appearance: none;
  width: 3.5rem;
  height: 2rem;
  background-color: #d1d5db;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;

  &:checked { 
    background-color: #2563eb; 
  }

  &:before {
    content: '';
    position: absolute;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background-color: white;
    top: 0.125rem;
    left: 0.125rem;
    transition: transform 0.2s;
  }

  &:checked:before { 
    transform: translateX(1.5rem); 
  }
  
  &:disabled { 
    background-color: #e5e7eb; 
    cursor: not-allowed; 
  }
`;

const ToggleStatus = styled.span`
  font-size: 1rem;
  margin-top: 0.5rem;
  color: ${props => props.active ? '#166534' : '#991b1b'};
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 1rem;
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #fef2f2;
  border-radius: 0.25rem;
  border: 1px solid #fecaca;
`;

const SuccessMessage = styled.p`
  color: #10b981;
  font-size: 1rem;
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f0fdf4;
  border-radius: 0.25rem;
  border: 1px solid #bbf7d0;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Card = styled.div`
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;

  &:hover { 
    background-color: #e5e7eb; 
  }
`;

const StatusChip = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
  background-color: ${props => props.active ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.active ? '#166534' : '#991b1b'};
  border: 1px solid ${props => props.active ? '#bbf7d0' : '#fecaca'};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 20rem;
  text-align: center;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
`;

const ConfirmButton = styled(ModalButton)`
  background-color: #2563eb;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
  
  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

const CancelModalButton = styled(ModalButton)`
  background-color: #e5e7eb;
  color: #374151;
  border: 1px solid #d1d5db;
  
  &:hover:not(:disabled) {
    background-color: #d1d5db;
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

// Custom debounce function (no external dependencies)
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Utility to format date
const formatDate = (date) => (date ? new Date(date).toLocaleDateString('it-IT') : 'Mancante');

function Home() {
  const { user, handleLogin } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Consolidated state
  const [state, setState] = useState({
    error: '',
    success: '',
    allUsers: [],
    loadingUsers: false,
    isModalOpen: false,
    isEditing: false,
    isSaving: false,
    profile: {
      email: '',
      first_name: '',
      last_name: '',
      address: '',
      birth_date: '',
      working_status: false,
    },
  });

  // Track debounce state to prevent multiple rapid clicks
  const isDebouncingRef = useRef(false);

  // Validate handleLogin on mount
  useEffect(() => {
    if (typeof handleLogin !== 'function') {
      console.error('handleLogin is not a function on mount');
      setState((prev) => ({
        ...prev,
        error: 'Errore: contesto utente non valido. Alcune funzionalità potrebbero non funzionare.',
      }));
    }
  }, [handleLogin]);

  // Initialize profile from user
  useEffect(() => {
    if (user) {
      setState((prev) => ({
        ...prev,
        profile: {
          email: user.email || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          address: user.address || '',
          birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '',
          working_status: user.working_status || false,
        },
      }));
    }
  }, [user]);

  // Load admin users
  useEffect(() => {
    if (user?.role === 'admin') {
      setState((prev) => ({ ...prev, loadingUsers: true }));
      getUsers()
        .then((res) =>
          setState((prev) => ({
            ...prev,
            allUsers: res.utenti.filter((u) => u.role !== 'admin'),
            loadingUsers: false,
          }))
        )
        .catch((err) => {
          console.error('Error fetching users:', err);
          setState((prev) => ({ ...prev, error: 'Errore caricamento utenti', loadingUsers: false }));
        });
    }
  }, [user]);

  // Debounced edit handler
  const handleEditClick = useCallback(
    debounce(() => {
      if (isDebouncingRef.current) return;
      isDebouncingRef.current = true;
      setState((prev) => ({ ...prev, isEditing: true, error: '', success: '' }));
      setTimeout(() => {
        isDebouncingRef.current = false;
      }, 300);
    }, 300),
    []
  );

  // Cancel edit
  const handleCancelEdit = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isEditing: false,
      error: '',
      success: '',
      profile: {
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        address: user?.address || '',
        birth_date: user?.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '',
        working_status: user?.working_status || false,
      },
    }));
  }, [user]);

  // Input change handler
  const handleInputChange = useCallback((field, value) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  }, []);

  // Working status mutation
  const workingStatusMutation = useMutation({
    mutationFn: () => updateWorkingStatus(user.id, !state.profile.working_status),
    onSuccess: () => {
      const newStatus = !state.profile.working_status;
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, working_status: newStatus },
        success: 'Stato lavorativo aggiornato con successo',
        error: '',
        isModalOpen: false,
      }));
      if (typeof handleLogin === 'function') {
        handleLogin({
          user: { ...user, working_status: newStatus },
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken'),
        });
      } else {
        console.error('handleLogin is not a function');
        setState((prev) => ({
          ...prev,
          error: 'Errore: contesto utente non valido. Stato aggiornato localmente.',
        }));
      }
      setTimeout(() => setState((prev) => ({ ...prev, success: '' })), 3000);
    },
    onError: (err) => {
      console.error('Working status update error:', err);
      setState((prev) => ({
        ...prev,
        error: err?.response?.data?.error || 'Errore aggiornamento stato',
        isModalOpen: false,
      }));
    },
  });

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: () => updateUserProfile(user.id, state.profile),
    onMutate: () => {
      setState((prev) => ({ ...prev, isSaving: true }));
    },
    onSuccess: (data) => {
      setState((prev) => ({
        ...prev,
        profile: {
          email: data.user.email || '',
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          address: data.user.address || '',
          birth_date: data.user.birth_date ? new Date(data.user.birth_date).toISOString().split('T')[0] : '',
          working_status: data.user.working_status || false,
        },
        isEditing: false,
        isSaving: false,
        success: 'Profilo aggiornato con successo',
        error: '',
      }));
      if (typeof handleLogin === 'function') {
        handleLogin({
          user: data.user,
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken'),
        });
      } else {
        console.error('handleLogin is not a function');
        setState((prev) => ({
          ...prev,
          error: 'Errore: contesto utente non valido. Profilo aggiornato localmente.',
        }));
      }
      setTimeout(() => setState((prev) => ({ ...prev, success: '' })), 3000);
    },
    onError: (err) => {
      console.error('Profile update error:', err);
      setState((prev) => ({
        ...prev,
        isSaving: false,
        error: err?.response?.data?.error || 'Errore aggiornamento profilo',
        success: '',
      }));
    },
  });

  // Handlers
  const handleToggleClick = () => setState((prev) => ({ ...prev, isModalOpen: true }));
  const handleConfirm = () => workingStatusMutation.mutate();
  const handleCancel = () => setState((prev) => ({ ...prev, isModalOpen: false }));
  const handleSaveClick = () => {
    setState((prev) => ({ ...prev, error: '', success: '' }));
    profileMutation.mutate();
  };

  const handleCardClick = (taxCode) => {
    if (!taxCode) {
      setState((prev) => ({ ...prev, error: 'Codice fiscale non valido' }));
      return;
    }
    navigate(`/timetable?tax_code=${taxCode}`);
  };

  // Guard against missing user
  if (!user) {
    return <Container><Text>Caricamento...</Text></Container>;
  }

  return (
    <Container>
      <Title>Benvenuto {user.first_name} {user.last_name}</Title>

      {user.role === 'admin' ? (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Lista Utenti</h2>
          {state.loadingUsers ? (
            <Text>Caricamento utenti...</Text>
          ) : (
            <CardList>
              {state.allUsers.map((u) => (
                <Card key={u.id} onClick={() => handleCardClick(u.tax_code)}>
                  <strong>{u.first_name} {u.last_name}</strong>
                  <p>{u.tax_code}</p>
                  <StatusChip active={u.working_status}>
                    {u.working_status ? 'Occupato' : 'Non occupato'}
                  </StatusChip>
                </Card>
              ))}
            </CardList>
          )}
        </>
      ) : (
        <>
          <ProfileSection>
            <ProfileHeader>
              <SectionTitle>Profilo Utente</SectionTitle>
              {!state.isEditing && (
                <EditButton onClick={handleEditClick} disabled={state.isSaving}>
                  Modifica
                </EditButton>
              )}
            </ProfileHeader>

            <Text>
              <Label>Email:</Label>
              {state.isEditing ? (
                <Input
                  type="email"
                  value={state.profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={state.isSaving}
                />
              ) : (
                <Value>{user.email || 'Mancante'}</Value>
              )}
            </Text>

            <Text>
              <Label>Nome:</Label>
              {state.isEditing ? (
                <Input
                  type="text"
                  value={state.profile.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  disabled={state.isSaving}
                />
              ) : (
                <Value>{user.first_name || 'Mancante'}</Value>
              )}
            </Text>

            <Text>
              <Label>Cognome:</Label>
              {state.isEditing ? (
                <Input
                  type="text"
                  value={state.profile.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  disabled={state.isSaving}
                />
              ) : (
                <Value>{user.last_name || 'Mancante'}</Value>
              )}
            </Text>

            <Text>
              <Label>Indirizzo:</Label>
              {state.isEditing ? (
                <Input
                  type="text"
                  value={state.profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={state.isSaving}
                />
              ) : (
                <Value>{user.address || 'Mancante'}</Value>
              )}
            </Text>

            <Text>
              <Label>Data di nascita:</Label>
              {state.isEditing ? (
                <Input
                  type="date"
                  value={state.profile.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  disabled={state.isSaving}
                />
              ) : (
                <Value>{formatDate(user.birth_date)}</Value>
              )}
            </Text>

            {state.isEditing && (
              <ButtonGroup>
                <CancelButton onClick={handleCancelEdit} disabled={state.isSaving}>
                  Annulla
                </CancelButton>
                <SaveButton onClick={handleSaveClick} disabled={state.isSaving}>
                  {state.isSaving ? (
                    <>
                      <Spinner />
                      Salvataggio...
                    </>
                  ) : (
                    'Salva'
                  )}
                </SaveButton>
              </ButtonGroup>
            )}
          </ProfileSection>

          <ToggleContainer>
            <ToggleLabel>Stato Lavorativo</ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={state.profile.working_status}
              onChange={handleToggleClick}
              disabled={workingStatusMutation.isLoading || state.isSaving}
            />
            <ToggleStatus active={state.profile.working_status}>
              {state.profile.working_status ? 'Occupato' : 'Non occupato'}
            </ToggleStatus>
          </ToggleContainer>

          {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
          {state.success && <SuccessMessage>{state.success}</SuccessMessage>}

          {state.isModalOpen && (
            <ModalOverlay>
              <ModalContent>
                <p>Confermi di modificare il tuo stato lavorativo?</p>
                <ModalButtons>
                  <CancelModalButton onClick={handleCancel} disabled={workingStatusMutation.isLoading}>
                    No
                  </CancelModalButton>
                  <ConfirmButton onClick={handleConfirm} disabled={workingStatusMutation.isLoading}>
                    {workingStatusMutation.isLoading ? (
                      <>
                        <Spinner />
                        Attendi...
                      </>
                    ) : (
                      'Sì'
                    )}
                  </ConfirmButton>
                </ModalButtons>
              </ModalContent>
            </ModalOverlay>
          )}
        </>
      )}
    </Container>
  );
}

export default Home;