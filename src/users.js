let users = [{
    "_id": "5adf91274d777d68700b0ca1",
    "firstName": "Erick",
    "lastName": "Coble",
    "contact": [{"type": "Cell", "info": "3162100111"}, {"type": "email", "info": "erickcoble@netpayadvance.com"}],
    "address": {},
    "organizations": [{
        "deptRole": "Programmer",
        "deptID": "5ae9d6247b2a7d123552bc86",
        "organizationID": "5ae99e5fb1d95d623c6a48ff",
        "reportsTo": [""],
        "reportedBy": [""]
    }],
    "permissions": {},
    "createDate": "2018-04-24 15:25:14.274"
}];

class User {
    get initials() {
        return this.firstName[0] + this.lastName[0];
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

users = users.map(x => Object.assign(new User(), x));


export default users;