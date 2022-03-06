class Output {
  constructor() {
    this._autoRefreshing = true;
    this._feed = null; // should be set later
  }

  clear() {
    this.stopAutoRefresh();
  }

  setFeed(feed) {
    this.stopAutoRefresh();
    this._feed = feed;

    if (this._feed.nodeName == 'VIDEO') {
      this._autoRefreshing = true;
      this._autoRefresh();
    } else {
      this._autoRefreshing = false;
      this.refresh();
    }
  }

  stopAutoRefresh() {
    this._autoRefreshing = false;
  }

  _autoRefresh() {
    if (this._autoRefreshing) {
      this.refresh();
      setTimeout(() => this._autoRefresh());
    }
  }
}
