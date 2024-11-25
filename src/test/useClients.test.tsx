import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAllClients,
  useToggleClientStatus,
  useClientData,
  useNextClientId,
} from '../hooks/useClients';
import {
  getAllClients,
  toggleClientStatus,
  getClientByNit,
  getNextClientId,
} from '../services/clients.services';

// Mock all client services
jest.mock('../services/clients.services', () => ({
  getAllClients: jest.fn(),
  toggleClientStatus: jest.fn(),
  getClientByNit: jest.fn(),
  getNextClientId: jest.fn(),
}));

const queryClient = new QueryClient();

describe('useClients Hooks', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all clients successfully with useAllClients', async () => {
    (getAllClients as jest.Mock).mockResolvedValue([{ id: 1, name: 'Client A' }]);

    const { result } = renderHook(() => useAllClients(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([{ id: 1, name: 'Client A' }]);
    expect(getAllClients).toHaveBeenCalledTimes(1);
  });

  it('toggles client status successfully with useToggleClientStatus', async () => {
    (toggleClientStatus as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useToggleClientStatus(), { wrapper });

    await result.current.mutateAsync({ clientId: 1, currentStatus: true });

    expect(toggleClientStatus).toHaveBeenCalledWith(1, true);
    expect(toggleClientStatus).toHaveBeenCalledTimes(1);
  });

  it('fetches specific client data with useClientData', async () => {
    const nit = '12345';
    (getClientByNit as jest.Mock).mockResolvedValue({ id: 1, nit: '12345', name: 'Client A' });

    const { result } = renderHook(() => useClientData(nit), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ id: 1, nit: '12345', name: 'Client A' });
    expect(getClientByNit).toHaveBeenCalledWith(nit);
    expect(getClientByNit).toHaveBeenCalledTimes(1);
  });

  it('fetches next client ID with useNextClientId', async () => {
    (getNextClientId as jest.Mock).mockResolvedValue(101);

    const { result } = renderHook(() => useNextClientId(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(101);
    expect(getNextClientId).toHaveBeenCalledTimes(1);
  });

});
