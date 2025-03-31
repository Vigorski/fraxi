import { FieldProps, FormikProps } from 'formik';
import Select, { SingleValue } from 'react-select';
import { SelectOption } from 'types/form';

interface FormikSelectOwnProps<T> extends FieldProps {
  form: FormikProps<T>;
  options: SelectOption[];
}

const FormikSelect = <T extends object>({
  field,
  form,
  options,
}: FormikSelectOwnProps<T>) => {
  const handleChange = (option: SingleValue<SelectOption | string>) => {
    const value = typeof option === 'string' ? option : option?.value;
    form.setFieldValue(field.name, value || '');
  };

  return (
    <Select
      inputId={field.name}
      name={field.name}
      onBlur={field.onBlur}
      onChange={handleChange}
      options={options}
      value={
        options ? options.find(option => option.value === field.value) : ''
      }
      className="react-select-wrapper"
      classNamePrefix="react-select"
      isSearchable={false}
			// use this as a tool for inspecting the select dropdown in DOM
			// menuIsOpen={true} 
    />
  );
};

export default FormikSelect;
