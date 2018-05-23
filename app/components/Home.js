// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import Decoder from '../utils/Decoder';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);


    this.state = {
      selectTorrent: {},
      announceList: []
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
      /*this.setState({
        selectTorrent: Decoder.creatObj(tmp)
      });*/

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
                  <button onClick={() => this.handleAtivar()} >Ativar</button>
                </td>
              </tr>
            </tbody>
          </table>
          {/*
          <table className="table table-bordered table-sm">
            <tbody>
              <tr>
                <td>Announce</td>
                <td>{ this.state.selectTorrent.announce }</td>
              </tr>

              { this.state.selectTorrent.announceList != null ?
              <tr>
                <td>Announce List</td>
                <td>
                  <ul>
                    {this.state.selectTorrent.announceList.map((e) => {
                      return (
                        <li>{ e.value }</li>
                      );
                    })}
                  </ul>
                </td>
              </tr> : null}

            </tbody>
          </table>
          */}
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