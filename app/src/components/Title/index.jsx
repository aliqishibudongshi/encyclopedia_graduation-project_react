import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: #4caf50;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 0 10px;
  box-sizing: border-box;

  .loginLogout {
    padding: 6px;
    border-radius: 5px;
    background-color: white;
    color: #4caf50;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }
`;
export default function Title() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      dispatch(logout());
    }
  };

  return (
    <Header>
      <span></span>
      <span>游戏图鉴收集助手</span>
      <button className="loginLogout" onClick={handleLoginLogout}>
        {isLoggedIn ? "退出" : "登录"}
      </button>
    </Header>
  );
}