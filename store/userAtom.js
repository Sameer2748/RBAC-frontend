import { atom } from 'recoil';

export const userState = atom({
  key: 'userState', // unique ID (with respect to other atoms/selectors)
  default: {
    id:"",
    name: '',
    email: '',
    token: '',
    role:"",
    status:""
  }, // initial state
});
export const manageState = atom({
  key: 'manageState', // unique ID (with respect to other atoms/selectors)
  default: false, // initial state
});

export const allusersforAdmin = atom({
  key: 'allusersforAdmin', // unique ID (with respect to other atoms/selectors)
  default: [], // initial state
})

