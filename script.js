document.getElementById("extractButton").addEventListener("click", () => {
	const fileInput = document.getElementById("csvFile");
	const file = fileInput.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target.result;
			const names = extractNamesFromCSV(text);
			showProcessingAnimation(names);
			setTimeout(() => {
				const randomNames = getRandomNames(names, names.length);
				displayNames(randomNames);

				// Enable the export button after extraction
				document.getElementById("exportButton").disabled = false;

				// Hide the processing animation
				document.getElementById("processingAnimation").style.display =
					"none";
			}, 4 * 1000); // Duration of the animation
		};
		reader.readAsText(file);
	} else {
		alert("Please upload a CSV file.");
	}
});

document.getElementById("exportButton").addEventListener("click", () => {
	const nameList = document.getElementById("nameList");
	const names = Array.from(nameList.getElementsByClassName("name")).map(
		(nameElement) => nameElement.textContent
	);
	if (names.length > 0) {
		const csvContent = "data:text/csv;charset=utf-8," + names.join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "extracted_names.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} else {
		alert("No names to export.");
	}
});

function extractNamesFromCSV(text) {
	return text.split("\n").map((row) => {
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
	names.forEach((name, index) => {
		const nameElement = document.createElement("div");
		nameElement.className = "name";
		nameElement.textContent = `${index + 1}. ${name}`; // Include the row index
		nameList.appendChild(nameElement);
	});
}

function showProcessingAnimation(names) {
	const processingAnimation = document.getElementById("processingAnimation");
	const nameElement = document.createElement("p");
	processingAnimation.innerHTML = "";
	processingAnimation.appendChild(nameElement);
	processingAnimation.style.display = "block";

	let index = 0;
	const interval = setInterval(() => {
		if (index < names.length) {
			nameElement.textContent = names[index];
			index++;
		} else {
			clearInterval(interval);
			processingAnimation.style.display = "none";
		}
	}, (4 * 1000) / names.length); // Change name every 200ms
}

window.addEventListener("beforeunload", (event) => {
	const confirmationMessage = "Sei sicuro di voler uscire? Le modifiche apportate potrebbero non essere salvate.";
	event.returnValue = confirmationMessage; // Standard for most browsers
	return confirmationMessage; // For some older browsers
});
