document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('id');

  if (ticketId) {
      const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
      const ticket = tickets.find(t => t.id === ticketId);

      if (ticket) {
          // Populate ticket details
          document.getElementById('ticket-subject').textContent = ticket.subject;
          document.getElementById('ticket-creator').textContent = ticket.requester;
          document.getElementById('ticket-status-display').textContent = ticket.status;
          document.getElementById('ticket-email').textContent = ticket.email;
          document.getElementById('requester-message').textContent = ticket.message;

          // Display the original technician in properties section
          document.getElementById('original-technician').textContent = ticket.assignee;

          // Display creation date
          document.getElementById('creation-date').textContent = formatDate(new Date(ticket.creationDate));

          // Populate the technician dropdown with the original technician as selected
          const technicianSelect = document.getElementById('ticket-technician');
          technicianSelect.innerHTML = `
              <option ${ticket.assignee === "Technician - Chng" ? "selected" : ""} value="Technician - Chng">Technician - Chng</option>
              <option ${ticket.assignee === "Technician - Eugene Tan" ? "selected" : ""} value="Technician - Eugene Tan">Technician - Eugene Tan</option>
              <option ${ticket.assignee === "Technician - Melvin Lim" ? "selected" : ""} value="Technician - Melvin Lim">Technician - Melvin Lim</option>
          `;

          // Load replies and set the selected status
          loadReplies(ticketId);
          const statusSelect = document.getElementById('ticket-status');
          statusSelect.value = ticket.status;

          // Display close date if ticket is closed
          if (ticket.status === 'Closed') {
              document.getElementById('closure-date').textContent = formatDate(new Date(ticket.closureDate));
              statusSelect.disabled = true; // Disable the dropdown
          }

          // Add change event listener for status to show the solution modal
          statusSelect.addEventListener('change', function () {
              if (this.value === 'Closed') {
                  const solutionMessage = ticket.solution || ''; // Check if solution already exists
                  if (!solutionMessage) {
                      openSolutionModal();
                      this.value = 'Open'; // Reset the status if no solution is provided
                      return; // Prevent status change
                  }
              }
          });
      } else {
          document.getElementById('ticket-subject').textContent = "Ticket not found.";
      }
  }
});

function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
}

function openSolutionModal() {
  document.getElementById('solution-modal').style.display = 'block';
}

function closeSolutionModal() {
  document.getElementById('solution-modal').style.display = 'none';
}

function saveSolution() {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('id');
  const solutionMessage = document.getElementById('solution-message').value.trim();

  if (solutionMessage) {
      // Save solution to local storage
      let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);

      if (ticketIndex !== -1) {
          tickets[ticketIndex].solution = solutionMessage; // Save the solution in the ticket object
          tickets[ticketIndex].status = 'Closed'; // Set status to Closed here
          tickets[ticketIndex].closureDate = new Date(); // Set the closure date to now
          localStorage.setItem('tickets', JSON.stringify(tickets));
          closeSolutionModal();
          alert("Solution saved successfully!");

          // Update the status dropdown to reflect 'Closed'
          const statusSelect = document.getElementById('ticket-status');
          statusSelect.value = 'Closed'; 
          statusSelect.disabled = true; // Disable the dropdown

          // Call saveTicketChanges to ensure the ticket is updated in local storage
          saveTicketChanges(); 

          loadReplies(ticketId);
      }
  } else {
      alert("Please enter a solution.");
  }
}

// Function to send a reply
function sendReply() {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('id');
  const replyMessage = document.getElementById('reply-message').value.trim();

  if (replyMessage) {
      // Save reply to local storage
      let replies = JSON.parse(localStorage.getItem('replies')) || {};
      if (!replies[ticketId]) {
          replies[ticketId] = [];
      }
      replies[ticketId].push(replyMessage);
      localStorage.setItem('replies', JSON.stringify(replies));

      // Clear the reply message input
      document.getElementById('reply-message').value = '';

      // Display the new reply
      loadReplies(ticketId);
  }
}

// Function to load replies from local storage
function loadReplies(ticketId) {
  const replies = JSON.parse(localStorage.getItem('replies')) || {};
  const repliesContainer = document.getElementById('replies');
  repliesContainer.innerHTML = ''; // Clear previous replies

  // Display the solution if exists
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket && ticket.solution) {
      const solutionElement = document.createElement('p');
      solutionElement.textContent = `Solution: ${ticket.solution}`;
      repliesContainer.appendChild(solutionElement);
  }

  if (replies[ticketId]) {
      replies[ticketId].forEach(reply => {
          const replyElement = document.createElement('p');
          replyElement.textContent = reply;
          repliesContainer.appendChild(replyElement);
      });
  }
}

function saveTicketChanges() {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('id');
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];

  const ticketIndex = tickets.findIndex(t => t.id === ticketId);

  if (ticketIndex !== -1) {
      // Update ticket details
      tickets[ticketIndex].status = document.getElementById('ticket-status').value;
      tickets[ticketIndex].assignee = document.getElementById('ticket-technician').value;

      // Save updated ticket list to local storage
      localStorage.setItem('tickets', JSON.stringify(tickets));
      alert("Ticket updated successfully!");

      // Update displayed status and technician
      document.getElementById('ticket-status-display').textContent = tickets[ticketIndex].status;
      document.getElementById('original-technician').textContent = tickets[ticketIndex].assignee;

      // Update the closure date display if the ticket is closed
      if (tickets[ticketIndex].status === 'Closed') {
          document.getElementById('closure-date').textContent = formatDate(new Date(tickets[ticketIndex].closureDate));
      } else {
          document.getElementById('closure-date').textContent = ''; // Clear if not closed
      }
  } else {
      alert("Error: Ticket not found.");
  }
}

