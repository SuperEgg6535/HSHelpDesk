function updateTicketStats() {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];

    // Initialize counters
    const counts = {
        "Software Issue": 0,
        "Hardware Issue": 0,
        "Request IT Stuff": 0
    };

    // Count tickets by category
    tickets.forEach(ticket => {
        if (counts[ticket.category] !== undefined) {
            counts[ticket.category]++;
        }
    });

    // Update the counts in the table
    document.getElementById('software-count').textContent = counts["Software Issue"];
    document.getElementById('hardware-count').textContent = counts["Hardware Issue"];
    document.getElementById('request-count').textContent = counts["Request IT Stuff"];

    // Calculate percentages
    const totalTickets = tickets.length;
    document.getElementById('software-percentage').textContent = totalTickets ? ((counts["Software Issue"] / totalTickets) * 100).toFixed(2) + '%' : '0%';
    document.getElementById('hardware-percentage').textContent = totalTickets ? ((counts["Hardware Issue"] / totalTickets) * 100).toFixed(2) + '%' : '0%';
    document.getElementById('request-percentage').textContent = totalTickets ? ((counts["Request IT Stuff"] / totalTickets) * 100).toFixed(2) + '%' : '0%';

    // Prepare data for the pie chart
    const chartData = {
        labels: Object.keys(counts),
        datasets: [{
            label: 'Ticket Categories',
            data: Object.values(counts),
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1
        }]
    };

    // Create the pie chart
    const ctx = document.getElementById('myPieChart').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear previous chart if exists
    new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Ticket Distribution by Category'
                }
            }
        }
    });

    // Update the technician open tickets
    calculateOpenTickets(); // Ensure this function is defined properly to update the technician tickets
}

// Call the updateTicketStats function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateTicketStats();
});

function calculateOpenTickets() {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const technicianOpenTickets = {};

    tickets.forEach(ticket => {
        if (ticket.status === 'Open') {
            if (!technicianOpenTickets[ticket.assignedTo]) {
                technicianOpenTickets[ticket.assignedTo] = 0;
            }
            technicianOpenTickets[ticket.assignedTo]++;
        }
    });

    // Populate the technician open tickets table
    const technicianBody = document.getElementById('technician-open-tickets-body');
    technicianBody.innerHTML = ''; // Clear previous data

    for (const [technician, count] of Object.entries(technicianOpenTickets)) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${technician}</td><td>${count}</td>`;
        technicianBody.appendChild(row);
    }
}
