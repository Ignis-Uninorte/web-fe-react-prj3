export type Contact = {
    name: string;
    lastName: string;
    email: string;
    phone: string;
};

export type Client = {
    id: number;
    nit: number;
    name: string;
    address: string;
    city: string;
    country: string;
    email: string;
    activo: boolean;
};

export type ListClients = {
    clients: Client[];
};
