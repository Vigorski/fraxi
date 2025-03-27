import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import FormikSelect from 'components/forms/FormikSelect';
import DriverRouteMap from 'components/map/DriverRouteMap';
import { addNewRide } from 'store/rides/ridesAsyncActions';
import { addTime } from 'utilities/helpers/date-time';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import {
  CreateRideFormValues,
  MAX_PASSENGERS,
  MAX_PASSENGERS_LABEL,
  RIDE_TYPE,
  RIDE_TYPE_LABEL,
  SMOKING,
  SMOKING_LABEL,
} from 'types/ride';
import { useAppSelector } from 'hooks/useAppSelector';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { FormErrors } from 'types/form';
import { Route } from 'types/map';

const CreateRide = () => {
  const earliestDepartureDate = new Date(addTime([1]));
  const navigate = useNavigate();
  const userDetails = useAppSelector(state => state.user.userDetails);
  const dispatch = useAppDispatch();
  const [departureDate, setDepartureDate] = useState<Date | null>(
    earliestDepartureDate,
  );
  const [routeMapDetails, setRouteMapDetails] = useState<Route>();

  const handleValidation = (values: CreateRideFormValues) => {
    const errors: FormErrors<CreateRideFormValues> = {};

    if (!values.price) {
      errors.price = 'Required';
    } else if (values.price <= 0) {
      errors.price = 'Must be positive integer';
    }

    if (values.maxPassengers === undefined || values.maxPassengers === null) {
      errors.maxPassengers = 'Required';
    }

    return errors;
  };

  const handleSubmit = async (
    values: CreateRideFormValues,
    { setSubmitting }: FormikHelpers<CreateRideFormValues>,
  ) => {
    if (userDetails && routeMapDetails) {
      const newRoute = await dispatch(
        addNewRide({
          driver: userDetails,
          route: routeMapDetails,
          values,
        }),
      ).unwrap();

      setSubmitting(false);

      if (newRoute) {
        navigate(MY_PROFILE.path);
      }
    }
  };

  const storeRouteMapDetails = useCallback(
    ({ origin, destination, waypoints }: Route) => {
      const directionsAugmentedData: Route = {
        origin,
        destination,
        travelMode: window.google?.maps?.TravelMode?.DRIVING ?? 'DRIVING',
      };

      if (waypoints) {
        directionsAugmentedData.waypoints = waypoints;
      }

      setRouteMapDetails(directionsAugmentedData);
    },
    [],
  );

  const formInitialValues: CreateRideFormValues = {
    price: 0,
    maxPassengers: MAX_PASSENGERS.four,
    departureDate: earliestDepartureDate,
    rideType: RIDE_TYPE.regular,
    smoking: SMOKING.noSmoking,
  };

  return (
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
              <DriverRouteMap storeRouteMapDetails={storeRouteMapDetails} />
            </motion.div>
            <motion.div className="form-field form-field__datepicker" variants={itemVariants}>
              <label htmlFor="departureDate">Departure date</label>
              <DatePicker
                name="departureDate"
                id="departureDate"
                selected={departureDate}
                onChange={setDepartureDate}
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
  );
};

export default CreateRide;
