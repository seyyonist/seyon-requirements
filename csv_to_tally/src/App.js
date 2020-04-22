import React, { Component } from 'react';
import './App.css';
import {generateVoucherXml} from './voucherGenerator';

class App extends Component{
  state={
    csvString:"",
    xml:"",
    dataList:[],
    selectedFile:""
  }
  openFile(){
    this.refs.fileSelector.click()
  }
  readInputFile(event) {
    let self = this;
    let fileReader = new FileReader();
    let filename=event.target.files[0].name
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = () => {
      let data = fileReader.result.trim()
      self.setState({ csvString: data });
    }
    this.setState({selectedFile:filename})
  }

  processCSV(){
    let content=this.state.csvString.split("\n")
    let data=[]
    console.debug(content);
    if(Array.isArray(content)){
      for(let i=1;i<content.length;i++){
        console.debug(content[i]);
        let infor=content[i].split(",")
        if(Array.isArray(infor)){
            let csvData={
              date:infor[0],
              vtype:infor[1],
              refNo:infor[2],
              drLed:infor[3],
              crLed:infor[4],
              amt:infor[5],
              narration:infor[6]
            }
            data.push(csvData);
        }
      }
      this.setState({
        dataList:data
      })
    }else{
      alert("invalid data")
    }
  }

  generateXML(){
    let csv=this.state.dataList;
    let entries = "<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA><REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME><STATICVARIABLES><SVCURRENTCOMPANY></SVCURRENTCOMPANY></STATICVARIABLES></REQUESTDESC><REQUESTDATA>"
    csv.forEach((x,i)=>{
      let y=generateVoucherXml(x,i)
      entries+=y
    })
    entries+="</REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>"
    this.setState({xml:entries})
  }

  OBJtoXML(obj,rootTag) {
    var xml = '<'+rootTag+'>';
    for (var prop in obj) {
      xml += "<" + prop + ">";
      xml += obj[prop];
      xml += "</" + prop + ">";
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    xml=xml+"</"+rootTag+">"
    return xml
  }

  render(){
    let tdata=this.state.dataList.map((data,index)=>{
      return(
        <tr key={index}>
          <td>{data.date}</td>
          <td>{data.vtype}</td>
          <td>{data.refNo}</td>
          <td>{data.drLed}</td>
          <td>{data.crLed}</td>
          <td>{data.amt}</td>
          <td>{data.narration}</td>
        </tr>
      )
    })
    return(
     <div>
        <input type="file" id="chooseFile"  ref="fileSelector"
          onChange={this.readInputFile.bind(this)} onClick={(event) => { event.target.value = null }} style={{ display: "none" }} />
          <button onClick={()=>this.openFile()}>Open File</button>
          <button onClick={()=>this.processCSV()}>Process CSV</button>
          <button onClick={()=>this.generateXML()}>Generate XML</button>
       <hr/>
    <div>Selected file : {this.state.selectedFile}</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Voucher Type</th>
              <th>Ref Number</th>
              <th>Dr Ledger</th>
              <th>Cr Ledger</th>
              <th>Amount</th>
              <th>narration</th>
            </tr>
          </thead>
          <tbody>
              {tdata}
          </tbody>
        </table>
        <hr/>
        <div>
          <textarea readOnly value={this.state.xml} rows="15" cols="150">

          </textarea>
          
        </div>
     </div>
    )
  }
}
export default App;
