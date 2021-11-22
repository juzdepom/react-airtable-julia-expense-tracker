import { airtableAPIKey, baseId } from "./airtableIds";
import React, { useEffect } from "react";
import Airtable from "airtable";

const base = new Airtable({ apiKey: airtableAPIKey }).base(baseId);

function convertBahtToUSD(baht){
  return Math.round(baht / 30 * 100) / 100 //Math.round(num * 100) / 100
}

function App() {

  // const [records, setRecords] = useState([]);
  // const [entries, setEntries] = useState([]);
  // const [entries] = useState([]);
  // const [total, setTotal] = useState(0);
  // const [total] = useState(0);

  //this method pulls in the data
  useEffect(() => {
   //pull in the table view data from airtable
   base("nov")
     .select({ view: "Grid view" })
     .eachPage((records, fetchNextPage) => { 
      // let set = new Set()
      // setRecords(records);
      let entries = []
      records.forEach((record) => {
        let entry = {}
        entry.amount = record.fields.amount
        entry.category = record.fields.category
        entry.date = record.fields.date
        entry.location = record.fields.location
        entry.description = record.fields.description
        entry.dollars = Math.round(record.fields.dollars * 100) / 100 //Math.round(num * 100) / 100
        entries.push(entry)
      })
      //sorting by date
      let sortedByDate = []
      let dates = new Set();
      //sort by dates
      entries.forEach((entry) => {
        if (dates.has(entry.date)){
          //if the date already exists
          sortedByDate.forEach((dateObject, index) => {
            if(dateObject.date === entry.date){
              sortedByDate[index].entries.push(entry)
              // console.log(`found ${entry.date}! adding new entry to this date`)
            }
          })
        } else {
          dates.add(entry.date)
          let dateObject = { "date" : entry.date, "entries": [entry]}
          sortedByDate.push(dateObject)
        }
      })
      //method below loops through each entries in sorted by date
      //and calculate total amount spent per day in baht and in usd
      //and sort entries according to category
      sortedByDate.forEach((dateObject, index) => {
        
        let total = 0 
        let category = new Set();
        let entriesSortedByCategory = []
        dateObject.entries.forEach((entry, index) => {
          //calculating total
          total = total + entry.amount
          //sorting by category
          if(category.has(entry.category)){ //if this category has already been created and has one or more entries
            entriesSortedByCategory.forEach((categoryEntry, index) => { //then loop through your categories 
              if(categoryEntry.category === entry.category){
                entriesSortedByCategory[index].entries.push(entry) // and append this entries to the entries of that prexisting category
              }
            })
          } else { //this category has not been created yet
            category.add(entry.category) //add to the set so that in future loops we know this category has been created
            let categoryObject = {"category": entry.category, "entries": [entry]} //create the new category log entry
            entriesSortedByCategory.push(categoryObject) //push to the parent object
          }
          
        })
        sortedByDate[index].categories = entriesSortedByCategory
        sortedByDate[index].totalInBaht = total
        sortedByDate[index].totalInUSD = convertBahtToUSD(total) //Math.round(num * 100) / 100
        //calculate total by category
        sortedByDate[index].categories.forEach((category, categoryIndex) => {
          let amountInBaht = 0
          if (category.entries.length > 1){
            let total = 0
            category.entries.forEach((entry) => { //loop through the entries
              total = total + entry.amount //add up the amount of each entry
            })
            amountInBaht = total
          } else { //there was only one entry in this category so you can just set the total to the entry amount
            amountInBaht = category.entries[0].amount
          }
          sortedByDate[index].categories[categoryIndex].totalInBaht = amountInBaht
          sortedByDate[index].categories[categoryIndex].totalInUSD = convertBahtToUSD(amountInBaht)
        })
        //create a totalByCategory node
        let totalByCategory = []
        sortedByDate[index].categories.forEach((categoryObject) => { //loop through each category
         let {category, totalInBaht, totalInUSD} = categoryObject
         let totalByCategoryObject = { "categoryName": category, "totalInBaht": totalInBaht, "totalInUSD" : totalInUSD}
         totalByCategory.push(totalByCategoryObject)
        })
        totalByCategory.sort(function(a,b){ //sort totalByCategory so that the one with the highest spend is on top
          return b.totalInBaht - a.totalInBaht
        })
        sortedByDate[index].totalByCategory = totalByCategory 
        sortedByDate[index].totalWithoutAnySpecialEntries = "TODO: add a special tab to airtable that you can tick on or off (off by default) where you can mark a certain purchase as special; for example I would mark rent as a special purchase; then calculate my daily spend without taking into account special entries"
      })
      console.log(sortedByDate)
      // console.log(records)
      fetchNextPage();
    });
    //  console.log(`Total number of entries: ${allEntries.length}`)
  }, []);

  return (
    <>
     <div>
      <p>Date: November 26th</p>
      <p>Total Spent: ฿236 ($20.03)</p>
      <p>Food: ฿236 ($20.03)</p>
      <p>Rent: ฿2200 ($100.03)</p>
      <p>Gas: ฿100 ($2.03)</p>

     </div>
    </>
  );
}

export default App;
