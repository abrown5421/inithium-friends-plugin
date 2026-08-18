import { Users } from 'lucide-react';
import { defineClientPlugin } from '@inithium/plugin-engine/client';
import type { ProfileTabContext } from '@inithium/plugin-engine/client';
import { FRIENDS_PLUGIN_META } from './index.js';
import { FriendsProfileTab } from './lib/client/friends-profile-tab.js';
import { FriendsNotificationsBackground } from './lib/client/friends-notifications-background.js';
import { FriendActionPanel } from './lib/client/friend-action-panel.js';
import { FriendsAvatarStackWidget } from './lib/client/friends-avatar-stack-widget.js';

export default defineClientPlugin({
  ...FRIENDS_PLUGIN_META,
  profileTabs: [{ id: 'friends', label: 'Friends', icon: Users, component: FriendsProfileTab, enabled: () => true }],
  profileInfoWidgets: [
    { id: 'friends-action-panel', component: FriendActionPanel, enabled: (context: ProfileTabContext) => !context.isOwner },
    { id: 'friends-avatar-stack', component: FriendsAvatarStackWidget, enabled: () => true }
  ],
  backgroundComponents: [FriendsNotificationsBackground]
});
