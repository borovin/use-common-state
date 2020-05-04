import { mount } from 'enzyme';
import React, { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import useCommonState, {
  initCommonState,
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

describe('createCommonState', () => {
  const guardianNicknameRender = jest.fn();
  const avengerNameRender = jest.fn();
  let avangerName;
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
      const [avenger] = useAvengers(id, {
        firstName: 'defaultFirstName',
        lastName: 'defaultLastName',
      });
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

    avangerName = mount(<AvengerName id={0} />);
    guardianNickname = mount(<GuardianNickname id={0} />);
  });

  afterEach(() => {
    if (avangerName.length) {
      avangerName.unmount();
    }
    if (guardianNickname.length) {
      guardianNickname.unmount();
    }
  });

  it('should render initial state', () => {
    expect(avangerName).toMatchInlineSnapshot(`
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

    avangerName.update();
    guardianNickname.update();

    expect(avangerName).toMatchInlineSnapshot(`
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

    avangerName.update();
    guardianNickname.update();

    expect(avangerName).toMatchInlineSnapshot(`
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

    avangerName.update();
    guardianNickname.update();

    expect(guardianNicknameRender).toBeCalledTimes(1);
    expect(avengerNameRender).toBeCalledTimes(1);
  });

  it('should render updated props', () => {
    avangerName.setProps({ id: 2 });
    guardianNickname.setProps({ id: 2 });

    expect(avangerName).toMatchInlineSnapshot(`
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
    const avengerName = mount(<AvengerName id={10} />);

    expect(avengerName).toMatchInlineSnapshot(`
      <AvengerName
        id={10}
      >
        defaultFirstName defaultLastName
      </AvengerName>
    `);

    avengerName.unmount();
  });
});
