
const tabSections = document.getElementById("tab-sections") as HTMLDivElement;
const historyList = document.getElementById("history-list") as HTMLUListElement;
const languageSelect = document.getElementById("language-select") as HTMLSelectElement;
const savedTabsTitle = document.getElementById("saved-tabs-title") as HTMLElement;
const historyTitle = document.getElementById("history-title") as HTMLElement;

const translations = {
  en: {
    savedTabs: "Saved Tabs",
    history: "History",
  },
  ja: {
    savedTabs: "保存されたタブ",
    history: "履歴",
  },
};

function updateLanguage(lang: string) {
  savedTabsTitle.textContent = translations[lang].savedTabs;
  historyTitle.textContent = translations[lang].history;
}

updateLanguage("ja");

languageSelect.addEventListener("change", (event) => {
  const selectedLanguage = (event.target as HTMLSelectElement).value;
  updateLanguage(selectedLanguage);
});

chrome.runtime.sendMessage({ action: "getSavedTabs" }, (savedTabs) => {
  Object.keys(savedTabs).forEach((date) => {
    const section = document.createElement("div");
    const heading = document.createElement("h2");
    heading.textContent = date;
    section.appendChild(heading);

    const list = document.createElement("ul");
    savedTabs[date].forEach((tab: { title: string; url: string }) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = tab.url;
      link.textContent = tab.title;
      link.target = "_blank";
      li.appendChild(link);
      list.appendChild(li);
    });
    section.appendChild(list);
    tabSections.appendChild(section);
  });
});

chrome.runtime.sendMessage({ action: "getHistory" }, (historyItems) => {
  historyItems.forEach((item: { title: string; url: string }) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = item.title || item.url;
    link.target = "_blank";
    li.appendChild(link);
    historyList.appendChild(li);
  });
});
