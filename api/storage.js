import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

const sampleOptions = {page: 10, colors: ["red", "blue", "brown"]}

// Your retrieve function plus any additional functions go here ...
async function retrieve(options) {
  options.page = 1;
  options.colors = [];
  const  primaryEvaluator = (d) => d === 'yellow' || d === 'blue' || d === 'red';
  // const output = {};
  const offset = (options.page -1) * 10
  const url = URI({
    protocol: 'http',
    hostname: 'localhost',
    port: '3000',
    path: 'records',
    search: options.colors.map(e => `color[]=${e}`).join('&')
  })
 
const output = await fetch(url.toString())
    .then(response => response.json())
    .then(data => data.slice(offset, offset + 10))
    .then(data => {
      output.previousPage = options.page > 1 ? options.page -1 : null;
      output.nextPage = options.page < data.map(e => e.id).length ? options.page + 1 : null;
      output.ids = data.map(e => e.id)
      output.open = data.map(e => ({...e, isPrimary: primaryEvaluator(e.color)})).filter(e => e.disposition === 'open')
      output.closedPrimaryCount = data.filter(e => e.disposition === 'closed' && primaryEvaluator(e.color)).length
      return output;
    })
    // .finally(() => console.log(output))
    .catch(error => console.log(error));
let data = await output();
return data;
    }

const colorized = retrieve(sampleOptions);
console.log(colorized)
export default retrieve;
