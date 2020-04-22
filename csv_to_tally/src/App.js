import React, { Component } from 'react';
import './App.css';
import { generateVoucherXml } from './voucherGenerator';
import  * as format from 'xml-formatter';

const Results = (props) => (
  <div id="results" className="results" style={{display:props.show?"block":"none"}}>
    <div className="header">
      <button onClick={()=>props.toggle()} className="btn btn-sm btn-danger">close</button>
    </div>
    <div className="body">{props.value}</div>
  </div>
)

class App extends Component {
  state = {
    csvString: "",
    xml: "",
    dataList: [],
    selectedFile: "",
    showResult:false
  }
  openFile() {
    this.refs.fileSelector.click()
  }
  readInputFile(event) {
    let self = this;
    let fileReader = new FileReader();
    let filename = event.target.files[0].name
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = () => {
      let data = fileReader.result.trim()
      self.setState({ csvString: data });
    }
    this.setState({ selectedFile: filename })
  }

  processCSV() {
    let content = this.state.csvString.split("\n")
    let data = []
    console.debug(content);
    if (Array.isArray(content)) {
      for (let i = 1; i < content.length; i++) {
        console.debug(content[i]);
        let infor = content[i].split(",")
        if (Array.isArray(infor)) {
          let csvData = {
            date: infor[0],
            vtype: infor[1],
            refNo: infor[2],
            drLed: infor[3],
            crLed: infor[4],
            amt: infor[5],
            narration: infor[6]
          }
          data.push(csvData);
        }
      }
      this.setState({
        dataList: data
      })
    } else {
      alert("invalid data")
    }
  }

  generateXML() {
    let csv = this.state.dataList;
    let entries = "<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA><REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME><STATICVARIABLES><SVCURRENTCOMPANY></SVCURRENTCOMPANY></STATICVARIABLES></REQUESTDESC><REQUESTDATA>"
    csv.forEach((x, i) => {
      let y = generateVoucherXml(x, i)
      entries += y
    })
    entries += "</REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>"
    let xml=format(entries)
    this.setState({ xml: entries,showResult:true })
  }

  OBJtoXML(obj, rootTag) {
    var xml = '<' + rootTag + '>';
    for (var prop in obj) {
      xml += "<" + prop + ">";
      xml += obj[prop];
      xml += "</" + prop + ">";
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    xml = xml + "</" + rootTag + ">"
    return xml
  }
  toggleResult(){
    let current=this.state.showResult
    this.setState({
      showResult:!current
    })
  }
  render() {
    let tdata = this.state.dataList.map((data, index) => {
      return (
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

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Voucher to tally XML </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor03">
            <ul className="navbar-nav mr-auto">
            </ul>
          </div>
        </nav>
        <div className="container-fluid">
          <input type="file" id="chooseFile" ref="fileSelector"
            onChange={this.readInputFile.bind(this)} onClick={(event) => { event.target.value = null }} style={{ display: "none" }} />
          <div className="bg-info pl-2 pr-2 pb-1 pt-1 text-dark">
            Selected file : 
            <button onClick={() => this.openFile()} type="button" className="btn btn-sm btn-primary">Open File</button> : {this.state.selectedFile}
            &nbsp;<button onClick={() => this.processCSV()} type="button" className="btn btn-sm btn-success">Process CSV</button>
            <button type="button" className="btn btn-sm btn-warning float-right" onClick={() => this.generateXML()}>Generate XML</button>
          </div>
          <table className="table table-hover">
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
          <hr />
          <Results value={this.state.xml} show={this.state.showResult} toggle={()=>this.toggleResult()}/>
        </div>
      </div>
    )
  }
}
export default App;
