import React, { Component } from 'react';

export default class TorrentTable extends Component {

	render() {
		return (
		  <table className="table table-bordered table-sm">
            <thead>
              <tr>
                <th>Propiedade</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Announce</td>
                <td>{ this.props.selectTorrent.announce }</td>
              </tr>

              { this.props.selectTorrent['announce-list'] != null ?
              <tr>
                <td>Announce Lists</td>
                <td>
                  <ul>
                    {this.props.selectTorrent['announce-list'].map((e) => {
                      return (
                        <li key={e}>{ e }</li>
                      );
                    })}
                  </ul>
                </td>
              </tr> : null}

              { this.props.selectTorrent['info'] != null ?
                Object.keys(this.props.selectTorrent['info']).map((key, value) => {
                  return (
                    <tr key={key}>
                      <td>{ key }</td>
                      <td>{ this.props.selectTorrent['info'][key] }</td>
                    </tr>
                  );
                }) 
              : null }

              { this.props.selectTorrent['rtorrent_meta_download'] != null ?
                Object.keys(this.props.selectTorrent['rtorrent_meta_download']).map((key, value) => {
                  return (
                    <tr key={key}>
                      <td>{ key }</td>
                      <td>{ JSON.stringify(this.props.selectTorrent['rtorrent_meta_download'][key]) }</td>
                    </tr>
                  );
                }) 
              : null }

            </tbody>
          </table>
		);
	}

}