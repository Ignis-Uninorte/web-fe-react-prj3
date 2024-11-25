import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModuleClient from '../pages/moduleClients/main';
import '@testing-library/jest-dom'; 

// Mock `useNavigate`
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // Mock `useNavigate`
}));

jest.mock('../layouts/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div>
    <header>Mocked Header</header>
    <main>{children}</main>
  </div>
));

// Initialize QueryClient for testing
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

    // Narrow the scope to the main container
    const mainContainer = screen.getByRole('main');
    const header = within(mainContainer).getByRole('heading', { name: 'Clientes' });

    expect(header).toBeInTheDocument();

    // Check for create client button
    const createButton = within(mainContainer).getByText(/Crear Cliente/i);
    expect(createButton).toBeInTheDocument();
  });

  it('navigates to the create client page when the button is clicked', () => {
    renderWithProviders(<ModuleClient />);

    // Find the button and simulate a click
    const createButton = screen.getByText(/Crear Cliente/i);
    fireEvent.click(createButton);

    // Check if `mockNavigate` was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/crear-cliente');
  });
});
