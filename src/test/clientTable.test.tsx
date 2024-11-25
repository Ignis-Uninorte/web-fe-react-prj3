import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClientTable from '../pages/moduleClients/components/clientTable';
import { useAllClients, useToggleClientStatus } from '../hooks/useClients';
import '@testing-library/jest-dom';

jest.mock('../hooks/useClients');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ClientTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockClients = [
    {
      id: 1,
      nit: 123,
      name: 'Client A',
      corporateEmail: 'clienta@example.com',
      active: true,
    },
    {
      id: 2,
      nit: 456,
      name: 'Client B',
      corporateEmail: 'clientb@example.com',
      active: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAllClients as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockClients,
    });
    (useToggleClientStatus as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
  });

  it('toggles client status when the toggle button is clicked', () => {
    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );

    const toggleButtons = screen.getAllByText('Inactivar');
    fireEvent.click(toggleButtons[0]);

    const { mutate } = useToggleClientStatus();
    expect(mutate).toHaveBeenCalledWith(
      { clientId: 123, currentStatus: true },
      expect.any(Object) 
    );
  });

  it('navigates to the update client page when "Actualizar" button is clicked', () => {
    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );

    const updateButtons = screen.getAllByText('Actualizar');
    fireEvent.click(updateButtons[0]); 

    expect(mockNavigate).toHaveBeenCalledWith('/crear-cliente/123');
  });

  it('navigates to the client detail page when the client name is clicked', () => {
    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );

    const clientName = screen.getByText('Client A');
    fireEvent.click(clientName); 

    expect(mockNavigate).toHaveBeenCalledWith('/client/Client%20A');
  });

  it('renders loading state', () => {
    (useAllClients as jest.Mock).mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: null,
    });

    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useAllClients as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: null,
    });

    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );

    expect(screen.getByText('Hubo un error')).toBeInTheDocument();
  });

  it('renders clients table successfully', async () => {
    (useAllClients as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockClients,
    });

    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Client A')).toBeInTheDocument();
      expect(screen.getByText('Client B')).toBeInTheDocument();
    });
  });

  it('calls toggleClientStatus when "Inactivar" button is clicked', async () => {
    const mockToggleClientStatus = jest.fn();
    (useAllClients as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockClients,
    });
    (useToggleClientStatus as jest.Mock).mockReturnValue({
      mutate: mockToggleClientStatus,
    });

    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );

    const inactivateButton = await screen.findByText('Inactivar');
    fireEvent.click(inactivateButton);

    expect(mockToggleClientStatus).toHaveBeenCalledWith(
      { clientId: 123, currentStatus: true },
      expect.any(Object)
    );
  });

  it('navigates to the update client page when "Actualizar" button is clicked', async () => {
    (useAllClients as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockClients,
    });
  
    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );
  
    const updateButtons = await screen.findAllByText('Actualizar');
    fireEvent.click(updateButtons[0]);
  
    expect(mockNavigate).toHaveBeenCalledWith('/crear-cliente/123');
  });

  it('navigates to the client detail page when client name is clicked', async () => {
    (useAllClients as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockClients,
    });

    render(
      <BrowserRouter>
        <ClientTable />
      </BrowserRouter>
    );

    const clientName = await screen.findByText('Client A');
    fireEvent.click(clientName);

    expect(mockNavigate).toHaveBeenCalledWith('/client/Client%20A');
  });
});
