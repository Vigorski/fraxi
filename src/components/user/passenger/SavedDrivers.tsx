import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserPicture from 'components/shared/UserPicture';
import { fetchUsers } from 'store/user/userAsyncActions';
import {
  DRIVER_ACTIVE_RIDES,
  MY_PROFILE,
} from 'utilities/constants/routesConfig';
import { itemVariants } from 'utilities/constants/framerVariants';
import { encryptData } from 'utilities/helpers/encription';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { User } from 'types/user';

const SavedDrivers = () => {
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector(state => state.user);
  const [savedDrivers, setSavedDrivers] = useState<User[]>();
	const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    if (userDetails?.savedDrivers) {
      const getDrivers = async () => {
        const response = await dispatch(
          fetchUsers({ usersIds: userDetails.savedDrivers }),
        ).unwrap();
        setSavedDrivers(response);
				setIsLoading(false);
      };

      getDrivers();
    }
  }, [userDetails?.savedDrivers, dispatch]);

	const renderDrivers = () => {
		if (isLoading) {
			return (
				<motion.div className="card__section" variants={itemVariants}>
					<p className='text-center'>Loading...</p>
				</motion.div>
			)
		}

		if (savedDrivers) {
			return (
				savedDrivers.map((driver, index) => {
					const encryptedDriverId = encryptData(
						driver.userId,
						process.env.REACT_APP_QUERY_PARAM_SECRET_KEY as string,
					);

					return (
						<motion.div
							key={`${driver.userId}_${index}`}
							variants={itemVariants}
							transition={{ delay: 0.1 * index }}>
							<div className="saved-driver">
								<div className="row">
									<div className="col-4">
										<div className="thumbnail__user saved-driver__wrapper">
											<UserPicture profilePicture={driver.profilePicture} />
										</div>
									</div>
									<div className="col-8 flex align-center">
										<div className="saved-driver__wrapper">
											<h6>{`${driver.name} ${driver.surname}`}</h6>
											<p>{`${driver.activeRides.length} active ride${
												driver.activeRides.length > 1 ? 's' : ''
											}`}</p>
										</div>
									</div>
									<Link
										className="saved-driver__link"
										to={`${MY_PROFILE.path}${DRIVER_ACTIVE_RIDES.path}?userId=${encryptedDriverId}`}
									/>
								</div>
							</div>
						</motion.div>
					);
				})
			);
		} else {
			return (
				<motion.div
					variants={itemVariants}
					className="card__section">
					<h5>You haven't saved anyone yet :/</h5>
				</motion.div>
			);
		}
	}

	return (
		<div className="card card--stats">
			{renderDrivers()}
		</div>
	);

};

export default SavedDrivers;
