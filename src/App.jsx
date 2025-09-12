
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Router, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { router } from './config/routes';
import { store } from './store/store';
import { Layout } from './components/layout/Layout';


import './App.css';





// Configuracion del cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  }
})

function App() {


  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>

          {/* <Layout> */}
            <RouterProvider router={router} />
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          {/* </Layout> */}
        
        
      </QueryClientProvider>
    </Provider>
  )
}

export default App
