import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';

// Importa il logo
import logoImage from '../assets/logoPeirano.jpeg';

const Nav = styled.nav`
  background-color: #D9B2B8;
  padding: 1rem;
  color: white;
  min-height: 100px;
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    padding: 0.75rem;
    min-height: auto;
  }
`;

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    max-width: 1200px;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  gap: 1rem;

  @media (max-width: 767px) {
    gap: 0.75rem;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 767px) {
    gap: 0.75rem;
  }
`;

const LogoImage = styled.img`
  height: 80px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;

  @media (max-width: 767px) {
    height: 60px;
  }
`;

const LogoTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 767px) {
    display: none; /* Nascondi il testo su mobile per risparmiare spazio */
  }
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 1.25rem;
  }
`;

const SubText = styled.p`
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.9;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 767px) {
    width: 100%;
    justify-content: center;
    gap: 0.75rem;
  }
`;

const NavButton = styled(Link)`
  background-color: ${props => props.primary ? '#2563eb' : 'transparent'};
  color: white;
  padding: ${props => props.primary ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  border: ${props => props.primary ? 'none' : '1px solid white'};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-width: ${props => props.primary ? '120px' : 'auto'};

  &:hover {
    background-color: ${props => props.primary ? '#1d4ed8' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }

  @media (max-width: 767px) {
    padding: ${props => props.primary ? '1rem 1.5rem' : '0.75rem 1.25rem'};
    font-size: ${props => props.primary ? '1.1rem' : '1rem'};
    flex: ${props => props.primary ? '1' : 'none'};
    min-width: ${props => props.primary ? 'auto' : '100px'};
  }

  @media (max-width: 480px) {
    padding: ${props => props.primary ? '0.9rem 1.25rem' : '0.65rem 1rem'};
    font-size: ${props => props.primary ? '1rem' : '0.9rem'};
  }
`;

const LogoutButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  &:hover {
    background-color: #dc2626;
    transform: translateY(-2px);
  }

  @media (max-width: 767px) {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    flex: 1;
    min-width: auto;
  }

  @media (max-width: 480px) {
    padding: 0.9rem 1.25rem;
    font-size: 1rem;
  }
`;

const UserInfo = styled.span`
  font-size: 0.9rem;
  margin-right: 1rem;
  display: none;

  @media (min-width: 768px) {
    display: inline;
  }
`;

function Navbar() {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <Nav>
      <Container>
        <LogoContainer to="/">
          <LogoWrapper>
            <LogoImage 
              src={logoImage} 
              alt="Peirano Bevande Logo" 
            />
            <LogoTextContainer>
              <LogoText>Peirano Bevande WorkTime</LogoText>
              <SubText>powered by Mattia Maurizio - Software Ing.</SubText>
            </LogoTextContainer>
          </LogoWrapper>
        </LogoContainer>
        
        <NavLinks>
          {user ? (
            <>
              <UserInfo>Ciao, {user.first_name || 'Utente'}</UserInfo>
              <LogoutButton onClick={handleLogoutClick}>Logout</LogoutButton>
            </>
          ) : (
            <>
              <NavButton to="/login" primary>Login</NavButton>
              <NavButton to="/register">Registrati</NavButton>
            </>
          )}
        </NavLinks>
      </Container>
    </Nav>
  );
}

export default Navbar;