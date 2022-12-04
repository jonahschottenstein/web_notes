chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "web-notes",
		title: "Web Notes",
		contexts: ["all"],
	});
});

const sendMessage = (webNotesMessage) => {
	chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
		const tab = tabs[0];
		chrome.tabs.sendMessage(tab.id, {
			webNotesMessage: webNotesMessage,
		});
	});
};

chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
	if (menuItemId === "web-notes") {
		console.log(menuItemId);
		let message = "web notes clicked";
		sendMessage(message);
		console.log(message);
	}
});
