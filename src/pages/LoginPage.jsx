import Login from '../components/Login';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 1rem;
`;

function LoginPage() {
  return (
    <PageContainer>
      <Login />
    </PageContainer>
  );
}

export default LoginPage;