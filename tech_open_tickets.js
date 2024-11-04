// tech_open_tickets.js

function calculateOpenTickets() {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const technicianCounts = {};

    // Define target technicians
    const targetTechnicians = ['Chng', 'Eugene Tan', 'Melvin Lim'];

    // Initialize the technicianCounts object
    targetTechnicians.forEach(technician => {
        technicianCounts[technician] = 0; // Start with zero open tickets
    });

    // Count open tickets for each technician
    tickets.forEach(ticket => {
        if (ticket.status === 'Open' && targetTechnicians.includes(ticket.assignedTo)) {
            technicianCounts[ticket.assignedTo]++;
        }
    });

    // Update the technician open tickets table
    const tbody = document.getElementById('technician-open-tickets-body');
    tbody.innerHTML = ''; // Clear previous data

    targetTechnicians.forEach(technician => {
        const openCount = technicianCounts[technician];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${technician}</td>
            <td>${openCount}</td>
        `;
        tbody.appendChild(row);
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    calculateOpenTickets();
});

// Example function to close a ticket and update the counts
function closeTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const updatedTickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
            ticket.status = 'Closed'; // Update the status to Closed
        }
        return ticket;
    });
    
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    calculateOpenTickets(); // Update the technician open ticket counts
}
