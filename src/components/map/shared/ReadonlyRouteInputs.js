const ReadonlyRouteInputs = ({
	origin,
	destination
}) => {
	return (
		<>
			<div className="form-field form-field--disabled">
				<label htmlFor="origin">Origin</label>
                <input
                    type="text"
                    id="origin"
                    value={origin.formatted_address}
                    disabled
                />
			</div>
			<div className="form-field form-field--disabled">
				<label htmlFor="destination">Destination</label>
                <input
                    type="text"
                    id="origin"
                    value={destination.formatted_address}
                    disabled
                />
			</div>
		</>
	);
};

export default ReadonlyRouteInputs;
