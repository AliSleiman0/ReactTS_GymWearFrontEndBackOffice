// import toast from 'react-hot-toast';
import {
 

  
  HiOutlineCube,
  
 
  HiOutlineArrowLeftOnRectangle,
} from 'react-icons/hi2';
// import { IoSettingsOutline } from 'react-icons/io5';

export const menu = [
  
  {
    catalog: 'lists',
    listItems: [
      {
        isLink: true,
        url: '/welcome',
            icon: HiOutlineCube,
        label: 'Welcome',
      },
      {
        isLink: true,
        url: '/about',
        icon: HiOutlineCube,
        label: 'About',
      },
      {
        isLink: true,
        url: '/skills',
          icon: HiOutlineCube,
        label: 'Skills',
        },
        {
            isLink: true,
            url: '/projects',
            icon: HiOutlineCube,
            label: 'Projects',
        },
        {
            isLink: true,
            url: '/socials',
            icon: HiOutlineCube,
            label: 'Socials',
        },
     
    ],
  },
 
 
  {
    catalog: 'miscellaneous',
    listItems: [
      // {
      //   isLink: true,
      //   url: '/settings',
      //   icon: IoSettingsOutline,
      //   label: 'settings',
      // },
      {
        isLink: true,
        url: '/signin',
        icon: HiOutlineArrowLeftOnRectangle,
        label: 'log out',
      },
    ],
  },
];
