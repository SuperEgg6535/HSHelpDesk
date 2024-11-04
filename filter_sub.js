//subject filter
document.addEventListener('DOMContentLoaded', (event) => { 
    loadTickets(); 
    addFilterEventListener(); 
 });


document.getElementById('subject-filter').addEventListener('change', function () {
    const selectedsubject = this.value;
    filterTickets(selectedsubject);
  });
  
  function filterTickets(subject) {
    const tickets = getTicketsFromLocalStorage();
    const tableBody = document.querySelector('.ticket-list tbody');
    tableBody.innerHTML = ''; // Clear existing rows
  
    tickets.forEach(ticket => {
      if (subject === 'All' || ticket.subject === subject) {
        addTicketToTable(ticket);
      }
    });
  }
  
  function loadTickets() {
    const selectedsubject = document.getElementById('subject-filter').value;
    filterTickets(selectedsubject);
  }

    
  function loadTickets() { filterTickets('All'); }// Load all tickets initially 






  



  



  

  
  



  



  



  

  
  