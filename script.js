async function fetchSupportLogs() {
    try {
        const response = await fetch("http://localhost:5000/logs");
        const data = await response.json();
        displayLogs(data);
    } catch (error) {
        console.error("Error fetching logs:", error);
    }
}

function displayLogs(logs) {
    const logContainer = document.getElementById("supportLog");
    logContainer.innerHTML = "";

    logs.forEach((entry) => {
        const logDiv = document.createElement("div");
        logDiv.className = "log-entry";

        logDiv.innerHTML = `
            <p><strong>Query:</strong> ${entry.query}</p>
            <p><strong>Escalation Level:</strong> ${entry.escalation_level}</p>
            <p><strong>Status:</strong> ${entry.status}</p>
            <p><strong>Response:</strong> ${entry.response}</p>
            ${entry.status === "Open" ? `<button class="resolve" onclick="resolveIssue(${entry.id})">Mark as Resolved</button>` : ""}
        `;

        logContainer.appendChild(logDiv);
    });
}

async function submitQuery() {
    const query = document.getElementById("queryInput").value;
    const escalationLevel = document.getElementById("escalationLevel").value;

    if (!query.trim()) return alert("Please enter a customer issue.");

    try {
        await fetch("http://localhost:5000/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, escalation_level: escalationLevel })
        });
        fetchSupportLogs();
        document.getElementById("queryInput").value = "";
    } catch (error) {
        console.error("Error submitting query:", error);
    }
}

async function resolveIssue(id) {
    try {
        await fetch(`http://localhost:5000/logs/${id}`, {
            method: "PUT"
        });
        fetchSupportLogs();
    } catch (error) {
        console.error("Error resolving issue:", error);
    }
}

// Fetch logs on page load
fetchSupportLogs();
