import Layout from '../../components/shared/Layout';
import RegisterEditUser from './RegisterEditUser';

const EditMyProfile = () => {
	return (
		<Layout>
			<section className='profile profile--edit'>
				<h3>Edit profile</h3>
				<RegisterEditUser editUserProfile={true} />
			</section>
		</Layout>
	);
};

export default EditMyProfile;
