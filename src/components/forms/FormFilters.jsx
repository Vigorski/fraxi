import { Formik, Form } from 'formik';
import FormObserver from 'components/forms/FormObserver';

// Left deliberately blank, so that it may be reused
const FormFilters = ({ children, initialValues, handleObserverValues }) => {
  return (
    <div className="filters">
      <Formik initialValues={initialValues}>
        <Form>
          <FormObserver handleObserverValues={handleObserverValues} />
          {children}
        </Form>
      </Formik>
    </div>
  );
};

export default FormFilters;
