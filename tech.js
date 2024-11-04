// Function to randomly auto-assign a technician
const technicians = [
    { name: "Technician - Chng", tasks: 0 },
    { name: "Technician - Eugene Tan", tasks: 0 },
    { name: "Technician - Melvin Lim", tasks: 0 }
  ];
  
  if (!localStorage.getItem('technicians')) {
    localStorage.setItem('technicians', JSON.stringify(technicians));
  }
  
  function autoAssignTechnician() {
    const technicians = JSON.parse(localStorage.getItem('technicians'));
    technicians.sort((a, b) => a.tasks - b.tasks); // Sort technicians by the number of tasks
    const selectedTechnician = technicians[0]; // Select the technician with the fewest tasks
  
    // Update the task count
    selectedTechnician.tasks += 1;
    localStorage.setItem('technicians', JSON.stringify(technicians));
  
    return selectedTechnician.name;
  }
  
  function removeTaskFromTechnician(technicianName) {
    const technicians = JSON.parse(localStorage.getItem('technicians'));
    const technician = technicians.find(t => t.name === technicianName);
    if (technician) {
      technician.tasks = Math.max(0, technician.tasks - 1); // Prevent negative task count
      localStorage.setItem('technicians', JSON.stringify(technicians));
    }
  }



 