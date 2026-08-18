import { Text, Tooltip, TooltipContent, TooltipTrigger, UserAvatar } from '@inithium/ui';
import { resolveAvatarDisplay, resolveAvatarInitials, useReadAllProfilesQuery } from '@inithium/store';
import { usePageNavigate } from '@inithium/pages';
import type { ProfileTabContext } from '@inithium/plugin-engine/client';
import { useFriendsResource } from './use-friends-fetch.js';
import type { FriendSummary } from '../friendship.model.js';

const RANDOM_FRIENDS_LIMIT = 6;

interface FriendStackAvatarProps {
  readonly friend: FriendSummary;
}

const FriendStackAvatar = ({ friend }: FriendStackAvatarProps) => {
  const pageNavigate = usePageNavigate();
  const displayName = `${friend.firstName} ${friend.lastName}`.trim() || friend.email;
  const { data: profilesResult } = useReadAllProfilesQuery({ field: 'user_id', search: friend.userId, limit: 1 });
  const profile = profilesResult?.data?.[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => void pageNavigate(`/profile/${friend.userId}`)}
          className="-ml-3 rounded-full ring-2 ring-background transition-transform first:ml-0 hover:z-10 hover:-translate-y-0.5"
        >
          <UserAvatar
            user={{
              name: displayName,
              avatarFallback: resolveAvatarInitials(friend.firstName, friend.lastName, friend.email),
              ...resolveAvatarDisplay(profile?.profileAvatar)
            }}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>{displayName}</TooltipContent>
    </Tooltip>
  );
};

export interface FriendsAvatarStackWidgetProps {
  readonly context: ProfileTabContext;
}

export const FriendsAvatarStackWidget = ({ context }: FriendsAvatarStackWidgetProps) => {
  const resource = useFriendsResource<readonly FriendSummary[]>(
    `/friends/of/${context.userId}/random?limit=${RANDOM_FRIENDS_LIMIT}`
  );
  const friends = resource.data ?? [];

  if (friends.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <Text size="xs" color="muted">
        Friends
      </Text>
      <div className="flex items-center">
        {friends.map((friend) => (
          <FriendStackAvatar key={friend.friendshipId} friend={friend} />
        ))}
      </div>
    </div>
  );
};
