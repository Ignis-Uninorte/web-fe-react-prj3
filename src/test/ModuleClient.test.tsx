import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModuleClient from '../pages/moduleClients/main';
import '@testing-library/jest-dom'; 


const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, 
}));

jest.mock('../layouts/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div>
    <header>Mocked Header</header>
    <main>{children}</main>
  </div>
));


const queryClient = new QueryClient();

describe('ModuleClient Component', () => {
  const renderWithProviders = (ui: React.ReactNode) => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{ui}</BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders the header and the create client button', () => {
    renderWithProviders(<ModuleClient />);

   
    const mainContainer = screen.getByRole('main');
    const header = within(mainContainer).getByRole('heading', { name: 'Clientes' });

    expect(header).toBeInTheDocument();

    
    const createButton = within(mainContainer).getByText(/Crear Cliente/i);
    expect(createButton).toBeInTheDocument();
  });

  it('navigates to the create client page when the button is clicked', () => {
    renderWithProviders(<ModuleClient />);

   
    const createButton = screen.getByText(/Crear Cliente/i);
    fireEvent.click(createButton);

    
    expect(mockNavigate).toHaveBeenCalledWith('/crear-cliente');
  });
});
