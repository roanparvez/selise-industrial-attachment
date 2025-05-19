let currentOperand = "0";
let previousOperand = "";
let operation = undefined;
let shouldResetScreen = false;

const currentOperandElement = document.getElementById("current-operand");
const previousOperandElement = document.getElementById("previous-operand");

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;

  if (operation != null) {
    previousOperandElement.textContent = `${previousOperand} ${operation}`;
  } else {
    previousOperandElement.textContent = previousOperand;
  }
}

function appendNumber(number) {
  if (currentOperand === "Error") return;

  if (currentOperand === "0" || shouldResetScreen) {
    currentOperand = number;
    shouldResetScreen = false;
  } else {
    currentOperand += number;
  }
  updateDisplay();
}

function appendDecimal() {
  if (currentOperand === "Error") return;

  if (shouldResetScreen) {
    currentOperand = "0.";
    shouldResetScreen = false;
  } else if (!currentOperand.includes(".")) {
    currentOperand += ".";
  }
  updateDisplay();
}

function appendOperator(operator) {
  if (currentOperand === "Error") return;

  if (operation !== undefined && !shouldResetScreen) {
    calculate();
  }

  operation = operator;
  previousOperand = currentOperand;
  shouldResetScreen = true;
  updateDisplay();
}

function clearAll() {
  currentOperand = "0";
  previousOperand = "";
  operation = undefined;
  updateDisplay();
}

function deleteNumber() {
  if (currentOperand === "Error") {
    clearAll();
    return;
  }

  if (
    currentOperand.length === 1 ||
    (currentOperand.length === 2 && currentOperand.startsWith("-"))
  ) {
    currentOperand = "0";
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
  updateDisplay();
}

function calculate() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "×":
      computation = prev * current;
      break;
    case "÷":
      if (current === 0) {
        currentOperand = "Error";
        previousOperand = "";
        operation = undefined;
        updateDisplay();
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }

  // Format the result to avoid long decimal numbers
  computation = Math.round(computation * 1000000) / 1000000;

  currentOperand = computation.toString();
  operation = undefined;
  previousOperand = "";
  shouldResetScreen = true;
  updateDisplay();
}

document.addEventListener("keydown", handleKeyboardInput);

function handleKeyboardInput(e) {
  if (currentOperand === "Error" && e.key !== "Escape") return;

  if (e.key >= "0" && e.key <= "9") {
    appendNumber(e.key);
  } else if (e.key === ".") {
    appendDecimal();
  } else if (e.key === "=" || e.key === "Enter") {
    calculate();
  } else if (e.key === "Backspace") {
    deleteNumber();
  } else if (e.key === "Escape") {
    clearAll();
  } else if (e.key === "+" || e.key === "-") {
    appendOperator(e.key);
  } else if (e.key === "*") {
    appendOperator("×");
  } else if (e.key === "/") {
    appendOperator("÷");
  }
}

// Add button press animation
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("mousedown", () => {
    button.style.transform = "scale(0.95)";
  });

  button.addEventListener("mouseup", () => {
    button.style.transform = "";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

// Initialize display
updateDisplay();
