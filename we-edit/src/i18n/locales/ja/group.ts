/**
 * [実装計画書](../../../../docs/features/group/logs/ai/2025-03-03_18_27-group-implementation.md)
 */

export const group = {
  list: {
    title: "グループ一覧",
    empty: "グループがありません",
    create: "新規グループ作成",
    search: "グループを検索",
    filter: {
      all: "すべて",
      joined: "参加中",
      managed: "管理中",
      public: "公開グループ",
      private: "非公開グループ"
    }
  },
  form: {
    create: {
      title: "新規グループ作成",
      submit: "作成",
      cancel: "キャンセル"
    },
    edit: {
      title: "グループ設定",
      submit: "保存",
      cancel: "キャンセル",
      delete: "グループを削除"
    },
    fields: {
      name: "グループ名",
      description: "説明",
      isPublic: "公開設定",
      isPublicHint: "公開グループは誰でも検索できます",
      icon: "アイコン",
      settings: "グループ設定"
    },
    settings: {
      allowMemberInvite: "メンバーによる招待を許可",
      requireApproval: "参加承認を必要とする",
      notifications: {
        title: "通知設定",
        newMember: "新しいメンバーが参加したとき",
        contentUpdate: "コンテンツが更新されたとき",
        memberLeave: "メンバーが退会したとき"
      }
    }
  },
  members: {
    title: "メンバー管理",
    empty: "メンバーがいません",
    invite: "メンバーを招待",
    count: (count: number) => `メンバー: ${count}名`,
    roles: {
      admin: "管理者",
      editor: "編集者",
      viewer: "閲覧者"
    },
    status: {
      active: "アクティブ",
      invited: "招待中",
      pending: "承認待ち"
    },
    actions: {
      changeRole: "権限を変更",
      remove: "削除",
      accept: "承認",
      reject: "拒否"
    }
  },
  validation: {
    formIncomplete: "必須項目をすべて入力してください",
    name: {
      required: "グループ名を入力してください",
      minLength: "グループ名は2文字以上で入力してください",
      maxLength: "グループ名は50文字以内で入力してください"
    },
    description: {
      required: "説明を入力してください",
      maxLength: "説明は500文字以内で入力してください"
    }
  },
  errors: {
    create: "グループの作成に失敗しました",
    update: "グループの更新に失敗しました",
    delete: "グループの削除に失敗しました",
    notFound: "グループが見つかりません",
    addMember: "メンバーの追加に失敗しました",
    removeMember: "メンバーの削除に失敗しました",
    changeRole: "権限の変更に失敗しました",
    notAuthorized: "権限がありません"
  },
  confirmations: {
    delete: "本当にこのグループを削除しますか？\nこの操作は取り消すことができません。",
    leave: "本当にこのグループを退会しますか？",
    removeMember: "本当にこのメンバーを削除しますか？"
  },
  dangerZone: {
    title: "危険な操作",
    deleteWarning: "この操作は取り消すことができません"
  }
} as const;

// 型の出力
export type GroupTranslation = typeof group;