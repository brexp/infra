import * as React from 'react';
import './App.css';

import Loading from './components/loading-bar/loading-bar';
import Toolbar from './components/toolbar/toolbar';
import Connection from './connection';
import { getDefaultLocationConfig } from './utils/location';

export type PreviewLocationConfig = {
  protocol: string;
  spacekey: string;
  token: string;
  port: string;
  host: string;
  ports: string;
  addonpath?: string; // option中的path options.path
};
interface IState {
  url: string;
  historyList: Array<string>;
  currentIndex: number;
  loadingPercent: number;
  history: {
    canGoBack: boolean;
    canGoForward: boolean;
  };
  preLocConf?: PreviewLocationConfig;
}

const messageOriginRegex = /cloudstudio.net/i;
export const blankUrl = 'about:blank';

class App extends React.Component<any, IState> {
  private connection: Connection = new Connection();

  constructor(props: any) {
    super(props);
    this.state = {
      url: blankUrl,
      historyList: [],
      currentIndex: 0,
      loadingPercent: 0,
      history: {
        canGoBack: false,
        canGoForward: false,
      },
      preLocConf: undefined,
    };

    this.onToolbarActionInvoked = this.onToolbarActionInvoked.bind(this);
    window.addEventListener('message', (event) => {
      if (messageOriginRegex.test(event.origin)) {
        switch (event.data.params.type) {
          case 'refresh':
            this.handleRefresh();
            break;
          case 'learn-more':
            this.connection.send('Page.openUrl', { url: event.data.params.url });
            break;
        }
      }
    });
  }

  componentDidMount() {
    setTimeout(() => {
      const iframe = document.querySelector('#webviewIframe');
      // @ts-ignore
      const defaultUrl = iframe ? iframe.dataset.defaulturl : '';
      this.handleUrlChange({ url: defaultUrl });

      if (iframe) {
        const locationConfig = getDefaultLocationConfig(iframe);
        this.setState({ preLocConf: locationConfig });
      }
    });
  }

  public render() {
    const { preLocConf, history, url } = this.state;
    const { canGoBack, canGoForward } = history;

    return (
      <div className='App'>
        <Toolbar
          url={url}
          onActionInvoked={this.onToolbarActionInvoked}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          preLocConf={preLocConf}
        />
        {this.state.loadingPercent < 100 && <Loading percent={this.state.loadingPercent} />}
      </div>
    );
  }

  private onToolbarActionInvoked(action: string, data: any): void {
    switch (action) {
      case 'forward':
        this.handleForward();
        break;
      case 'backward':
        this.handleBackward();
        break;
      case 'refresh':
        this.handleRefresh();
        break;
      case 'urlChange':
        this.handleUrlChange(data);
        break;
      case 'openDoc':
        this.connection.send('Page.openDoc', {});
        break;
    }
  }

  private handleLoadingBar() {
    let loadingTimeOut = setInterval(() => {
      if (this.state.loadingPercent >= 100) {
        clearInterval(loadingTimeOut);
        return;
      }
      this.setState({
        loadingPercent: this.state.loadingPercent + 20,
      });
    }, 50);
  }

  private handleForward() {
    this.handleLoadingBar();
    let nextIndex = this.state.currentIndex + 1;

    this.connection.send('Page.changeUrl', { url: this.state.historyList[nextIndex] });
    if (document.getElementById('webviewIframe')) {
      //@ts-ignore
      document.getElementById('webviewIframe').src = this.state.historyList[nextIndex];
      //@ts-ignore
      document.getElementById('openInBrowser').href = this.state.historyList[nextIndex];
    }
    this.setState({
      url: this.state.historyList[nextIndex],
      currentIndex: nextIndex,
      loadingPercent: 0,
      history: {
        canGoBack: nextIndex !== 0,
        canGoForward: nextIndex !== this.state.historyList.length - 1,
      },
    });
  }

  private handleBackward() {
    this.handleLoadingBar();
    let nextIndex = this.state.currentIndex - 1;

    this.connection.send('Page.changeUrl', { url: this.state.historyList[nextIndex] });
    if (document.getElementById('webviewIframe')) {
      //@ts-ignore
      document.getElementById('webviewIframe').src = this.state.historyList[nextIndex];
      //@ts-ignore
      document.getElementById('openInBrowser').href = this.state.historyList[nextIndex];
    }

    this.setState({
      url: this.state.historyList[nextIndex],
      currentIndex: nextIndex,
      loadingPercent: 0,
      history: {
        canGoBack: nextIndex !== 0,
        canGoForward: nextIndex !== this.state.historyList.length - 1,
      },
    });
  }

  private handleRefresh() {
    this.handleLoadingBar();
    this.connection.send('Page.changeUrl', { url: this.state.url });

    if (document.getElementById('webviewIframe')) {
      //@ts-ignore
      document.getElementById('webviewIframe').src = this.state.url;
      //@ts-ignore
      document.getElementById('openInBrowser').href = this.state.url;
    }
    this.setState({
      loadingPercent: 0,
    });
  }

  private handleUrlChange(data: any) {
    this.handleLoadingBar();
    let historyList = [...this.state.historyList];
    console.log('url info: > ', data);
    if (data.url !== historyList[historyList.length - 1]) historyList.push(data.url);

    this.connection.send('Page.changeUrl', {
      url: data.url,
    });
    if (document.getElementById('webviewIframe')) {
      //@ts-ignore
      document.getElementById('webviewIframe').src = data.url;
      //@ts-ignore
      document.getElementById('openInBrowser').href = data.url;
    }

    this.setState({
      historyList,
      url: data.url,
      loadingPercent: 0,
      currentIndex: historyList.length - 1,
      history: {
        canGoBack: historyList.length - 1 !== 0,
        canGoForward: false,
      },
    });
  }
}

export default App;
