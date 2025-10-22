class Helper {
    formatPhonenumberTo62(phoneNumber) {
        const cleanedNumber = phoneNumber
            .replace(/\s/g, '')
            .replace(/-/g, '')
            .replace(/\(/g, '')
            .replace(/\)/g, '');

        if (/^08/.test(cleanedNumber)) {
            return cleanedNumber.replace(/^0/, '62');
        } else if (/^\+62/.test(cleanedNumber)) {
            return cleanedNumber.replace(/^\+/, '');
        }
        return cleanedNumber;
    }
}

export default new Helper();