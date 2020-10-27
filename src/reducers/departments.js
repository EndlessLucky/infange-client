const initialState = {
    departments: [{
        "departments": [{
            "_id": "5ad796da5b8ef10dc832b334",
            "departmentName": "IT"
        }, {"_id": "5ad796da5b8ef10dc832b333", "departmentName": "HR"}],
        "_id": "5ad7671012c4293080ae8101",
        "organizationName": "Testing",
        "settings": {"_id": "5ad7abad8cb3a037ac27014a", "timeout": 40, "nickname": true, "passwordAttempts": 5},
        "__v": 3
    }, {
        "departments": [{"_id": "5ad8ecf2b9b763248c964178", "departmentName": "Sales"}, {
            "_id": "5ad8ecf2b9b763248c964177",
            "departmentName": "Operations"
        }, {"_id": "5ada3808251ec53514795cd8", "departmentName": "aaaaaa"}, {
            "_id": "5ada383e420ecf199c2ad3a9",
            "departmentName": "aaaaaa"
        }],
        "_id": "5ad8ecf2b9b763248c964176",
        "organizationName": "Depart",
        "settings": {"_id": "5ad8ecf2b9b763248c964179", "timeout": 10, "nickname": true, "passwordAttempts": 5},
        "__v": 2
    }]
};

const departments = (state = initialState, action) => {
    switch (action.type) {
        case 'RECEIVE_DEPARTMENTS': {
            return {...state, ...action.payload};
        }
        default:
            return state;    
    }
}

export default departments;