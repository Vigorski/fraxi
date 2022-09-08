const FormIkImage = ({ field, form }) => {
	return (
      <input id={field.name} name={field.name} type="file" onChange={(event) => {
        form.setFieldValue(field.name, event.currentTarget.files[0]);
      }} />
	);
};

export default FormIkImage;