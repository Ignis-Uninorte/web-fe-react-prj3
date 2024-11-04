export type Client = {
    id: number;
    nit: number;
    name: string;
    direction: string;
    city: string;
    country: string;
    corporateEmail: string;
    active: boolean;
};


export type ListClients = {
    clients: Client[];
};