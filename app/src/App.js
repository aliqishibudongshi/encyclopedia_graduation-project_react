import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import IndexRouter from './router/IndexRouter';
import theme from './theme';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
};

export default App;
