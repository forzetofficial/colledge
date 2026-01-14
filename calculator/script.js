let currentInput = '0';
let previousInput = '';
let operation = null;
let memory = 0;
let expressionText = '';

const display = document.getElementById('display');
const expression = document.getElementById('expression');
const memoryValue = document.getElementById('memoryValue');
const memoryIndicator = document.getElementById('memoryIndicator');

function updateDisplay() {
    display.textContent = formatNumber(currentInput);
    expression.textContent = expressionText;
    memoryValue.textContent = memory;
    memoryIndicator.classList.toggle('active', memory !== 0);
}

function formatNumber(num) {
    if (num === 'Error') return 'Error';
    
    if (num.length > 12) {
        const n = parseFloat(num);
        return n.toExponential(6);
    }
    
    return num;
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    expressionText = '';
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function appendNumber(num) {
    if (currentInput === '0' || currentInput === 'Error') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function appendDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function toggleSign() {
    if (currentInput !== '0' && currentInput !== 'Error') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }
}

function setOperation(op) {
    if (currentInput === 'Error') return;
    
    if (operation !== null) {
        calculate();
    }
    
    previousInput = currentInput;
    operation = op;
    expressionText = `${previousInput} ${getOperationSymbol(op)}`;
    currentInput = '0';
    updateDisplay();
}

function calculate() {
    if (operation === null || previousInput === '') return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch(operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                showError();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Округление
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    expressionText = `${previousInput} ${getOperationSymbol(operation)} ${current} =`;
    operation = null;
    previousInput = '';
    updateDisplay();
}

function getOperationSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };
    return symbols[op] || op;
}

// Показать ошибку
function showError() {
    currentInput = 'Error';
    expressionText = '';
    operation = null;
    previousInput = '';
    updateDisplay();
}

function percent() {
    const current = parseFloat(currentInput);
    
    if (operation && previousInput) {
        const prev = parseFloat(previousInput);
        let result;
        
        switch(operation) {
            case '+':
                result = prev + (prev * current / 100);
                break;
            case '-':
                result = prev - (prev * current / 100);
                break;
            case '*':
                result = prev * (current / 100);
                break;
            case '/':
                if (current === 0) {
                    showError();
                    return;
                }
                result = prev / (current / 100);
                break;
            default:
                result = current / 100;
        }
        
        currentInput = result.toString();
        expressionText = `${prev} ${getOperationSymbol(operation)} ${current}% =`;
    } else {
        currentInput = (current / 100).toString();
        expressionText = `${current}% =`;
    }
    
    updateDisplay();
}

function squareRoot() {
    const num = parseFloat(currentInput);
    if (num >= 0) {
        currentInput = Math.sqrt(num).toString();
        expressionText = `√${num} =`;
    } else {
        showError();
    }
    updateDisplay();
}

function square() {
    const num = parseFloat(currentInput);
    currentInput = (num * num).toString();
    expressionText = `${num}² =`;
    updateDisplay();
}

function reciprocal() {
    const num = parseFloat(currentInput);
    if (num !== 0) {
        currentInput = (1 / num).toString();
        expressionText = `1/${num} =`;
    } else {
        showError();
    }
    updateDisplay();
}

function memoryClear() {
    memory = 0;
    updateDisplay();
}

function memoryRecall() {
    if (memory !== 0) {
        currentInput = memory.toString();
        updateDisplay();
    }
}

function memoryAdd() {
    const current = parseFloat(currentInput);
    if (!isNaN(current)) {
        memory += current;
        updateDisplay();
    }
}

function memorySubtract() {
    const current = parseFloat(currentInput);
    if (!isNaN(current)) {
        memory -= current;
        updateDisplay();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendDecimal();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        setOperation(e.key);
    } else if (e.key === '%') {
        percent();
    }
});

updateDisplay();