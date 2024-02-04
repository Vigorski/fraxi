const ReadonlyRouteWaypoint = ({ waypoint }) => {
	return (
		waypoint.formatted_address ?
			<div className="form-field form-field--disabled">
				<label htmlFor="origin">Pick up location</label>
				<input type="text" id="origin" value={waypoint.formatted_address} disabled />
			</div> : null
	);
};

export default ReadonlyRouteWaypoint;
