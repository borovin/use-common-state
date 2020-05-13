import React from 'react';
import useCommonState, { setCommonState } from '../../src';

setCommonState({
  isLoadingUser: true,
});

const fetchUser = () => {
  setCommonState('isLoadingUser', true);
  setTimeout(() => {
    const user = {
      firstName: 'Natasha',
      lastName: 'Romanov',
    };

    setCommonState({ user, isLoadingUser: false });
  }, 3000);
};

const FirstName = () => {
  const [firstName] = useCommonState('user.firstName');

  return <div>{firstName}</div>;
};

const LastName = () => {
  const [lastName] = useCommonState('user.lastName');

  return <div>{lastName}</div>;
};

const Input = () => {
  const [firstName, setFirstName] = useCommonState('user.firstName');
  const [lastName, setLastName] = useCommonState('user.lastName');

  return (
    <>
      <input value={firstName} placeholder="First name" onChange={(e) => setFirstName(e.target.value)} />
      <input value={lastName} placeholder="Last name" onChange={(e) => setLastName(e.target.value)} />
    </>
  );
};

export default function Page() {
  const [isLoadingUser] = useCommonState('isLoadingUser');

  React.useEffect(() => {
    fetchUser();
  }, []);

  return isLoadingUser ? (
    <span>Loading user...</span>
  ) : (
    <>
      <FirstName />
      <LastName />
      <Input />
    </>
  );
}
