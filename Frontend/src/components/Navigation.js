import { NavLink } from "react-router-dom";

function Navigation(props) {
  return (
    <>
      <div className="navigation">
        <div className="title">
          <NavLink to="/">
            <p>Code</p>
            <p>gram</p>
          </NavLink>
        </div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/new-post">New Post</NavLink>
        <NavLink to="/Miguel">
          <div className="navPicContainer">
            <img
              src="images/Miguel.jpg"
              className="myProfilePicNavigtaion"
            ></img>
          </div>
        </NavLink>
      </div>
    </>
  );
}

export default Navigation;
