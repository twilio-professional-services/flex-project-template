import * as Flex from '@twilio/flex-ui';

import ConversationsHelper from './ConversationsHelper';

// Mock Flex SDK
jest.mock('@twilio/flex-ui', () => ({
  StateHelper: {
    getConversationStateForTask: jest.fn(),
  },
}));

describe('utils/helpers/ConversationsHelper', () => {
  describe('countOfOutstandingInvitesForConversation', () => {
    it('should return 0 when no invites exist', () => {
      const conversation = {
        source: {
          attributes: {},
        },
      } as any;

      const result = ConversationsHelper.countOfOutstandingInvitesForConversation(conversation);
      expect(result).toBe(0);
    });

    it('should return 0 when invites object is empty', () => {
      const conversation = {
        source: {
          attributes: {
            invites: {},
          },
        },
      } as any;

      const result = ConversationsHelper.countOfOutstandingInvitesForConversation(conversation);
      expect(result).toBe(0);
    });

    it('should count outstanding invites correctly', () => {
      const conversation = {
        source: {
          attributes: {
            invites: {
              invite1: { status: 'pending' },
              invite2: { status: 'pending' },
              invite3: { status: 'pending' },
            },
          },
        },
      } as any;

      const result = ConversationsHelper.countOfOutstandingInvitesForConversation(conversation);
      expect(result).toBe(3);
    });

    it('should handle undefined source', () => {
      const conversation = {} as any;

      const result = ConversationsHelper.countOfOutstandingInvitesForConversation(conversation);
      expect(result).toBe(0);
    });

    it('should handle undefined attributes', () => {
      const conversation = {
        source: {},
      } as any;

      const result = ConversationsHelper.countOfOutstandingInvitesForConversation(conversation);
      expect(result).toBe(0);
    });
  });

  describe('allowLeave', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return false when no conversation state exists', () => {
      (Flex.StateHelper.getConversationStateForTask as jest.Mock).mockReturnValue(null);

      const task = {} as Flex.ITask;
      const result = ConversationsHelper.allowLeave(task);

      expect(result).toBe(false);
    });

    it('should return false for 1:1 conversation (worker + customer only)', () => {
      const conversationState = {
        participants: new Map([
          [
            'participant1',
            {
              source: {
                bindings: { sms: { sid: 'binding1' } },
              },
            },
          ],
          [
            'participant2',
            {
              source: {
                bindings: null,
              },
            },
          ],
        ]),
        source: {
          attributes: {},
        },
      };

      (Flex.StateHelper.getConversationStateForTask as jest.Mock).mockReturnValue(conversationState);

      const task = {} as Flex.ITask;
      const result = ConversationsHelper.allowLeave(task);

      expect(result).toBe(false);
    });

    it('should return true when there are more than 2 participants', () => {
      const conversationState = {
        participants: new Map([
          ['p1', { source: { bindings: { sms: { sid: 'b1' } } } }],
          ['p2', { source: { bindings: null } }],
          ['p3', { source: { bindings: null } }],
        ]),
        source: {
          attributes: {},
        },
      };

      (Flex.StateHelper.getConversationStateForTask as jest.Mock).mockReturnValue(conversationState);

      const task = {} as Flex.ITask;
      const result = ConversationsHelper.allowLeave(task);

      expect(result).toBe(true);
    });

    it('should return true when there are outstanding invites', () => {
      const conversationState = {
        participants: new Map([
          ['p1', { source: { bindings: { sms: { sid: 'b1' } } } }],
          ['p2', { source: { bindings: null } }],
        ]),
        source: {
          attributes: {
            invites: {
              invite1: { status: 'pending' },
            },
          },
        },
      };

      (Flex.StateHelper.getConversationStateForTask as jest.Mock).mockReturnValue(conversationState);

      const task = {} as Flex.ITask;
      const result = ConversationsHelper.allowLeave(task);

      expect(result).toBe(true);
    });

    it('should count only one bound participant correctly', () => {
      // When there's only 1 bound participant, it shouldn't be subtracted
      const conversationState = {
        participants: new Map([
          ['p1', { source: { bindings: { sms: { sid: 'b1' } } } }],
          ['p2', { source: { bindings: null } }],
          ['p3', { source: { bindings: null } }],
        ]),
        source: {
          attributes: {},
        },
      };

      (Flex.StateHelper.getConversationStateForTask as jest.Mock).mockReturnValue(conversationState);

      const task = {} as Flex.ITask;
      const result = ConversationsHelper.allowLeave(task);

      // 3 participants total, 1 bound participant (not subtracted), so > 2
      expect(result).toBe(true);
    });

    it('should handle multiple bound participants correctly', () => {
      // When there are 2+ bound participants, one is subtracted from the count
      const conversationState = {
        participants: new Map([
          ['p1', { source: { bindings: { sms: { sid: 'b1' } } } }],
          ['p2', { source: { bindings: { whatsapp: { sid: 'b2' } } } }],
          ['p3', { source: { bindings: null } }],
        ]),
        source: {
          attributes: {},
        },
      };

      (Flex.StateHelper.getConversationStateForTask as jest.Mock).mockReturnValue(conversationState);

      const task = {} as Flex.ITask;
      const result = ConversationsHelper.allowLeave(task);

      // 3 participants - (2-1) = 2, which is NOT > 2, so false
      expect(result).toBe(false);
    });

    it('should handle participants without bindings property', () => {
      const conversationState = {
        participants: new Map([
          ['p1', { source: {} }],
          ['p2', { source: {} }],
        ]),
        source: {
          attributes: {},
        },
      };

      (Flex.StateHelper.getConversationStateForTask as jest.Mock).mockReturnValue(conversationState);

      const task = {} as Flex.ITask;
      const result = ConversationsHelper.allowLeave(task);

      expect(result).toBe(false);
    });

    it('should handle empty participants map', () => {
      const conversationState = {
        participants: new Map(),
        source: {
          attributes: {},
        },
      };

      (Flex.StateHelper.getConversationStateForTask as jest.Mock).mockReturnValue(conversationState);

      const task = {} as Flex.ITask;
      const result = ConversationsHelper.allowLeave(task);

      expect(result).toBe(false);
    });
  });

  describe('getMyParticipant', () => {
    it('should return null when task is not provided', async () => {
      const result = await ConversationsHelper.getMyParticipant(null as any);
      expect(result).toBeNull();
    });

    it('should return null when flexInteractionChannelSid is missing', async () => {
      const task = {
        attributes: {},
        workerSid: 'WK123',
      } as any;

      const result = await ConversationsHelper.getMyParticipant(task);
      expect(result).toBeNull();
    });

    it('should return null when workerSid is missing', async () => {
      const task = {
        attributes: {
          flexInteractionChannelSid: 'CH123',
        },
      } as any;

      const result = await ConversationsHelper.getMyParticipant(task);
      expect(result).toBeNull();
    });

    it('should find and return the agent participant matching workerSid', async () => {
      const mockParticipants = [
        { type: 'customer', sid: 'MB1' },
        {
          type: 'agent',
          sid: 'MB2',
          routingProperties: { workerSid: 'WK123' },
        },
        {
          type: 'agent',
          sid: 'MB3',
          routingProperties: { workerSid: 'WK456' },
        },
      ];

      const task = {
        attributes: {
          flexInteractionChannelSid: 'CH123',
        },
        workerSid: 'WK123',
        getParticipants: jest.fn().mockResolvedValue(mockParticipants),
      } as any;

      const result = await ConversationsHelper.getMyParticipant(task);

      expect(result).toEqual(mockParticipants[1]);
      expect(task.getParticipants).toHaveBeenCalledWith('CH123');
    });

    it('should return undefined when no matching agent participant found', async () => {
      const mockParticipants = [
        { type: 'customer', sid: 'MB1' },
        {
          type: 'agent',
          sid: 'MB2',
          routingProperties: { workerSid: 'WK999' },
        },
      ];

      const task = {
        attributes: {
          flexInteractionChannelSid: 'CH123',
        },
        workerSid: 'WK123',
        getParticipants: jest.fn().mockResolvedValue(mockParticipants),
      } as any;

      const result = await ConversationsHelper.getMyParticipant(task);

      expect(result).toBeUndefined();
    });
  });
});
