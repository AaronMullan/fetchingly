// import retrieve from './managed-records.js'
import fetch from "../util/fetch-fill";
import URI from "urijs";

window.path = "http://localhost:3000/records";

async function retrieve({ page = 1, colors = [] } = {}) {
  const primaryEvaluator = (d) => d === 'yellow' || d === 'blue' || d === 'red';

  const url = URI({
    path: window.path
  })
  url.addSearch("limit", 10);
  url.addSearch("offset", (page - 1) * 10);
  url.addSearch("color[]", colors);

  let response
  
  response = await fetch(url.toString())
    .then(response => {
  if (response.status >= 200 && response.status <= 299) {
    return response;
  } else {
    throw Error(response.statusText)
  }
})

  const data = await response.json()
  const output = {}
  output.previousPage = page > 1 ? page - 1 : null;
  output.nextPage = data[0] && page < 50 ? page + 1 : null;
  output.ids = data.map(e => e.id)
  output.open = data.map(e => ({ ...e, isPrimary: primaryEvaluator(e.color) })).filter(e => e.disposition === 'open')
  output.closedPrimaryCount = data.filter(e => e.disposition === 'closed' && primaryEvaluator(e.color)).length
  return output;
}
export default retrieve;
