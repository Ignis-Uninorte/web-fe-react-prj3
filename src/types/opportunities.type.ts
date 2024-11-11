
export type Opportunity = {
    Id: string;
    clientId: string;
    businessName: string;
    businessLine: string;
    description: string;
    estimatedValue: string;
    estimatedDate: string;
    status: string;
};

export type ListOpportunities = {
    opportunities: Opportunity[];
};