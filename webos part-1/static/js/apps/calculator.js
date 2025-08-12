class Calculator {
    constructor() {
        this.currentValue = 0;
        this.memory = 0;
        this.operation = null;
        this.isScientific = false;
    }

    init() {
        this.setupUI();
        this.setupEventListeners();
    }

    setupUI() {
        const content = document.getElementById('calculator-content');
        content.innerHTML = `
            <div class="calculator-display">
                <div class="display-value">0</div>
                <div class="display-memory"></div>
            </div>
            <div class="calculator-buttons">
                <button class="calc-btn" data-action="memory-clear">MC</button>
                <button class="calc-btn" data-action="memory-recall">MR</button>
                <button class="calc-btn" data-action="memory-add">M+</button>
                <button class="calc-btn" data-action="memory-subtract">M-</button>
                <button class="calc-btn" data-action="clear">C</button>
                <button class="calc-btn" data-action="backspace">⌫</button>
                <button class="calc-btn" data-action="percent">%</button>
                <button class="calc-btn" data-action="divide">÷</button>
                <button class="calc-btn" data-action="7">7</button>
                <button class="calc-btn" data-action="8">8</button>
                <button class="calc-btn" data-action="9">9</button>
                <button class="calc-btn" data-action="multiply">×</button>
                <button class="calc-btn" data-action="4">4</button>
                <button class="calc-btn" data-action="5">5</button>
                <button class="calc-btn" data-action="6">6</button>
                <button class="calc-btn" data-action="subtract">-</button>
                <button class="calc-btn" data-action="1">1</button>
                <button class="calc-btn" data-action="2">2</button>
                <button class="calc-btn" data-action="3">3</button>
                <button class="calc-btn" data-action="add">+</button>
                <button class="calc-btn" data-action="0">0</button>
                <button class="calc-btn" data-action="decimal">.</button>
                <button class="calc-btn" data-action="equals">=</button>
            </div>
            <div class="calculator-mode">
                <button class="mode-btn" data-mode="standard">Standard</button>
                <button class="mode-btn" data-mode="scientific">Scientific</button>
            </div>
        `;
    }

    setupEventListeners() {
        const content = document.getElementById('calculator-content');
        
        // Number and operation buttons
        content.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button.dataset.action);
            });
        });

        // Mode buttons
        content.querySelectorAll('.mode-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.toggleMode(button.dataset.mode);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e.key);
        });
    }

    handleButtonClick(action) {
        switch (action) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.appendDigit(action);
                break;
                
            case 'decimal':
                this.appendDecimal();
                break;
                
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperation(action);
                break;
                
            case 'equals':
                this.calculate();
                break;
                
            case 'clear':
                this.clear();
                break;
                
            case 'backspace':
                this.backspace();
                break;
                
            case 'percent':
                this.percent();
                break;
                
            case 'memory-clear':
                this.memoryClear();
                break;
                
            case 'memory-recall':
                this.memoryRecall();
                break;
                
            case 'memory-add':
                this.memoryAdd();
                break;
                
            case 'memory-subtract':
                this.memorySubtract();
                break;
        }
        
        this.updateDisplay();
    }

    handleKeyPress(key) {
        const actions = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '.': 'decimal',
            '+': 'add',
            '-': 'subtract',
            '*': 'multiply',
            '/': 'divide',
            '=': 'equals',
            'Enter': 'equals',
            'Backspace': 'backspace',
            'Escape': 'clear',
            '%': 'percent'
        };

        if (actions[key]) {
            this.handleButtonClick(actions[key]);
        }
    }

    appendDigit(digit) {
        const display = document.querySelector('.display-value');
        if (display.textContent === '0' || this.operation) {
            display.textContent = digit;
            this.operation = null;
        } else {
            display.textContent += digit;
        }
        this.currentValue = parseFloat(display.textContent);
    }

    appendDecimal() {
        const display = document.querySelector('.display-value');
        if (!display.textContent.includes('.')) {
            display.textContent += '.';
        }
    }

    setOperation(op) {
        this.operation = op;
        this.memory = this.currentValue;
        document.querySelector('.display-memory').textContent = `${this.memory} ${this.getOperationSymbol(op)}`;
    }

    calculate() {
        if (!this.operation) return;
        
        const display = document.querySelector('.display-value');
        const result = this.performOperation(this.memory, this.currentValue, this.operation);
        
        display.textContent = result;
        this.currentValue = result;
        this.operation = null;
        document.querySelector('.display-memory').textContent = '';
    }

    performOperation(a, b, op) {
        switch (op) {
            case 'add':
                return a + b;
            case 'subtract':
                return a - b;
            case 'multiply':
                return a * b;
            case 'divide':
                return b !== 0 ? a / b : 'Error';
            default:
                return b;
        }
    }

    clear() {
        this.currentValue = 0;
        this.memory = 0;
        this.operation = null;
        document.querySelector('.display-value').textContent = '0';
        document.querySelector('.display-memory').textContent = '';
    }

    backspace() {
        const display = document.querySelector('.display-value');
        if (display.textContent.length > 1) {
            display.textContent = display.textContent.slice(0, -1);
            this.currentValue = parseFloat(display.textContent);
        } else {
            display.textContent = '0';
            this.currentValue = 0;
        }
    }

    percent() {
        const display = document.querySelector('.display-value');
        this.currentValue = parseFloat(display.textContent) / 100;
        display.textContent = this.currentValue;
    }

    memoryClear() {
        this.memory = 0;
        document.querySelector('.display-memory').textContent = '';
    }

    memoryRecall() {
        const display = document.querySelector('.display-value');
        display.textContent = this.memory;
        this.currentValue = this.memory;
    }

    memoryAdd() {
        this.memory += this.currentValue;
        document.querySelector('.display-memory').textContent = `M: ${this.memory}`;
    }

    memorySubtract() {
        this.memory -= this.currentValue;
        document.querySelector('.display-memory').textContent = `M: ${this.memory}`;
    }

    getOperationSymbol(op) {
        const symbols = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[op] || '';
    }

    toggleMode(mode) {
        this.isScientific = mode === 'scientific';
        const content = document.getElementById('calculator-content');
        
        if (this.isScientific) {
            // Add scientific mode buttons
            const scientificButtons = `
                <button class="calc-btn" data-action="sin">sin</button>
                <button class="calc-btn" data-action="cos">cos</button>
                <button class="calc-btn" data-action="tan">tan</button>
                <button class="calc-btn" data-action="log">log</button>
                <button class="calc-btn" data-action="ln">ln</button>
                <button class="calc-btn" data-action="sqrt">√</button>
                <button class="calc-btn" data-action="power">x^y</button>
                <button class="calc-btn" data-action="pi">π</button>
                <button class="calc-btn" data-action="e">e</button>
            `;
            
            content.querySelector('.calculator-buttons').innerHTML += scientificButtons;
        } else {
            // Remove scientific mode buttons
            const buttons = content.querySelectorAll('.calc-btn');
            buttons.forEach(button => {
                if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'power', 'pi', 'e'].includes(button.dataset.action)) {
                    button.remove();
                }
            });
        }
    }

    updateDisplay() {
        const display = document.querySelector('.display-value');
        display.textContent = this.currentValue;
    }
}

// Initialize Calculator when the app is launched
function initCalculator() {
    const calculator = new Calculator();
    calculator.init();
}