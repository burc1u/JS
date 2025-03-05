"use strict";

class Calculator {
  constructor(previousOperandtextElement, currentOperandtextElement) {
    this.currentOperandtextElement = currentOperandtextElement;
    this.previousOperandtextElement = previousOperandtextElement;
    this.clear();//sets the initial variables 
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete_content() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }


  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }


  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      case "-":
        computation = prev - current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }


  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractiondigits: 0,
      }); //no decimal places after this valuea when converted to string
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }

    // const floatNumber = parseFloat(number);
    // if (isNaN(floatNumber))
    //     return "";

    //return floatNumber.toLocaleString("en");/*adds a , to the number */
  }

  

  
  updateDisplay() {
    this.currentOperandtextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandtextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandtextElement.innerText = "";
    }
  }
}
const numberButtons = document.querySelectorAll("[data-number");
const operationButtons = document.querySelectorAll("[data-operation");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearsButton = document.querySelector("[data-all-clear]");
const previousOperandtextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandtextElement = document.querySelector(
  "[data-current-operand]"
);

const calculator = new Calculator(
  previousOperandtextElement,
  currentOperandtextElement
);

numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    calculator.appendNumber(
      button.innerText
    ); /*the inner text aka the button number becames a value */
    calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(
      button.innerText); /*the inner text aka the button number becames a value */
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", button => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearsButton.addEventListener("click", button => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", button => {
  calculator.delete_content();
  calculator.updateDisplay();
});
