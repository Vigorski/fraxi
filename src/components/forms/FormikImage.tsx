import { ChangeEvent } from 'react';
import { FieldInputProps, FieldProps, FormikProps } from 'formik';

interface FormikImageOwnProps<T> extends FieldProps {
  form: FormikProps<T>;
  field: FieldInputProps<File>;
}

const FormikImage = <T extends object>({
  field,
  form,
}: FormikImageOwnProps<T>) => {
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      form.setFieldValue(field.name, event.currentTarget.files[0]);
    }
  };

  return (
    <input
      id={field.name}
      name={field.name}
      type="file"
      onChange={onChangeHandler}
    />
  );
};

export default FormikImage;
