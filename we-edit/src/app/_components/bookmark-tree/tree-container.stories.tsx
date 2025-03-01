import type { Meta, StoryObj } from "@storybook/react";
import { TreeContainer } from "./tree-container";
import { useBookmarkTreeStore } from "~/store/bookmark-tree";
import type { TreeItem } from "~/types/bookmark-tree";

// モックデータ
const sampleData: TreeItem[] = [
  {
    id: "1",
    name: "技術書",
    isExpanded: true,
    position: 0,
    parentId: null,
    children: [
      {
        id: "2",
        name: "フロントエンド",
        isExpanded: true,
        position: 0,
        parentId: "1",
        children: [
          {
            id: "3",
            name: "React",
            isExpanded: false,
            position: 0,
            parentId: "2",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "ブログ記事",
    isExpanded: false,
    position: 1,
    parentId: null,
    children: [],
  },
];

// ストアの初期状態に使用するnoop関数
const noop = {
  // アイテムの移動（Storybook環境では実行されない）
  moveItem: (_sourceId: string, _destinationId: string | null, _index: number) => {
    console.log("moveItem called in Storybook");
  },
  // アイテムの追加（Storybook環境では実行されない）
  addItem: (_item: TreeItem) => {
    console.log("addItem called in Storybook");
  },
  // アイテムの更新（Storybook環境では実行されない）
  updateItem: (_id: string, _updates: Partial<Omit<TreeItem, "id">>) => {
    console.log("updateItem called in Storybook");
  },
  // アイテムの削除（Storybook環境では実行されない）
  removeItem: (_id: string) => {
    console.log("removeItem called in Storybook");
  },
};

const meta = {
  title: "Components/BookmarkTree/TreeContainer",
  component: TreeContainer,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      // Zustandストアの初期化
      useBookmarkTreeStore.setState({
        tree: [],
        ...noop,
      });
      return (
        <div className="min-h-[400px] w-[300px] border border-border rounded-lg bg-background">
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof TreeContainer>;

export default meta;
type Story = StoryObj<typeof TreeContainer>;

// 基本的なストーリー
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "空の状態のブックマークツリー。新規フォルダの作成が可能です。",
      },
    },
  },
};

// サンプルデータを使用したストーリー
export const WithSampleData: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "サンプルデータが入った状態のブックマークツリー。",
      },
    },
  },
  decorators: [
    (Story) => {
      useBookmarkTreeStore.setState({
        tree: sampleData,
        ...noop,
      });
      return <Story />;
    },
  ],
};
