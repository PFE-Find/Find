const MapEmbed = () => {
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
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=tunisia+(My%20Business%20Name)&amp;t=p&amp;z=6&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        ></iframe>
      </div>
      </div>

    );
  };
  
  export default MapEmbed;
  