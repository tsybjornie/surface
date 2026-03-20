const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<button>Order Swatch Box ($29)</button><a href="#swatch">Box</a>`);
const document = dom.window.document;

const buttons = document.querySelectorAll('a, button');
let attached = 0;
buttons.forEach(btn => {
    const text = btn.textContent || btn.innerText || '';
    if (text.includes('Swatch Box') || btn.getAttribute('href') === '#swatch') {
        attached++;
    }
});
console.log("Attached to:", attached);
