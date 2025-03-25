import { CachedWaypointInfo, DirectionsResult } from 'types/map';

type ReducerState = {
  selectedMarker?: CachedWaypointInfo;
  directions?: DirectionsResult;
  distance?: string;
  duration?: string;
  cachedWaypointsInfo: CachedWaypointInfo[];
};

export enum MapActionTypes {
  SET_SELECTED_MARKER,
  SET_DIRECTIONS,
  SET_DISTANCE,
  SET_DURATION,
  ADD_CACHED_WAYPOINT,
}

type Action =
  | { type: MapActionTypes.SET_SELECTED_MARKER; payload?: CachedWaypointInfo }
  | { type: MapActionTypes.SET_DIRECTIONS; payload: DirectionsResult }
  | { type: MapActionTypes.SET_DISTANCE; payload: string }
  | { type: MapActionTypes.SET_DURATION; payload: string }
  | { type: MapActionTypes.ADD_CACHED_WAYPOINT; payload: CachedWaypointInfo };

export const initialMapState: ReducerState = {
  selectedMarker: undefined,
  directions: undefined,
  distance: undefined,
  duration: undefined,
  cachedWaypointsInfo: [],
};

export function mapReducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case MapActionTypes.SET_SELECTED_MARKER:
      return { ...state, selectedMarker: action.payload };
    case MapActionTypes.SET_DIRECTIONS:
      return { ...state, directions: action.payload };
    case MapActionTypes.SET_DISTANCE:
      return { ...state, distance: action.payload };
    case MapActionTypes.SET_DURATION:
      return { ...state, duration: action.payload };
    case MapActionTypes.ADD_CACHED_WAYPOINT:
      return {
        ...state,
        cachedWaypointsInfo: [...state.cachedWaypointsInfo, action.payload],
      };
    default:
      return state;
  }
}
