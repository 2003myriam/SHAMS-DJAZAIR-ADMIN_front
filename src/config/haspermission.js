import permissions from "./permissions";

 
export function  hasPermission(role,resource, action){
 if (!(role in permissions)) {
    return false;
}
if (!(resource in permissions[role])) {
    return false;
}
if (permissions[role][resource].includes(action)) {
    return true;
}
return false;
}