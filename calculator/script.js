class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
        this.currentOperand = '';
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.currentOperand.length > 14) return;
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (operation === '√') {
            this.computeSqrt();
            if (this.previousOperand !== '') {
                this.previousOperand = `${this.previousOperand} ${this.operation}`;
            }
            this.operation = operation;
            return;
        }
        if (this.currentOperand === '' && this.previousOperand === '') return;
        if (this.previousOperand !== '' && this.currentOperand !== '') {
            this.compute();
        }
        if (this.currentOperand === '' && this.previousOperand !== '') {
            this.operation = operation;
            this.previousOperand = this.previousOperand;
            this.currentOperand = this.currentOperand;
        } else {
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
        }
    }

    computeSqrt() {
        this.currentOperand = Math.sqrt(this.currentOperand);
        console.log(this.currentOperand);

    }

    compute() {
        let computation;
        let prev;
        if (this.operation === '√') {
            const parser = this.previousOperand.split(' ');
            prev = parseFloat(parser[0]);
            this.operation = parser[1];
        } else {
            prev = parseFloat(this.previousOperand);
        }
        const curr = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(curr)) return;
        switch (this.operation) {
            case '+':
                computation = prev + curr;
                break;
            case '-':
                computation = prev - curr;
                break;
            case '*':
                computation = prev * curr;
                break;
            case '÷':
                if (curr === 0) {
                    computation = 'Error'
                } else {
                    computation = prev / curr;
                }
                break;
            case '^':
                computation = Math.pow(prev, curr);
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.previousOperand = '';
        this.operation = undefined;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (this.currentOperand === 'Error') {
            currentOperandTextElement.innerText = this.currentOperand;
            previousOperandTextElement.innerText = '';
            this.currentOperand = '';
            this.previousOperand = ''
            this.operation = undefined;
        } else if (this.operation === '√') {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}${Math.pow(this.currentOperand, 2)}`;
            this.currentOperandTextElement.innerText = this.currentOperand;
        }
        else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
            if (this.operation != null) {
                this.previousOperandTextElement.innerText =
                    `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
            }
            else this.previousOperandTextElement.innerText = ''
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});