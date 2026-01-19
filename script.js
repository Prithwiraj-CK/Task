let tasks = [];
let currentFilter = 'all';

function addTask() {
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('prioritySelect').value;
    const text = input.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(task);
    input.value = '';
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    updateStats();
}

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    let filteredTasks = tasks;

    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'high') {
        filteredTasks = tasks.filter(t => t.priority === 'high');
    }

    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
            </div>
            <div class="task-actions">
                <button class="btn-small complete" onclick="toggleTask(${task.id})">
                    ${task.completed ? '↩️' : '✓'}
                </button>
                <button class="btn-small delete" onclick="deleteTask(${task.id})">✕</button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const high = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;

    const maxWidth = 100;
    const maxTasks = Math.max(high, medium, low, 1);

    document.getElementById('highBar').style.width = (high / maxTasks * maxWidth) + '%';
    document.getElementById('highBar').textContent = high;
    
    document.getElementById('mediumBar').style.width = (medium / maxTasks * maxWidth) + '%';
    document.getElementById('mediumBar').textContent = medium;
    
    document.getElementById('lowBar').style.width = (low / maxTasks * maxWidth) + '%';
    document.getElementById('lowBar').textContent = low;
}

// Event listener for Enter key
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initialize
    renderTasks();
    updateStats();
});