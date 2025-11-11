import * as React from 'react';
import './url-input.css';

interface IUrlInputState {
  isFocused: boolean;
  hasChanged: boolean;
  url: string;
  urlSelectionStart: number | null;
  urlSelectionEnd: number | null;
  initUrl: string;
}

class UrlInput extends React.Component<any, IUrlInputState> {
  private ref?: HTMLInputElement;
  constructor(props: any) {
    super(props);
    this.state = {
      hasChanged: false,
      isFocused: false,
      url: props.url,
      urlSelectionStart: 0,
      urlSelectionEnd: 0,
      initUrl: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.setRef = this.setRef.bind(this);
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.url !== this.state.url && !this.state.hasChanged) {
      this.setState({
        url: nextProps.url,
        initUrl: this.state.initUrl || nextProps.url,
      });
    }
  }

  //changing url from child components
  public setUrl(value: string) {
    // if selectionStart and selectionEnd are available, then we have to
    // only modify that part of the url
    let newCursorPosition: number | null = null;
    if (this.state.urlSelectionStart && this.state.urlSelectionEnd) {
      let _url: string = this.state.url;
      let firstPart: string = _url.slice(0, this.state.urlSelectionStart);
      let secondPart: string = _url.slice(this.state.urlSelectionEnd);

      //set newCursorPosition
      newCursorPosition = (firstPart + value).length;

      value = firstPart + value + secondPart;
    } else if (this.state.urlSelectionStart) {
      let _url: string = this.state.url;
      let firstPart: string = _url.slice(0, this.state.urlSelectionStart);
      let secondPart: string = _url.slice(this.state.urlSelectionStart);

      //set newCursorPosition
      newCursorPosition = (firstPart + value).length;

      value = firstPart + value + secondPart;
    }

    if (value !== this.state.url) {
      this.setState({
        url: value,
        hasChanged: true,
        isFocused: true,
      });

      //set urlCursorPosition
      if (this.ref && newCursorPosition) {
        this.ref.focus();
        this.ref.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }
  }

  public render() {
    const className = ['urlbar'];
    if (this.state.isFocused) {
      className.push('focused');
    }

    return (
      <div className={className.join(' ')}>
        <input
          type='text'
          ref={this.setRef}
          value={this.state.url}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </div>
    );
  }

  private setRef(node: HTMLInputElement) {
    this.ref = node;
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      url: e.target.value,
      hasChanged: true,
    });
  }

  private handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    this.selectUrl(e.target);
  }

  //select all url from child components
  private selectUrl(element?: HTMLInputElement) {
    if (!element && this.ref) element = this.ref;

    if (element) {
      element.select();
      this.setState({
        isFocused: true,
      });
    }
  }

  private handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    this.setState({
      isFocused: false,
    });
  }

  private enterUrl() {
    let url = this.state.url;
    if (url === '') {
      url = this.state.initUrl;
      this.setState({ url });
    } else {
      let schemeRegex = /^(https?|about|chrome|file):/;
      let slashRegex = /(\/|\\)$/;

      if (!url.match(schemeRegex)) {
        url = 'https://' + this.state.url;
      }

      if (url.match(slashRegex)) {
        url = url.slice(0, -1);
      }

      this.setState({
        hasChanged: false,
      });
    }

    this.props.onUrlChanged(url);
  }

  private handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) {
      // Enter
      this.enterUrl();
    }
  }
}

export default UrlInput;
