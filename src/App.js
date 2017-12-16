import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'
import { isEqual } from 'lodash'
import SettingsContainer from './SettingsContainer'
import FollowContainer from './FollowContainer'
import NewMeowContainer from './NewMeowContainer'
import Meow from './Meow'

class App extends Component {
  componentWillMount() {
    // this fetches the hash which represents the active users userHash
    this.props.getMyAppKeyHash()
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.me && this.props.me) {
      this.props.getHandle(this.props.me, true)
      this.props.getFollow(this.props.me, "following")
      this.getMyFeed()
      if (this.interval) clearInterval(this.interval)
      this.interval = setInterval(this.getMyFeed, 1000)
    }
    if (!isEqual(Object.keys(prevProps.handles), Object.keys(this.props.handles))) {
      // get handles for users we don't have handles for
      Object.keys(this.props.handles).forEach(userHash => {
        const handle = this.props.handles[userHash]
        if (!handle) {
          console.log('getting handle for ' + userHash)
          this.props.getHandle(userHash)
        }
      })
    }
  }
  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval)
  }
  getMyFeed = () => {
    // my feed is a list of posts that are either by me or people I follow
    const users = Object.keys(this.props.follows)
    if (!users.includes(this.props.me)) {
        users.push(this.props.me)
    }
    this.props.getPostsBy(users)
  }
  render() {
    return (
      <div className="container">
        <div className="spinner transition500"></div>
        <div className="error transition500"></div>
        <div className="row">
          <div className="col-sm-2">
            <div className="logo">
              <img src="cat-eating-bird-circle.png" />
            </div>
          </div>
          <div className="col-sm-7">
            <div className="contentcontainer">
              <div>
                <Link to="/" id="handle">{this.props.handle}</Link>
                <Link to="/settings" id="changeHandleButton" className="btn btn-default">Settings</Link>
              </div>
              <Link to="/follow" id="followButton" className="btn btn-default">Follow People</Link>
              <div id="banner">
                Clutter
                <div className="subtitle">can haz herd cats?</div>
              </div>
              <div id="content">
                <h2 id="user-header"></h2>
                <Route path="/" exact render={() => {
                  return (
                    <React.Fragment>
                      <NewMeowContainer />
                      <div id="meows">
                        {Object.keys(this.props.posts).sort().reverse().map(pId => {
                          const post = Object.assign({}, this.props.posts[pId], {
                            userHandle: this.props.handles[post.author]
                          })
                          return <Meow post={post} key={pId} />
                        })}
                      </div>
                    </React.Fragment>
                  )
                }}/>
                <Route path="/settings" component={SettingsContainer} />
                <Route path="/follow" component={FollowContainer} />
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="alphabox">
              <div id="about">
                <h2>What is Clutter?</h2>
                <p>A <a href="https://en.wiktionary.org/wiki/clutter"><em>clutter</em></a> is a flock of cats.</p>
                <p><strong>Clutter</strong> is a fully decentralized alternative to Twitter.</p>
                <p>Impossible to censor or control.</p>
                <p>Join the mewvolution on <a href="http://holochain.org">holochain.org</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
