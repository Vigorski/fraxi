import Layout from '../../components/shared/Layout';
import RegisterEditUser from '../../components/shared/RegisterEditUser';

const EditMyProfile = () => {
	return (
		<Layout>
			<section className='profile profile--edit'>
				<h1>Edit profile</h1>
				<RegisterEditUser editUserProfile={true} />
			</section>
		</Layout>
	);
};

export default EditMyProfile;
