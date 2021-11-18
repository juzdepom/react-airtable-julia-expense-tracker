import { airtableAPIKey, baseId } from "./airtableIds";
import React, { useEffect, useState } from "react";
import Airtable from "airtable";

const base = new Airtable({ apiKey: airtableAPIKey }).base(baseId);

function App() {

  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);

  let todaysEntries = []
  //this method pulls in the data
  useEffect(() => {
   //pull in the table view data from airtable
   base("entries")
     .select({ view: "Grid view" })
     .eachPage((records, fetchNextPage) => { 
       records.forEach((record) => { 
        if(record.fields.Date === "2021-11-18"){ // check if the date is equal to today
          let entry = {}
          entry.amount = record.fields.Amount
          setTotal(total + entry.amount)
          entry.category = record.fields.Category
          entry.date = record.fields.Date
          entry.location = record.fields.Location
          entry.description = record.fields.Description
          entry.dollars = Math.round(record.fields.Dollars * 100) / 100 //Math.round(num * 100) / 100
          console.log(entry)
          todaysEntries.push(entry)
          console.log(`todayz entry length: ${todaysEntries.length}`)
          setEntries(todaysEntries)
        }
       })
       fetchNextPage();
     });
    //  console.log(`Total number of entries: ${allEntries.length}`)
  }, []);
  

  return (
    <div className="App">
      <p>Total number of entries: {entries.length} </p>
      <p>Total = {total}</p>
    </div>
  );
}

export default App;
