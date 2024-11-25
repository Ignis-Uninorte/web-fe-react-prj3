import { getAllClients, toggleClientStatus, getClientByNit, getNextClientId } from '../services/clients.services';
import apiManager from '../services/api';

jest.mock('../services/api');

describe('clients.services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllClients', () => {
    it('should return all clients when API call succeeds', async () => {
      const mockClients = [{ id: 1, name: 'Client A' }, { id: 2, name: 'Client B' }];
      (apiManager.get as jest.Mock).mockResolvedValue({ data: mockClients });

      const result = await getAllClients();

      expect(apiManager.get).toHaveBeenCalledWith('/clients');
      expect(result).toEqual(mockClients);
    });

    it('should throw an error when API call fails', async () => {
      const error = new Error('API Error');
      (apiManager.get as jest.Mock).mockRejectedValue(error);

      await expect(getAllClients()).rejects.toThrow(error);
      expect(apiManager.get).toHaveBeenCalledWith('/clients');
    });
  });

  describe('toggleClientStatus', () => {
    it('should toggle client status and return updated data', async () => {
      const mockResponse = { id: 1, active: false };
      (apiManager.patch as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await toggleClientStatus(123, true);

      expect(apiManager.patch).toHaveBeenCalledWith('/clients/activate/123', { active: false });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when API call fails', async () => {
      const error = new Error('API Error');
      (apiManager.patch as jest.Mock).mockRejectedValue(error);

      await expect(toggleClientStatus(123, true)).rejects.toThrow(error);
      expect(apiManager.patch).toHaveBeenCalledWith('/clients/activate/123', { active: false });
    });
  });

  describe('getClientByNit', () => {
    it('should return client data when API call succeeds', async () => {
      const mockClient = { id: 1, name: 'Client A', nit: '12345' };
      (apiManager.get as jest.Mock).mockResolvedValue({ data: mockClient });

      const result = await getClientByNit('12345');

      expect(apiManager.get).toHaveBeenCalledWith('/clients/12345');
      expect(result).toEqual(mockClient);
    });

    it('should throw an error when API call fails', async () => {
      const error = new Error('API Error');
      (apiManager.get as jest.Mock).mockRejectedValue(error);

      await expect(getClientByNit('12345')).rejects.toThrow(error);
      expect(apiManager.get).toHaveBeenCalledWith('/clients/12345');
    });
  });

  describe('getNextClientId', () => {
    it('should return the next client ID based on existing clients', async () => {
      const mockClients = [
        { id: 1, name: 'Client A' },
        { id: 2, name: 'Client B' },
      ];
      (apiManager.get as jest.Mock).mockResolvedValue({ data: mockClients });

      const result = await getNextClientId();

      expect(apiManager.get).toHaveBeenCalledWith('/clients');
      expect(result).toBe(3); 
    });

    it('should return 1 if there are no clients', async () => {
      (apiManager.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await getNextClientId();

      expect(apiManager.get).toHaveBeenCalledWith('/clients');
      expect(result).toBe(1); 
    });

    it('should throw an error when API call fails', async () => {
      const error = new Error('API Error');
      (apiManager.get as jest.Mock).mockRejectedValue(error);

      await expect(getNextClientId()).rejects.toThrow(error);
      expect(apiManager.get).toHaveBeenCalledWith('/clients');
    });
  });
});
