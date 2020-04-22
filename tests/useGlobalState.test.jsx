import { mount } from 'enzyme';
import React, { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import useGlobalState, {
  initGlobalState,
  setGlobalState,
  localStateSetters,
} from '../src/useGlobalState';

const UserName1 = (props) => {
  const { userId } = props;
  const [firstName] = useGlobalState(
    ['users', userId, 'firstName'],
    'defaultFirstName',
  );
  const [lastName] = useGlobalState(
    `users.${userId}.lastName`,
    'defaultLastName',
  );

  return `${firstName} ${lastName}`;
};

const UserName2 = (props) => {
  const { userId } = props;
  const [user] = useGlobalState(['users', userId]);

  return `${user.firstName} ${user.lastName}`;
};

const UserName3 = (props) => {
  const { userId } = props;
  const [user, setUser] = useGlobalState(['users', userId]);

  useEffect(() => {
    setUser({
      firstName: 'Tony',
      lastName: 'Stark',
    });
  }, [setUser]);

  return `${user.firstName} ${user.lastName}`;
};

describe('useGlobalState hook', () => {
  beforeEach(() => {
    initGlobalState({
      users: [
        {
          firstName: 'Steve',
          lastName: 'Rogers',
        },
        {
          firstName: 'Carol',
          lastName: 'Danvers',
        },
        {
          firstName: 'Natasha',
          lastName: 'Romanov',
        },
      ],
    });
  });

  it('should render initial state', () => {
    const userName = mount(<UserName1 userId={0} />);

    expect(userName).toMatchInlineSnapshot(`
      <UserName1
        userId={0}
      >
        Steve Rogers
      </UserName1>
    `);

    userName.unmount();
  });

  it('should render updated state', () => {
    const userName = mount(<UserName1 userId={0} />);

    act(() => {
      setGlobalState(['users', 0, 'firstName'], 'Bruce');
      setGlobalState('users.0.lastName', () => 'Banner');
    });

    userName.update();

    expect(userName).toMatchInlineSnapshot(`
      <UserName1
        userId={0}
      >
        Bruce Banner
      </UserName1>
    `);

    userName.unmount();
  });

  it('should render updated top state', () => {
    const userName = mount(<UserName1 userId={0} />);

    act(() => {
      setGlobalState(['users', 0], {
        firstName: 'Bruce',
        lastName: 'Banner',
      });
    });

    userName.update();

    expect(userName).toMatchInlineSnapshot(`
      <UserName1
        userId={0}
      >
        Bruce Banner
      </UserName1>
    `);

    userName.unmount();
  });

  it('should render nested state', () => {
    const userName = mount(<UserName2 userId={0} />);

    expect(userName).toMatchInlineSnapshot(`
      <UserName2
        userId={0}
      >
        Steve Rogers
      </UserName2>
    `);

    userName.unmount();
  });

  it('should render updated nested state', () => {
    const userName = mount(<UserName2 userId={0} />);

    act(() => {
      setGlobalState(['users', 0], {
        firstName: 'Bruce',
        lastName: 'Banner',
      });
    });

    userName.update();

    expect(userName).toMatchInlineSnapshot(`
      <UserName2
        userId={0}
      >
        Bruce Banner
      </UserName2>
    `);

    userName.unmount();
  });

  it('should render updated nested state field', () => {
    const userName = mount(<UserName2 userId={0} />);

    act(() => {
      setGlobalState(['users', 0, 'firstName'], 'Bruce');
    });

    userName.update();

    expect(userName).toMatchInlineSnapshot(`
      <UserName2
        userId={0}
      >
        Bruce Rogers
      </UserName2>
    `);

    userName.unmount();
  });

  it('should render updated props', () => {
    const userName1 = mount(<UserName1 userId={0} />);
    const userName2 = mount(<UserName2 userId={0} />);

    userName1.setProps({ userId: 2 });
    userName2.setProps({ userId: 2 });

    expect(userName1).toMatchInlineSnapshot(`
      <UserName1
        userId={2}
      >
        Natasha Romanov
      </UserName1>
    `);
    expect(userName2).toMatchInlineSnapshot(`
      <UserName2
        userId={2}
      >
        Natasha Romanov
      </UserName2>
    `);

    userName1.unmount();
    userName2.unmount();
  });

  it('should remove local setter on unmount', () => {
    const userName = mount(<UserName1 userId={0} />);

    userName.unmount();

    expect(localStateSetters).toMatchInlineSnapshot('Map {}');
  });

  it('should remove local setter on path change', () => {
    const userName = mount(<UserName1 userId={0} />);

    userName.setProps({ userId: 2 });

    expect(localStateSetters).toMatchInlineSnapshot(`
      Map {
        [Function] => "[\\"users\\",\\"2\\",\\"firstName\\"]",
        [Function] => "[\\"users\\",\\"2\\",\\"lastName\\"]",
      }
    `);

    userName.unmount();
  });

  it('should not remove local setter on prop change', () => {
    const userName = mount(<UserName1 userId={0} label="test_label_1" />);

    userName.setProps({ label: 'test_label_2' });

    expect(localStateSetters).toMatchInlineSnapshot(`
      Map {
        [Function] => "[\\"users\\",\\"0\\",\\"firstName\\"]",
        [Function] => "[\\"users\\",\\"0\\",\\"lastName\\"]",
      }
    `);

    userName.unmount();
  });

  it('should update global state on mount', () => {
    let userName;

    act(() => {
      userName = mount(<UserName3 userId={0} />);
    });

    userName.update();

    expect(userName).toMatchInlineSnapshot(`
      <UserName3
        userId={0}
      >
        Tony Stark
      </UserName3>
    `);
  });

  it('should render default state value', () => {
    const userName = mount(<UserName1 userId={10} />);

    expect(userName).toMatchInlineSnapshot(`
      <UserName1
        userId={10}
      >
        defaultFirstName defaultLastName
      </UserName1>
    `);

    userName.unmount();
  });
});
