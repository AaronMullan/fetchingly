import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

const sampleOptions = { page: 2, colors: ["red", "brown"] }

// Your retrieve function plus any additional functions go here ...
function retrieve(options) {
  const output = {};
  const colorString = options.colors ? options.colors.map(element => `color[]=${element}`).join('&'): '';
  const offset = (options.page -1) * 10
  const url = URI('http://localhost:3000/records')
  fetch(url)
    .then(response => response.json())
    .then(data => data.slice(offset, offset + 10))
    .then(data => {
      output.ids = data.map(element => element.id)
      output.open = data.filter(element => element.disposition === 'open')
      output.isPrimary = data.filter(element =>
        element.color === 'red' ||
        element.color === 'blue' ||
        element.color === 'green').length
      output.closedPrimaryCount = data.filter(element => 
        element.disposition === 'closed' &&
        element.color === 'red' ||
        element.color === 'blue' ||
        element.color === 'green').length
      output.previousPage = options.page > 1 ? options.page -1 : null;
      output.nextPage = options.page < output.ids.length ? options.page + 1 : null;
    })
    .then(() => console.log(output))
  return output;
}
const colorized = retrieve(sampleOptions);
console.log(colorized)
export default retrieve;

function retrieveNoUri(options) {
  const output = {};
  const colorString = options.colors ? options.colors.map(element => `color[]=${element}`).join('&'): '';
  const offset = (options.page -1) * 10
  const url = `http://localhost:3000/records?${colorString}`
  fetch(url)
    .then(response => response.json())
    .then(data => data.slice(offset, offset + 10))
    .then(data => {
      output.ids = data.map(element => element.id)
      output.open = data.filter(element => element.disposition === 'open')
      output.isPrimary = data.filter(element =>
        element.color === 'red' ||
        element.color === 'blue' ||
        element.color === 'green').length
      output.closedPrimaryCount = data.filter(element => 
        element.disposition === 'closed' &&
        element.color === 'red' ||
        element.color === 'blue' ||
        element.color === 'green').length
      output.previousPage = options.page > 1 ? options.page -1 : null;
      output.nextPage = options.page < output.ids.length ? options.page + 1 : null;
    })
    .then(() => console.log(output))
  return output;
}