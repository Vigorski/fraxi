import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import FormikSelect from 'components/forms/FormikSelect';
import Layout from 'layout/Layout';
import DriverRouteMap from 'components/map/DriverRouteMap';
import { addNewRide } from 'store/rides/ridesAsyncActions';
import { addTime } from 'utilities/helpers/date-time';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import {
  MAX_PASSENGERS,
  MAX_PASSENGERS_LABEL,
  RIDE_TYPE,
  RIDE_TYPE_LABEL,
  SMOKING,
  SMOKING_LABEL,
} from 'utilities/constants/rides';

const CreateRide = () => {
  const earliestDepartureDate = new Date(addTime([1]));
  const [departureDate, setDepartureDate] = useState(earliestDepartureDate);
  const history = useHistory();
  const userDetails = useSelector(state => state.user.userDetails);
  const dispatch = useDispatch();
  const [routeMapDetails, setRouteMapDetails] = useState({});

  const handleValidation = values => {
    const errors = {};

    if (!values.price) {
      errors.price = 'Required';
    } else if (values.price <= 0) {
      errors.price = 'Must be positive integer';
    }

    if (
      values.maxPassengers === '' ||
      values.maxPassengers === undefined ||
      values.maxPassengers === null
    ) {
      errors.maxPassengers = 'Required';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    await dispatch(
      addNewRide({
        driver: userDetails,
        route: routeMapDetails,
        values,
      }),
    ).unwrap();
    setSubmitting(false);
    history.push(MY_PROFILE.path);
  };

  const storeRouteMapDetails = useCallback(
    ({ origin, destination, waypoints }) => {
      const directionsAugmentedData = {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      setRouteMapDetails(directionsAugmentedData);
    },
    [],
  );

  const formInitialValues = {
    price: 0,
    maxPassengers: MAX_PASSENGERS.four,
    departureDate: earliestDepartureDate,
    rideType: RIDE_TYPE.regular,
    smoking: SMOKING.noSmoking,
  };

  return (
    <Layout>
      <motion.section
        className="profile profile--edit"
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <Formik
          initialValues={formInitialValues}
          validate={handleValidation}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <motion.div className="form-field" variants={itemVariants}>
                <DriverRouteMap
                  // originCity={'Skopje, North Macedonia'}
                  // destinationCity={'Prilep, North Macedonia'}
                  storeRouteMapDetails={storeRouteMapDetails}
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="departureDate">Departure date</label>
                <DatePicker
                  name="departureDate"
                  id="departureDate"
                  selected={departureDate}
                  onChange={date => setDepartureDate(date)}
                  showTimeSelect
                  dateFormat="d MMMM, yyyy h:mm aa"
                  timeFormat="HH:mm"
                  timeIntervals={15}
                />
                <ErrorMessage
                  name="departureDate"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="price">Price per person</label>
                <Field name="price" id="price" type="number" />
                <ErrorMessage
                  name="price"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="maxPassengers">
                  Maximum passengers allowed
                </label>
                <Field
                  name="maxPassengers"
                  id="maxPassengers"
                  component={FormikSelect}
                  options={[
                    {
                      value: MAX_PASSENGERS.one,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.one],
                    },
                    {
                      value: MAX_PASSENGERS.two,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.two],
                    },
                    {
                      value: MAX_PASSENGERS.three,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.three],
                    },
                    {
                      value: MAX_PASSENGERS.four,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.four],
                    },
                  ]}
                />
                <ErrorMessage
                  name="maxPassengers"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="rideType">Ride</label>
                <Field
                  name="rideType"
                  id="rideType"
                  component={FormikSelect}
                  options={[
                    {
                      value: RIDE_TYPE.regular,
                      label: RIDE_TYPE_LABEL[RIDE_TYPE.regular],
                    },
                    {
                      value: RIDE_TYPE.irregular,
                      label: RIDE_TYPE_LABEL[RIDE_TYPE.irregular],
                    },
                  ]}
                />
                <ErrorMessage
                  name="rideType"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="smoking">Smoking</label>
                <Field
                  name="smoking"
                  id="smoking"
                  component={FormikSelect}
                  options={[
                    {
                      value: SMOKING.noSmoking,
                      label: SMOKING_LABEL[SMOKING.noSmoking],
                    },
                    {
                      value: SMOKING.smoking,
                      label: SMOKING_LABEL[SMOKING.smoking],
                    },
                  ]}
                />
                <ErrorMessage
                  name="smoking"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.button
                className="btn-primary btn-block mt-xl"
                type="submit"
                disabled={isSubmitting}
                variants={itemVariants}>
                Create ride
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.section>
    </Layout>
  );
};

export default CreateRide;
