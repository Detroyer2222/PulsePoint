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
    expand: any;
};

export type OrganizationMember = {
    username: string;
    id: string;
}

export type StarSystem = {
    id: string;
    name: string;
    code: string;
    jurisdiction: string;
    faction: string;
    expand: any;
}

export type Planet = {
    id: string;
    name: string;
    code: string;
    star_system: string;
    jurisdiction: string;
    faction: string;
    expand: any;
};

export type Moon = {
    id: string;
    name: string;
    code: string;
    planet: string;
    jurisdiction: string;
    faction: string;
    expand: any;
};

export type SpaceStations = {
    id: string;
    name: string;
    pad_types: string;
    jurisdiction: string;
    faction: string;
    has_terminal: boolean;
    has_refinery: boolean;
    star_system: string;
    planet: string;
    moon: string;
    orbit: string
    is_lagrange: boolean;
    expand: any;
}