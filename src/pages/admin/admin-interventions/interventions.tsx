const TEMP_URL =
  "https://geosmart.undp.org/arcgis/apps/experiencebuilder/experience/?id=04d91841b2f2487ea74090024990268a";
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
