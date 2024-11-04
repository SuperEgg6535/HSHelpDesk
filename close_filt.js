// Subject filter
document.addEventListener('DOMContentLoaded', (event) => { 
    loadTickets(); 
    addFilterEventListener(); 
});

// Subject filter event listener
document.getElementById('subject-filter').addEventListener('change', function () {
    const selectedsubject = this.value;
    filterTickets(selectedsubject);
});

// Filter tickets based on subject
function filterTickets(subject) {
    const tickets = getTicketsFromLocalStorage();
    const tableBody = document.querySelector('.ticket-list tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    tickets.forEach(ticket => {
        // Show all subjects and check if status is 'Closed'
        if (ticket.status === 'Closed' && (subject === 'All' || ticket.subject === subject)) {
            addTicketToTable(ticket);
        }
    });
}

// Load tickets when the page loads
function loadTickets() {
    filterTickets('All'); // Load all tickets initially
}

// Status filter event listener
document.getElementById('status-filter').addEventListener('change', function () {
    // Only allow "closed" to be shown
    filtersTickets('closed');
});

// Filter tickets based on status
function filtersTickets(status) {
    const tickets = getTicketsFromLocalStorage();
    const tableBody = document.querySelector('.ticket-list tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    tickets.forEach(ticket => {
        // Show only tickets that are closed
        if (ticket.status === status) {
            addTicketToTable(ticket);
        }
    });
}

// Helper functions
function getTicketsFromLocalStorage() {
    let tickets = localStorage.getItem('tickets');
    return tickets ? JSON.parse(tickets) : [];
}

function addTicketToTable(ticket) {
    const tableBody = document.querySelector('.ticket-list tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><a href="#" onclick="loadTicketDetails('${ticket.id}')">${ticket.requester}</a></td>
        <td>${ticket.email}</td>
        <td>${ticket.subject}</td>
        <td>${ticket.assignee}</td>
        <td class="status ${ticket.status.toLowerCase()}">${ticket.status}</td>
        <td>${ticket.closureDate ? formatDate(new Date(ticket.closureDate)) : 'N/A'}</td> <!-- Display Closure Date -->
    `;
    tableBody.appendChild(row);

}

function loadTicketDetails(ticketId) {
    // Assuming you're navigating to a ticket detail page or updating the DOM
    window.location.href = `ticket_detail.html?id=${ticketId}`;
}
