// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import Decoder from '../utils/Decoder';
import TorrentTable from './TorrentTable';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);


    this.state = {
      selectTorrent: null,
    };
  }

  handleAtivar() {
    //console.log('ativar 1');
    //ipcRenderer.send('ativar', {id: 1});

    var result = null;

    fs.readFile('tt.torrent', (err, buf) => {
      //console.log(buf.toString('utf8'));
      //console.log(err);


      var tmp = Decoder.decode(buf);
      console.log(tmp);
      console.log(Decoder.createObj(tmp));
      this.setState({
        selectTorrent: Decoder.createObj(tmp)
      });

    });
  }

  render() {
    return (
      <div className="container">
        <div className="contante">
          <h2>Lista</h2>
          
          <table className="table table-bordered table-sm">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>tt</td>
                <td>
                  <button className="btn btn-primary" onClick={() => this.handleAtivar()} >Ativar</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          { !this.state.selectTorrent ? null : 
          <TorrentTable selectTorrent={this.state.selectTorrent} /> }
        </div>
      </div>
    );
  }
}

/*
return (
  <div>
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <Link to="/counter">to Counter</Link>
      <button onClick={() => this.handleAtivar()} >Ativar</button>
    </div>
  </div>
);
*/