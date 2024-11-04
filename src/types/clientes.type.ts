export type Client = {
    id: number;
    nit: number;
    name: string;
    direction: string;
    city: string;
    country: string;
    email: string;
    activo: boolean;
};


export type ListClients = {
    clients: Client[];
};