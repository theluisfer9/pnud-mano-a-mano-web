import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import logos from "@/data/footers";
const DatosAbiertosLayout = () => {
  const mapURL =
    "https://geosmart.undp.org/arcgis/apps/dashboards/c589b8ae431246dcb44ba7227282c0d6";
  return (
    <div className="open-data-layout">
      <Navbar activeSection="datosabiertos" />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Datos Abiertos</h1>
        <iframe src={mapURL} className="w-full h-[750px] rounded-lg" />
      </div>
      <Footer logos={logos} />
    </div>
  );
};

export default DatosAbiertosLayout;
