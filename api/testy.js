// import retrieve from './managed-records.js'
import fetch from "../util/fetch-fill";
import URI from "urijs";

async function retrieve({page = 1, colors = []} = {}) 
{
  const primaryEvaluator = (d) => d === 'yellow' || d === 'blue' || d === 'red';
  const url = URI({
    protocol: 'http',
    hostname: 'localhost',
    port: '3000',
    path: 'records',
    search: colors.map(e => `color[]=${e}`).join('&')
  })
  
  let response = await fetch(url.toString())
  let data = await response.json()
  let output = {}
    output.ids = data.map(e => e.id)
    output.open = data.map(e => ({...e, isPrimary: primaryEvaluator(e.color)})).filter(e => e.disposition === 'open')
    output.closedPrimaryCount = data.filter(e => e.disposition === 'closed' && primaryEvaluator(e.color)).length
  return output;
}
export default retrieve;
retrieve()
  .then(data => console.log(data)); 