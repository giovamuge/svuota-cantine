document.getElementById("extractButton").addEventListener("click", () => {
	const fileInput = document.getElementById("csvFile");
	const file = fileInput.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target.result;
			const names = extractNamesFromCSV(text);
			const randomNames = getRandomNames(names, 5); // Estrai 5 nomi casuali
			displayNames(randomNames);
		};
		reader.readAsText(file);
	} else {
		alert("Please upload a CSV file.");
	}
});

function extractNamesFromCSV(text) {
	return text.split("\n").map(row => {
		const [firstName, lastName] = row.split(",");
		return `${firstName} ${lastName}`;
	});
}

function getRandomNames(names, count) {
	const shuffled = names.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

function displayNames(names) {
	const nameList = document.getElementById("nameList");
	nameList.innerHTML = "";
	names.forEach(name => {
		const nameElement = document.createElement("div");
		nameElement.className = "name";
		nameElement.textContent = name;
		nameList.appendChild(nameElement);
	});
}
