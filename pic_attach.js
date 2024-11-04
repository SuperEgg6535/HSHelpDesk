document.addEventListener('DOMContentLoaded', (event) => {
    const ticketId = new URLSearchParams(window.location.search).get('id'); // Get the ticket ID from the URL
    const ticket = getTicketFromLocalStorage(ticketId); // Retrieve the ticket from local storage

    if (ticket) {
        // Populate the ticket details on the page
        const requesterEl = document.getElementById('requester');
        const emailEl = document.getElementById('email');
        const subjectEl = document.getElementById('subject');
        const assigneeEl = document.getElementById('assignee');
        const statusEl = document.getElementById('status');
        const messageEl = document.getElementById('message');
        const attachmentContainer = document.getElementById('attachments');

        if (requesterEl) requesterEl.textContent = ticket.requester;
        if (emailEl) emailEl.textContent = ticket.email;
        if (subjectEl) subjectEl.textContent = ticket.subject;
        if (assigneeEl) assigneeEl.textContent = ticket.assignee;
        if (statusEl) statusEl.textContent = ticket.status;
        if (messageEl) messageEl.textContent = ticket.message;

        // Check if there are any attachments and display them
        if (ticket.attachments && ticket.attachments.length > 0) {
            ticket.attachments.forEach(att => {
                // Create an element based on the file type
                if (att.data.startsWith('data:image')) {
                    // If the attachment is an image, display it
                    const img = document.createElement('img');
                    img.src = att.data;
                    img.alt = att.name;
                    img.style.maxWidth = '1000px';
                    img.style.marginRight = '10px';
                    attachmentContainer.appendChild(img);
                } else {
                    // For non-image attachments, provide a download link
                    const link = document.createElement('a');
                    link.href = att.data;
                    link.download = att.name;
                    link.textContent = `Download ${att.name}`;
                    link.style.display = 'block';
                    link.style.marginTop = '5px';
                    attachmentContainer.appendChild(link);
                }
            });
        } 
    } else {
        console.error('Ticket not found'); // Log an error if the ticket cannot be found
    }
});

// Function to retrieve a specific ticket from local storage
function getTicketFromLocalStorage(id) {
    const tickets = getTicketsFromLocalStorage(); // Get all tickets
    return tickets.find(ticket => ticket.id === id); // Find the ticket with the matching ID
}

// Function to get tickets from local storage
function getTicketsFromLocalStorage() {
    let tickets = localStorage.getItem('tickets'); // Retrieve the tickets from local storage
    return tickets ? JSON.parse(tickets) : []; // Parse and return them or return an empty array
}
