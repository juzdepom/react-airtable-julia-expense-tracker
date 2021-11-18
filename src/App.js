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
   base("nov")
     .select({ view: "Grid view" })
     .eachPage((records, fetchNextPage) => { 
       records.forEach((record) => { 
        if(record.fields.date === "2021-11-18"){ // check if the date is equal to today
          let entry = {}
          entry.amount = record.fields.amount
          entry.category = record.fields.category
          entry.date = record.fields.date
          entry.location = record.fields.location
          entry.description = record.fields.description
          entry.dollars = Math.round(record.fields.dollars * 100) / 100 //Math.round(num * 100) / 100
          console.log(entry)
          todaysEntries.push(entry)
          console.log(`todayz entry length: ${todaysEntries.length}`)
          // setTotal(total + entry.amount)
          setEntries(todaysEntries)
        }
       })
       fetchNextPage();
     });
    //  console.log(`Total number of entries: ${allEntries.length}`)
  }, []);

  console.log(`ENTRIES LENGTH: ${entries.length}`)
  // let everything = 0
  // entries.forEach((entry) => {
  //   everything = everything + entry.amount
  //   // setTotal(total + entry.amount)
  // });

  // console.log(everything)

  return (
    <div className="App">
      {
      entries.map((entry, index) => (
        <div key={index}>
          <span>{entry.amount} ({entry.dollars} USD) – </span>
          <span>{entry.category}</span>
          {/* TODO: add some conditional code so that if entry.location is empty, do not show this ↓ */}
          <span><i> – 📍{entry.location}</i></span>
          {/* TODO↑ */}
          <br/>
          <span><i>{entry.description}</i></span>
          <br/>
          <br/>
        </div>
      ))}
      <p>Total Spent Today = {total} BAHT; {Math.round(total / 30 * 100) / 100} USD</p>
    </div>
  );
}

export default App;
