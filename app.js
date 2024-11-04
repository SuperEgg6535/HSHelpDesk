document.addEventListener('DOMContentLoaded', (event) => {
  loadTickets(); // Load existing tickets from local storage on page load
});

// Select the form element
const form = document.getElementById('new-ticket-form');

// Event listener for form submission
form.addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent form from refreshing the page

  // Capture form data
  const ticket = {
    id: Date.now().toString(), // Unique ID based on timestamp
    requester: document.getElementById('requester').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    assignee: autoAssignTechnician(),
    status: document.getElementById('status').value,
    message: document.getElementById('message').value,
    attachments: [], // Initialize attachments array
    creationDate: new Date().toISOString(), // Set the creation date
    closureDate: null // Initialize closure date as null
  };

  // Handle file uploads
  const fileInput = document.getElementById('attachment');
  const files = fileInput.files;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileData = await convertFileToBase64(file);
    ticket.attachments.push({ name: file.name, data: fileData });
  }

  // Save ticket to local storage and add to table
  addTicketToLocalStorage(ticket);
  addTicketToTable(ticket);

  // Clear the form after submission
  form.reset();
  alert("Ticket added successfully!");
});

// Function to convert file to Base64
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function addTicketToTable(ticket) {
  const tableBody = document.querySelector('.ticket-list tbody');

  if (tableBody) {
    const row = document.createElement('tr');
    const truncatedMessage = ticket.message.length > 30 ? ticket.message.substring(0, 30) + '...' : ticket.message;
    row.innerHTML = `
      <td><a href="ticket_detail.html?id=${encodeURIComponent(ticket.id)}">${ticket.requester}</a></td>
      <td>${ticket.email}</td>
      <td>${ticket.subject}</td>
      <td>${ticket.assignee}</td>
      <td class="status ${ticket.status.toLowerCase()}">${ticket.status}</td>
      <td>${truncatedMessage}</td>
    `;
    tableBody.appendChild(row);
  }
}

function addTicketToLocalStorage(ticket) {
  let tickets = getTicketsFromLocalStorage();
  tickets.push(ticket);
  localStorage.setItem('tickets', JSON.stringify(tickets));
}

function getTicketsFromLocalStorage() {
  let tickets = localStorage.getItem('tickets');
  return tickets ? JSON.parse(tickets) : [];
}

function loadTickets() {
  const tickets = getTicketsFromLocalStorage();
  tickets.forEach(ticket => {
    addTicketToTable(ticket);
  });
}

// Function to format date as a string
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

