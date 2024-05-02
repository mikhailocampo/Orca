const PatientDetail = ({ patientInfo }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <label className="w-1/3">Name:</label>
                        <span className="w-2/3">{patientInfo.name}</span>
                    </div>
                    <div className="flex flex-row">
                        <label className="w-1/3">Date of Birth:</label>
                        <span className="w-2/3">{patientInfo.birthdate}</span>
                    </div>
                    <div className="flex flex-row">
                        <label className="w-1/3">Gender:</label>
                        <span className="w-2/3">{patientInfo.gender}</span>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-lg font-bold">Patient Address</h2>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <label className="w-1/3">Address:</label>
                        <span className="w-2/3">{patientInfo.address}</span>
                    </div>
                    <div className="flex flex-row">
                        <label className="w-1/3">Phone:</label>
                        <span className="w-2/3">{patientInfo.phone}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetail;