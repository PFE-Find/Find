const Maps = ({ localisation }: { localisation: string }) => {
  return (
      <div className="p-4 container mx-auto rounded-2xl">
          <div style={{ width: "100%" }}>
              <iframe
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${localisation}&t=p&z=12&ie=UTF8&iwloc=B&output=embed`}
              ></iframe>
          </div>
      </div>
  );
};

export default Maps;
