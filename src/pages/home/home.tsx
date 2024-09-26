// HomeLayout.tsx
import Navbar from "../../components/Navbar/navbar";
import DimensionCard from "../../components/Dimension-Card/card";
import dimensions from "../../data/dimensions";
import "./home.css";
import Footer from "../../components/Footer/footer";
import logos from "../../data/footers";

const HomeLayout: React.FC = () => {
  return (
    <div className="home-layout">
      <Navbar activeSection="home" />
      <main className="home-content">
        <div className="home-text-container">
          <h1>
            ¿Qué es la <strong>Iniciativa Intersectorial Mano a Mano?</strong>
          </h1>
          <p>
            Es un <strong>esfuerzo colaborativo</strong> que busca{" "}
            <strong>responder a las necesidades humanas más urgentes</strong> de
            los y las guatemaltecas en situación de vulnerabilidad, teniendo
            como objetivo principal la contribución al bienestar y mejora
            progresiva la calidad de vida.
          </p>
          <p>
            Para ello, se definieron{" "}
            <strong>siete dimensiones de trabajo:</strong>
          </p>
        </div>
        <div className="home-image">
          <img
            id="home-logo"
            src="https://s3-alpha-sig.figma.com/img/793e/a088/be681a0d11fed644e8df7099baba15c4?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VDqx-Fk-fhfSfW6oGmAzj3gsGiLEhMIIkIKDekI7AUa7oKp0O9DlSPk6cyBDUVPmg3CKbX~1zBz6n-6G~13vaY42os22ag~KrQCNpaGf2w5gZ-3P6SLCdZcED2m6jiH~kUfr7-wIeMRmgLQUB5vzQrneldRzilBnZp6w8DiV9bLu6rML7tG45DBUXU5dryru0DDlZHeJMlKzlsboIxd8UkScen5~UBf0GXn0BboPxp9ZNzb9Wwswd7qJoFD8YtWQCUDjeqQ~3Eh38xUpMQZBpe8PIcpVuLNFDGIjVW2OerL6zsnoqEDhwyIG069SPKTuGGWvDTzLl0aqcPS86H742w__"
            alt="Mano a Mano"
          />
        </div>
      </main>
      <section className="home-dimensions">
        <div className="home-dimensions-container">
          {dimensions.map((dimension) => (
            <DimensionCard
              id={dimension.id}
              name={dimension.name}
              image={dimension.image}
              details={dimension.details}
            />
          ))}
          {/* Add the text block after the 7th card */}
          <div className="objective-text-container">
            <h3>
              ¿Cuál es el
              <strong> objetivo principal?</strong>
            </h3>
            <p>
              Actuar de manera <strong>integral y multidimensional</strong> para
              reducir la pobreza y malnutrición en territorio nacional.
            </p>
          </div>
        </div>
      </section>
      <section className="rsh">
        <div className="rsh-container">
          <h2>Registro Social de Hogares</h2>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/ImpDQurT5EA?si=OfdJa1AfNRRexWvT"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
          <div className="rsh-content-row">
            <div className="rsh-details">
              <p>
                Esta aplicación ha sido desarrollada para{" "}
                <strong>facilitar el registro y seguimiento</strong> de las
                acciones implementadas por cada Ministerio.
              </p>
            </div>
            <div className="rsh-info">
              <div className="info-item">
                <div className="info-item-c">
                  <div className="info-icon"></div>
                  <div className="info-text">
                    <h4>¿En qué consiste?</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Phasellus interdum nulla ut sapien volutpat, ac fermentum
                      justo hendrerit.
                    </p>
                  </div>
                </div>
                <hr />
              </div>
              <div className="info-item">
                <div className="info-item-c">
                  <div className="info-icon"></div>
                  <div className="info-text">
                    <h4>¿En qué territorios se trabajará?</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Phasellus interdum nulla ut sapien volutpat, ac fermentum
                      justo hendrerit.
                    </p>
                  </div>
                </div>
                <hr />
              </div>
              <div className="info-item">
                <div className="info-item-c">
                  <div className="info-icon"></div>
                  <div className="info-text">
                    <h4>Información importante</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Phasellus interdum nulla ut sapien volutpat, ac fermentum
                      justo hendrerit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer logos={logos} />
    </div>
  );
};

export default HomeLayout;
