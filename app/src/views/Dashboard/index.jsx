import styled from 'styled-components'
import { Outlet } from 'react-router-dom';
import Title from '../../components/Title';
import FooterNav from '../../components/FooterNav'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  overflow-y: auto;
`;
export default function Dashboard() {
    return (
        <AppContainer>
            <Title/>
            <Main>
                <Outlet></Outlet>
            </Main>
            <FooterNav></FooterNav>
        </AppContainer>
    )
}
