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
 * Represents a generic object with expandable properties.
 * @typedef {Object} Expandable
 * @property {any} expand - Additional expandable properties.
 */
export type Expand<T> = {
	[key in keyof T]: T[key];
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
 * @property {string} owner - The user ID of the organization's owner.
 * @property {string[]} admins - The user IDs of the organization's admins.
 * @property {string[]} members - The user IDs of the organization's members.
 * @property {Expand} expand - Additional expandable properties.
 */
export type Organization = {
	id: string;
	name: string;
	description: string;
	logo: string;
	owner: string;
	admins: string[];
	members: string[];
	expand?: Expand<{
		admins?: OrganizationMember[];
		members?: OrganizationMember[];
	}>;
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
 * @extends {PocketBaseType}
 */
export type StarSystem = {
	id: string;
	name: string;
	code: string;
	jurisdiction: string;
	faction: string;
} & PocketBaseType;

/**
 * Represents a planet.
 * @typedef {Object} Planet
 * @property {string} id - The unique identifier of the planet.
 * @property {string} name - The name of the planet.
 * @property {string} code - A 3 character code representing the planet.
 * @property {string} star_system - The star system ID where the planet is located.
 * @property {string} jurisdiction - The jurisdiction under which the planet operates.
 * @property {string} faction - The faction that controls the planet.
 * @property {Expand} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type Planet = {
	id: string;
	name: string;
	code: string;
	star_system: string;
	jurisdiction: string;
	faction: string;
	expand?: Expand<{
		star_system?: StarSystem;
	}>;
} & PocketBaseType;

/**
 * Represents a moon.
 * @typedef {Object} Moon
 * @property {string} id - The unique identifier of the moon.
 * @property {string} name - The name of the moon.
 * @property {string} code - A 3 character code representing the moon.
 * @property {string} planet - The planet ID where the moon is located.
 * @property {string} jurisdiction - The jurisdiction under which the moon operates.
 * @property {string} faction - The faction that controls the moon.
 * @property {Expand} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type Moon = {
	id: string;
	name: string;
	code: string;
	planet: string;
	jurisdiction?: string;
	faction: string;
	expand?: Expand<{
		planet?: Planet;
	}>;
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
 * @property {string} star_system - The star system ID where the space station is located.
 * @property {string} planet - The planet ID where the space station is located.
 * @property {string} moon - The moon ID where the space station is located.
 * @property {string} orbit - The orbit where the space station is located.
 * @property {boolean} is_lagrange - Indicates if the space station is at a Lagrange point.
 * @property {Expand} expand - Additional expandable properties.
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
	expand: Expand<{
		star_system?: StarSystem;
		planet?: Planet;
		moon?: Moon;
	}>;
} & PocketBaseType;

/**
 * Represents an outpost.
 * @typedef {Object} Outpost
 * @property {string} id - The unique identifier of the outpost.
 * @property {string} name - The name of the outpost.
 * @property {string} code - A 4 character code representing the outpost.
 * @property {string} description - The description of the outpost.
 * @property {string} image - The URL of the outpost's image.
 * @property {string} organization - The organization ID that owns the outpost.
 * @property {string} star_system - The star system  IDin which the outpost is located.
 * @property {string} planet - The planet ID on which the outpost is located.
 * @property {string} moon - The moon ID on which the outpost is located. Can be null.
 * @property {number} latitude - The latitude of the outpost.
 * @property {number} longitude - The longitude of the outpost.
 * @property {string[]} space_stations - The space stations associated with the outpost.
 * @property {Expand} expand - Additional expandable properties.
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
	expand?: Expand<{
		organization?: Organization;
		star_system?: StarSystem;
		planet?: Planet;
		moon?: Moon;
		space_stations?: SpaceStations[];
	}>;
} & PocketBaseType;

/**
 * Represents a commodity from an outpost.
 * @typedef {Object} OutpostCommodities
 * @property {string} id - The unique identifier of the commodity.
 * @property {string} organization - The organization ID that owns the commodity.
 * @property {string} outpost - The outpost ID where the commodity is stored.
 * @property {string} commodity - The commodity ID.
 * @property {number} quantity - The quantity of the commodity.
 * @property {Date} updated - The date and time the commodity was last updated.
 * @property {Expand} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type OutpostCommodity = {
	id: string;
	organization: string;
	outpost: string;
	commodity: string;
	quantity: number;
	updated: Date;
	expand?: Expand<{
		organization?: Organization;
		outpost?: Outpost;
		commodity?: Commodity;
	}>;
} & PocketBaseType;

/**
 * Represents a commodity quantity change from an outpost.
 * @typedef {Object} OutpostCommodityChanges
 * @property {string} id - The unique identifier of the commodity change.
 * @property {string} organization - The organization ID that owns the commodity.
 * @property {string} outpost - The outpost ID where the commodity is stored.
 * @property {string} commodity - The commodity ID.
 * @property {number} change_quantity - The quantity of the commodity that changed.
 * @property {Date} timestamp - The date and time the commodity quantity changed.
 * @property {Expand} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type OutpostCommodityChanges = {
	id: string;
	organization: string;
	outpost: string;
	commodity: string;
	change_quantity: number;
	timestamp: Date;
	expand?: Expand<{
		organization?: Organization;
		outpost?: Outpost;
		commodity?: Commodity;
	}>;
} & PocketBaseType;

/**
 * Represents a commodity.
 * @typedef {Object} Commodity
 * @property {string} id - The unique identifier of the commodity.
 * @property {string} name - The name of the commodity.
 * @property {string} code - A 3 character code representing the commodity.
 * @property {string} type - The type of the commodity.
 * @property {number} price_buy - The buy price of the commodity.
 * @property {number} price_sell - The sell price of the commodity.
 * @property {boolean} is_illegal - Indicates if the commodity is illegal.
 * @property {Date} updated - The date and time the commodity was last updated.
 * @extends {PocketBaseType}
 */
export type Commodity = {
	id: string;
	name: string;
	code: string;
	type: string;
	price_buy: number;
	price_sell: number;
	is_illegal: boolean;
	updated: Date;
} & PocketBaseType;

/**
 * Represents a commodity type.
 * @typedef {Object} CommodityType
 * @property {string} id - The unique identifier of the commodity type.
 * @property {string} name - The name of the commodity type.
 * @extends {PocketBaseType}
 */
export type CommodityType = {
	id: string;
	name: string;
} & PocketBaseType;

/**
 * Represents a job request.
 * @typedef {Object} Jobs
 * @property {string} id - The unique identifier of the job.
 * @property {string} requestingOutpost - The outpost ID that requested the job.
 * @property {string} commodity - The commodity ID of the job.
 * @property {number} quantity - The quantity of the commodity for the job.
 * @property {string} fromOutpost - The outpost ID where the commodity is coming from.
 * @property {JobStatus} status - The status of the job. Can be 'Pending', 'Accepted', 'Completed', or 'Cancelled'.
 * @property {Date} created - The date and time the job was created.
 * @property {Date} updated - The date and time the job was last updated.
 * @property {Expand} expand - Additional expandable properties.
 * @extends {PocketBaseType}
 */
export type Job = {
	id: string;
	requestingOutpost: string;
	commodity: string;
	quantity: number;
	fromOutpost: string;
	status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
	created: Date;
	updated: Date;
	expand?: Expand<{
		requestingOutpost?: Outpost;
		commodity?: Commodity;
		fromOutpost?: Outpost;
	}>;
} & PocketBaseType;
