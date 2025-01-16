import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import IndexRouter from './router/IndexRouter';
import theme from './theme';

const App = () => {
  return (
    
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
    
  );
};

export default App;
