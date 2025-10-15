import React from 'react'

function AppCarousel() {
  return (
    <section className="container p-0 rounded-4 overflow-hidden shadow-md">
        <div id="carouselExampleRide" className="carousel slide carousel-fade" data-bs-ride="carousel">
            {/* indicators */}
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleRide" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleRide" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleRide" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselExampleRide" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>

            {/* slides */}
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="/mother_child_ai_1.png" className="d-block w-100 object-fit-cover" alt="banner 4" style={{height: "50vh", objectPosition: "top"}} />
                </div>
                <div className="carousel-item">
                    <img src="/banners/Designer_3.png" className="d-block w-100 object-fit-cover" alt="banner 3" style={{height: "50vh", objectPosition: "top"}} />
                </div>
                <div className="carousel-item">
                    <img src="/banners/Designer_2.png" className="d-block w-100 object-fit-cover" alt="banner 2" style={{height: "50vh", objectPosition: "top"}} />
                </div>
                <div className="carousel-item">
                    <img src="/banners/Designer_1.png" className="d-block w-100 object-fit-cover" alt="banner 1" style={{height: "50vh", objectPosition: "top"}} />
                </div>
            </div>

            {/* controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    </section>
  )
}

export default AppCarousel