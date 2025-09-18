// JS/SCRIPT.JS
let todos = [];
let todoId = 1;

// Add task function
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const errorMessage = document.getElementById('errorMessage');
    
    // Clear previous error
    errorMessage.textContent = '';
    
    // Validate input
    if (!taskInput.value.trim()) {
        errorMessage.textContent = 'Please enter a task';
        taskInput.focus();
        return;
    }
    
    if (!dateInput.value) {
        errorMessage.textContent = 'Please select a due date';
        dateInput.focus();
        return;
    }
    
    // Check if date is in the past
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        errorMessage.textContent = 'Due date cannot be in the past';
        dateInput.focus();
        return;
    }
    
    // Create new todo
    const newTodo = {
        id: todoId++,
        task: taskInput.value.trim(),
        dueDate: dateInput.value,
        status: 'pending',
        completed: false
    };
    
    todos.push(newTodo);
    
    // Clear inputs
    taskInput.value = '';
    dateInput.value = '';
    
    // Refresh display
    displayTodos();
    
    // Success feedback
    taskInput.style.background = 'rgba(85, 239, 196, 0.2)';
    setTimeout(() => {
        taskInput.style.background = 'rgba(255, 255, 255, 0.9)';
    }, 500);
}

// Display todos function
function displayTodos(filter = 'all') {
    const todoList = document.getElementById('todoList');
    
    let filteredTodos = todos;
    
    if (filter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (filter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <tr class="no-task">
                <td colspan="4">No task found</td>
            </tr>
        `;
        return;
    }
    
    todoList.innerHTML = filteredTodos.map(todo => {
        const dueDate = new Date(todo.dueDate);
        const formattedDate = dueDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <tr>
                <td class="${todo.completed ? 'task-completed' : ''}">${todo.task}</td>
                <td>${formattedDate}</td>
                <td>
                    <span class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                        ${todo.completed ? 'completed' : 'pending'}
                    </span>
                </td>
                <td>
                    <div class="actions">
                        ${!todo.completed ? 
                            `<button class="action-btn complete-btn" data-id="${todo.id}">Complete</button>` : 
                            ''}
                        <button class="action-btn delete-btn" data-id="${todo.id}">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Complete task function
function completeTask(id) {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
        todos[todoIndex].completed = true;
        todos[todoIndex].status = 'completed';
        displayTodos();
    }
}

// Delete task function
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        displayTodos();
    }
}

// Filter tasks function
function filterTasks(filter) {
    if (filter === 'all') {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            displayTodos();
        }
        return;
    }
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayTodos(filter);
}

// Handle Enter key press
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.getElementById('dateInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Set minimum date to today
document.getElementById('dateInput').min = new Date().toISOString().split('T')[0];

// Add event listeners
document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('deleteAllBtn').addEventListener('click', () => filterTasks('all'));

// Event delegation for dynamic buttons
document.getElementById('todoList').addEventListener('click', function(e) {
    const taskId = parseInt(e.target.getAttribute('data-id'));
    
    if (e.target.classList.contains('complete-btn')) {
        completeTask(taskId);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
});

// Initialize display
displayTodos();