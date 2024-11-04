import { useQuery, UseQueryResult} from '@tanstack/react-query';
import { getAllClients } from '../services/clients.services';
import { ListClients } from '../types/clientes.type';


export const useGetClients = () : UseQueryResult<ListClients, Error> => {
    return useQuery<ListClients, Error>({
        queryKey: ['clientsquery'], //clave para identificar la consulta
        queryFn: () => getAllClients(), //función que se ejecuta para obtener los datos
    });
};

