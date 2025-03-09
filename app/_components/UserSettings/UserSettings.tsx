import { Tabs } from '@mantine/core';
import NameForm from './components/NameForm';
import AccountSection from './components/AccountSection';
// import ProfilePictureSection from './components/ProfilePictureSection';
import { TABS } from './UserSettings.consts';
import { toTitleCase } from '../../_utils/utils';

export default function UserSettings() {
  return (
    <Tabs defaultValue="nameSettings">
      <Tabs.List mb="xs">
        {TABS.map((tab) => (
          <Tabs.Tab key={tab} value={tab} size="xs" p="xs" color="green">
            {toTitleCase(tab)}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Tabs.Panel value="nameSettings">
        <NameForm />
      </Tabs.Panel>
      {/* <Tabs.Panel value="profilePicture">
        <ProfilePictureSection />
      </Tabs.Panel> */}
      <Tabs.Panel value="accountActions">
        <AccountSection />
      </Tabs.Panel>
    </Tabs>
  );
}
