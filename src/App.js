import { airtableAPIKey, baseId } from "./airtableIds";
import React, { useEffect, useState } from "react";
import Airtable from "airtable";

const base = new Airtable({ apiKey: airtableAPIKey }).base(baseId);

function App() {

  const [entries, setEntries] = useState([]);

  let allEntries = []
  //this method pulls in the data
  useEffect(() => {
   //pull in the table view data from airtable
   base("entries")
     .select({ view: "Grid view" })
     .eachPage((records, fetchNextPage) => { 
       console.log(records.length)
       records.forEach((record) => { // check if the date
        if(record.fields.Date === "2021-11-18"){
          console.log(record.fields)
        }
         
       })
      //  allEntries.push(records)
      //  console.log(allEntries)
      //  setEntries(allEntries)
      //  setEntries(records);
       // console.log(records)
       fetchNextPage();
     });
    //  console.log(`Total number of entries: ${allEntries.length}`)
     
  }, []);
  
  console.log(`Total number of entries: ${entries.length}`)

  return (
    <div className="App">
    </div>
  );
}

export default App;
