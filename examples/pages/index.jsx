import React from 'react';
import useCommonState, { setCommonState } from '../../src';

const user = {
  firstName: 'Natasha',
  lastName: 'Romanov',
};

setCommonState({
  isLoadingUser: true,
});

const fetchUser = () => {
  setCommonState('isLoadingUser', true);
  setTimeout(() => {
    setCommonState({ user, isLoadingUser: false });
  }, 3000);
};

const Time = () => {
  const time = new Intl.DateTimeFormat(navigator.language, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(Date.now());

  return <span>{time}</span>;
};

const FirstName = () => {
  const [firstName] = useCommonState('user.firstName', 'First name');

  return (
    <div>
      {firstName}
      {' '}
      (updated:
      {' '}
      <Time />
      )
    </div>
  );
};

const LastName = () => {
  const [lastName] = useCommonState('user.lastName', 'Last name');

  return (
    <h1>
      {lastName}
      {' '}
      (updated:
      {' '}
      <Time />
      )
    </h1>
  );
};

const Input = () => {
  const [user, setUser] = useCommonState('user', {});

  const handleChange = (e) => {
    const [firstName, lastName] = e.target.value.trim().split(' ');
    setUser({ firstName, lastName });
  };

  return (
    <>
      <input onChange={handleChange} placeholder="Change username here" />
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
