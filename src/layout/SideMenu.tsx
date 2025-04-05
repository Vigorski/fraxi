import { IconClose, IconEdit } from 'components/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { userLogout } from 'store/user/userAsyncActions';
import {
  sideMenuContentVariants,
  sideMenuItemVariants,
  sideMenuOverlayVariants,
} from 'utilities/constants/framerVariants';
import { EDIT_USER, MY_PROFILE } from 'utilities/constants/routesConfig';

type SideMenuOwnProps = {
  isMenuOpen: boolean;
  handleMenuToggle: (state: boolean) => void;
};

const SideMenu: FC<SideMenuOwnProps> = ({ isMenuOpen, handleMenuToggle }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleMenuToggle(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, handleMenuToggle]);

  // Lock scroll when open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  const handleEditProfile = () => {
    handleMenuToggle(false);
    navigate(`${MY_PROFILE.path}${EDIT_USER.path}`);
  };

  const handleLogout = async () => {
    await dispatch(userLogout()).unwrap();
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {isMenuOpen && (
        <div
          className="sidemenu"
          role="dialog"
          aria-modal="true"
          aria-label="Side menu">
          <motion.div
            className="sidemenu__overlay"
            onClick={handleMenuToggle.bind(null, false)}
            variants={sideMenuOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
          <motion.div
            className="sidemenu__content"
            variants={sideMenuContentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden">
            <div className="sidemenu__header">
              <button
                className="btn-menu"
                onClick={handleMenuToggle.bind(null, false)}>
                <IconClose />
              </button>
            </div>
            <div className="sidemenu__body">
              <ul className="list-menu">
                <motion.li variants={sideMenuItemVariants}>
                  <button
                    className="list-menu__item btn-stripped btn-block"
                    onClick={handleEditProfile}>
                    <div className="icon__stamp icon__stamp--md">
                      <IconEdit />
                    </div>
                    <span>Edit your profile</span>
                  </button>
                </motion.li>
              </ul>
              <motion.button
                variants={sideMenuItemVariants}
                className="btn-primary-ghost btn-block mt-xl"
                onClick={handleLogout}>
                Logout
              </motion.button>
            </div>
            <div className="sidemenu__footer"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default SideMenu;
