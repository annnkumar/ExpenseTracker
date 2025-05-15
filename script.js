document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmount = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');
    
    // Load expenses from localStorage if available
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let totalAmount = calculateTotalAmount();

    expenseForm.addEventListener('submit' , (e) => {
         
         e.preventDefault();
         const name = expenseNameInput.value.trim();
         const amount = parseFloat(expenseAmount.value.trim());

         if(name !== "" && !isNaN(amount) && amount > 0){
                 const newExpense = {
                    id: Date.now(),
                    name: name,
                    amount: amount
                 }

                 expenses.push(newExpense);
                 saveExpensesToLocalStorage();
                 renderExpenses();
                 updateTotal();

                 // clear input fields
                 expenseNameInput.value = "";
                 expenseAmount.value = "";
         } else {
                 alert('Please enter a valid expense name and amount');
         }

    });


    function saveExpensesToLocalStorage(){
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }


    function calculateTotalAmount(){
        return expenses.reduce((sum , expense) => sum  + expense.amount , 0);
    }

    function renderExpenses(){
        expenseList.innerHTML = "";
        
        if(expenses.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No expenses added yet';
            emptyMessage.className = 'empty-message';
            expenseList.appendChild(emptyMessage);
            return;
        }
        
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.className = 'expense-item';
            li.innerHTML = `  
             ${expense.name} - $${expense.amount.toFixed(2)}
             <button class="delete-btn" data-id="${expense.id}">Delete</button>    
             `;
            expenseList.appendChild(li);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteExpense(id);
            });
        });
    }
     


    function updateTotal(){
      totalAmount = calculateTotalAmount();
      totalAmountDisplay.textContent = totalAmount.toFixed(2);
    }
    
    function deleteExpense(id) {
      expenses = expenses.filter(expense => expense.id !== id);
      saveExpensesToLocalStorage();
      renderExpenses();
      updateTotal();
    }
    
    // Initialize the app
    renderExpenses();
    updateTotal();
})