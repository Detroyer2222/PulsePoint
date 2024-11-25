export type Organization = {
    id: string;
    name: string;
    description: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
    owner: string[];
    admins: string[];
    members: string[];
};

export type OrganizationMember = {
    username: string;
    id: string;
}