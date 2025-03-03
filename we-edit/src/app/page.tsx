import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">We Edit Features</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* グループ機能 */}
        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Group Management</h2>
          <p className="text-gray-600 mb-4">
            Create and manage groups, invite members, and control group settings.
          </p>
          <div className="space-y-2">
            <Link 
              href="/ja/v1/group"
              className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
            >
              Open Group Management (ja)
            </Link>
            <Link 
              href="/en/v1/group"
              className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
            >
              Open Group Management (en)
            </Link>
          </div>
        </div>

        {/* ブックマーク機能 */}
        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Bookmark Management</h2>
          <p className="text-gray-600 mb-4">
            Organize and share bookmarks within groups.
          </p>
          <div className="space-y-2">
            <Link 
              href="/ja/v1/bookmark"
              className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
            >
              Open Bookmark Management (ja)
            </Link>
            <Link 
              href="/en/v1/bookmark"
              className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
            >
              Open Bookmark Management (en)
            </Link>
          </div>
        </div>

        {/* その他の機能用のプレースホルダー */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-400">Coming Soon</h2>
          <p className="text-gray-400">
            New features are under development...
          </p>
        </div>
      </div>

      {/* 開発者向け情報 */}
      <div className="mt-12 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Developer Notes</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Feature implementations are in progress</li>
          <li>Mock API is used for testing</li>
          <li>Language switching is available for testing i18n</li>
        </ul>
      </div>
    </div>
  );
}
