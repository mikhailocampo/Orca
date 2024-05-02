export const formatStaff = (staffName, type) => {
    // Given a full name "John Smith" return abbreviation "JS"
    // when type is "abbreviation" return "JS"
    // when type is "shorten" return "JSMITH"

    if (typeof(staffName) === "string") {
        const names = staffName.split(' ');
        switch(type) {
            case "abbreviation":
                return names.map(n => n[0]).join('');
            case "shorten":
                if (names.length > 1) {
                    return `${names[0][0]}${names[names.length - 1].toUpperCase()}`;
                } else {
                    return names[0].toUpperCase();
                }
        }
    }
}