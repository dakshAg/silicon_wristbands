import MERCHI from "../app/merchi";

export const removeEmpty = (obj) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
        else if (obj[key] !== undefined) newObj[key] = obj[key];
    });
    return newObj;
};

export function cleanUndefinedToNull(obj) {
    if (obj === undefined) {
        return null;

    }
    if (typeof obj !== 'object') {
        return obj;

    }
    if (obj instanceof Array) {
        return obj.map(cleanUndefinedToNull);
    }

    return Object.keys(obj).reduce((result, key) => ({
        ...result,
        [key]: cleanUndefinedToNull(obj[key])
    }), {});
}

export function makeMerchiJsEnt(entName, data) {
    if (Array.isArray(data)) {
        const entities = data.map((v) => makeMerchiJsEnt(entName, v))
        return entities
    }
    const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
    return jobEntity;
}