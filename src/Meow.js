import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Meow extends Component {
  render() {
    const { stamp, message, author, hash, userHandle } = this.props.post
    return (
      <div className="meow" id={stamp}>
        <a className="meow-edit" href="#" onClick={() => "openEditPost('+id+')"}>edit</a>
        <div className="stamp">{new Date(stamp).toString()}</div>
        <Link to={`/u/${author}`} className="user">{userHandle}</Link>
        <div className="message">{message}</div>
      </div>
    )
  }
}

export default Meow