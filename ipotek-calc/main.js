// text inputs
const textInputs = document.querySelectorAll('.input input[type="number"]'),
	  totalCost  = document.getElementById('total-cost'),
	  initialFee = document.getElementById('an-initial-fee'),
	  creditTerm = document.getElementById('credit-term');

// range inputs
const inputRanges     = document.querySelectorAll('.input-range'),
      totalCostRange  = document.getElementById('total-cost-range'),
	  initialFeeRange = document.getElementById('an-initial-fee-range'),
	  creditTermRange = document.getElementById('credit-term-range');

// results
const totalAmountCredit      = document.getElementById('amount-of-credit'),
	  totalMonthlyPayment    = document.getElementById('monthly-payment'),
	  totalRecommendedIncome = document.getElementById('recommended-income');

// banks
const bankBtns = document.querySelectorAll('.bank');

// 
const assignValue = () => {
	totalCost.value  = totalCostRange.value;
	initialFee.value = initialFeeRange.value;
	creditTerm.value = creditTermRange.value;
};

// 
const assignValueReverse = () => {
	totalCostRange.value  = totalCost.value; 
	initialFeeRange.value = initialFee.value; 
	creditTermRange.value = creditTerm.value; 
};

assignValue();

// 
const banks = [
	{
		name: 'alfa',
		precents: 8.7
	},
	{
		name: 'sberbank',
		precents: 8.4
	},
	{
		name: 'pochta',
		precents: 7.9
	},
	{
		name: 'tinkoff',
		precents: 9.2
	},
];

let currentPrecent = banks[0].precents;

// 
for(let bank of bankBtns) {
	bank.addEventListener('click', () => {
		for(let item of bankBtns) {
			item.classList.remove('active');
		}

		bank.classList.add('active');

		takeActiveBank(bank);
	});
}

// 
const takeActiveBank = currentActive => {
	const dataAttrValue = currentActive.dataset.name;
	const currentBank   = banks.find( bank => bank.name === dataAttrValue );
	currentPrecent      = currentBank.precents;

	calculation(totalCost.value, initialFee.value, creditTerm.value);
};

// 
for(textInput of textInputs) {
	textInput.addEventListener('input', (e) => {
		const target    = e.target,
			  maxNumber = target.getAttribute('max'),
			  minNumber = target.getAttribute('min');

		if (target.value < 0) {
			target.value = minNumber;
			console.log('min');
		}
		
		assignValueReverse();
		calculation(totalCost.value, initialFee.value, creditTerm.value);	

	});
}

// 
for(input of inputRanges) {
	input.addEventListener('input', () => {
		assignValue();
		calculation(totalCost.value, initialFee.value, creditTerm.value);
	});
}

// function for calculate 
const calculation = (totalCost = 0, initialFee = 100000, creditTerm = 1) => {
	/*
		ep - montly credit
		rk - razmer kredita
		ps - procentnaya stavka
		km - kol-vo mesacev

		ep = (rk + (((rk / 100) * ps) / 12) * km) / km
	*/

	let monthlyPayment, // montly credit
		lounAmount     = totalCost - initialFee, // razmer kredita
		interestRate   = currentPrecent,         // procentnaya stavka
		numberOfYears  = creditTerm,             // kol-vo let
		numberOfMonths = 12 * numberOfYears;     // kol-vo mesacev

	monthlyPayment = (lounAmount + (((lounAmount / 100) * interestRate) / 12) * numberOfMonths) / numberOfMonths;

	const monthlyPaymentArounded = Math.round(monthlyPayment),
		  errorText              = document.querySelector('.error');

	if (monthlyPaymentArounded < 0) {
		totalAmountCredit.innerHTML      = '0 ₽';
		totalMonthlyPayment.innerHTML    = '0 ₽';
		totalRecommendedIncome.innerHTML = '0 ₽';

		if (totalCost < initialFee) {
			setTimeout(function() {
				errorText.classList.add('active');
			}, 500);
		}

	} else {
		totalAmountCredit.innerHTML      = `${lounAmount} ₽`;
		totalMonthlyPayment.innerHTML    = `${monthlyPaymentArounded} ₽`;
		totalRecommendedIncome.innerHTML = `${monthlyPaymentArounded + ((monthlyPaymentArounded / 100) * 35)} ₽`;
		
		if (totalCost >= initialFee) {
			setTimeout(function() {
				errorText.classList.remove('active');
			}, 500);
		}

	}
};