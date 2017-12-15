import React, { Component } from 'react'

class Meow extends Component {
  render() {
    const { stamp, message, author, hash, userHandle } = this.props.post
    return (
      <div className="meow" id={stamp}>
        <a className="meow-edit" href="#" onClick={() => "openEditPost('+id+')"}>edit</a>
        <div className="stamp">{stamp}</div>
        <a href="#" className="user" onClick={() => "showUser(\''+post.author+'\');"}>{userHandle || author}</a>
        <div className="message">{message}</div>
      </div>
    )
  }
}

export default Meow