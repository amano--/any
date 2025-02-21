chrome.action.onClicked.addListener(() => {
  // 拡張機能アイコンがクリックされたときの処理
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const dateKey = new Date().toISOString().split('T')[0]; // 現在の日付を取得（YYYY-MM-DD形式）

    const tabInfo = tabs.map((tab) => ({
      id: tab.id, // タブID
      title: tab.title, // タブのタイトル
      url: tab.url, // タブのURL
    }));

    chrome.storage.local.get("savedTabs", (data) => {
      const savedTabs = data.savedTabs || {}; // 保存されたタブのデータを取得
      if (!savedTabs[dateKey]) {
        savedTabs[dateKey] = []; // 日付ごとに新しい配列を作成
      }
      savedTabs[dateKey].push(...tabInfo); // タブ情報を追加

      chrome.storage.local.set({ savedTabs }, () => {
        // 保存完了後、現在のタブを閉じる
        tabs.forEach((tab) => {
          if (tab.id) chrome.tabs.remove(tab.id);
        });
      });
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // メッセージリスナーの設定
  if (message.action === "getHistory") {
    // 履歴を取得する場合
    chrome.history.search({ text: "", maxResults: 100, startTime: 0 }, (historyItems) => {
      sendResponse(historyItems); // 履歴アイテムを返す
    });
    return true; // 非同期レスポンスを示す
  } else if (message.action === "getSavedTabs") {
    // 保存されたタブを取得する場合
    chrome.storage.local.get("savedTabs", (data) => {
      sendResponse(data.savedTabs || {}); // 保存されたタブデータを返す
    });
    return true; // 非同期レスポンスを示す
  }
});
