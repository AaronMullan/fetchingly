import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

const sampleOptions = { page: 3 }

// Your retrieve function plus any additional functions go here ...
function retrieve(options) {
  if(!options.page) options.page = 1;
  if(!options.colors) options.colors = [];
  const  primaryEvaluator = (d) => d === 'yellow' || d === 'blue' || d === 'red';
  const output = {};
  const offset = (options.page -1) * 10
  const url = URI({
    protocol: 'http',
    hostname: 'localhost',
    port: '3000',
    path: 'records',
    search: options.colors.map(e => `color[]=${e}`).join('&')
  })
 
  fetch(url.toString())
    .then(response => response.json())
    .then(data => data.slice(offset, offset + 10))
    .then(data => {
      output.previousPage = options.page > 1 ? options.page -1 : null;
      output.nextPage = options.page < data.map(e => e.id).length ? options.page + 1 : null;
      output.ids = data.map(e => e.id)
      output.open = data.map(e => ({...e, isPrimary: primaryEvaluator(e.color)}))
        .filter(e => e.disposition === 'open')
      output.closedPrimaryCount = data.filter(e => e.disposition === 'closed' && primaryEvaluator(e.color)).length
    })
    .then(() => console.log(output))
  return output;
}
const colorized = retrieve(sampleOptions);
console.log(colorized)
export default retrieve;
