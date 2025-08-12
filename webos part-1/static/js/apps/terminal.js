class Terminal {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.currentDirectory = '/';
    }

    init() {
        this.setupUI();
        this.setupEventListeners();
        this.printWelcomeMessage();
    }

    setupUI() {
        const content = document.getElementById('terminal-content');
        content.innerHTML = `
            <div class="terminal-header">
                <div class="terminal-title">Terminal</div>
                <div class="terminal-controls">
                    <button class="control-btn" data-action="minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="control-btn" data-action="maximize">
                        <i class="fas fa-square"></i>
                    </button>
                    <button class="control-btn" data-action="close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="terminal-body">
                <div class="terminal-output"></div>
                <div class="terminal-input">
                    <span class="prompt">$</span>
                    <input type="text" class="command-input" autofocus>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const content = document.getElementById('terminal-content');
        const input = content.querySelector('.command-input');
        
        // Command input
        input.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    this.executeCommand(input.value);
                    input.value = '';
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateHistory('up');
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateHistory('down');
                    break;
                    
                case 'Tab':
                    e.preventDefault();
                    this.handleTabCompletion(input.value);
                    break;
            }
        });

        // Control buttons
        content.querySelectorAll('.control-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.handleControlAction(button.dataset.action);
            });
        });
    }

    printWelcomeMessage() {
        this.printLine('Welcome to WebOS Terminal');
        this.printLine('Type "help" for available commands');
        this.printPrompt();
    }

    printPrompt() {
        this.printLine(`<span class="prompt">$</span> `, false);
    }

    printLine(text, newLine = true) {
        const output = document.querySelector('.terminal-output');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text;
        
        if (newLine) {
            output.appendChild(line);
        } else {
            output.appendChild(line);
        }
        
        output.scrollTop = output.scrollHeight;
    }

    executeCommand(command) {
        if (!command.trim()) {
            this.printPrompt();
            return;
        }
        
        // Add to history
        this.history.push(command);
        this.historyIndex = this.history.length;
        
        // Print command
        this.printLine(`<span class="prompt">$</span> ${command}`);
        
        // Parse and execute command
        const [cmd, ...args] = command.split(' ');
        
        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
                
            case 'ls':
                this.listDirectory(args[0] || this.currentDirectory);
                break;
                
            case 'cd':
                this.changeDirectory(args[0]);
                break;
                
            case 'pwd':
                this.printWorkingDirectory();
                break;
                
            case 'mkdir':
                this.createDirectory(args[0]);
                break;
                
            case 'rm':
                this.removeFile(args[0]);
                break;
                
            case 'cat':
                this.showFileContent(args[0]);
                break;
                
            case 'clear':
                this.clearScreen();
                break;
                
            default:
                this.printLine(`Command not found: ${cmd}`);
        }
        
        this.printPrompt();
    }

    navigateHistory(direction) {
        const input = document.querySelector('.command-input');
        
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            input.value = this.history[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            input.value = this.history[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.history.length - 1) {
            this.historyIndex++;
            input.value = '';
        }
    }

    handleTabCompletion(input) {
        // Implement tab completion
        // This is a placeholder - implement actual tab completion logic
    }

    handleControlAction(action) {
        switch (action) {
            case 'minimize':
                // Implement minimize
                break;
                
            case 'maximize':
                // Implement maximize
                break;
                
            case 'close':
                // Implement close
                break;
        }
    }

    showHelp() {
        const commands = [
            { cmd: 'help', desc: 'Show this help message' },
            { cmd: 'ls [dir]', desc: 'List directory contents' },
            { cmd: 'cd [dir]', desc: 'Change directory' },
            { cmd: 'pwd', desc: 'Print working directory' },
            { cmd: 'mkdir [dir]', desc: 'Create directory' },
            { cmd: 'rm [file]', desc: 'Remove file' },
            { cmd: 'cat [file]', desc: 'Show file content' },
            { cmd: 'clear', desc: 'Clear screen' }
        ];
        
        this.printLine('Available commands:');
        commands.forEach(cmd => {
            this.printLine(`  ${cmd.cmd.padEnd(15)} ${cmd.desc}`);
        });
    }

    async listDirectory(path) {
        try {
            const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            data.forEach(item => {
                const type = item.type === 'directory' ? 'd' : '-';
                const name = item.name;
                this.printLine(`${type} ${name}`);
            });
        } catch (error) {
            this.printLine(`Error: ${error.message}`);
        }
    }

    changeDirectory(path) {
        if (!path) {
            this.currentDirectory = '/';
            return;
        }
        
        // Handle relative paths
        if (path.startsWith('./')) {
            path = this.currentDirectory + path.substring(1);
        } else if (path.startsWith('../')) {
            const parts = this.currentDirectory.split('/');
            parts.pop();
            this.currentDirectory = parts.join('/') || '/';
            return;
        }
        
        this.currentDirectory = path;
    }

    printWorkingDirectory() {
        this.printLine(this.currentDirectory);
    }

    async createDirectory(name) {
        if (!name) {
            this.printLine('Usage: mkdir [directory_name]');
            return;
        }
        
        try {
            const response = await fetch('/api/files', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    type: 'directory',
                    path: this.currentDirectory
                })
            });
            
            if (response.ok) {
                this.printLine(`Directory created: ${name}`);
            } else {
                this.printLine('Error creating directory');
            }
        } catch (error) {
            this.printLine(`Error: ${error.message}`);
        }
    }

    async removeFile(name) {
        if (!name) {
            this.printLine('Usage: rm [file_name]');
            return;
        }
        
        try {
            const response = await fetch(`/api/files/${encodeURIComponent(name)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.ok) {
                this.printLine(`File removed: ${name}`);
            } else {
                this.printLine('Error removing file');
            }
        } catch (error) {
            this.printLine(`Error: ${error.message}`);
        }
    }

    async showFileContent(name) {
        if (!name) {
            this.printLine('Usage: cat [file_name]');
            return;
        }
        
        try {
            const response = await fetch(`/api/files/${encodeURIComponent(name)}/content`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const content = await response.text();
            this.printLine(content);
        } catch (error) {
            this.printLine(`Error: ${error.message}`);
        }
    }

    clearScreen() {
        const output = document.querySelector('.terminal-output');
        output.innerHTML = '';
        this.printPrompt();
    }
}

// Initialize Terminal when the app is launched
function initTerminal() {
    const terminal = new Terminal();
    terminal.init();
}