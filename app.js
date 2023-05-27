let imgElem = document.getElementById("cardType");
let cardNumberWarning = document.getElementById("invalidCardNumber");
let expireDateWarning = document.getElementById("invalidExpireDate");
let cvvWarning = document.getElementById("invalidCVV");

// Luhn Algorithm
function validateLuhnAlgorithm(cardNumber) {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }
    detectCardType(cardNumber);
    console.log(sum % 10 === 0);
    return sum % 10 === 0;
}

// Card Type Detection

function detectCardType(cardNumber) {
    const patterns = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    };

    for (const cardType in patterns) {
        if (patterns[cardType].test(cardNumber)) {
            return cardType;
        }
    }

    return "Unknown";
}

// Expiration Date Validation

function validateExpirationDate(expirationMonth, expirationYear) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0

    if (expirationYear > currentYear) {
        return true;
    } else if (expirationYear === currentYear && expirationMonth >= currentMonth) {
        return true;
    }

    return false;
}

// CVV/CVC Validation

function validateCVV(cvv) {
    const cvvPattern = /^[0-9]{3,4}$/;
    return cvvPattern.test(cvv);
}

// Example usage

const cardNumber = document.getElementById("cardNumber");
const cvv = document.getElementById("cvv");
const expireDate = document.getElementById("expireDate");

cardNumber.addEventListener("input", (e) => {
    if (!validateLuhnAlgorithm(e.target.value)) {
        cardNumberWarning.classList.remove("hidden");
        return "Invalid card number";
    } else {
        cardNumberWarning.classList.add("hidden");
    }

    // Validate card type
    const cardType = detectCardType(e.target.value);
    if (cardType === "Unknown") {
        imgElem.classList.add("hidden");
        return "Unknown card type";
    } else {
        imgElem.classList.remove("hidden");
        console.log(cardType);
        imgElem.src = `imgs/${cardType}.svg`;
    }
});

expireDate.addEventListener("input", (e) => {
    const dateExpression = new RegExp("^(0[1-9]|1[0-2])\/?([0-9]{2})$");
    if (dateExpression.test(e.target.value)) {
        expireDateWarning.classList.add("hidden");
        let data = e.target.value.split("/");
        let expirationMonth = data[0];
        let expirationYear = '20' + data[1];
        // Validate expiration date
        if (!validateExpirationDate(expirationMonth, expirationYear)) {
            expireDateWarning.classList.remove("hidden");
            return "Card has expired";
        } else {
            expireDateWarning.classList.add("hidden");
        }
    } else {
        expireDateWarning.classList.remove("hidden");
    }
});

cvv.addEventListener("input", (e) => {
    if (!validateCVV(e.target.value)) {
        cvvWarning.classList.remove("hidden");
        return "Invalid CVV";
    } else {
        cvvWarning.classList.add("hidden");
    }
});