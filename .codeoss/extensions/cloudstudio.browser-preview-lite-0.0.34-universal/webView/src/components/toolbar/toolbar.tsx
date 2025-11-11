import * as React from 'react';
import QRCode from 'qrcode';
import './toolbar.css';

import UrlInput from '../url-input/url-input';
import { PreviewLocationConfig } from '../../App';
import SelectComponent from '../PortSelect';
import { getPreviewUrl } from '../../utils/location';
import { getPreviewIframe } from '../../utils/dom';

const iconBackwardStyle = {
  backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNNDI3IDIzNC42MjVIMTY3LjI5NmwxMTkuNzAyLTExOS43MDJMMjU2IDg1IDg1IDI1NmwxNzEgMTcxIDI5LjkyMi0yOS45MjQtMTE4LjYyNi0xMTkuNzAxSDQyN3YtNDIuNzV6Ii8+PC9zdmc+)`,
};

const iconForwardStyle = {
  backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNODUgMjc3LjM3NWgyNTkuNzA0TDIyNS4wMDIgMzk3LjA3NyAyNTYgNDI3bDE3MS0xNzFMMjU2IDg1bC0yOS45MjIgMjkuOTI0IDExOC42MjYgMTE5LjcwMUg4NXY0Mi43NXoiLz48L3N2Zz4=)`,
};

const iconRefreshStyle = {
  backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMjU2IDM4OGMtNzIuNTk3IDAtMTMyLTU5LjQwNS0xMzItMTMyIDAtNzIuNjAxIDU5LjQwMy0xMzIgMTMyLTEzMiAzNi4zIDAgNjkuMjk5IDE1LjQgOTIuNDA2IDM5LjYwMUwyNzggMjM0aDE1NFY4MGwtNTEuNjk4IDUxLjcwMkMzNDguNDA2IDk5Ljc5OCAzMDQuNDA2IDgwIDI1NiA4MGMtOTYuNzk3IDAtMTc2IDc5LjIwMy0xNzYgMTc2czc4LjA5NCAxNzYgMTc2IDE3NmM4MS4wNDUgMCAxNDguMjg3LTU0LjEzNCAxNjkuNDAxLTEyOEgzNzguODVjLTE4Ljc0NSA0OS41NjEtNjcuMTM4IDg0LTEyMi44NSA4NHoiLz48L3N2Zz4=)`,
};

const iconDocStyle = {
  backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADpSURBVHgBtZPBDcIwDEUtuJcBUCaABZpBOkF7B3pjiU7ABExAuXBrGQD1xI3OATb6gWC5ggP90pMa27HdOCEaQQlTMmemBzVTMU4HT9S6YI7MnVkxc7CGv0aMKXG0VpVIDp1llqNTmwvYWvxSHCu2JE5QgSAfdROqppG/VEnpwCxVFR+td6rtFAVe6mlYHh3os+l/SZChUmr4nnvCGG8DQVJ1zzTKvmAu8jGFYYZgHdgYNtGWuTKnYEjIvgNy0oXRVWfEUm4kcfQ57zDSnAaUI7vciXisnt7vI6Mvckgg9z48Jtm4Ud38Rw+hSTNuyuKbfgAAAABJRU5ErkJggg==)`,
};

const iconDeviceStyle = {
  backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADqSURBVHgB1VHBEYIwEAyBv5QQoADpAEqwAy3BErAD7QA6sATsQP+AVwINAO4xwXEwwjg+HPaTy83uXrInxL9hjRtKKde27c2kyLKoKIrcaOB53h2EK8r6k0HXdTE4p6qqjo5h6oHFTdPkRGQ0AX8Hg4jr3kBKmbRtu+an6QkKvRjlXszA0QIXgqwsy3Q8YQ5S/AhnjhAEAWfj6kzoawNOHMcKIfM1nTTA30Pxsj7OgsXaKPJ9P9J1iNCzNwMg5El47nAnEIUBGX6TPw2QeA3iFpsguPNdoX0bSFPoDSBOcMS8Tt2/oD6LReABdD1lrpwWsCsAAAAASUVORK5CYII=)`,
};

const iconQRcodeStyle = {
  backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACDSURBVHgB7VNBCoAgEFy1h9gP+oSdI+gJ0Y+C3hBE5/xEP8h/RJgeBBNLyVs0ILKz7MwedgASgeyC1d2mPhqYEXwaclNgp0lVE+mnlIXlIgzvGmQ3LrBYLk/AkIhf4BMC3kNiTVugg1Q2Jwme+div8H6D3ctewlSqMMlAmHQuYs88CifEoh9KMXOn/wAAAABJRU5ErkJggg==)`,
};

interface IToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  url: string;
  onActionInvoked: (action: string, data?: object) => void;
  preLocConf?: PreviewLocationConfig;
}

class Toolbar extends React.Component<IToolbarProps, any> {
  constructor(props: any) {
    super(props);

    this.handleBack = this.handleBack.bind(this);
    this.handleForward = this.handleForward.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleDoc = this.handleDoc.bind(this);
  }

  public render() {
    const { preLocConf } = this.props;
    const { ports = '', port = '' } = preLocConf || {};

    return (
      <div className='toolbar'>
        <div className='inner'>
          <button
            className='backward'
            title='backward'
            style={iconBackwardStyle}
            onClick={this.handleBack}
            disabled={!this.props.canGoBack}
          >
            Backward
          </button>
          <button
            className='forward'
            title='forward'
            style={iconForwardStyle}
            onClick={this.handleForward}
            disabled={!this.props.canGoForward}
          >
            Forward
          </button>
          <button className='refresh' title='refresh' style={iconRefreshStyle} onClick={this.handleRefresh}>
            Refresh
          </button>
          <SelectComponent
            value={port}
            options={ports.split(',')}
            onSelect={(port) => {
              this.handleUrlChange(getPreviewUrl(port, preLocConf));
              const iframe = getPreviewIframe();
              if (iframe) {
                iframe.setAttribute('data-defaultport', port);
              }
            }}
          />
          <UrlInput
            url={this.props.url}
            onUrlChanged={this.handleUrlChange}
            onActionInvoked={this.props.onActionInvoked}
          />
          <button className='doc' title='doc' style={iconDocStyle} onClick={this.handleDoc}>
            doc
          </button>
          <button className='device' title='toggle device' style={iconDeviceStyle} onClick={this.handleDevice}>
            device
          </button>
          <button className='QR-code' style={iconQRcodeStyle} onMouseEnter={() => this.handleQRCodeMouseMove()}>
            <div className='QR-code-canvas'>
              <canvas id='canvas'></canvas>
              <span>扫码预览移动端效果</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  private renderCanvasQRCode(url: string) {
    const canvasDom = document.getElementById('canvas')!;
    if (!canvasDom) return;
    QRCode.toCanvas(canvasDom!, url);
    (canvasDom as HTMLCanvasElement).setAttribute('style', 'height: 120px;width: 120px;');
  }

  private handleQRCodeMouseMove() {
    this.renderCanvasQRCode(this.props.url);
  }

  private handleDoc() {
    this.props.onActionInvoked('openDoc', {});
  }

  private handleDevice() {
    const boxDom = document.getElementById('device-box');
    boxDom!.classList.toggle('marvel-device');
    const webviewIframeDom = document.getElementById('webviewIframe');
    const h = webviewIframeDom!.style.height;
    webviewIframeDom!.style.height = h === '100%' ? '100vh' : '100%';
  }

  private handleUrlChange(url: string) {
    this.props.onActionInvoked('urlChange', { url });
  }

  private handleBack() {
    this.props.onActionInvoked('backward', {});
  }

  private handleForward() {
    this.props.onActionInvoked('forward', {});
  }

  private handleRefresh() {
    this.props.onActionInvoked('refresh', {});
  }
}

export default Toolbar;
