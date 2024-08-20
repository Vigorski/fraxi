import { FC, ReactElement } from 'react';
import { Formik, Form } from 'formik';
import FormObserver from 'components/forms/FormObserver';
import { RidePreferences } from 'types/ride';

type FormFiltersOwnProps = {
  children: ReactElement;
  initialValues: RidePreferences;
  handleObserverValues: <RidePreferences>(values: RidePreferences) => Promise<void>;
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
