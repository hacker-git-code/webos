class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.viewMode = 'month'; // 'month', 'week', 'day'
        this.events = [];
    }

    init() {
        this.setupUI();
        this.setupEventListeners();
        this.loadEvents();
        this.renderCalendar();
    }

    setupUI() {
        const content = document.getElementById('calendar-content');
        content.innerHTML = `
            <div class="calendar-header">
                <div class="view-controls">
                    <button class="view-btn" data-view="month">Month</button>
                    <button class="view-btn" data-view="week">Week</button>
                    <button class="view-btn" data-view="day">Day</button>
                </div>
                <div class="navigation">
                    <button class="nav-btn" data-action="prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="current-date"></div>
                    <button class="nav-btn" data-action="next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <button class="add-event-btn">
                    <i class="fas fa-plus"></i> Add Event
                </button>
            </div>
            <div class="calendar-body">
                <div class="calendar-grid"></div>
            </div>
        `;
    }

    setupEventListeners() {
        const content = document.getElementById('calendar-content');
        
        // View mode buttons
        content.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.viewMode = button.dataset.view;
                this.renderCalendar();
            });
        });

        // Navigation buttons
        content.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.navigate(button.dataset.action);
            });
        });

        // Add event button
        content.querySelector('.add-event-btn').addEventListener('click', () => {
            this.showEventForm();
        });
    }

    navigate(direction) {
        switch (this.viewMode) {
            case 'month':
                if (direction === 'prev') {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                } else {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                }
                break;
                
            case 'week':
                if (direction === 'prev') {
                    this.currentDate.setDate(this.currentDate.getDate() - 7);
                } else {
                    this.currentDate.setDate(this.currentDate.getDate() + 7);
                }
                break;
                
            case 'day':
                if (direction === 'prev') {
                    this.currentDate.setDate(this.currentDate.getDate() - 1);
                } else {
                    this.currentDate.setDate(this.currentDate.getDate() + 1);
                }
                break;
        }
        
        this.renderCalendar();
    }

    renderCalendar() {
        const content = document.getElementById('calendar-content');
        const currentDateElement = content.querySelector('.current-date');
        const gridElement = content.querySelector('.calendar-grid');
        
        // Update current date display
        currentDateElement.textContent = this.formatDate(this.currentDate);
        
        // Clear grid
        gridElement.innerHTML = '';
        
        switch (this.viewMode) {
            case 'month':
                this.renderMonthView(gridElement);
                break;
                
            case 'week':
                this.renderWeekView(gridElement);
                break;
                
            case 'day':
                this.renderDayView(gridElement);
                break;
        }
    }

    renderMonthView(gridElement) {
        // Add day names header
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headerRow = document.createElement('div');
        headerRow.className = 'calendar-row header';
        
        dayNames.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell header-cell';
            cell.textContent = day;
            headerRow.appendChild(cell);
        });
        
        gridElement.appendChild(headerRow);
        
        // Get first day of month and total days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const totalDays = lastDay.getDate();
        
        // Create calendar grid
        let day = 1;
        let currentRow = document.createElement('div');
        currentRow.className = 'calendar-row';
        
        // Add empty cells for days before the first day
        for (let i = 0; i < firstDay.getDay(); i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell empty';
            currentRow.appendChild(cell);
        }
        
        // Add days
        for (let i = firstDay.getDay(); i < 7; i++) {
            const cell = this.createDayCell(day);
            currentRow.appendChild(cell);
            day++;
        }
        
        gridElement.appendChild(currentRow);
        
        // Add remaining weeks
        while (day <= totalDays) {
            currentRow = document.createElement('div');
            currentRow.className = 'calendar-row';
            
            for (let i = 0; i < 7 && day <= totalDays; i++) {
                const cell = this.createDayCell(day);
                currentRow.appendChild(cell);
                day++;
            }
            
            gridElement.appendChild(currentRow);
        }
    }

    renderWeekView(gridElement) {
        // Add time slots
        const timeSlots = [];
        for (let hour = 0; hour < 24; hour++) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        
        timeSlots.forEach(time => {
            const row = document.createElement('div');
            row.className = 'calendar-row week-row';
            
            const timeCell = document.createElement('div');
            timeCell.className = 'calendar-cell time-cell';
            timeCell.textContent = time;
            
            const dayCells = document.createElement('div');
            dayCells.className = 'day-cells';
            
            // Get start of week
            const startOfWeek = new Date(this.currentDate);
            startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
            
            // Add cells for each day of the week
            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + i);
                
                const cell = document.createElement('div');
                cell.className = 'calendar-cell week-cell';
                cell.dataset.date = day.toISOString();
                
                // Add events for this time slot
                const events = this.getEventsForTime(day, time);
                events.forEach(event => {
                    const eventElement = this.createEventElement(event);
                    cell.appendChild(eventElement);
                });
                
                dayCells.appendChild(cell);
            }
            
            row.appendChild(timeCell);
            row.appendChild(dayCells);
            gridElement.appendChild(row);
        });
    }

    renderDayView(gridElement) {
        // Add time slots
        const timeSlots = [];
        for (let hour = 0; hour < 24; hour++) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        
        timeSlots.forEach(time => {
            const row = document.createElement('div');
            row.className = 'calendar-row day-row';
            
            const timeCell = document.createElement('div');
            timeCell.className = 'calendar-cell time-cell';
            timeCell.textContent = time;
            
            const eventCell = document.createElement('div');
            eventCell.className = 'calendar-cell day-cell';
            eventCell.dataset.date = this.currentDate.toISOString();
            eventCell.dataset.time = time;
            
            // Add events for this time slot
            const events = this.getEventsForTime(this.currentDate, time);
            events.forEach(event => {
                const eventElement = this.createEventElement(event);
                eventCell.appendChild(eventElement);
            });
            
            row.appendChild(timeCell);
            row.appendChild(eventCell);
            gridElement.appendChild(row);
        });
    }

    createDayCell(day) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.textContent = day;
        
        // Check if this is today
        const today = new Date();
        if (this.currentDate.getFullYear() === today.getFullYear() &&
            this.currentDate.getMonth() === today.getMonth() &&
            day === today.getDate()) {
            cell.classList.add('today');
        }
        
        // Add events for this day
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const events = this.getEventsForDate(date);
        
        if (events.length > 0) {
            const eventIndicator = document.createElement('div');
            eventIndicator.className = 'event-indicator';
            eventIndicator.textContent = events.length;
            cell.appendChild(eventIndicator);
        }
        
        return cell;
    }

    createEventElement(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'calendar-event';
        eventElement.textContent = event.title;
        eventElement.style.backgroundColor = event.color || '#4a90e2';
        
        eventElement.addEventListener('click', () => {
            this.showEventDetails(event);
        });
        
        return eventElement;
    }

    async loadEvents() {
        try {
            const response = await fetch('/api/calendar/events', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            this.events = data;
            this.renderCalendar();
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    getEventsForTime(date, time) {
        return this.events.filter(event => {
            const eventStart = new Date(event.start);
            return eventStart.toDateString() === date.toDateString() &&
                   eventStart.toTimeString().substring(0, 5) === time;
        });
    }

    showEventForm(event = null) {
        const form = document.createElement('div');
        form.className = 'event-form';
        
        form.innerHTML = `
            <h3>${event ? 'Edit Event' : 'New Event'}</h3>
            <form>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value="${event ? event.title : ''}" required>
                </div>
                <div class="form-group">
                    <label>Start</label>
                    <input type="datetime-local" name="start" value="${event ? this.formatDateTime(event.start) : ''}" required>
                </div>
                <div class="form-group">
                    <label>End</label>
                    <input type="datetime-local" name="end" value="${event ? this.formatDateTime(event.end) : ''}" required>
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <input type="color" name="color" value="${event ? event.color : '#4a90e2'}">
                </div>
                <div class="form-actions">
                    <button type="submit">Save</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                    ${event ? '<button type="button" class="delete-btn">Delete</button>' : ''}
                </div>
            </form>
        `;
        
        document.body.appendChild(form);
        
        // Handle form submission
        form.querySelector('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const eventData = {
                title: formData.get('title'),
                start: formData.get('start'),
                end: formData.get('end'),
                color: formData.get('color')
            };
            
            if (event) {
                eventData.id = event.id;
                await this.updateEvent(eventData);
            } else {
                await this.createEvent(eventData);
            }
            
            form.remove();
        });
        
        // Handle cancel
        form.querySelector('.cancel-btn').addEventListener('click', () => {
            form.remove();
        });
        
        // Handle delete
        const deleteBtn = form.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this event?')) {
                    await this.deleteEvent(event.id);
                    form.remove();
                }
            });
        }
    }

    showEventDetails(event) {
        const details = document.createElement('div');
        details.className = 'event-details';
        
        details.innerHTML = `
            <h3>${event.title}</h3>
            <p>Start: ${this.formatDateTime(event.start)}</p>
            <p>End: ${this.formatDateTime(event.end)}</p>
            <div class="event-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                <button class="close-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(details);
        
        // Handle edit
        details.querySelector('.edit-btn').addEventListener('click', () => {
            details.remove();
            this.showEventForm(event);
        });
        
        // Handle delete
        details.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this event?')) {
                await this.deleteEvent(event.id);
                details.remove();
            }
        });
        
        // Handle close
        details.querySelector('.close-btn').addEventListener('click', () => {
            details.remove();
        });
    }

    async createEvent(eventData) {
        try {
            const response = await fetch('/api/calendar/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            
            const data = await response.json();
            this.events.push(data);
            this.renderCalendar();
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    }

    async updateEvent(eventData) {
        try {
            const response = await fetch(`/api/calendar/events/${eventData.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            
            const data = await response.json();
            const index = this.events.findIndex(e => e.id === data.id);
            if (index !== -1) {
                this.events[index] = data;
                this.renderCalendar();
            }
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    }

    async deleteEvent(eventId) {
        try {
            await fetch(`/api/calendar/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            this.events = this.events.filter(e => e.id !== eventId);
            this.renderCalendar();
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    }

    formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toISOString().slice(0, 16);
    }
}

// Initialize Calendar when the app is launched
function initCalendar() {
    const calendar = new Calendar();
    calendar.init();
}