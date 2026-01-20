import 'bootstrap/dist/css/bootstrap.min.css'
function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">Shreyas Gautam</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">SUBS</a>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" />
              <button className="btn btn-light" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <h1 className="text-primary">Navbar</h1>
      </div>
    </>
  );
}
export default App;