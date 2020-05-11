import React from 'react';
import { createCommonState } from '../../src';

const user = {
  firstName: 'Natasha',
  lastName: 'Romanov',
};

const [useUser, setUser] = createCommonState({
  isLoading: true,
});

const fetchUser = () => {
  setUser('isLoading', true);
  setTimeout(() => {
    setUser({ ...user, isLoading: false });
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
  const [firstName] = useUser('firstName', 'First name');

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
  const [lastName] = useUser('lastName', 'Last name');

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
  const [isLoading] = useUser('isLoading');

  React.useEffect(() => {
    fetchUser();
  }, []);

  return isLoading ? (
    <span>Loading user...</span>
  ) : (
    <>
      <FirstName />
      <LastName />
      <Input />
    </>
  );
}
