import React, {Component} from 'react';
import {Table} from 'react-bootstrap';

export default class Excel extends Component{
    constructor(props){
        super(props);
        this.state = {currentEditData: null,data: props.initialData, headers: props.headers, sortBy : null, edit:{row: null, cell : null}};
    }
    componentWillReceiveProps(nxtProps){
        let searchTerm = nxtProps.searchTerm;
        let searchColumn = nxtProps.searchColumn;
        let columnIndex = this.state.headers.indexOf(searchColumn);
        
        let data = this.props.initialData.slice();
        data = data.filter((row)=>{
            let matches = row.filter((cell, id) => {
                if(id === columnIndex){

                    return cell.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                }
            });
            return matches !== null &&  matches.length > 0;
        });
        this.setState({data: data});
    }
    sort(e){
        const cellIndex = e.target.cellIndex;//column to sort
        const descending = this.state.sortBy === cellIndex && !this.state.descending;
        let data = this.state.data.slice();
        data.sort((r1,r2)=>{
            return descending ? 
                   r1[cellIndex] > r2[cellIndex] ? 1: -1 : 
                   r1[cellIndex] < r2[cellIndex] ? 1: -1 ;
        });
        this.setState({data:data, sortBy: cellIndex, descending: descending})
    }
    showEditor(e){
        let cellIndex = e.target.cellIndex;
        let rowIndex = e.target.dataset.row; 
    
        this.setState({
            currentEditData: this.state.data[rowIndex][cellIndex],
            edit: {cell : cellIndex, row: parseInt(rowIndex,10)}
        });
        
    }
    saveCellData(e){
        e.preventDefault();
        let data = this.state.data.slice();
        
        data[this.state.edit.row][this.state.edit.cell] = this.state.currentEditData;
        this.setState({data: data, edit: {cell:null, row: null}});
    }
    onChangeEditorData(e){
        this.setState({currentEditData : e.target.value});
    }
    render(){
        
        return (
            <Table responsive hover>
                <thead onClick={(e) => this.sort(e)}>
                    <tr>
                        {this.state.headers.map((headerTitle, idx) => {
                            return <th key={idx}>{headerTitle}{this.state.sortBy === idx ? this.state.descending ? "\u25bc" : "\u25b2" : null}</th>
                        })}
                    </tr>
                </thead>
                <tbody onDoubleClick={(e)=>this.showEditor(e)}>
                    {this.state.data.map((row, rid) => {
                        return (
                            <tr key={rid} >
                                {row.map((cell, idx) => {
                                    let content = cell;
                                    if(this.state.edit.cell === idx && this.state.edit.row === rid){
                                        content = <form onSubmit={(e) => {this.saveCellData(e)}}>
                                                    <input type="text" className="form-control" defaultValue={cell} onChange={(e)=>this.onChangeEditorData(e)}/>    
                                                  </form>;
                                    }
                                    return (
                                           <td key={idx} data-row={rid}>{content}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }
}