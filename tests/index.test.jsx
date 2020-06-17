import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import useCommonState, {
  setCommonState,
  createCommonState,
} from '../src/index';

describe('useCommonState hook', () => {
  const userName1Render = jest.fn();
  const userName2Render = jest.fn();
  let userName1;
  let userName2;

  const UserName1 = (props) => {
    const { userId } = props;
    const [firstName = 'defaultFirstName'] = useCommonState(
      ['users', userId, 'firstName'],
    );
    const [lastName = 'defaultLastName'] = useCommonState(
      `users.${userId}.lastName`,
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

  beforeEach(() => {
    setCommonState({
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

  it('should render full state update', () => {
    act(() => {
      setCommonState({
        users: [
          {
            firstName: 'Natasha',
            lastName: 'Romanov',
          },
        ],
      });
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
});

describe('createCommonState', () => {
  const guardianNicknameRender = jest.fn();
  const avengerNameRender = jest.fn();
  let avengerName;
  let guardianNickname;
  let useAvengers;
  let setAvengers;
  let useGuardians;
  let setGuardians;
  let AvengerName;
  let GuardianNickname;

  beforeEach(() => {
    [useAvengers, setAvengers] = createCommonState([
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
    ]);

    [useGuardians, setGuardians] = createCommonState([
      {
        nickname: 'Star-Lord',
      },
      {
        nickname: 'Gamora',
      },
      {
        nickname: 'Groot',
      },
    ]);

    AvengerName = (props) => {
      const { id } = props;
      const defaultAvenger = {
        firstName: 'defaultFirstName',
        lastName: 'defaultLastName',
      };
      const [avenger = defaultAvenger] = useAvengers(id);
      avengerNameRender();
      return `${avenger.firstName} ${avenger.lastName}`;
    };

    GuardianNickname = (props) => {
      const { id } = props;
      const [guadianNickname] = useGuardians([id, 'nickname']);
      guardianNicknameRender();
      return guadianNickname;
    };

    guardianNicknameRender.mockClear();
    avengerNameRender.mockClear();

    avengerName = mount(<AvengerName id={0} />);
    guardianNickname = mount(<GuardianNickname id={0} />);
  });

  afterEach(() => {
    if (avengerName.length) {
      avengerName.unmount();
    }
    if (guardianNickname.length) {
      guardianNickname.unmount();
    }
  });

  it('should render initial state', () => {
    expect(avengerName).toMatchInlineSnapshot(`
      <AvengerName
        id={0}
      >
        Steve Rogers
      </AvengerName>
    `);

    expect(guardianNickname).toMatchInlineSnapshot(`
      <GuardianNickname
        id={0}
      >
        Star-Lord
      </GuardianNickname>
    `);
  });

  it('should render updated fields', () => {
    act(() => {
      setAvengers([0, 'firstName'], 'Bruce');
      setAvengers('0.lastName', () => 'Banner');
      setGuardians([0, 'nickname'], 'Rocket');
    });

    avengerName.update();
    guardianNickname.update();

    expect(avengerName).toMatchInlineSnapshot(`
      <AvengerName
        id={0}
      >
        Bruce Banner
      </AvengerName>
    `);

    expect(guardianNickname).toMatchInlineSnapshot(`
      <GuardianNickname
        id={0}
      >
        Rocket
      </GuardianNickname>
    `);
  });

  it('should render updated parent fields', () => {
    act(() => {
      setAvengers(0, {
        firstName: 'Natasha',
        lastName: 'Romanov',
      });
      setGuardians(0, {
        nickname: 'Groot',
      });
    });

    avengerName.update();
    guardianNickname.update();

    expect(avengerName).toMatchInlineSnapshot(`
      <AvengerName
        id={0}
      >
        Natasha Romanov
      </AvengerName>
    `);

    expect(guardianNickname).toMatchInlineSnapshot(`
      <GuardianNickname
        id={0}
      >
        Groot
      </GuardianNickname>
    `);
  });

  it('should not render unchaged fields', () => {
    act(() => {
      setAvengers([0, 'firstName'], 'Steve');
      setGuardians([0, 'nickname'], 'Star-Lord');
    });

    avengerName.update();
    guardianNickname.update();

    expect(guardianNicknameRender).toBeCalledTimes(1);
    expect(avengerNameRender).toBeCalledTimes(1);
  });

  it('should render updated props', () => {
    avengerName.setProps({ id: 2 });
    guardianNickname.setProps({ id: 2 });

    expect(avengerName).toMatchInlineSnapshot(`
      <AvengerName
        id={2}
      >
        Natasha Romanov
      </AvengerName>
    `);
    expect(guardianNickname).toMatchInlineSnapshot(`
      <GuardianNickname
        id={2}
      >
        Groot
      </GuardianNickname>
    `);
  });

  it('should render default state value', () => {
    const name = mount(<AvengerName id={10} />);

    expect(name).toMatchInlineSnapshot(`
      <AvengerName
        id={10}
      >
        defaultFirstName defaultLastName
      </AvengerName>
    `);

    name.unmount();
  });

  it('should render full state update', () => {
    act(() => {
      setAvengers([
        {
          firstName: 'Natasha',
          lastName: 'Romanov',
        },
      ]);
      setGuardians([
        {
          nickname: 'Groot',
        },
      ]);
    });

    avengerName.update();
    guardianNickname.update();

    expect(avengerName).toMatchInlineSnapshot(`
      <AvengerName
        id={0}
      >
        Natasha Romanov
      </AvengerName>
    `);
    expect(guardianNickname).toMatchInlineSnapshot(`
      <GuardianNickname
        id={0}
      >
        Groot
      </GuardianNickname>
    `);
  });
});
