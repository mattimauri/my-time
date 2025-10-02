import Register from '../components/Register';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 1rem;
`;

function RegisterPage() {
  return (
    <PageContainer>
      <Register />
    </PageContainer>
  );
}

export default RegisterPage;