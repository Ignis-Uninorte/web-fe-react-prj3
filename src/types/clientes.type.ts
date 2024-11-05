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
    corporateEmail: string;
    active: boolean;
    contacts: Contact[]; 
};

export type ListClients = {
    clients: Client[];
};
