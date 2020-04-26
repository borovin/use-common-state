import { mount } from 'enzyme';
import React, { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import useCommonState, {
  initCommonState,
  setCommonState,
  localStateSetters,
} from '../src/useCommonState';

const userName1Render = jest.fn();
const userName2Render = jest.fn();
let userName1;
let userName2;

const UserName1 = (props) => {
  const { userId } = props;
  const [firstName] = useCommonState(
    ['users', userId, 'firstName'],
    'defaultFirstName',
  );
  const [lastName] = useCommonState(
    `users.${userId}.lastName`,
    'defaultLastName',
  );
  userName1Render();
  return `${firstName} ${lastName}`;
};

const UserName2 = (props) => {
  const { userId } = props;
  const [user] = useCommonState(['users', userId]);
  userName2Render();
  return `${user.firstName} ${user.lastName}`;
};

const UserName3 = (props) => {
  const { userId } = props;
  const [user, setUser] = useCommonState(['users', userId]);

  useEffect(() => {
    setUser({
      firstName: 'Tony',
      lastName: 'Stark',
    });
  }, [setUser]);

  return `${user.firstName} ${user.lastName}`;
};

describe('useCommonState hook', () => {
  beforeEach(() => {
    initCommonState({
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

    userName1Render.mockClear();
    userName2Render.mockClear();

    userName1 = mount(<UserName1 userId={0} />);
    userName2 = mount(<UserName2 userId={0} />);
  });

  afterEach(() => {
    if (userName1.length) {
      userName1.unmount();
    }
    if (userName2.length) {
      userName2.unmount();
    }
  });

  it('should render initial state', () => {
    expect(userName1).toMatchInlineSnapshot(`
      <UserName1
        userId={0}
      >
        Steve Rogers
      </UserName1>
    `);

    expect(userName2).toMatchInlineSnapshot(`
      <UserName2
        userId={0}
      >
        Steve Rogers
      </UserName2>
    `);
  });

  it('should render updated fields', () => {
    act(() => {
      setCommonState(['users', 0, 'firstName'], 'Bruce');
      setCommonState('users.0.lastName', () => 'Banner');
    });

    userName1.update();
    userName2.update();

    expect(userName1).toMatchInlineSnapshot(`
      <UserName1
        userId={0}
      >
        Bruce Banner
      </UserName1>
    `);

    expect(userName2).toMatchInlineSnapshot(`
      <UserName2
        userId={0}
      >
        Bruce Banner
      </UserName2>
    `);
  });

  it('should render updated parent fields', () => {
    act(() => {
      setCommonState('users', [
        {
          firstName: 'Natasha',
          lastName: 'Romanov',
        },
      ]);
    });

    userName1.update();
    userName2.update();

    expect(userName1).toMatchInlineSnapshot(`
      <UserName1
        userId={0}
      >
        Natasha Romanov
      </UserName1>
    `);

    expect(userName2).toMatchInlineSnapshot(`
      <UserName2
        userId={0}
      >
        Natasha Romanov
      </UserName2>
    `);
  });

  it('should not render unchaged fields', () => {
    act(() => {
      setCommonState(['users', 0, 'firstName'], 'Steve');
    });

    userName1.update();
    userName2.update();

    expect(userName1Render).toBeCalledTimes(1);
    expect(userName2Render).toBeCalledTimes(1);
  });

  it('should render updated props', () => {
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
  });

  it('should remove local setter on unmount', () => {
    userName1.unmount();
    userName2.unmount();

    expect(localStateSetters).toMatchInlineSnapshot('Map {}');
  });

  it('should remove local setter on path change', () => {
    userName1.setProps({ userId: 2 });

    expect(localStateSetters).toMatchInlineSnapshot(`
      Map {
        [Function] => "[\\"users\\",\\"2\\",\\"firstName\\"]",
        [Function] => "[\\"users\\",\\"2\\",\\"lastName\\"]",
        [Function] => "[\\"users\\",\\"0\\"]",
      }
    `);
  });

  it('should not remove local setter on prop change', () => {
    userName1.setProps({ label: 'test_label_2' });

    expect(localStateSetters).toMatchInlineSnapshot(`
      Map {
        [Function] => "[\\"users\\",\\"0\\",\\"firstName\\"]",
        [Function] => "[\\"users\\",\\"0\\",\\"lastName\\"]",
        [Function] => "[\\"users\\",\\"0\\"]",
      }
    `);
  });

  it('should update state on mount', () => {
    let userName3;

    act(() => {
      userName3 = mount(<UserName3 userId={0} />);
    });

    userName3.update();

    expect(userName3).toMatchInlineSnapshot(`
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
