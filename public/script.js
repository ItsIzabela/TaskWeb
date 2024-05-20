document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const taskForm = document.getElementById('taskForm');
    const answerForm = document.getElementById('answerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const role = document.getElementById('role').value;

            if (role === 'teacher') {
                window.location.href = 'teacher.html';
            } else if (role === 'student') {
                window.location.href = 'student.html';
            }
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const task = document.getElementById('task').value;
            const duration = document.getElementById('duration').value;

            const taskList = document.getElementById('taskList');
            const taskItem = document.createElement('div');
            taskItem.innerHTML = `<p>Zadanie: ${task}, Czas trwania: ${duration} minut</p>`;
            taskList.appendChild(taskItem);

            localStorage.setItem('task', JSON.stringify({ task, duration }));
        });
    }

    if (answerForm) {
        const task = JSON.parse(localStorage.getItem('task'));
        if (task) {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = `<p>Zadanie: ${task.task}, Czas trwania: ${task.duration} minut</p>`;
        }

        const countdownDisplay = document.getElementById('countdown');
        let timeLeft = task.duration * 60;

        const updateCountdown = () => {
            const minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            countdownDisplay.textContent = `${minutes}:${seconds}`;
        };

        updateCountdown();

        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                updateCountdown();
            } else {
                clearInterval(countdownInterval);
                countdownDisplay.textContent = 'Time Up!';
            }
        }, 1000);

        answerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const answer = document.getElementById('answer').value;
            const result = {
                task: task.task,
                answer,
                timestamp: new Date().toISOString()
            };

            fetch('/submit-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                clearInterval(countdownInterval);
            })
            .catch((error) => {
                console.error('Error:', error);
                clearInterval(countdownInterval);
            });
        });
    }
});