import { useState } from 'react';
import { IconUserPlaceholder } from '../icons';

const FormIkUserImage = ({ field, form, profilePicture }) => {
  const [url, setURL] = useState(!!profilePicture ? profilePicture : '');

  function handleChange(e) {
    if (e.currentTarget.files[0]) {
      form.setFieldValue(field.name, e.currentTarget.files[0]);
      setURL(URL.createObjectURL(e.currentTarget.files[0]));
    }
  }
  
	return (
    <label htmlFor={field.name} className="profile__img">
      <div className="profile__file-input">
        <input id={field.name} name={field.name} type="file" onChange={handleChange} />
      </div>
      {url !== '' ?
        <img src={url} alt="user avatar" /> :
        <div className="profile__svg-wrapper">
          <IconUserPlaceholder />
        </div>
      }
      <div className="profile__file-change"><span>Change</span></div>
    </label>
    
	);
};

export default FormIkUserImage;