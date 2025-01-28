let employees = [];
let regions = {};

// JSON ფაილის ჩატვირთვა
fetch('data.json') // Ensure this path is correct
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        employees = data; // მონაცემების ჩატვირთვა
        populateRegions();
    })
    .catch(error => {
        console.error('მონაცემების ჩატვირთვის შეცდომა:', error);
        document.getElementById('results').innerHTML = '<p>მონაცემების ჩატვირთვის შეცდომა. სცადეთ მოგვიანებით.</p>';
    });

function populateRegions() {
    employees.forEach(employee => {
        const region = employee['ლოკაცია'];
        if (!regions[region]) {
            regions[region] = [];
        }
        regions[region].push(employee);
    });

    const regionsList = document.getElementById('regions-list');
    for (const region in regions) {
        const button = document.createElement('button');
        button.className = 'region-button';
        button.textContent = region;
        button.addEventListener('click', () => loadEmployees(region));
        regionsList.appendChild(button);
    }
}

function loadEmployees(region) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const results = regions[region];

    if (results.length > 0) {
        results.forEach(employee => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p><strong>სახელი:</strong> ${employee['სახელი']}</p>
                <p><strong>გვარი:</strong> ${employee['გვარი']}</p>
                <p><strong>პოზიცია:</strong> ${employee['პოზიცია']}</p>
                <p><strong>დაბადების თარიღი:</strong> ${employee['დაბადების თარიღი']}</p>
                <p><strong>მობილური:</strong> ${employee['მობილური'].join(', ')}</p>
                <p><strong>ელ.ფოსტა:</strong> ${employee['ელ.ფოსტა'].join(', ')}</p>
                <p><strong>ლოკაცია:</strong> ${employee['ლოკაცია']}</p>
            `;
            resultsContainer.appendChild(div);
        });
    } else {
        resultsContainer.textContent = 'შედეგები არ მოიძებნა';
    }

    document.getElementById('regions-container').style.display = 'block';
    document.getElementById('employees-container').style.display = 'block';
}

// Login functionality
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Replace with your actual authentication logic
        if (username === 'admin' && password === '123') {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('search-container').style.display = 'block';
            fetchEmployees(); // Start loading employees
        } else {
            document.getElementById('login-error').textContent = 'არასწორი მომხმარებლის სახელი ან პაროლი';
        }
    });

    document.getElementById('logout-button').addEventListener('click', function() {
        document.getElementById('search-container').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });

    document.getElementById('regions-button').addEventListener('click', function() {
        document.getElementById('regions-container').style.display = 'block';
        document.getElementById('employees-container').style.display = 'none';
    });

    updateDateTime();
    updateWeather();
    setInterval(updateDateTime, 60000); // Update date and time every minute
});

// Search function with debounce for performance optimization
let timeout = null;
document.getElementById('search').addEventListener('input', function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        searchEmployee();
    }, 300); // 300ms debounce to avoid excessive searches
});

function searchEmployee() {
    const query = document.getElementById('search').value.toLowerCase();
    if (query.length < 3) {
        document.getElementById('results').innerHTML = '<p>გთხოვთ შეიყვანოთ მინიმუმ 3 სიმბოლო.</p>';
        return;
    }
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const results = employees.filter(employee => 
        employee['სახელი'].toLowerCase().includes(query) || 
        employee['გვარი'].toLowerCase().includes(query)
    );

    if (results.length > 0) {
        results.forEach(employee => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p><strong>სახელი:</strong> ${employee['სახელი']}</p>
                <p><strong>გვარი:</strong> ${employee['გვარი']}</p>
                <p><strong>პოზიცია:</strong> ${employee['პოზიცია']}</p>
                <p><strong>დაბადების თარიღი:</strong> ${employee['დაბადების თარიღი']}</p>
                <p><strong>მობილური:</strong> ${employee['მობილური'].join(', ')}</p>
                <p><strong>ელ.ფოსტა:</strong> ${employee['ელ.ფოსტა'].join(', ')}</p>
                <p><strong>ლოკაცია:</strong> ${employee['ლოკაცია']}</p>
            `;
            resultsContainer.appendChild(div);
        });
    } else {
        resultsContainer.textContent = 'შედეგები არ მოიძებნა';
    }
}

function updateDateTime() {
    const now = new Date();
    const datetimeElement = document.getElementById('datetime');
    datetimeElement.textContent = now.toLocaleString('ka-GE', {
        dateStyle: 'full',
        timeStyle: 'short',
    });
}

function updateWeather() {
    const weatherElement = document.getElementById('weather');
    const apiKey = '4766347f15eebd3e30e46e21fd21560e'; // Replace with your actual API key
    const location = 'Tbilisi'; // Replace with your actual location

    weatherElement.textContent = 'ამინდის ჩატვირთვა...';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const temp = Math.round(data.main.temp);
            const description = data.weather[0].description;
            weatherElement.textContent = `${location}: ${temp}°C, ${description}`;
        })
        .catch(error => {
            weatherElement.textContent = 'ამინდის მონაცემების ჩატვირთვა ვერ მოხერხდა.';
            console.error('Weather API error:', error);
        });
}
