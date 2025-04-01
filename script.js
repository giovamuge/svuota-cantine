document.getElementById("csvFile").addEventListener("change", (event) => {
	const fileInput = event.target;
	const extractButton = document.getElementById("extractButton");

	// Enable the button only if a file is selected and it has a .csv extension
	if (fileInput.files.length > 0 && fileInput.files[0].name.endsWith(".csv")) {
		extractButton.disabled = false;
	} else {
		extractButton.disabled = true;
	}
});

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

				// Directly download the extracted names as a CSV
				downloadCSV(randomNames);

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

function extractNamesFromCSV(text) {
	return text.split("\n").slice(1).map((row) => {
		const [order, firstName, lastName] = row.split(",");
		return { order: parseInt(order), name: `${firstName} ${lastName}` };
	});
}

function getRandomNames(names, count) {
	const shuffled = names.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

function downloadCSV(names) {
	const csvHeader = "Nuovo Ordine,Ordine Originale,Nome e Cognome";
	const csvContent =
		"data:text/csv;charset=utf-8," +
		[csvHeader]
			.concat(
				names.map(
					({ order, name }, index) =>
						`${index + 1},${order},${name}`
				)
			)
			.join("\n");
	const encodedUri = encodeURI(csvContent);

	// Use the original file name with "estrazion" appended
	const fileInput = document.getElementById("csvFile");
	const originalFileName = fileInput.files[0].name.replace(".csv", "");
	const newFileName = `${originalFileName}_estratti.csv`;

	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", newFileName);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
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
			nameElement.textContent = names[index].name;
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
