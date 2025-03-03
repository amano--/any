/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

export const group = {
  list: {
    title: "Groups",
    empty: "No groups found",
    create: "Create New Group",
    search: "Search groups",
    filter: {
      all: "All",
      joined: "Joined",
      managed: "Managed",
      public: "Public Group",
      private: "Private Group"
    }
  },
  form: {
    create: {
      title: "Create New Group",
      submit: "Create",
      cancel: "Cancel"
    },
    edit: {
      title: "Group Settings",
      submit: "Save",
      cancel: "Cancel",
      delete: "Delete Group"
    },
    fields: {
      name: "Group Name",
      description: "Description",
      isPublic: "Visibility",
      isPublicHint: "Public groups can be found by anyone",
      icon: "Icon",
      settings: "Group Settings"
    },
    settings: {
      allowMemberInvite: "Allow members to invite others",
      requireApproval: "Require approval for new members",
      notifications: {
        title: "Notification Settings",
        newMember: "When new member joins",
        contentUpdate: "When content is updated",
        memberLeave: "When member leaves"
      }
    }
  },
  members: {
    title: "Member Management",
    empty: "No members found",
    invite: "Invite Members",
    count: (count: number) => `Members: ${count}`,
    roles: {
      admin: "Administrator",
      editor: "Editor",
      viewer: "Viewer"
    },
    status: {
      active: "Active",
      invited: "Invited",
      pending: "Pending"
    },
    actions: {
      changeRole: "Change Role",
      remove: "Remove",
      accept: "Accept",
      reject: "Reject"
    }
  },
  validation: {
    formIncomplete: "Please fill in all required fields",
    name: {
      required: "Group name is required",
      minLength: "Group name must be at least 2 characters",
      maxLength: "Group name cannot exceed 50 characters"
    },
    description: {
      required: "Description is required",
      maxLength: "Description cannot exceed 500 characters"
    }
  },
  errors: {
    create: "Failed to create group",
    update: "Failed to update group",
    delete: "Failed to delete group",
    notFound: "Group not found",
    addMember: "Failed to add member",
    removeMember: "Failed to remove member",
    changeRole: "Failed to change role",
    notAuthorized: "You don't have permission"
  },
  confirmations: {
    delete: "Are you sure you want to delete this group?\nThis action cannot be undone.",
    leave: "Are you sure you want to leave this group?",
    removeMember: "Are you sure you want to remove this member?"
  },
  dangerZone: {
    title: "Danger Zone",
    deleteWarning: "This action cannot be undone"
  }
} as const;

// Type export
export type GroupTranslation = typeof group;