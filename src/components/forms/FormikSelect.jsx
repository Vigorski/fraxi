import Select from 'react-select';

const FormikSelect = ({ options, field, form }) => {
  return (
    <Select
      inputId={field.name}
      name={field.name}
      onBlur={field.onBlur}
      onChange={({ value }) => form.setFieldValue(field.name, value)}
      options={options}
      value={
        options ? options.find(option => option.value === field.value) : ''
      }
      className="react-select-wrapper"
      classNamePrefix="react-select"
    />
  );
};

export default FormikSelect;
