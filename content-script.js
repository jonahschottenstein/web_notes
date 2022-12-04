const getSelection = () => window.getSelection();

const getRange = () => {
	const selection = getSelection();
	let rangeArray = [];

	for (let i = 0; i < selection.rangeCount; i++) {
		rangeArray[i] = selection.getRangeAt(i);
	}

	return rangeArray;
};

const createNewRange = (startNode, startOffset, endNode, endOffset) => {
	const newRange = document.createRange();
	newRange.setStart(startNode, startOffset);
	newRange.setEnd(endNode, endOffset);
	return newRange;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log(message, sender, sendResponse);
});
