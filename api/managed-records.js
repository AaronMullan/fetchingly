// import retrieve from './managed-records.js'
import fetch from "../util/fetch-fill";
import URI from "urijs";

async function retrieve({page = 1, colors = []} = {}) 
{
  const primaryEvaluator = (d) => d === 'yellow' || d === 'blue' || d === 'red';
  const offset = (page -1) * 10
  const url = URI({
    protocol: 'http',
    hostname: 'localhost',
    port: '3000',
    path: 'records',
    // search: options.colors.map(e => `color[]=${e}`).join('&')
  })
  url.addSearch("color", colors);
  const response = await fetch(url.toString())
  const data = await response.json()
  const pagenatedData = data.slice(offset, offset + 10)
  let output = {}
    output.previousPage = page > 1 ? page -1 : null;
    output.nextPage = page < data.map(e => e.id).length ? page + 1 : null;
    output.ids = pagenatedData.map(e => e.id)
    output.open = pagenatedData.map(e => ({...e, isPrimary: primaryEvaluator(e.color)})).filter(e => e.disposition === 'open')
    output.closedPrimaryCount = pagenatedData.filter(e => e.disposition === 'closed' && primaryEvaluator(e.color)).length
  return output;
}
export default retrieve;
retrieve()
  .then(data => console.log(data)); 