import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import Excel from './Excel';

const headers = [
 "Book", "Author", "Language", "Published", "Sales"
];


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {searchTerm: '', searchColumn:'Book'};
    this.state.data = [
      ["The Lord of the Rings", "J. R. R. Tolkien",
      "English", "1954–1955", "150 million"],
      ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry", "French", "1943", "140 million"],
      ["Harry Potter and the Philosopher's Stone", "J. K. Rowling",
      "English", "1997", "107 million"],
      ["And Then There Were None", "Agatha Christie",
      "English", "1939", "100 million"],
      ["Dream of the Red Chamber", "Cao Xueqin",
      "Chinese", "1754–1791", "100 million"],
      ["The Hobbit", "J. R. R. Tolkien",
      "English", "1937", "100 million"],
      ["She: A History of Adventure", "H. Rider Haggard",
      "English", "1887", "100 million"]
      ];
  }
  search(e){
    e.preventDefault();
  }
  onSearchTermChange(e){
    this.setState({searchTerm: e.target.value});
  }
  onSearchColumnChange(e){
    this.setState({searchColumn: e.target.value});
  }
  download(type, ev){
    var contents = type === 'json'
      ? JSON.stringify(this.state.data)
      : this.state.data.reduce(function(result, row) {
          return result
            + row.reduce(function(rowresult, cell, idx) {
                return rowresult 
                  + '"' 
                  + cell.replace(/"/g, '""')
                  + '"'
                  + (idx < row.length - 1 ? ',' : '');
              }, '')
            + "\n";
        }, '');

    var URL = window.URL || window.webkitURL;
    var blob = new Blob([contents], {type: 'text/' + type});
    ev.target.href = URL.createObjectURL(blob);
    ev.target.download = 'data.' + type;
  }
  addRow(e){
    const book = this.bookInput.value;
    const author = this.authorInput.value;
    const lang = this.langInput.value;
    const publish = this.publishInput.value;
    const sales = this.salesInput.value;

    if(book !== "" && author !== "" && lang !== "" && publish !== "" && sales !== ""){
      let data = this.state.data.slice();
      let row = [book, author, lang, publish, sales];
      data.push(row);
      this.clearInput();
      this.setState({data : data});
    }
    else{
      console.error("one of the input is empty");
    }
  }
  clearInput(){
    this.bookInput.value = "";
    this.authorInput.value = "";
    this.langInput.value = "";
    this.publishInput.value = "";
    this.salesInput.value = "";

    this.bookInput.focus();
  }
  render() {
    return (
      <div>
        <h1 className="centeredText">Excel in React <small>Farooq AR (7842)</small></h1>
        <form className="withPadding" onSubmit={(e)=>this.search(e)}>
          <div className="input-group">
            
              <input className="form-control" type="text" onChange={(e)=>this.onSearchTermChange(e)} value={this.state.searchTerm} placeholder="Search" />
              
              <select name="search_column" className="form-control" value={this.state.searchColumn} onChange={(e)=>this.onSearchColumnChange(e)}>
                <option value="Book">Book</option>
                <option value="Author">Author</option>
                <option value="Language">Language</option>
                <option value="Published">Published</option>
                <option value="Sales">Sales</option>
              </select>
            
          </div>
        </form>
        <div className="withMargin withPadding">
          <a href="data.csv" onClick={(e)=>this.download("csv",e)}>Export as CSV</a> <br/>
          <a href="data.json" onClick={(e)=>this.download("json",e)}>Export as JSON</a>
        </div>
        {/*tables*/}
        <Excel initialData = {this.state.data} headers={headers} searchTerm = {this.state.searchTerm} searchColumn={this.state.searchColumn}/>
        
        {/*add rows*/}
        <Table responsive>
          <tbody>
            <tr>
              <td>
                <input type="text" ref={input => this.bookInput = input} className="form-control" placeholder="Book"/>
              </td>
              <td>
                <input type="text" ref={input => this.authorInput = input} className="form-control" placeholder="Author"/>
              </td>
              <td>
                <input type="text" ref={input => this.langInput= input} className="form-control" placeholder="Language"/>
              </td>
              <td>
                <input type="text" ref={input => this.publishInput= input} className="form-control" placeholder="Published"/>
              </td>
              <td>
                <input type="text" ref={input => this.salesInput= input} className="form-control" placeholder="Sales"/>
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="withPadding">
          <input type="button" className="btn btn-default" value="Add" onClick={(e)=>this.addRow(e)}/>
        </div>
      </div>
      
    );
  }
}
