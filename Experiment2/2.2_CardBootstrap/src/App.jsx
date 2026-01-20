import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="container-fluid py-5">
      <div className="row gx-4 gy-5 px-4">

        {/* CARD 1 */}
        <div className="col-md-6">
          <div className="card w-100 h-100 shadow">
            <img
              src="Bootstrap-Tutorial.webp"
              className="card-img-top"
              alt="card"
            />
            <div className="card-body">
              <h5 className="card-title">BOOTSTRAP TUTORIAL</h5>
              <p className="card-text">
                Click on the link to access a beginner friendly bootstrap workshop.
              </p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="col-md-6">
          <div className="card w-100 h-100 shadow">
            <img
              src="image.png"
              className="card-img-top"
              alt="card"
            />
            <div className="card-body">
              <h5 className="card-title">Microsoft Windows</h5>
              <p className="card-text">
                The most widely used personal operating system.
              </p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
export default App