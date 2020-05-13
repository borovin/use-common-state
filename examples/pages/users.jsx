import React, { memo } from 'react';
import useCommonState, { setCommonState } from '../../src/index';

global.setCommonState = setCommonState;

setCommonState({
  users: [
    {
      firstName: 'Steve',
      lastName: 'Rogers',
      address: {
        street: 'test_street_1',
        zip: 194220,
      },
    },
    {
      firstName: 'Carol',
      lastName: 'Danvers',
      address: {
        street: 'test_street_1',
        zip: 194220,
      },
    },
    {
      firstName: 'Natasha',
      lastName: 'Romanov',
      address: {
        street: 'test_street_1',
        zip: 194220,
      },
    },
  ],
});

const Time = () => {
  if (!global.navigator) {
    return null;
  }
  const time = new Intl.DateTimeFormat(navigator.language, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(Date.now());

  return <span>{time}</span>;
};

const UserName = memo((props) => {
  const { userId } = props;
  const [firstName] = useCommonState(['users', userId, 'firstName']);
  const [lastName] = useCommonState(['users', userId, 'lastName']);
  return (
    <div>
      <span>
        {`${firstName} ${lastName}`}
        {' '}
      </span>
      <Time />
    </div>
  );
});

const UserAddress = memo((props) => {
  const { userId } = props;
  const [address] = useCommonState(['users', userId, 'address']);

  return (
    <div>
      <span>
        {`${address.street} ${address.zip}`}
        {' '}
      </span>
      <Time />
    </div>
  );
});

const UserList = () => {
  const [users] = useCommonState('users');

  return users.map((user, userId) => (
    <div key={userId}>
      <UserName userId={userId} />
      <UserAddress userId={userId} />
    </div>
  ));
};

export default function Page() {
  return <UserList />;
}
