// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { ipcRenderer } from 'electron';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  handleAtivar() {
    console.log('ativar 1');
    ipcRenderer.send('ativar', {id: 1});
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