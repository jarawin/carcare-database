async function checkPhone(phoneNumber){
    let lengthPhone = phoneNumber.length;
    if (phoneNumber.length != 10){
        return false;
    }
    if (phoneNumber[0] != "0"){
        return false;
    }
    for (let i = 1 ; i < lengthPhone; i++){
        if (phoneNumber[i] == "0"){
            return false
        }
    }
    return true;
}

export default checkPhone;

// console.log(checkPhone("0864664514"));