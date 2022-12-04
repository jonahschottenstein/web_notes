chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "web-notes",
		title: "Web Notes",
		contexts: ["all"],
	});
});
