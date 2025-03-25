import { ChangeEvent, FC, useState } from 'react';
import { IconUserPlaceholder } from 'components/icons';
import { FieldInputProps, FieldProps, FormikProps } from 'formik';
import { UserForm } from 'types/user';

interface FormikUserImageOwnProps extends FieldProps {
  form: FormikProps<UserForm>;
  field: FieldInputProps<File>;
  profilePicture: string;
}

const FormikUserImage: FC<FormikUserImageOwnProps> = ({
  field,
  form,
  profilePicture,
}) => {
  const [url, setURL] = useState(profilePicture ?? '');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files?.length) {
      form.setFieldValue(field.name, e.currentTarget.files[0]);
      setURL(URL.createObjectURL(e.currentTarget.files[0]));
    }
  }

  return (
    <label htmlFor={field.name} className="profile__img">
      <div className="profile__file-input">
        <input
          id={field.name}
          name={field.name}
          type="file"
          onChange={handleChange}
        />
      </div>
      {url !== '' ? (
        <img src={url} alt="user avatar" />
      ) : (
        <div className="profile__svg-wrapper">
          <IconUserPlaceholder />
        </div>
      )}
      <div className="profile__file-change">
        <span>Change</span>
      </div>
    </label>
  );
};

export default FormikUserImage;
