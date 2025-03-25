import { FC } from "react";

export type RouteDetails = {
	title: string,
	path: string,
	description: string
}

export type Route = {
	path: string,
	component: FC,
	roles?: string[],
	pathDetails?: RouteDetails,
}

export type RouteGroup = Route[];