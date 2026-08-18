import { Button, Text } from '@inithium/ui';
import { selectIsAuthenticated, useAppSelector, useReadUserQuery } from '@inithium/store';
import type { ProfileTabContext } from '@inithium/plugin-engine/client';
import { useFriendsMutation, useFriendsResource } from './use-friends-fetch.js';
import { formatFriendsSince } from './format-friends-since.js';
import type { FriendshipStatusResult } from '../friendship.model.js';

export interface FriendActionPanelProps {
  readonly context: ProfileTabContext;
}

export const FriendActionPanel = ({ context }: FriendActionPanelProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: targetUser } = useReadUserQuery(context.userId, { skip: !isAuthenticated });
  const resource = useFriendsResource<FriendshipStatusResult>(
    isAuthenticated ? `/friends/status/${context.userId}` : undefined
  );
  const mutation = useFriendsMutation(resource.refetch);

  if (!isAuthenticated || !resource.data) return null;

  const targetName =
    [targetUser?.first_name, targetUser?.last_name].filter(Boolean).join(' ') || targetUser?.email || 'this user';
  const { status, friendshipId, acceptedAt } = resource.data;

  if (status === 'none') {
    return (
      <Button
        type="button"
        color="primary"
        size="sm"
        loading={mutation.pendingKey === context.userId}
        onClick={() => mutation.execute(context.userId, '/friends/requests', 'POST', { recipientId: context.userId })}
      >
        Add Friend
      </Button>
    );
  }

  if (status === 'pending-outgoing') {
    return (
      <Text size="sm" color="muted">
        Friend request pending.
      </Text>
    );
  }

  if (status === 'pending-incoming' && friendshipId) {
    return (
      <div className="flex flex-col gap-2">
        <Text size="sm" color="muted">
          {targetName} sent you a friend request.
        </Text>
        <div className="flex gap-2">
          <Button
            type="button"
            color="primary"
            size="sm"
            loading={mutation.pendingKey === friendshipId}
            onClick={() => mutation.execute(friendshipId, `/friends/requests/${friendshipId}/accept`, 'POST')}
          >
            Accept
          </Button>
          <Button
            type="button"
            variant="outlined"
            size="sm"
            loading={mutation.pendingKey === friendshipId}
            onClick={() => mutation.execute(friendshipId, `/friends/requests/${friendshipId}`, 'DELETE')}
          >
            Decline
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'accepted' && friendshipId && acceptedAt) {
    return (
      <div className="flex flex-col gap-2">
        <Text size="sm" color="muted">
          You and {targetName} have been friends for {formatFriendsSince(acceptedAt)}.
        </Text>
        <Button
          type="button"
          variant="outlined"
          color="destructive"
          size="sm"
          loading={mutation.pendingKey === friendshipId}
          onClick={() => mutation.execute(friendshipId, `/friends/${friendshipId}`, 'DELETE')}
        >
          Unfriend
        </Button>
      </div>
    );
  }

  return null;
};
