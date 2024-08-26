import { FC, ReactElement } from 'react';
import { Formik, Form } from 'formik';
import FormObserver from 'components/forms/FormObserver';
import { RidePreferences, SearchRideFormValues } from 'types/ride';

type FormFiltersOwnProps = {
  children: ReactElement;
  initialValues: RidePreferences;
  handleObserverValues: (values: SearchRideFormValues) => Promise<void>;
};
// Left deliberately blank, so that it may be reused
const FormFilters: FC<FormFiltersOwnProps> = ({
  children,
  initialValues,
  handleObserverValues,
}) => {
  return (
    <div className="filters">
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form>
          <FormObserver handleObserverValues={handleObserverValues} />
          {children}
        </Form>
      </Formik>
    </div>
  );
};

export default FormFilters;
