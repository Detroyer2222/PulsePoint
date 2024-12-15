/**
 * @typedef {Object} PocketBaseType
 * @property {string} collectionId - The unique identifier for the collection.
 * @property {string} collectionName - The name of the collection.
 */
export type PocketBaseType = {
	collectionId: string;
	collectionName: string;
};

/**
 * @typedef {Object} Organization
 *
 * @property {string} id - The unique identifier of the organization.
 * @property {string} name - The name of the organization.
 * @property {string} description - The description of the organization.
 * @property {string} logo - The URL of the organization's logo.
 * @property {string} createdAt - The date and time the organization was created.
 * @property {string} updatedAt - The date and time the organization was last updated.
 * @property {string} owner - The username of the organization's owner.
 * @property {string[]} admins - The usernames of the organization's admins.
 * @property {string[]} members - The usernames of the organization's members.
 * @property {any} expand - Additional expandable properties.
 */
export type Organization = {
	id: string;
	name: string;
	description: string;
	logo: string;
	owner: string;
	admins: string[];
	members: string[];
	expand?: any;
} & PocketBaseType;

/**
 * Represents a member of an organization.
 * @typedef {Object} OrganizationMember
 * @property {string} username - The username of the member.
 * @property {string} id - The unique identifier of the member.
 * @extends {PocketBaseType}
 */
export type OrganizationMember = {
	username: string;
	id: string;
} & PocketBaseType;

/**
 * Represents a star system.
 * @typedef {Object} StarSystem
 * @property {string} id - The unique identifier of the star system.
 * @property {string} name - The name of the star system.
 * @property {string} code - A 2 character code representing the star system.
 * @property {string} jurisdiction - The jurisdiction under which the star system operates.
 * @property {string} faction - The faction that controls the star system.
 * @property {any} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type StarSystem = {
	id: string;
	name: string;
	code: string;
	jurisdiction: string;
	faction: string;
	expand?: any;
} & PocketBaseType;

/**
 * Represents a planet.
 * @typedef {Object} Planet
 * @property {string} id - The unique identifier of the planet.
 * @property {string} name - The name of the planet.
 * @property {string} code - A 3 character code representing the planet.
 * @property {string} star_system - The star system where the planet is located.
 * @property {string} jurisdiction - The jurisdiction under which the planet operates.
 * @property {string} faction - The faction that controls the planet.
 * @property {any} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type Planet = {
	id: string;
	name: string;
	code: string;
	star_system: string;
	jurisdiction: string;
	faction: string;
	expand?: any;
} & PocketBaseType;

/**
 * Represents a moon.
 * @typedef {Object} Moon
 * @property {string} id - The unique identifier of the moon.
 * @property {string} name - The name of the moon.
 * @property {string} code - A 3 character code representing the moon.
 * @property {string} planet - The planet where the moon is located.
 * @property {string} jurisdiction - The jurisdiction under which the moon operates.
 * @property {string} faction - The faction that controls the moon.
 * @property {any} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type Moon = {
	id: string;
	name: string;
	code: string;
	planet: string;
	jurisdiction?: string;
	faction: string;
	expand?: any;
} & PocketBaseType;

/**
 * Represents a space station.
 * @typedef {Object} SpaceStations
 * @property {string} id - The unique identifier of the space station.
 * @property {string} name - The name of the space station.
 * @property {string} pad_types - The types of pads available at the space station.
 * @property {string} jurisdiction - The jurisdiction under which the space station operates.
 * @property {string} faction - The faction that controls the space station.
 * @property {boolean} has_terminal - Indicates if the space station has a terminal.
 * @property {boolean} has_refinery - Indicates if the space station has a refinery.
 * @property {string} star_system - The star system where the space station is located.
 * @property {string} planet - The planet where the space station is located.
 * @property {string} moon - The moon where the space station is located.
 * @property {string} orbit - The orbit where the space station is located.
 * @property {boolean} is_lagrange - Indicates if the space station is at a Lagrange point.
 * @property {any} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
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
	orbit: string;
	is_lagrange: boolean;
	expand: any;
} & PocketBaseType;

/**
 * Represents an outpost.
 * @typedef {Object} Outpost
 * @property {string} id - The unique identifier of the outpost.
 * @property {string} name - The name of the outpost.
 * @property {string} code - A 4 character code representing the outpost.
 * @property {string} description - The description of the outpost.
 * @property {string} image - The URL of the outpost's image.
 * @property {string} organization - The organization that owns the outpost.
 * @property {string} star_system - The star system in which the outpost is located.
 * @property {string} planet - The planet on which the outpost is located.
 * @property {string} moon - The moon on which the outpost is located. Can be null.
 * @property {number} latitude - The latitude of the outpost.
 * @property {number} longitude - The longitude of the outpost.
 * @property {string[]} space_stations - The space stations associated with the outpost.
 * @property {any} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type Outpost = {
	id: string;
	name: string;
	code: string;
	description: string;
	image: string;
	organization: string;
	star_system: string;
	planet: string;
	moon: string;
	latitude: number;
	longitude: number;
	space_stations: string[];
	expand?: any;
} & PocketBaseType;
