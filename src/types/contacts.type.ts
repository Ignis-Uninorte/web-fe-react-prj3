
export type Contact = {
    idCliente: number;
    id: number;
    name: string;
    lastname: string;
    email: string;
    phone: string;
};

export type ListContacts = {
    contacts: Contact[];
};