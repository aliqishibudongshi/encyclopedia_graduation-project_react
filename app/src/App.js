import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import IndexRouter from './router/IndexRouter';
import theme from './theme';

const App = () => {
  return (
    <Provider store={store}>
        <HashRouter>
          <ConfigProvider
            theme={{
              token: { colorPrimary: theme.colorPrimary },
              components: { Button: { colorPrimary: theme.Button?.colorPrimary } },
            }}
          >
            <IndexRouter />
          </ConfigProvider>
        </HashRouter>
    </Provider>
  );
};

export default App;
