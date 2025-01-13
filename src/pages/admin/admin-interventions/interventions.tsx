const TEMP_URL =
  "https://geosmart.undp.org/arcgis/apps/dashboards/0729653a5e524b308dd10dc5b40489dc";
const AdminInterventionsSection = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-start gap-4">
      <h2 className="text-2xl font-bold text-[#505050]">
        Intervenciones / Mano a Mano
      </h2>
      <iframe
        src={TEMP_URL}
        title="Admin Interventions"
        className="w-full h-full rounded-lg"
      ></iframe>
    </div>
  );
};

export default AdminInterventionsSection;
